const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const Prediction = require('../models/Prediction');
const Appointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const localMLService = require('../services/localMLService');

const router = express.Router();

// ML Server URL - can be configured via environment variable
const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:5001';

// Helper function to call ML server
const callMLServer = (imagePath) => {
    return new Promise((resolve, reject) => {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        const data = JSON.stringify({ image: base64Image });
        
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: '/predict-base64',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        
        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseData));
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => reject(error));
        req.write(data);
        req.end();
    });
};

// Helper function to call ML server for Grad-CAM
const callGradcamServer = (imagePath) => {
    return new Promise((resolve, reject) => {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        const data = JSON.stringify({ image: base64Image });
        
        const options = {
            hostname: 'localhost',
            port: 5001,
            path: '/gradcam',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        
        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(responseData));
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => reject(error));
        req.write(data);
        req.end();
    });
};

// =====================
// SPECIFIC ROUTES (BEFORE parametric routes)
// =====================

// @route   POST /api/prediction/diagnose
router.post('/diagnose', auth, upload.single('image'), handleUploadError, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No image file uploaded' });
        }

        const imagePath = req.file.path;
        console.log('Processing image:', req.file.filename);

        let mlResult;
        let heatmapBufferFromLocal = null;
        try {
            mlResult = await callMLServer(imagePath);
            console.log('ML prediction result from remote:', mlResult.prediction);
        } catch (mlError) {
            console.warn('External ML server unavailable, using local embedded diagnostic analysis:', mlError.message);
            try {
                mlResult = await localMLService.diagnoseImage(imagePath, req.file.originalname);
                if (mlResult.heatmapBase64) {
                    heatmapBufferFromLocal = Buffer.from(mlResult.heatmapBase64, 'base64');
                }
            } catch (fallbackError) {
                console.error('Local fallback failed:', fallbackError);
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
                return res.status(500).json({
                    status: 'error',
                    message: 'Prediction analysis failed'
                });
            }
        }

        if (!mlResult.success) {
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            return res.status(500).json({ status: 'error', message: mlResult.error || 'ML prediction failed' });
        }

        if (mlResult.prediction === 'unknown' || mlResult.isAccepted === false) {
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            return res.status(422).json({
                status: 'warning',
                message: mlResult.rejectedReason || 'Image quality too low',
                data: { binaryResult: mlResult.binaryResult, isAccepted: false }
            });
        }

        // Generate Grad-CAM heatmap
        let gradcamImageUrl = null;
        try {
            const uploadDir = path.dirname(imagePath);
            if (heatmapBufferFromLocal) {
                const heatmapFilename = `heatmap_${req.file.filename}.png`;
                const heatmapPath = path.join(uploadDir, heatmapFilename);
                fs.writeFileSync(heatmapPath, heatmapBufferFromLocal);
                gradcamImageUrl = `/uploads/${heatmapFilename}`;
                console.log('Local Grad-CAM heatmap generated:', heatmapFilename);
            } else {
                const gradcamResult = await callGradcamServer(imagePath);
                if (gradcamResult.success && gradcamResult.heatmap) {
                    const heatmapFilename = `heatmap_${req.file.filename}.png`;
                    const heatmapPath = path.join(uploadDir, heatmapFilename);
                    const heatmapBuffer = Buffer.from(gradcamResult.heatmap, 'base64');
                    fs.writeFileSync(heatmapPath, heatmapBuffer);
                    gradcamImageUrl = `/uploads/${heatmapFilename}`;
                    console.log('Remote Heatmap generated:', heatmapFilename);
                }
            }
        } catch (heatmapError) {
            console.error('Heatmap generation error:', heatmapError);
            // Continue without heatmap - don't fail diagnosis
        }

        const prediction = new Prediction({
            userId: req.user._id,
            imageUrl: `/uploads/${req.file.filename}`,
            imageName: req.file.originalname,
            prediction: mlResult.prediction,
            isNormal: mlResult.isNormal,
            confidence: mlResult.confidence,
            binaryResult: mlResult.binaryResult || null,
            diseaseResult: mlResult.diseaseResult || null,
            confidenceThreshold: 0.7,
            isAccepted: mlResult.isAccepted !== false,
            recommendations: (mlResult.recommendations || []).map(desc => ({
                title: mlResult.isNormal ? 'Healthy Eyes' : mlResult.prediction,
                description: desc,
                priority: mlResult.isNormal ? 'low' : (mlResult.diseaseResult?.confidence > 0.9 ? 'high' : 'medium')
            })),
            status: 'completed',
            gradcamImageUrl: gradcamImageUrl
        });

        await prediction.save();

        res.status(201).json({
            status: 'success',
            message: 'Diagnosis completed',
            data: {
                id: prediction._id,
                prediction: mlResult.prediction,
                confidence: mlResult.confidence,
                isNormal: mlResult.isNormal,
                isAccepted: mlResult.isAccepted !== false,
                binaryResult: mlResult.binaryResult,
                diseaseResult: mlResult.diseaseResult,
                recommendations: mlResult.recommendations,
                gradcamImageUrl: gradcamImageUrl
            }
        });

    } catch (error) {
        console.error('Diagnosis error:', error);
        if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ status: 'error', message: 'Diagnosis failed', error: error.message });
    }
});

// @route   GET /api/prediction/pending-review (SPECIFIC route - must come before /:id)
router.get('/pending-review', auth, async (req, res) => {
    try {
        const predictions = await Prediction.find({
            'reviewRequest.sentToDoctorId': req.user._id,
            'reviewRequest.status': { $in: ['pending', 'in-review'] }
        })
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({ status: 'success', data: { predictions } });
    } catch (error) {
        console.error('Pending review fetch error:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/pending-review/all
router.get('/pending-review/all', auth, async (req, res) => {
    try {
        const predictions = await Prediction.find({ status: 'pending' })
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({ status: 'success', data: { predictions } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/reviewed
router.get('/reviewed', auth, async (req, res) => {
    try {
        const total = await Prediction.countDocuments({
            status: { $in: ['reviewed', 'confirmed'] },
            'reviewRequest.sentToDoctorId': req.user._id
        });
        res.json({ status: 'success', data: { total } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/stats/overview
router.get('/stats/overview', auth, async (req, res) => {
    try {
        const stats = await Prediction.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: '$prediction', count: { $sum: 1 }, avgConfidence: { $avg: '$confidence' } } }
        ]);

        const total = await Prediction.countDocuments({ userId: req.user._id });
        const recentPredictions = await Prediction.find({ userId: req.user._id })
            .sort({ createdAt: -1 }).limit(5)
            .select('prediction confidence createdAt status isNormal');

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const thisWeekCount = await Prediction.countDocuments({
            userId: req.user._id, createdAt: { $gte: oneWeekAgo }
        });

        const pendingCount = await Prediction.countDocuments({ userId: req.user._id, status: 'pending' });
        const completedCount = await Prediction.countDocuments({
            userId: req.user._id, status: { $in: ['reviewed', 'confirmed'] }
        });

        res.json({
            status: 'success',
            data: { total, thisWeek: thisWeekCount, pending: pendingCount, completed: completedCount, byClass: stats, recentPredictions }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/my-reviews (Doctor - get predictions for doctor review)
router.get('/my-reviews', auth, async (req, res) => {
    try {
        // Get all predictions that are sent to this specific doctor for review
        // Include both pending and completed reviews for this doctor
        const predictions = await Prediction.find({
            'reviewRequest.sentToDoctorId': req.user._id
        })
            .populate('userId', 'name email phone')
            .populate('doctorReview.doctorId', 'name email')
            .populate('reviewRequest.sentToDoctorId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ status: 'success', data: { predictions } });
    } catch (error) {
        console.error('My reviews fetch error:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/all-reviews (Admin - get all predictions with reviewRequest)
router.get('/all-reviews', auth, async (req, res) => {
    try {
        // Get all predictions that have reviewRequest (sent for review) - NOT appointments
        const predictions = await Prediction.find({
            reviewRequest: { $exists: true },
            'reviewRequest.sentToDoctorId': { $exists: true }
        })
            .populate('userId', 'name email phone')
            .populate('doctorReview.doctorId', 'name email')
            .populate('reviewRequest.sentToDoctorId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ status: 'success', data: { predictions } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/all-pending (Admin - get all pending predictions)
router.get('/all-pending', auth, async (req, res) => {
    try {
        // Get all predictions with reviewRequest
        const predictions = await Prediction.find({
            reviewRequest: { $exists: true },
            'reviewRequest.sentToDoctorId': { $exists: true }
        })
            .populate('userId', 'name email phone')
            .populate('doctorReview.doctorId', 'name email')
            .populate('reviewRequest.sentToDoctorId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ status: 'success', data: { predictions } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/history
router.get('/history', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const predictions = await Prediction.find({ userId: req.user._id })
            .sort({ createdAt: -1 }).skip(skip).limit(limit)
            .populate('doctorReview.doctorId', 'name email')
            .populate('reviewRequest.sentToDoctorId', 'name email');

        const total = await Prediction.countDocuments({ userId: req.user._id });

        res.json({
            status: 'success',
            data: {
                predictions,
                pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalItems: total }
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/reports (Patient - get all reports)
router.get('/reports', auth, async (req, res) => {
    try {
        // Get all predictions for the patient that have reports generated
        const predictions = await Prediction.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('doctorReview.doctorId', 'name email specialization')
            .select('prediction confidence isNormal binaryResult diseaseResult recommendations doctorReview imageUrl gradcamImageUrl createdAt');

        res.json({ status: 'success', data: { reports: predictions } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   POST /api/prediction/:id/generate-report (Generate PDF report)
router.post('/:id/generate-report', auth, async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('doctorReview.doctorId', 'name email specialization');

        if (!prediction) {
            return res.status(404).json({ status: 'error', message: 'Prediction not found' });
        }

        // Check if user owns this prediction or is a doctor/admin
        const isOwner = prediction.userId?._id?.toString() === req.user._id.toString();
        const isDoctor = req.user.role === 'doctor';
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isDoctor && !isAdmin) {
            return res.status(403).json({ status: 'error', message: 'Not authorized' });
        }

        // Generate report filename
        const timestamp = Date.now();
        const reportFilename = `report_${prediction._id}_${timestamp}.html`;
        const reportsDir = path.join(__dirname, '../../uploads/reports');
        
        // Create reports directory if it doesn't exist
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const reportPath = path.join(reportsDir, reportFilename);
        const reportUrl = `/uploads/reports/${reportFilename}`;

        // Build HTML report
        const patientName = prediction.userId?.name || 'Unknown';
        const patientEmail = prediction.userId?.email || 'N/A';
        const patientPhone = prediction.userId?.phone || 'N/A';
        const diagnosisDate = new Date(prediction.createdAt).toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const predictionLabel = prediction.prediction === 'normal' ? 'Healthy Eyes (Normal)' : 
            prediction.prediction.charAt(0).toUpperCase() + prediction.prediction.slice(1);
        const confidencePercent = Math.round(prediction.confidence * 100);
        
        const normalProb = prediction.binaryResult?.normalProbability ? 
            Math.round(prediction.binaryResult.normalProbability * 100) : 0;
        const diseaseProb = prediction.binaryResult?.diseaseProbability ? 
            Math.round(prediction.binaryResult.diseaseProbability * 100) : 0;

        // Disease probabilities
        const diseaseProbs = prediction.diseaseResult?.probabilities || {};
        const diseaseProbsHtml = Object.entries(diseaseProbs).map(([disease, prob]) => 
            `<div class="disease-item"><span>${disease.charAt(0).toUpperCase() + disease.slice(1)}</span><span>${Math.round(prob * 100)}%</span></div>`
        ).join('');

        // Recommendations
        const recommendationsHtml = (prediction.recommendations || []).map(rec => 
            `<li>${rec.description || rec}</li>`
        ).join('');

        // Doctor review info
        let doctorReviewHtml = '';
        if (prediction.doctorReview) {
            const doctorName = prediction.doctorReview.doctorId?.name || 'Unknown Doctor';
            const doctorEmail = prediction.doctorReview.doctorId?.email || '';
            const reviewedDate = new Date(prediction.doctorReview.reviewedAt).toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            doctorReviewHtml = `
                <div class="section doctor-review">
                    <h3>Doctor's Review</h3>
                    <div class="review-grid">
                        <div><strong>Reviewed by:</strong> Dr. ${doctorName}</div>
                        <div><strong>Email:</strong> ${doctorEmail}</div>
                        <div><strong>Reviewed on:</strong> ${reviewedDate}</div>
                        ${prediction.doctorReview.confirmedDiagnosis ? `<div><strong>Confirmed Diagnosis:</strong> ${prediction.doctorReview.confirmedDiagnosis}</div>` : ''}
                        ${prediction.doctorReview.notes ? `<div><strong>Notes:</strong> ${prediction.doctorReview.notes}</div>` : ''}
                        ${prediction.doctorReview.treatmentPlan ? `<div><strong>Treatment Plan:</strong> ${prediction.doctorReview.treatmentPlan}</div>` : ''}
                    </div>
                </div>
            `;
        }

        // Image URLs
        const originalImageUrl = prediction.imageUrl || '';
        const heatmapImageUrl = prediction.gradcamImageUrl || '';

        const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eye Disease Diagnosis Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; padding: 40px; }
        .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 14px; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #0284c7; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .info-item { background: #f8fafc; padding: 12px 15px; border-radius: 8px; }
        .info-item label { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; text-transform: uppercase; }
        .info-item span { font-size: 14px; font-weight: 600; color: #1e293b; }
        .prediction-box { background: ${prediction.isNormal ? '#f0fdf4' : '#fef2f2'}; border: 2px solid ${prediction.isNormal ? '#22c55e' : '#ef4444'}; border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 25px; }
        .prediction-box h2 { font-size: 32px; color: ${prediction.isNormal ? '#16a34a' : '#dc2626'}; margin-bottom: 10px; }
        .prediction-box p { font-size: 16px; color: #64748b; }
        .confidence-badge { display: inline-block; background: #0284c7; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; margin-top: 15px; }
        .probabilities { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
        .prob-box { padding: 20px; border-radius: 10px; text-align: center; }
        .prob-box.normal { background: #f0fdf4; border: 1px solid #bbf7d0; }
        .prob-box.disease { background: #fef2f2; border: 1px solid #fecaca; }
        .prob-box h4 { font-size: 14px; color: #64748b; margin-bottom: 8px; }
        .prob-box .percent { font-size: 28px; font-weight: 700; }
        .prob-box.normal .percent { color: #16a34a; }
        .prob-box.disease .percent { color: #dc2626; }
        .disease-section { background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .disease-section h4 { color: #0284c7; margin-bottom: 15px; }
        .disease-item { display: flex; justify-content: space-between; padding: 8px 12px; background: white; margin-bottom: 8px; border-radius: 6px; }
        .disease-item span:first-child { font-weight: 600; color: #334155; }
        .disease-item span:last-child { color: #64748b; }
        .recommendations { background: #eff6ff; padding: 20px; border-radius: 10px; }
        .recommendations ul { margin-left: 20px; }
        .recommendations li { margin-bottom: 10px; color: #1e40af; line-height: 1.6; }
        .images-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
        .image-box { background: #f8fafc; padding: 15px; border-radius: 10px; text-align: center; }
        .image-box img { max-width: 100%; border-radius: 8px; border: 2px solid #e2e8f0; }
        .image-box h4 { margin-top: 10px; color: #475569; font-size: 14px; }
        .doctor-review { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 10px; }
        .review-grid { display: grid; gap: 10px; }
        .review-grid > div { font-size: 14px; color: #1e293b; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; }
        @media print { body { padding: 0; background: white; } .container { box-shadow: none; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👁️ AI Eye Care - Diagnosis Report</h1>
            <p>Generated on ${new Date().toLocaleString('en-US')}</p>
        </div>
        <div class="content">
            <div class="section">
                <h3>👤 Patient Information</h3>
                <div class="info-grid">
                    <div class="info-item"><label>Name</label><span>${patientName}</span></div>
                    <div class="info-item"><label>Email</label><span>${patientEmail}</span></div>
                    <div class="info-item"><label>Phone</label><span>${patientPhone}</span></div>
                    <div class="info-item"><label>Report Date</label><span>${diagnosisDate}</span></div>
                </div>
            </div>
            
            <div class="prediction-box">
                <h2>${predictionLabel}</h2>
                <p>AI-Powered Diagnosis Result</p>
                <span class="confidence-badge">${confidencePercent}% Confidence</span>
            </div>

            <div class="probabilities">
                <div class="prob-box normal">
                    <h4>Normal Probability</h4>
                    <div class="percent">${normalProb}%</div>
                </div>
                <div class="prob-box disease">
                    <h4>Disease Probability</h4>
                    <div class="percent">${diseaseProb}%</div>
                </div>
            </div>

            ${Object.keys(diseaseProbs).length > 0 ? `
            <div class="disease-section">
                <h4>Disease Classification Probabilities</h4>
                ${diseaseProbsHtml}
            </div>
            ` : ''}

            ${recommendationsHtml ? `
            <div class="recommendations">
                <h4>📋 Recommendations</h4>
                <ul>${recommendationsHtml}</ul>
            </div>
            ` : ''}

            ${(originalImageUrl || heatmapImageUrl) ? `
            <div class="images-section">
                ${originalImageUrl ? `<div class="image-box"><img src="${originalImageUrl}" alt="Original Eye Scan"><h4>Original Fundus Image</h4></div>` : ''}
                ${heatmapImageUrl ? `<div class="image-box"><img src="${heatmapImageUrl}" alt="Heatmap"><h4>AI Attention Heatmap (Grad-CAM)</h4></div>` : ''}
            </div>
            ` : ''}

            ${doctorReviewHtml}
        </div>
        <div class="footer">
            <p>This report was generated by AI Eye Care System</p>
            <p>Prediction ID: ${prediction._id} | System: AI-Powered Eye Disease Detection</p>
        </div>
    </div>
</body>
</html>`;

        // Save the report
        fs.writeFileSync(reportPath, reportHtml);

        // Update prediction with report URL
        prediction.reportUrl = reportUrl;
        await prediction.save();

        res.json({ status: 'success', message: 'Report generated successfully', data: { reportUrl } });

    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to generate report', error: error.message });
    }
});

// @route   GET /api/prediction/reports/list (Get all reports for a patient - for sidebar)
router.get('/reports/list', auth, async (req, res) => {
    try {
        // Get all predictions that have reports (either reportUrl exists or it's completed)
        const predictions = await Prediction.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('prediction confidence createdAt imageUrl reportUrl gradcamImageUrl isNormal');

        res.json({ status: 'success', data: { reports: predictions } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/doctors
router.get('/doctors', auth, async (req, res) => {
    try {
        const User = require('../models/User');
        const doctors = await User.find({ role: 'doctor', isActive: true })
            .select('name email phone specialization')
            .sort({ name: 1 });
        res.json({ status: 'success', data: { doctors } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/my-patients
router.get('/my-patients', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.user._id })
            .populate('patientId', 'name email phone')
            .populate('predictionId', 'prediction confidence createdAt imageUrl')
            .sort({ createdAt: -1 });

        const reviewRequests = await Prediction.find({ 'reviewRequest.sentToDoctorId': req.user._id })
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        const patientMap = new Map();
        appointments.forEach(apt => {
            if (apt.patientId) {
                patientMap.set(apt.patientId._id.toString(), {
                    ...apt.patientId._doc,
                    lastInteraction: apt.createdAt,
                    appointmentId: apt._id,
                    predictionId: apt.predictionId
                });
            }
        });

        reviewRequests.forEach(pred => {
            if (pred.userId) {
                const existing = patientMap.get(pred.userId._id.toString());
                if (!existing || new Date(pred.createdAt) > new Date(existing.lastInteraction)) {
                    patientMap.set(pred.userId._id.toString(), {
                        ...pred.userId._doc,
                        lastInteraction: pred.createdAt,
                        predictionId: pred._id
                    });
                }
            }
        });

        res.json({ status: 'success', data: { patients: Array.from(patientMap.values()) } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// =====================
// PARAMETRIC ROUTES (AFTER specific routes)
// =====================

// @route   POST /api/prediction/:id/send-for-review
router.post('/:id/send-for-review', auth, async (req, res) => {
    try {
        const { doctorId, notes } = req.body;
        if (!doctorId) {
            return res.status(400).json({ status: 'error', message: 'Doctor ID is required' });
        }

        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            return res.status(404).json({ status: 'error', message: 'Prediction not found' });
        }

        if (prediction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ status: 'error', message: 'Not authorized' });
        }

        prediction.reviewRequest = {
            sentToDoctorId: doctorId,
            sentAt: new Date(),
            status: 'pending',
            notes: notes
        };
        prediction.status = 'pending';
        await prediction.save();

        res.json({ status: 'success', message: 'Prediction sent to doctor for review', data: { prediction } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   GET /api/prediction/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('doctorReview.doctorId', 'name email specialization')
            .populate('reviewRequest.sentToDoctorId', 'name email specialization');

        if (!prediction) {
            return res.status(404).json({ status: 'error', message: 'Prediction not found' });
        }

        const isOwner = prediction.userId?._id?.toString() === req.user._id.toString();
        // sentToDoctorId is a populated object, not an ObjectId
        const isAssignedDoctor = prediction.reviewRequest?.sentToDoctorId?._id?.toString() === req.user._id.toString() ||
                                 prediction.reviewRequest?.sentToDoctorId?.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        // Allow if owner, assigned doctor, admin, or if it's a pending prediction with no review yet
        if (!isOwner && !isAssignedDoctor && !isAdmin && !prediction.doctorReview) {
            // Check if it's a pending prediction that might be viewable
            if (prediction.status === 'pending' && prediction.reviewRequest?.status === 'pending') {
                // Allow viewing pending predictions for doctors
            } else {
                return res.status(403).json({ status: 'error', message: 'Not authorized to view this prediction' });
            }
        }

        res.json({ status: 'success', data: { prediction } });
    } catch (error) {
        console.error('Get prediction error:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   PUT /api/prediction/:id/review
router.put('/:id/review', auth, async (req, res) => {
    try {
        const { status, doctorNotes, confirmedDiagnosis, treatmentPlan } = req.body;

        const prediction = await Prediction.findById(req.params.id);
        if (!prediction) {
            return res.status(404).json({ status: 'error', message: 'Prediction not found' });
        }

        // sentToDoctorId is a populated object, so check both _id and direct comparison
        const sentToDoctorIdStr = prediction.reviewRequest?.sentToDoctorId?._id?.toString() || 
                                  prediction.reviewRequest?.sentToDoctorId?.toString();
        const isAssignedDoctor = sentToDoctorIdStr === req.user._id.toString();
        
        // Allow review if user is the assigned doctor
        if (!isAssignedDoctor) {
            return res.status(403).json({ status: 'error', message: 'Not authorized to review this prediction' });
        }

        prediction.status = status;
        prediction.doctorReview = {
            doctorId: req.user._id,
            notes: doctorNotes,
            confirmedDiagnosis: confirmedDiagnosis || prediction.prediction,
            treatmentPlan: treatmentPlan,
            reviewedAt: new Date()
        };
        prediction.reviewRequest.status = status === 'reviewed' ? 'completed' : status;
        await prediction.save();

        res.json({ status: 'success', message: 'Prediction reviewed successfully', data: { prediction } });
    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// @route   DELETE /api/prediction/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const prediction = await Prediction.findOne({ _id: req.params.id, userId: req.user._id });
        if (!prediction) {
            return res.status(404).json({ status: 'error', message: 'Prediction not found' });
        }

        if (prediction.imageUrl) {
            const imagePath = path.join(__dirname, '../../', prediction.imageUrl);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        await prediction.deleteOne();
        res.json({ status: 'success', message: 'Prediction deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
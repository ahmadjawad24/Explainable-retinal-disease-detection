import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredictionStore } from '../../store/predictionStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Upload, X, Eye, AlertCircle, CheckCircle,
  FileImage, ArrowRight, RefreshCw, Calendar, Send, FileText, Thermometer
} from 'lucide-react';

// Configure axios with proxy
const api = axios.create({
  baseURL: '', // Uses vite proxy
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Diagnose = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  
  // Booking state
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  
  // Review state
  const [reviewDoctor, setReviewDoctor] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Result state
  const [result, setResult] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await api.get('/api/prediction/doctors');
      setDoctors(res.data.data?.doctors || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    setImageFile(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleLoadSample = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Draw fundus eyeball background
      const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
      grad.addColorStop(0, '#991b1b');
      grad.addColorStop(0.7, '#450a0a');
      grad.addColorStop(1, '#0f0202');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Draw Optic Disc
      const discGrad = ctx.createRadialGradient(180, 256, 2, 180, 256, 45);
      discGrad.addColorStop(0, '#fef08a');
      discGrad.addColorStop(0.7, '#f59e0b');
      discGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = discGrad;
      ctx.beginPath();
      ctx.arc(180, 256, 40, 0, Math.PI * 2);
      ctx.fill();

      // Draw Macula
      ctx.fillStyle = '#260404';
      ctx.beginPath();
      ctx.arc(330, 256, 24, 0, Math.PI * 2);
      ctx.fill();

      // Blood vessels
      ctx.strokeStyle = '#260404';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(180, 256);
      ctx.bezierCurveTo(210, 140, 290, 110, 420, 130);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(180, 256);
      ctx.bezierCurveTo(210, 370, 300, 400, 420, 380);
      ctx.stroke();

      canvas.toBlob((blob) => {
        if (!blob) return;
        const sampleFile = new File([blob], 'clinical_fundus_sample.png', { type: 'image/png' });
        processFile(sampleFile);
        toast.success('Sample retinal fundus scan loaded');
      }, 'image/png');
    } catch (err) {
      console.error(err);
      toast.error('Could not load sample scan');
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageFile(null);
    setResult(null);
    setShowBookingModal(false);
    setShowReviewModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDiagnose = async () => {
    if (!imageFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsDiagnosing(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await api.post('/api/prediction/diagnose', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('Diagnosis response:', response.data);
      setResult(response.data.data);
      toast.success('Diagnosis completed!');
    } catch (error) {
      console.error('Diagnosis error:', error);
      toast.error(error.response?.data?.message || 'Diagnosis failed. Please try again.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !bookingDate || !bookingTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsBooking(true);
    try {
      await api.post('/api/appointments', {
        doctorId: selectedDoctor,
        date: bookingDate,
        time: bookingTime,
        reason: bookingReason || `Follow-up for ${result?.prediction} diagnosis`,
        predictionId: result?.id
      });
      
      toast.success('Appointment request sent! The doctor will confirm shortly.');
      setShowBookingModal(false);
      navigate('/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  const handleSendForReview = async (e) => {
    e.preventDefault();
    if (!reviewDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    setIsSending(true);
    try {
      await api.post(`/api/prediction/${result?.id}/send-for-review`, {
        doctorId: reviewDoctor,
        notes: reviewNotes
      });
      
      toast.success('Prediction sent to doctor for review!');
      setShowReviewModal(false);
      navigate('/history');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send for review');
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!result?.id) {
      toast.error('No prediction found');
      return;
    }

    setIsGeneratingReport(true);
    try {
      const res = await api.post(`/api/prediction/${result.id}/generate-report`);
      if (res.data.status === 'success' && res.data.data.reportUrl) {
        toast.success('Report generated successfully!');
        // Open report in new tab
        window.open(res.data.data.reportUrl, '_blank');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getResultBgColor = (prediction) => {
    switch (prediction) {
      case 'normal': return 'bg-green-50 border-green-300';
      case 'diabetes': return 'bg-red-50 border-red-300';
      case 'glaucoma': return 'bg-purple-50 border-purple-300';
      case 'cataract': return 'bg-blue-50 border-blue-300';
      case 'myopia': return 'bg-yellow-50 border-yellow-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Eye Disease Diagnosis</h1>
        <p className="text-gray-600">
          Upload a fundus image of your eye for AI-powered analysis and disease detection.
        </p>
      </div>

      {/* Upload Section */}
      <div
        className={`bg-white rounded-xl p-8 shadow border-2 border-dashed transition-colors ${
          isDragging ? 'border-sky-500 bg-sky-50' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {imagePreview ? (
          <div className="space-y-6">
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-80 object-contain rounded-lg bg-gray-100" 
              />
              <button 
                onClick={handleReset} 
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileImage className="h-10 w-10 text-sky-600" />
                <div>
                  <p className="font-medium text-gray-900">{imageFile?.name}</p>
                  <p className="text-sm text-gray-500">{(imageFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={handleUploadClick} className="flex items-center space-x-2 text-sky-600 hover:text-sky-700">
                <RefreshCw className="h-4 w-4" />
                <span>Change</span>
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            <button
              onClick={handleDiagnose}
              disabled={isDiagnosing}
              className="w-full py-4 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isDiagnosing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Analyzing image...</span>
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  <span>Start Diagnosis</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <Upload className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Eye Fundus Image</h3>
            <p className="text-gray-500 mb-6">Drag and drop an image here, or click to browse</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleUploadClick}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium cursor-pointer shadow-xs"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Fundus Image</span>
              </button>
              <button
                onClick={handleLoadSample}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-100 text-teal-800 border border-teal-200 rounded-xl hover:bg-teal-50 transition-colors font-medium cursor-pointer"
              >
                <Eye className="h-5 w-5 text-teal-600" />
                <span>Try Demo Sample Fundus Scan</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <p className="mt-4 text-sm text-gray-500">Supported formats: JPG, PNG (Max 10MB)</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className={`rounded-2xl p-6 shadow border-2 ${getResultBgColor(result.prediction)}`}>
          <div className="flex items-center space-x-4 mb-6">
            {result.isNormal ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <AlertCircle className="h-12 w-12 text-red-600" />
            )}
            <div>
              <h2 className="text-2xl font-bold capitalize text-slate-900">
                {result.prediction === 'normal' ? 'Healthy Eyes' : result.prediction}
              </h2>
              <p className="text-lg text-slate-700 font-semibold">{Math.round(result.confidence * 100)}% diagnostic confidence</p>
            </div>
          </div>

          {/* Explainable Grad-CAM Heatmap Comparison */}
          {result.gradcamImageUrl && (
            <div className="mb-6 p-5 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-teal-600" />
                  <h4 className="font-bold text-slate-900">Explainable Grad-CAM Attention Heatmap</h4>
                </div>
                <span className="text-xs px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full font-semibold">
                  Visual Interpretability
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-xs font-semibold text-slate-300 mb-2">Original Retinal Scan</p>
                  <img src={imagePreview} alt="Original Fundus" className="w-full h-56 object-contain rounded-lg" />
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-teal-500/50">
                  <p className="text-xs font-semibold text-teal-400 mb-2">Grad-CAM Neural Attention Overlay</p>
                  <img src={result.gradcamImageUrl} alt="Grad-CAM Heatmap" className="w-full h-56 object-contain rounded-lg" />
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3">
                Warm colored focal areas (red/yellow) indicate anatomical structures that guided the diagnostic classification.
              </p>
            </div>
          )}

          {/* Binary Result */}
          {result.binaryResult && (
            <div className="mb-4 p-4 bg-white/70 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">AI Binary Analysis:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-100/90 rounded-lg">
                  <p className="text-2xl font-bold text-green-800">
                    {(result.binaryResult.normalProbability * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm font-medium text-green-700">Normal Probability</p>
                </div>
                <div className="text-center p-3 bg-red-100/90 rounded-lg">
                  <p className="text-2xl font-bold text-red-800">
                    {(result.binaryResult.diseaseProbability * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm font-medium text-red-700">Disease Probability</p>
                </div>
              </div>
            </div>
          )}

          {/* Disease Probabilities */}
          {result.diseaseResult && (
            <div className="mb-4 p-4 bg-white/70 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">Multi-Class Disease Probabilities:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(result.diseaseResult.probabilities || {}).map(([disease, prob]) => (
                  <div key={disease} className="text-center p-2.5 bg-slate-100/80 rounded-lg">
                    <p className="text-sm font-bold capitalize text-slate-900">{disease}</p>
                    <p className="text-sm font-mono text-slate-700">{(prob * 100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {!result.isNormal && result.recommendations && (
            <div className="bg-white/70 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Clinical Recommendations:</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => {
                  const title = typeof rec === 'object' ? rec.title : rec;
                  const desc = typeof rec === 'object' ? rec.description : null;
                  const priority = typeof rec === 'object' ? rec.priority : null;
                  return (
                    <li key={index} className="flex items-start space-x-2 text-sm text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0"></span>
                      <div>
                        <span className="font-semibold">{title}</span>
                        {desc && <p className="text-xs text-slate-600 mt-0.5">{desc}</p>}
                        {priority && (
                          <span className="inline-block text-[10px] uppercase font-bold px-2 py-0.5 mt-1 rounded-md bg-amber-100 text-amber-800">
                            {priority} Priority
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Generate Report Button */}
            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isGeneratingReport ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
            {!result.isNormal && (
              <>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Send className="h-5 w-5" />
                  <span>Send for Review</span>
                </button>
              </>
            )}
            <button
              onClick={() => navigate('/history')}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FileImage className="h-5 w-5" />
              <span>View History</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>New Scan</span>
            </button>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Book Appointment</h2>
              <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor *</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} - {doc.specialization || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Notes</label>
                <textarea
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  rows="3"
                  placeholder={`Follow-up for ${result?.prediction} diagnosis`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowBookingModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isBooking} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 flex items-center">
                  {isBooking ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send for Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Send for Expert Review</h2>
              <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The selected doctor will review your prediction and provide professional medical advice.
              </p>
            </div>

            <form onSubmit={handleSendForReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor *</label>
                <select
                  value={reviewDoctor}
                  onChange={(e) => setReviewDoctor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} {doc.specialization ? `- ${doc.specialization}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (optional)</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                  placeholder="Any additional information you'd like to share with the doctor..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowReviewModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSending} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center">
                  {isSending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send for Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">📋 Image Guidelines</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Ensure the image shows the complete fundus (retina) area</li>
          <li>• Image should be well-lit and in focus</li>
          <li>• Avoid blurry or dark images for accurate results</li>
          <li>• Supported formats: JPEG, PNG</li>
          <li>• Maximum file size: 10MB</li>
        </ul>
      </div>
    </div>
  );
};

export default Diagnose;
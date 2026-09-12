const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/auth');
const predictionRoutes = require('./src/routes/prediction');
const appointmentRoutes = require('./src/routes/appointment');
const reportRoutes = require('./src/routes/report');
const userRoutes = require('./src/routes/user');

const app = express();

// Middleware
// Disable helmet for development (CSP blocks cross-origin images)
// In production, configure this properly
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload directories exist
const uploadDir = path.join(__dirname, 'uploads');
const heatmapDir = path.join(uploadDir, 'heatmaps');
const reportsDir = path.join(uploadDir, 'reports');

[uploadDir, heatmapDir, reportsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Static files for uploads
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const uploadDir = isVercel
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// ML Server configuration
const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:5001';

// Database connection
const connectDB = async () => {
    try {
        mongoose.set('bufferCommands', false);
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_eye_care', {
            serverSelectionTimeoutMS: 2000
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.warn('⚠️  MongoDB not connected, running with built-in in-memory store:', error.message);
    }
};

// Check ML server health
const checkMLServer = () => {
    return new Promise((resolve) => {
        http.get(`${ML_SERVER_URL}/health`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
    const mlStatus = await checkMLServer();
    res.json({ 
        status: 'success', 
        message: 'AI Eye Care API is running',
        timestamp: new Date().toISOString(),
        mlServer: mlStatus ? {
            status: 'online',
            models_loaded: mlStatus.models_loaded
        } : {
            status: 'offline',
            note: 'Running embedded fallback diagnosis model'
        }
    });
});

// Serve frontend SPA
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
            return next();
        }
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
} else {
    // Root endpoint fallback if frontend not yet built
    app.get('/', (req, res) => {
        res.json({
            name: 'AI Eye Care System API',
            version: '1.0.0',
            description: 'Backend API for AI-powered eye disease detection'
        });
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

// 404 handler for unmatched API routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const PORT = 3000;

// Start server
const startServer = async () => {
    await connectDB();
    
    // Check ML server status on startup
    const mlStatus = await checkMLServer();
    if (mlStatus) {
        console.log('✅ ML Server connected');
    } else {
        console.log('ℹ️  Using embedded fallback ML diagnosis and Grad-CAM generation');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

if (!process.env.VERCEL) {
    startServer();
} else {
    connectDB();
}

module.exports = app;
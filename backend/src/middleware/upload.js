const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const uploadDir = isVercel
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (e) {
        console.warn('Could not create upload directory:', e.message);
    }
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
    }
};

// Multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Error handler
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File size too large. Maximum size is 10MB.'
            });
        }
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
    
    if (err) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
    
    next();
};

module.exports = { upload, handleUploadError };
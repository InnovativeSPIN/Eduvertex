import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads/leaves directory if it doesn't exist
const leavesUploadDir = path.join(process.cwd(), 'public', 'uploads', 'leaves');
if (!fs.existsSync(leavesUploadDir)) {
    fs.mkdirSync(leavesUploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, leavesUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'leave-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure file filter - allow images and documents
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images, PDF, and Word documents are allowed'), false);
    }
};

// Create multer instance
const leaveUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});

export default leaveUpload;

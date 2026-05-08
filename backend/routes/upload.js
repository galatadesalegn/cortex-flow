import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

import path from 'path';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|mp4|webm|ogg|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, videos and PDF files are allowed'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Try to import cloudinary
try {
  var cloudinary = await import('../config/cloudinary.js').then(m => m.default);
} catch (e) {
  console.log('Cloudinary not configured, using local uploads');
}

// @desc    Upload image to Cloudinary or serve locally
// @route   POST /api/upload
// @access  Private
router.post(
  '/',
  protect,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('No file provided');
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const isPdf = req.file.mimetype === 'application/pdf';

    // Check if Cloudinary is configured
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_API_KEY && 
                          process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinary && cloudinary) {
      // Upload to Cloudinary
      const uploadOptions = {
        folder: 'portfolio',
        resource_type: isPdf ? 'raw' : 'auto'
      };

      const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);
      
      // Clean up local file
      fs.unlinkSync(req.file.path);
      
      // For PDFs, add fl_attachment parameter to force download
      let downloadUrl = result.secure_url;
      if (isPdf) {
        const separator = downloadUrl.includes('?') ? '&' : '?';
        downloadUrl = `${downloadUrl}${separator}fl_attachment`;
      }
      
      res.json({
        success: true,
        data: {
          url: downloadUrl,
          publicId: result.public_id,
        }
      });
    } else {
      // Serve file locally
      const baseUrl = process.env.BACKEND_URL || 'https://galatadesalegn.onrender.com';
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({
        success: true,
        data: {
          url: `${baseUrl}${fileUrl}`,
          localPath: fileUrl,
        }
      });
    }
  })
);

// @desc    Download CV by URL
// @route   GET /api/upload/download
// @access  Public
router.get(
  '/download',
  asyncHandler(async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Verify URL is from Cloudinary to prevent abuse
    if (!url.includes('cloudinary.com')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
      // Fetch the file from Cloudinary
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      
      const buffer = await response.arrayBuffer();
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
      res.setHeader('Content-Length', buffer.byteLength);
      
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  })
);

export default router;
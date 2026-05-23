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
        resource_type: isPdf ? 'raw' : 'auto',
        type: 'upload',
        overwrite: true,
        invalidate: true,
        use_filename: true,
        unique_filename: true,
        allowed_formats: isPdf ? ['pdf'] : undefined
      };

      console.log('Uploading file:', req.file.originalname, 'isPdf:', isPdf);
      console.log('Upload options:', uploadOptions);

      const result = await cloudinary.uploader.upload(req.file.path, uploadOptions);
      
      console.log('Cloudinary result:', result);
      
      // Clean up local file
      fs.unlinkSync(req.file.path);
      
      console.log('PDF uploaded to:', result.secure_url);
      
      res.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
        }
      });
    } else {
      // Serve file locally
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = process.env.BACKEND_URL || `${protocol}://${host}`;
      
      res.json({
        success: true,
        data: {
          url: `${baseUrl}/uploads/${req.file.filename}`,
          publicId: null,
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

    try {
      console.log('Downloading CV from:', url);

      // Check if it's a local file
      if (url.includes('/uploads/')) {
        // Extract filename from URL
        const urlParts = url.split('/uploads/');
        const filename = urlParts[urlParts.length - 1];
        const filePath = path.join('uploads', filename);

        console.log('Serving local file:', filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'File not found' });
        }

        // Set headers for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        return;
      }

      // For Cloudinary files, verify URL is from Cloudinary to prevent abuse
      if (!url.includes('cloudinary.com')) {
        return res.status(400).json({ error: 'Invalid URL' });
      }

      // Import cloudinary config
      const cloudinary = await import('../config/cloudinary.js').then(m => m.default);

      // Extract public_id from Cloudinary URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1].split('.')[0];
      const publicId = `portfolio/${fileName}`;

      console.log('Extracted public ID:', publicId);

      // Use Cloudinary's resource API to fetch the file
      const resource = await cloudinary.api.resource(publicId, {
        resource_type: 'raw'
      });

      console.log('Cloudinary resource:', resource);

      if (!resource || !resource.secure_url) {
        throw new Error('File not found in Cloudinary');
      }

      // Fetch the file using the secure URL from Cloudinary
      const response = await fetch(resource.secure_url);
      console.log('Response status:', response.status);
      console.log('Response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch file:', errorText);
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      console.log('Buffer size:', buffer.byteLength);

      // Detect content type from response
      const contentType = response.headers.get('content-type') || 'application/pdf';

      // Set headers for download
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
      res.setHeader('Content-Length', buffer.byteLength);

      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Failed to download file: ' + error.message });
    }
  })
);

export default router;
import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// No cache for profile - always fresh data
router.get('/', getProfile);
router.put('/', protect, updateProfile);

export default router;

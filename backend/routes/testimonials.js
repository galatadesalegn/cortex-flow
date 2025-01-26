import express from 'express';
import {
  getTestimonials,
  getAllTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonial,
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

// Public routes
router.get('/', cacheMiddleware(600), getTestimonials);

// Protected routes
router.get('/admin', protect, getAllTestimonials);
router.get('/:id', protect, getTestimonial);
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);
router.patch('/:id/toggle', protect, toggleTestimonial);

export default router;

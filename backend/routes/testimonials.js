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
import { protect, checkPermission } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

// Public routes
router.get('/', cacheMiddleware(600), getTestimonials);

// Protected routes (require testimonials permission)
router.use(protect, checkPermission('testimonials'));

router.get('/admin', getAllTestimonials);
router.get('/:id', getTestimonial);
router.post('/', createTestimonial);
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);
router.patch('/:id/toggle', toggleTestimonial);

export default router;

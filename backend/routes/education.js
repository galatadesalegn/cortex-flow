import express from 'express';
import {
  getEducations,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import { protect } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(600), getEducations);
router.get('/:id', getEducation);
router.post('/', protect, createEducation);
router.put('/:id', protect, updateEducation);
router.delete('/:id', protect, deleteEducation);

export default router;

import express from 'express';
import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { protect, checkPermission } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(600), getExperiences);
router.get('/:id', getExperience);

router.use(protect, checkPermission('experience'));

router.post('/', createExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

export default router;

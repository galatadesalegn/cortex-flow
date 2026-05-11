import express from 'express';
import {
  getEducations,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import { protect, checkPermission } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(600), getEducations);
router.get('/:id', getEducation);

router.use(protect, checkPermission('education'));

router.post('/', createEducation);
router.put('/:id', updateEducation);
router.delete('/:id', deleteEducation);

export default router;

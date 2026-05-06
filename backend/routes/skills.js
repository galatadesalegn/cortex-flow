import express from 'express';
import {
  getSkills,
  getSkill,
  getSkillsByCategory,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(600), getSkills);
router.get('/category/:category', getSkillsByCategory);
router.get('/:id', getSkill);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

export default router;

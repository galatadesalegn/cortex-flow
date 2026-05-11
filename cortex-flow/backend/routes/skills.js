import express from 'express';
import {
  getSkills,
  getSkill,
  getSkillsByCategory,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { protect, checkPermission } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(600), getSkills);
router.get('/category/:category', getSkillsByCategory);
router.get('/:id', getSkill);

router.use(protect, checkPermission('skills'));

router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

export default router;

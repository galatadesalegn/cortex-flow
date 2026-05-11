import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, checkPermission } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(600), getProjects);
router.get('/:id', cacheMiddleware(600), getProject);

router.use(protect, checkPermission('projects'));

router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;

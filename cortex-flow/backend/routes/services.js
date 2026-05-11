import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { protect, checkPermission } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(600), getServices);
router.get('/:id', getService);

router.use(protect, checkPermission('services'));

router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;

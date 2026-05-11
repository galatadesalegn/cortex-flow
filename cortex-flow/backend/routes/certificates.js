import express from 'express';
import {
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates
} from '../controllers/certificateController.js';
import { protect, checkPermission } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(600), getCertificates);
router.get('/:id', getCertificate);

// All admin actions below require protection and specific permission
router.use(protect, checkPermission('certificates'));

router.post('/reorder', reorderCertificates);
router.post('/', createCertificate);
router.put('/:id', updateCertificate);
router.delete('/:id', deleteCertificate);

export default router;

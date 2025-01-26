import express from 'express';
import {
  getMessages,
  getMessage,
  createMessage,
  deleteMessage,
  replyMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

router.get('/', protect, cacheMiddleware(300), getMessages);
router.get('/:id', protect, getMessage);
router.post('/', createMessage);
router.post('/:id/reply', protect, replyMessage);
router.delete('/:id', protect, deleteMessage);

export default router;

import express from 'express';
import {
  getMessages,
  getMessage,
  createMessage,
  deleteMessage,
  replyMessage,
} from '../controllers/messageController.js';
import { protect, checkPermission } from '../middleware/auth.js';
import { cacheMiddleware } from '../utils/cache.js';

const router = express.Router();

// Public route to send message
router.post('/', createMessage);

// Admin routes
router.use(protect, checkPermission('messages'));

router.get('/', cacheMiddleware(300), getMessages);
router.get('/:id', getMessage);
router.post('/:id/reply', replyMessage);
router.delete('/:id', deleteMessage);

export default router;

import express from 'express';
const router = express.Router();
import { getSystemStats } from '../controllers/systemStatsController.js';

router.get('/', getSystemStats);

export default router;

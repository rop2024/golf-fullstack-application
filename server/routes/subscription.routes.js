import express from 'express';
import {
  getSubscription,
  upgradeSubscription,
  cancelSubscription,
  getBalance,
  getDashboardData
} from '../controllers/subscription.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected routes
router.get('/my-subscription', authenticateUser, getSubscription);
router.post('/upgrade', authenticateUser, upgradeSubscription);
router.post('/cancel', authenticateUser, cancelSubscription);
router.get('/balance', authenticateUser, getBalance);
router.get('/dashboard', authenticateUser, getDashboardData);

export default router;
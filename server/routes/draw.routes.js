import express from 'express';
import {
  createDraw,
  getDraws,
  getDrawById,
  submitDrawEntry,
  executeDraw,
  getDrawWinners,
  getUserDrawEntries,
  getUserWinnings,
  claimPrize,
  getLatestDraw,
  getActiveDraw,
  getDrawStats,
  generateRandomNumbers
} from '../controllers/draw.controller.js';
import {
  authenticateUser,
  authorizeAdmin
} from '../middleware/auth.middleware.js';
import {
  requireActiveSubscription,
  requireFeatureAccess,
  rateLimitBySubscription
} from '../middleware/subscription.middleware.js';

const router = express.Router();

// Public routes
router.get('/latest', getLatestDraw);
router.get('/active', getActiveDraw);
router.get('/stats', getDrawStats);
router.get('/random-numbers', generateRandomNumbers);

// Protected routes
router.get('/', authenticateUser, getDraws);
router.get('/:drawId', authenticateUser, getDrawById);

router.post('/:drawId/entry',
  authenticateUser,
  requireActiveSubscription,
  rateLimitBySubscription({ free: 1, premium: 5, pro: 10 }),
  submitDrawEntry
);

router.get('/my/entries', authenticateUser, getUserDrawEntries);
router.get('/my/winnings', authenticateUser, getUserWinnings);
router.post('/winners/:winnerId/claim', authenticateUser, claimPrize);
router.get('/:drawId/winners', authenticateUser, getDrawWinners);

// Premium features
router.get('/advanced-stats',
  authenticateUser,
  requireFeatureAccess('view_advanced_stats'),
  getDrawStats
);

// Admin only routes
router.post('/create', authenticateUser, authorizeAdmin, createDraw);
router.post('/:drawId/execute', authenticateUser, authorizeAdmin, executeDraw);

export default router;
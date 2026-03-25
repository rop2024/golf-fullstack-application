import express from 'express';
import {
  addScore,
  getMyScores,
  getAllScoresController,
  deleteScoreController,
  getScoreStats,
  bulkAddScores
} from '../controllers/score.controller.js';
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

// Protected routes (require authentication)
router.post('/add',
  authenticateUser,
  rateLimitBySubscription({ free: 5, premium: 20, pro: 50 }),
  addScore
);

router.get('/me', authenticateUser, getMyScores);
router.delete('/:scoreId', authenticateUser, deleteScoreController);
router.get('/stats', authenticateUser, getScoreStats);

// Premium features
router.post('/bulk',
  authenticateUser,
  requireFeatureAccess('bulk_score_submission'),
  bulkAddScores
);

// Admin only routes
router.get('/all', authenticateUser, authorizeAdmin, getAllScoresController);

export default router;
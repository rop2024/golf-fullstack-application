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

const router = express.Router();

// Protected routes (require authentication)
router.post('/add', authenticateUser, addScore);
router.get('/me', authenticateUser, getMyScores);
router.delete('/:scoreId', authenticateUser, deleteScoreController);
router.get('/stats', authenticateUser, getScoreStats);

// Admin only routes
router.get('/all', authenticateUser, authorizeAdmin, getAllScoresController);

// Testing route (add multiple scores at once)
router.post('/bulk', authenticateUser, bulkAddScores);

export default router;
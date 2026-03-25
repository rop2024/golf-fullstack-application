import express from 'express';
import {
  getDrawWinners,
  getUserWinnings,
  claimPrize,
  getPrizeDistribution,
  getTopWinners,
  getWinnerStats,
  getWinnersByMatchCount,
  bulkClaimPrizes
} from '../controllers/winners.controller.js';
import {
  authenticateUser,
  authorizeAdmin
} from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/top', getTopWinners);
router.get('/stats', getWinnerStats);
router.get('/by-match', getWinnersByMatchCount);

// Protected routes (require authentication)
router.get('/my-winnings', authenticateUser, getUserWinnings);
router.post('/:winnerId/claim', authenticateUser, claimPrize);
router.post('/bulk-claim', authenticateUser, bulkClaimPrizes);
router.get('/draw/:drawId', authenticateUser, getDrawWinners);
router.get('/draw/:drawId/distribution', authenticateUser, getPrizeDistribution);

// Admin only routes
router.get('/admin/all', authenticateUser, authorizeAdmin, async (req, res) => {
  // This would be an admin endpoint to view all winners
  try {
    const { data, error } = await supabaseAdmin
      .from('winners_view')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ winners: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
import express from 'express';
import { supabaseAdmin } from '../services/supabase.service.js';
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
  try {
    const { data, error } = await supabaseAdmin
      .from('winners')
      .select(`
        *,
        profiles:user_id (
          username
        ),
        draws:draw_id (
          title,
          prize
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to match expected format
    const winners = data.map(winner => ({
      id: winner.id,
      draw_id: winner.draw_id,
      user_id: winner.user_id,
      username: winner.profiles?.username || 'Unknown',
      prize: winner.prize,
      prize_amount: parseFloat(winner.prize.replace('$', '')) || 0,
      matches_count: 1, // Default since we don't have this in basic winners table
      claimed: true, // Assume claimed for now
      created_at: winner.won_at
    }));

    res.json({ winners });
  } catch (error) {
    console.error('Admin get all winners error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
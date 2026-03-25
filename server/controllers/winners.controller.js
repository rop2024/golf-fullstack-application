import {
  getDrawWinners as getDrawWinnersService,
  getUserWinnings as getUserWinningsService,
  claimPrize as claimPrizeService,
  getPrizeDistribution as getPrizeDistributionService,
  getTopWinners as getTopWinnersService,
  getWinnerStats as getWinnerStatsService,
  getWinnersByMatchCount as getWinnersByMatchCountService
} from '../services/supabase.service.js';

// Get winners for a specific draw
export const getDrawWinners = async (req, res) => {
  try {
    const { drawId } = req.params;
    
    const { winners, error } = await getDrawWinnersService(drawId);
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_WINNERS_ERROR'
      });
    }
    
    // Get prize distribution for this draw
    const { distribution, error: distError } = await getPrizeDistributionService(drawId);
    
    res.json({ 
      winners,
      distribution: distribution || [],
      totalWinners: winners.length,
      totalPrize: winners.reduce((sum, w) => sum + w.prize_amount, 0)
    });
  } catch (error) {
    console.error('Get draw winners controller error:', error);
    res.status(500).json({
      message: 'Error fetching winners',
      code: 'SERVER_ERROR'
    });
  }
};

// Get current user's winnings
export const getUserWinnings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    
    const { winnings, stats, error } = await getUserWinningsService(userId, status);
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_WINNINGS_ERROR'
      });
    }
    
    res.json({ winnings, stats });
  } catch (error) {
    console.error('Get user winnings controller error:', error);
    res.status(500).json({
      message: 'Error fetching winnings',
      code: 'SERVER_ERROR'
    });
  }
};

// Claim a prize
export const claimPrize = async (req, res) => {
  try {
    const userId = req.user.id;
    const { winnerId } = req.params;
    
    const { winner, error } = await claimPrizeService(winnerId, userId);
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'CLAIM_PRIZE_ERROR'
      });
    }
    
    res.json({
      message: 'Prize claimed successfully! The amount has been added to your balance.',
      winner
    });
  } catch (error) {
    console.error('Claim prize controller error:', error);
    res.status(500).json({
      message: 'Error claiming prize',
      code: 'SERVER_ERROR'
    });
  }
};

// Get prize distribution for a draw
export const getPrizeDistribution = async (req, res) => {
  try {
    const { drawId } = req.params;
    
    const { distribution, error } = await getPrizeDistributionService(drawId);
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_DISTRIBUTION_ERROR'
      });
    }
    
    res.json({ distribution });
  } catch (error) {
    console.error('Get prize distribution controller error:', error);
    res.status(500).json({
      message: 'Error fetching prize distribution',
      code: 'SERVER_ERROR'
    });
  }
};

// Get top winners overall
export const getTopWinners = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const { topWinners, error } = await getTopWinnersService(parseInt(limit));
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_TOP_WINNERS_ERROR'
      });
    }
    
    res.json({ topWinners });
  } catch (error) {
    console.error('Get top winners controller error:', error);
    res.status(500).json({
      message: 'Error fetching top winners',
      code: 'SERVER_ERROR'
    });
  }
};

// Get winner statistics
export const getWinnerStats = async (req, res) => {
  try {
    const { stats, error } = await getWinnerStatsService();
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_STATS_ERROR'
      });
    }
    
    res.json({ stats });
  } catch (error) {
    console.error('Get winner stats controller error:', error);
    res.status(500).json({
      message: 'Error fetching statistics',
      code: 'SERVER_ERROR'
    });
  }
};

// Get winners by match count
export const getWinnersByMatchCount = async (req, res) => {
  try {
    const { drawId, matchCount } = req.query;
    
    const { winners, error } = await getWinnersByMatchCountService(drawId, matchCount ? parseInt(matchCount) : null);
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_WINNERS_ERROR'
      });
    }
    
    res.json({ winners });
  } catch (error) {
    console.error('Get winners by match count controller error:', error);
    res.status(500).json({
      message: 'Error fetching winners',
      code: 'SERVER_ERROR'
    });
  }
};

// Bulk claim prizes (for testing)
export const bulkClaimPrizes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { winnerIds } = req.body;
    
    if (!Array.isArray(winnerIds) || winnerIds.length === 0) {
      return res.status(400).json({
        message: 'Please provide an array of winner IDs',
        code: 'INVALID_INPUT'
      });
    }
    
    const results = [];
    for (const winnerId of winnerIds) {
      const { winner, error } = await claimPrizeService(winnerId, userId);
      if (!error && winner) {
        results.push(winner);
      }
    }
    
    res.json({
      message: `${results.length} prizes claimed successfully`,
      claimed: results.length,
      total: winnerIds.length
    });
  } catch (error) {
    console.error('Bulk claim prizes error:', error);
    res.status(500).json({
      message: 'Error claiming prizes',
      code: 'SERVER_ERROR'
    });
  }
};
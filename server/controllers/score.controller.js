import {
  addScore as addScoreService,
  getUserScores,
  getAllScores,
  deleteScore,
  getUserScoreStats
} from '../services/supabase.service.js';

// Add a new score
export const addScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { value } = req.body;
    
    // Validate input
    if (!value && value !== 0) {
      return res.status(400).json({ 
        message: 'Score value is required',
        code: 'MISSING_VALUE'
      });
    }
    
    if (typeof value !== 'number' || value < 0 || value > 100) {
      return res.status(400).json({ 
        message: 'Score must be a number between 0 and 100',
        code: 'INVALID_VALUE'
      });
    }
    
    // Add score
    const { score, scores, error } = await addScoreService(userId, value);
    
    if (error) {
      return res.status(400).json({ 
        message: error,
        code: 'ADD_SCORE_ERROR'
      });
    }
    
    res.status(201).json({
      message: 'Score added successfully',
      score: score,
      scores: scores,
      remaining_slots: Math.max(0, 5 - scores.length)
    });
  } catch (error) {
    console.error('Add score controller error:', error);
    res.status(500).json({ 
      message: 'Error adding score',
      code: 'SERVER_ERROR'
    });
  }
};

// Get current user's scores
export const getMyScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;
    
    const { scores, error } = await getUserScores(userId, limit);
    
    if (error) {
      return res.status(400).json({ 
        message: error,
        code: 'FETCH_SCORES_ERROR'
      });
    }
    
    // Calculate statistics
    const stats = {
      total: 0,
      average: 0,
      highest: 0,
      lowest: 0,
      count: scores.length
    };
    
    if (scores.length > 0) {
      const values = scores.map(s => s.value);
      stats.total = values.reduce((a, b) => a + b, 0);
      stats.average = Math.round(stats.total / values.length);
      stats.highest = Math.max(...values);
      stats.lowest = Math.min(...values);
    }
    
    res.json({
      scores: scores,
      stats: stats,
      remaining_slots: Math.max(0, 5 - scores.length)
    });
  } catch (error) {
    console.error('Get my scores controller error:', error);
    res.status(500).json({ 
      message: 'Error fetching scores',
      code: 'SERVER_ERROR'
    });
  }
};

// Get all scores (admin only)
export const getAllScoresController = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      });
    }
    
    const { scores, error } = await getAllScores();
    
    if (error) {
      return res.status(400).json({ 
        message: error,
        code: 'FETCH_SCORES_ERROR'
      });
    }
    
    res.json({ scores });
  } catch (error) {
    console.error('Get all scores controller error:', error);
    res.status(500).json({ 
      message: 'Error fetching scores',
      code: 'SERVER_ERROR'
    });
  }
};

// Delete a score
export const deleteScoreController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scoreId } = req.params;
    
    if (!scoreId) {
      return res.status(400).json({ 
        message: 'Score ID is required',
        code: 'MISSING_SCORE_ID'
      });
    }
    
    const { error } = await deleteScore(scoreId, userId);
    
    if (error) {
      return res.status(400).json({ 
        message: error,
        code: 'DELETE_SCORE_ERROR'
      });
    }
    
    // Get updated scores list
    const { scores, error: fetchError } = await getUserScores(userId, 5);
    
    if (fetchError) {
      console.error('Error fetching updated scores:', fetchError);
    }
    
    res.json({
      message: 'Score deleted successfully',
      scores: scores || [],
      remaining_slots: Math.max(0, 5 - (scores?.length || 0))
    });
  } catch (error) {
    console.error('Delete score controller error:', error);
    res.status(500).json({ 
      message: 'Error deleting score',
      code: 'SERVER_ERROR'
    });
  }
};

// Get score statistics
export const getScoreStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { stats, error } = await getUserScoreStats(userId);
    
    if (error) {
      return res.status(400).json({ 
        message: error,
        code: 'FETCH_STATS_ERROR'
      });
    }
    
    res.json({ stats });
  } catch (error) {
    console.error('Get score stats controller error:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics',
      code: 'SERVER_ERROR'
    });
  }
};

// Bulk add scores (for testing)
export const bulkAddScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scores } = req.body;
    
    if (!Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({ 
        message: 'Scores array is required',
        code: 'INVALID_INPUT'
      });
    }
    
    const results = [];
    for (const scoreValue of scores) {
      if (typeof scoreValue === 'number' && scoreValue >= 0 && scoreValue <= 100) {
        const { score, error } = await addScoreService(userId, scoreValue);
        if (!error && score) {
          results.push(score);
        }
      }
    }
    
    // Get final scores
    const { scores: finalScores, error: fetchError } = await getUserScores(userId, 5);
    
    if (fetchError) {
      console.error('Error fetching final scores:', fetchError);
    }
    
    res.status(201).json({
      message: `${results.length} scores added successfully`,
      scores: finalScores || [],
      added_count: results.length,
      remaining_slots: Math.max(0, 5 - (finalScores?.length || 0))
    });
  } catch (error) {
    console.error('Bulk add scores error:', error);
    res.status(500).json({ 
      message: 'Error adding scores',
      code: 'SERVER_ERROR'
    });
  }
};
import {
  createDraw as createDrawService,
  getDraws as getDrawsService,
  getDrawById as getDrawByIdService,
  submitDrawEntry as submitDrawEntryService,
  executeDraw as executeDrawService,
  getDrawWinners as getDrawWinnersService,
  getUserDrawEntries as getUserDrawEntriesService,
  getUserWinnings as getUserWinningsService,
  claimPrize as claimPrizeService,
  getLatestDraw as getLatestDrawService,
  getActiveDraw as getActiveDrawService,
  getDrawStats as getDrawStatsService,
  generateDrawNumbers
} from '../services/supabase.service.js';

// Create a new draw (Admin only)
export const createDraw = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prizePool = 1000 } = req.body;

    const { draw, error } = await createDrawService(userId, prizePool);

    if (error) {
      return res.status(400).json({
        message: error,
        code: 'CREATE_DRAW_ERROR'
      });
    }

    res.status(201).json({
      message: 'Draw created successfully',
      draw: {
        ...draw,
        numbers: draw.numbers // Show generated numbers to admin
      }
    });
  } catch (error) {
    console.error('Create draw controller error:', error);
    res.status(500).json({
      message: 'Error creating draw',
      code: 'SERVER_ERROR'
    });
  }
};

// Get all draws
export const getDraws = async (req, res) => {
  try {
    const { status, limit = 10 } = req.query;

    const { draws, error } = await getDrawsService(status, parseInt(limit));

    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_DRAWS_ERROR'
      });
    }

    res.json({ draws });
  } catch (error) {
    console.error('Get draws controller error:', error);
    res.status(500).json({
      message: 'Error fetching draws',
      code: 'SERVER_ERROR'
    });
  }
};

// Get draw by ID
export const getDrawById = async (req, res) => {
  try {
    const { drawId } = req.params;

    const { draw, error } = await getDrawByIdService(drawId);

    if (error) {
      return res.status(404).json({
        message: 'Draw not found',
        code: 'DRAW_NOT_FOUND'
      });
    }

    res.json({ draw });
  } catch (error) {
    console.error('Get draw by ID controller error:', error);
    res.status(500).json({
      message: 'Error fetching draw',
      code: 'SERVER_ERROR'
    });
  }
};

// Submit numbers for a draw
export const submitDrawEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { drawId } = req.params;
    const { numbers } = req.body;

    // Validate numbers
    if (!numbers || !Array.isArray(numbers) || numbers.length !== 5) {
      return res.status(400).json({
        message: 'Please provide exactly 5 numbers',
        code: 'INVALID_NUMBERS'
      });
    }

    // Validate numbers are between 1-50 and unique
    const isValid = numbers.every(n => n >= 1 && n <= 50) &&
                    new Set(numbers).size === 5;

    if (!isValid) {
      return res.status(400).json({
        message: 'Numbers must be between 1-50 and unique',
        code: 'INVALID_NUMBERS'
      });
    }

    const { entry, error } = await submitDrawEntryService(drawId, userId, numbers);

    if (error) {
      return res.status(400).json({
        message: error,
        code: 'SUBMIT_ENTRY_ERROR'
      });
    }

    res.status(201).json({
      message: 'Entry submitted successfully',
      entry
    });
  } catch (error) {
    console.error('Submit draw entry controller error:', error);
    res.status(500).json({
      message: 'Error submitting entry',
      code: 'SERVER_ERROR'
    });
  }
};

// Execute draw (Admin only)
export const executeDraw = async (req, res) => {
  try {
    const { drawId } = req.params;

    // Check if draw exists
    const { draw: existingDraw, error: fetchError } = await getDrawByIdService(drawId);

    if (fetchError || !existingDraw) {
      return res.status(404).json({
        message: 'Draw not found',
        code: 'DRAW_NOT_FOUND'
      });
    }

    if (existingDraw.status === 'completed') {
      return res.status(400).json({
        message: 'Draw already completed',
        code: 'DRAW_ALREADY_COMPLETED'
      });
    }

    const { draw, error } = await executeDrawService(drawId);

    if (error) {
      return res.status(400).json({
        message: error,
        code: 'EXECUTE_DRAW_ERROR'
      });
    }

    // Get winners after draw completion
    const { winners } = await getDrawWinnersService(drawId);

    res.json({
      message: 'Draw executed successfully',
      draw: {
        ...draw,
        numbers: draw.numbers // Show winning numbers
      },
      winners
    });
  } catch (error) {
    console.error('Execute draw controller error:', error);
    res.status(500).json({
      message: 'Error executing draw',
      code: 'SERVER_ERROR'
    });
  }
};

// Get draw winners
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

    res.json({ winners });
  } catch (error) {
    console.error('Get draw winners controller error:', error);
    res.status(500).json({
      message: 'Error fetching winners',
      code: 'SERVER_ERROR'
    });
  }
};

// Get user's draw entries
export const getUserDrawEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const { entries, error } = await getUserDrawEntriesService(userId, parseInt(limit));

    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_ENTRIES_ERROR'
      });
    }

    res.json({ entries });
  } catch (error) {
    console.error('Get user draw entries controller error:', error);
    res.status(500).json({
      message: 'Error fetching entries',
      code: 'SERVER_ERROR'
    });
  }
};

// Get user's winnings
export const getUserWinnings = async (req, res) => {
  try {
    const userId = req.user.id;

    const { winnings, stats, error } = await getUserWinningsService(userId);

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

// Claim prize
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
      message: 'Prize claimed successfully',
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

// Get latest draw
export const getLatestDraw = async (req, res) => {
  try {
    const { draw, error } = await getLatestDrawService();

    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_LATEST_DRAW_ERROR'
      });
    }

    res.json({ draw });
  } catch (error) {
    console.error('Get latest draw controller error:', error);
    res.status(500).json({
      message: 'Error fetching latest draw',
      code: 'SERVER_ERROR'
    });
  }
};

// Get active draw
export const getActiveDraw = async (req, res) => {
  try {
    const { draw, error } = await getActiveDrawService();

    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_ACTIVE_DRAW_ERROR'
      });
    }

    res.json({ draw });
  } catch (error) {
    console.error('Get active draw controller error:', error);
    res.status(500).json({
      message: 'Error fetching active draw',
      code: 'SERVER_ERROR'
    });
  }
};

// Get draw statistics
export const getDrawStats = async (req, res) => {
  try {
    const { stats, error } = await getDrawStatsService();

    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_STATS_ERROR'
      });
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get draw stats controller error:', error);
    res.status(500).json({
      message: 'Error fetching statistics',
      code: 'SERVER_ERROR'
    });
  }
};

// Generate random numbers for user (helper)
export const generateRandomNumbers = (req, res) => {
  try {
    const numbers = generateDrawNumbers();
    res.json({ numbers });
  } catch (error) {
    console.error('Generate random numbers error:', error);
    res.status(500).json({
      message: 'Error generating numbers',
      code: 'SERVER_ERROR'
    });
  }
};
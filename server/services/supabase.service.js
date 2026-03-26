import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}

// Use service role key for backend operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Function to verify JWT token
export const verifySupabaseToken = async (token) => {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error) throw error;

    return { user, error: null };
  } catch (error) {
    console.error('Token verification error:', error);
    return { user: null, error: error.message };
  }
};

// Function to get user profile
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { profile: data, error: null };
  } catch (error) {
    console.error('Get profile error:', error);
    return { profile: null, error: error.message };
  }
};

// Function to update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { profile: data, error: null };
  } catch (error) {
    console.error('Update profile error:', error);
    return { profile: null, error: error.message };
  }
};

// ============= SCORE FUNCTIONS =============

// Add a new score
export const addScore = async (userId, value) => {
  try {
    // Validate score value
    if (value < 0 || value > 100) {
      throw new Error('Score must be between 0 and 100');
    }

    // Insert new score
    const { data: newScore, error: insertError } = await supabaseAdmin
      .from('scores')
      .insert({
        user_id: userId,
        value: value
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Get all scores for this user after insertion
    const { data: allScores, error: fetchError } = await supabaseAdmin
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    // Enforce max 5 scores (in case trigger didn't fire or for double-check)
    let finalScores = allScores;
    if (allScores.length > 5) {
      // Get scores to keep (newest 5)
      finalScores = allScores.slice(0, 5);

      // Get IDs of scores to delete
      const scoresToDelete = allScores.slice(5).map(s => s.id);

      // Delete old scores
      if (scoresToDelete.length > 0) {
        const { error: deleteError } = await supabaseAdmin
          .from('scores')
          .delete()
          .in('id', scoresToDelete);

        if (deleteError) console.error('Error deleting old scores:', deleteError);
      }
    }

    return {
      score: newScore,
      scores: finalScores,
      error: null
    };
  } catch (error) {
    console.error('Add score error:', error);
    return { score: null, scores: null, error: error.message };
  }
};

// Get user's scores
export const getUserScores = async (userId, limit = 5) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { scores: data, error: null };
  } catch (error) {
    console.error('Get user scores error:', error);
    return { scores: null, error: error.message };
  }
};

// Get all scores (admin only)
export const getAllScores = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('scores')
      .select('*, profiles(username, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { scores: data, error: null };
  } catch (error) {
    console.error('Get all scores error:', error);
    return { scores: null, error: error.message };
  }
};

// Delete a specific score
export const deleteScore = async (scoreId, userId) => {
  try {
    const { error } = await supabaseAdmin
      .from('scores')
      .delete()
      .eq('id', scoreId)
      .eq('user_id', userId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Delete score error:', error);
    return { error: error.message };
  }
};

// Get score statistics for user
export const getUserScoreStats = async (userId) => {
  try {
    const { data: scores, error } = await supabaseAdmin
      .from('scores')
      .select('value')
      .eq('user_id', userId);

    if (error) throw error;

    if (scores.length === 0) {
      return {
        stats: {
          total: 0,
          average: 0,
          highest: 0,
          lowest: 0,
          count: 0
        },
        error: null
      };
    }

    const values = scores.map(s => s.value);
    const stats = {
      total: values.reduce((a, b) => a + b, 0),
      average: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      highest: Math.max(...values),
      lowest: Math.min(...values),
      count: values.length
    };

    return { stats, error: null };
  } catch (error) {
    console.error('Get score stats error:', error);
    return { stats: null, error: error.message };
  }
};

// ============= DRAW FUNCTIONS =============

// Generate random draw numbers (5 unique numbers between 1-50)
export const generateDrawNumbers = () => {
  const numbers = [];
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 50) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
};

// Create a new draw
export const createDraw = async (createdBy, prizePool = 1000) => {
  try {
    const numbers = generateDrawNumbers();

    const { data, error } = await supabaseAdmin
      .from('draws')
      .insert({
        numbers: numbers,
        status: 'pending',
        prize_pool: prizePool,
        created_by: createdBy,
        date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;

    return { draw: data, error: null };
  } catch (error) {
    console.error('Create draw error:', error);
    return { draw: null, error: error.message };
  }
};

// Get all draws
export const getDraws = async (status = null, limit = 10) => {
  try {
    let query = supabaseAdmin
      .from('draws')
      .select('*, winners(*), draw_entries(count)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { draws: data, error: null };
  } catch (error) {
    console.error('Get draws error:', error);
    return { draws: null, error: error.message };
  }
};

// Get draw by ID
export const getDrawById = async (drawId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .select('*, winners(*, profiles(username, email)), draw_entries(*, profiles(username, email))')
      .eq('id', drawId)
      .single();

    if (error) throw error;

    return { draw: data, error: null };
  } catch (error) {
    console.error('Get draw by ID error:', error);
    return { draw: null, error: error.message };
  }
};

// Submit user numbers for a draw
export const submitDrawEntry = async (drawId, userId, numbers) => {
  try {
    // Validate numbers
    if (!Array.isArray(numbers) || numbers.length !== 5) {
      throw new Error('Must provide exactly 5 numbers');
    }

    // Check if user already entered this draw
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('draw_entries')
      .select('id')
      .eq('draw_id', drawId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      throw new Error('You have already entered this draw');
    }

    // Insert entry
    const { data, error } = await supabaseAdmin
      .from('draw_entries')
      .insert({
        draw_id: drawId,
        user_id: userId,
        numbers: numbers.sort((a, b) => a - b)
      })
      .select()
      .single();

    if (error) throw error;

    return { entry: data, error: null };
  } catch (error) {
    console.error('Submit draw entry error:', error);
    return { entry: null, error: error.message };
  }
};

// Execute draw (complete the draw and award prizes)
export const executeDraw = async (drawId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .update({ status: 'completed' })
      .eq('id', drawId)
      .select()
      .single();

    if (error) throw error;

    return { draw: data, error: null };
  } catch (error) {
    console.error('Execute draw error:', error);
    return { draw: null, error: error.message };
  }
};

// Get user's entries for draws
export const getUserDrawEntries = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('draw_entries')
      .select('*, draws(*, winners(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { entries: data, error: null };
  } catch (error) {
    console.error('Get user draw entries error:', error);
    return { entries: null, error: error.message };
  }
};

// ============= WINNERS FUNCTIONS =============

// Get winners for a specific draw
export const getDrawWinners = async (drawId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('winners_view')
      .select('*')
      .eq('draw_id', drawId)
      .order('match_count', { ascending: false })
      .order('prize_amount', { ascending: false });

    if (error) throw error;

    return { winners: data, error: null };
  } catch (error) {
    console.error('Get draw winners error:', error);
    return { winners: null, error: error.message };
  }
};

// Get user's winnings
export const getUserWinnings = async (userId, status = null) => {
  try {
    let query = supabaseAdmin
      .from('winners_view')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      totalWon: data.reduce((sum, w) => sum + w.prize_amount, 0),
      claimedWon: data.filter(w => w.status === 'claimed').reduce((sum, w) => sum + w.prize_amount, 0),
      pendingWon: data.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.prize_amount, 0),
      totalWins: data.length,
      claimedWins: data.filter(w => w.status === 'claimed').length,
      pendingWins: data.filter(w => w.status === 'pending').length,
      highestPrize: data.length > 0 ? Math.max(...data.map(w => w.prize_amount)) : 0
    };

    return { winnings: data, stats, error: null };
  } catch (error) {
    console.error('Get user winnings error:', error);
    return { winnings: null, stats: null, error: error.message };
  }
};

// Claim a prize
export const claimPrize = async (winnerId, userId) => {
  try {
    // First check if winner belongs to user and is pending
    const { data: winner, error: fetchError } = await supabaseAdmin
      .from('winners')
      .select('*')
      .eq('id', winnerId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (fetchError || !winner) {
      throw new Error('Prize not found or already claimed');
    }

    // Update winner status
    const { data, error } = await supabaseAdmin
      .from('winners')
      .update({
        status: 'claimed',
        claimed_at: new Date().toISOString()
      })
      .eq('id', winnerId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return { winner: data, error: null };
  } catch (error) {
    console.error('Claim prize error:', error);
    return { winner: null, error: error.message };
  }
};

// Get prize distribution for a draw
export const getPrizeDistribution = async (drawId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('prize_distribution')
      .select('*')
      .eq('draw_id', drawId)
      .order('match_count', { ascending: false });

    if (error) throw error;

    return { distribution: data, error: null };
  } catch (error) {
    console.error('Get prize distribution error:', error);
    return { distribution: null, error: error.message };
  }
};

// Get top winners overall
export const getTopWinners = async (limit = 10) => {
  try {
    const { data, error } = await supabaseAdmin
      .rpc('get_top_winners', { limit_count: limit });

    if (error) throw error;

    return { topWinners: data, error: null };
  } catch (error) {
    console.error('Get top winners error:', error);
    return { topWinners: null, error: error.message };
  }
};

// Get winner statistics
export const getWinnerStats = async () => {
  try {
    // Total winners
    const { count: totalWinners, error: winnersError } = await supabaseAdmin
      .from('winners')
      .select('*', { count: 'exact', head: true });

    if (winnersError) throw winnersError;

    // Total prizes awarded
    const { data: prizes, error: prizesError } = await supabaseAdmin
      .from('winners')
      .select('prize_amount');

    if (prizesError) throw prizesError;

    const totalPrizeAwarded = prizes.reduce((sum, p) => sum + p.prize_amount, 0);

    // Claimed vs pending
    const { data: claimedData, error: claimedError } = await supabaseAdmin
      .from('winners')
      .select('status');

    if (claimedError) throw claimedError;

    const claimed = claimedData.filter(w => w.status === 'claimed').length;
    const pending = claimedData.filter(w => w.status === 'pending').length;

    // Average prize
    const avgPrize = totalWinners > 0 ? totalPrizeAwarded / totalWinners : 0;

    // Highest prize
    const highestPrize = prizes.length > 0 ? Math.max(...prizes.map(p => p.prize_amount)) : 0;

    return {
      stats: {
        totalWinners,
        totalPrizeAwarded,
        claimedCount: claimed,
        pendingCount: pending,
        averagePrize: avgPrize,
        highestPrize
      },
      error: null
    };
  } catch (error) {
    console.error('Get winner stats error:', error);
    return { stats: null, error: error.message };
  }
};

// Get winners by match count
export const getWinnersByMatchCount = async (drawId = null, matchCount = null) => {
  try {
    let query = supabaseAdmin
      .from('winners_view')
      .select('*');

    if (drawId) {
      query = query.eq('draw_id', drawId);
    }

    if (matchCount) {
      query = query.eq('match_count', matchCount);
    }

    const { data, error } = await query.order('prize_amount', { ascending: false });

    if (error) throw error;

    return { winners: data, error: null };
  } catch (error) {
    console.error('Get winners by match count error:', error);
    return { winners: null, error: error.message };
  }
};

// Get latest draw
export const getLatestDraw = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .select('*, winners(*), draw_entries(count)')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return { draw: data || null, error: null };
  } catch (error) {
    console.error('Get latest draw error:', error);
    return { draw: null, error: error.message };
  }
};

// Get active draw (pending)
export const getActiveDraw = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .select('*, winners(*), draw_entries(count)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return { draw: data || null, error: null };
  } catch (error) {
    console.error('Get active draw error:', error);
    return { draw: null, error: error.message };
  }
};

// Get draw statistics
export const getDrawStats = async () => {
  try {
    // Total draws
    const { count: totalDraws, error: drawsError } = await supabaseAdmin
      .from('draws')
      .select('*', { count: 'exact', head: true });

    if (drawsError) throw drawsError;

    // Total entries
    const { count: totalEntries, error: entriesError } = await supabaseAdmin
      .from('draw_entries')
      .select('*', { count: 'exact', head: true });

    if (entriesError) throw entriesError;

    // Total prizes awarded
    const { data: prizes, error: prizesError } = await supabaseAdmin
      .from('winners')
      .select('prize_amount');

    if (prizesError) throw prizesError;

    const totalPrizeAwarded = prizes.reduce((sum, p) => sum + p.prize_amount, 0);

    // Unique participants
    const { data: participants, error: participantsError } = await supabaseAdmin
      .from('draw_entries')
      .select('user_id')
      .order('user_id');

    if (participantsError) throw participantsError;

    const uniqueParticipants = new Set(participants.map(p => p.user_id)).size;

    return {
      stats: {
        totalDraws: totalDraws || 0,
        totalEntries: totalEntries || 0,
        totalParticipants: uniqueParticipants,
        totalPrizeAwarded
      },
      error: null
    };
  } catch (error) {
    console.error('Get draw stats error:', error);
    return { stats: null, error: error.message };
  }
};

// ============= SUBSCRIPTION FUNCTIONS =============

// Get user's subscription
export const getUserSubscription = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, subscription_expires_at, balance')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { subscription: data, error: null };
  } catch (error) {
    console.error('Get user subscription error:', error);
    return { subscription: null, error: error.message };
  }
};

// Update subscription
export const updateSubscription = async (userId, status, expiresAt = null) => {
  try {
    const updates = {
      subscription_status: status,
      updated_at: new Date().toISOString()
    };

    if (expiresAt) {
      updates.subscription_expires_at = expiresAt;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { subscription: data, error: null };
  } catch (error) {
    console.error('Update subscription error:', error);
    return { subscription: null, error: error.message };
  }
};

// Get user's subscription history
export const getUserSubscriptions = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { subscriptions: data, error: null };
  } catch (error) {
    console.error('Get user subscriptions error:', error);
    return { subscriptions: null, error: error.message };
  }
};

// Create subscription record
export const createSubscriptionRecord = async (subscriptionData) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (error) throw error;

    return { subscription: data, error: null };
  } catch (error) {
    console.error('Create subscription record error:', error);
    return { subscription: null, error: error.message };
  }
};

// Update subscription record
export const updateSubscriptionRecord = async (subscriptionId, updates, stripeSubscriptionId = null) => {
  try {
    let query = supabaseAdmin
      .from('subscriptions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      });

    if (stripeSubscriptionId) {
      query = query.eq('stripe_subscription_id', stripeSubscriptionId);
    } else {
      query = query.eq('id', subscriptionId);
    }

    const { data, error } = await query.select().single();

    if (error) throw error;

    return { subscription: data, error: null };
  } catch (error) {
    console.error('Update subscription record error:', error);
    return { subscription: null, error: error.message };
  }
};

// Cancel user subscription
export const cancelUserSubscription = async (userId) => {
  try {
    // Update the latest active subscription to cancelled
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'cancelled',
        end_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .select()
      .single();

    if (error) throw error;

    return { subscription: data, error: null };
  } catch (error) {
    console.error('Cancel user subscription error:', error);
    return { subscription: null, error: error.message };
  }
};

// Get user's balance
export const getUserBalance = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { balance: data.balance || 0, error: null };
  } catch (error) {
    console.error('Get user balance error:', error);
    return { balance: 0, error: error.message };
  }
};

// Update user balance
export const updateUserBalance = async (userId, amount) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        balance: amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { balance: data.balance, error: null };
  } catch (error) {
    console.error('Update balance error:', error);
    return { balance: null, error: error.message };
  }
};

// Get dashboard stats
export const getDashboardStats = async (userId) => {
  try {
    // Get user's scores
    const { data: scores, error: scoresError } = await supabaseAdmin
      .from('scores')
      .select('score')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (scoresError) throw scoresError;

    // Get user's winnings
    const { data: winnings, error: winningsError } = await supabaseAdmin
      .from('winners')
      .select('prize')
      .eq('user_id', userId);

    if (winningsError) throw winningsError;

    // Get user's entries count
    const { count: entriesCount, error: entriesError } = await supabaseAdmin
      .from('draw_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (entriesError) throw entriesError;

    // Get active draw
    const { data: activeDraw, error: drawError } = await supabaseAdmin
      .from('draws')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (drawError && drawError.code !== 'PGRST116') throw drawError;

    // Calculate stats
    const scoreStats = {
      total: scores.reduce((sum, s) => sum + s.score, 0),
      average: scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length) : 0,
      highest: scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0,
      count: scores.length
    };

    const winningsStats = {
      total: winnings.length, // Count of wins since prize is TEXT
      pending: 0, // No status column, so assume all are claimed
      claimed: winnings.length,
      count: winnings.length
    };

    return {
      stats: {
        scores: scoreStats,
        winnings: winningsStats,
        entriesCount: entriesCount || 0,
        hasActiveDraw: !!activeDraw
      },
      recentScores: scores,
      activeDraw,
      error: null
    };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return { stats: null, recentScores: null, activeDraw: null, error: error.message };
  }
};
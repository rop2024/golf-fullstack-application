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
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

// Function to create user profile
export const createUserProfile = async (profileData) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) throw error;

    return { profile: data, error: null };
  } catch (error) {
    console.error('Create profile error:', error);
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

export { supabaseAdmin as supabase };
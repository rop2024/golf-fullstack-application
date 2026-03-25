import { supabaseAdmin, getUserProfile, updateUserProfile } from '../services/supabase.service.js';

export const getCurrentUser = async (req, res) => {
  try {
    const { user } = req;

    // Get fresh profile data
    const { profile, error } = await getUserProfile(user.id);

    if (error && error !== 'PGRST116') {
      return res.status(500).json({ message: 'Error fetching profile' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        subscription_status: user.subscription_status,
        profile: profile || null
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;
    delete updates.email;

    const { profile, error } = await updateUserProfile(userId, updates);

    if (error) {
      return res.status(400).json({ message: error });
    }

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Only admins can access this
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Only admins can update roles
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { profile, error } = await updateUserProfile(userId, { role });

    if (error) {
      return res.status(400).json({ message: error });
    }

    res.json({
      message: 'User role updated successfully',
      user: profile
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};
import { verifySupabaseToken, getUserProfile, supabaseAdmin } from '../services/supabase.service.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token provided',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with Supabase
    const { user, error } = await verifySupabaseToken(token);

    if (error || !user) {
      return res.status(401).json({
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    // Get user profile from profiles table
    const { profile, error: profileError } = await getUserProfile(user.id);

    if (profileError && profileError !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching profile:', profileError);
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: profile?.role || 'user',
      subscription_status: profile?.subscription_status || 'free',
      profile: profile || null
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      message: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

export const authorizeAdmin = async (req, res, next) => {
  const userId = req.user.id;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || data.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

export const authorizePremium = (req, res, next) => {
  if (req.user && req.user.subscription_status === 'premium') {
    next();
  } else {
    res.status(403).json({
      message: 'Premium subscription required',
      code: 'PREMIUM_REQUIRED'
    });
  }
};
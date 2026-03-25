import { supabaseAdmin } from '../services/supabase.service.js';

// Check if user has active subscription
export const requireActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user's subscription status
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, subscription_expires_at')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    const isActive = profile.subscription_status !== 'free';
    const isExpired = profile.subscription_expires_at && 
                      new Date(profile.subscription_expires_at) < new Date();
    
    if (!isActive || isExpired) {
      return res.status(403).json({
        message: 'Active subscription required for this feature',
        code: 'SUBSCRIPTION_REQUIRED',
        subscription_status: profile.subscription_status
      });
    }
    
    // Check if subscription is expired but still marked as premium
    if (isExpired && isActive) {
      // Auto-downgrade expired subscription
      await supabaseAdmin
        .from('profiles')
        .update({ 
          subscription_status: 'free',
          subscription_expires_at: null
        })
        .eq('id', userId);
      
      return res.status(403).json({
        message: 'Your subscription has expired. Please renew to continue.',
        code: 'SUBSCRIPTION_EXPIRED'
      });
    }
    
    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    res.status(500).json({
      message: 'Error checking subscription status',
      code: 'SERVER_ERROR'
    });
  }
};

// Check if user has premium subscription for advanced features
export const requirePremiumSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, subscription_expires_at')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    const isPremium = profile.subscription_status === 'premium' || 
                      profile.subscription_status === 'pro';
    const isExpired = profile.subscription_expires_at && 
                      new Date(profile.subscription_expires_at) < new Date();
    
    if (!isPremium || isExpired) {
      return res.status(403).json({
        message: 'Premium subscription required for this feature',
        code: 'PREMIUM_REQUIRED',
        subscription_status: profile.subscription_status
      });
    }
    
    next();
  } catch (error) {
    console.error('Premium middleware error:', error);
    res.status(500).json({
      message: 'Error checking premium status',
      code: 'SERVER_ERROR'
    });
  }
};

// Check if user has pro subscription for advanced features
export const requireProSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, subscription_expires_at')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    const isPro = profile.subscription_status === 'pro';
    const isExpired = profile.subscription_expires_at && 
                      new Date(profile.subscription_expires_at) < new Date();
    
    if (!isPro || isExpired) {
      return res.status(403).json({
        message: 'Pro subscription required for this feature',
        code: 'PRO_REQUIRED',
        subscription_status: profile.subscription_status
      });
    }
    
    next();
  } catch (error) {
    console.error('Pro middleware error:', error);
    res.status(500).json({
      message: 'Error checking pro status',
      code: 'SERVER_ERROR'
    });
  }
};

// Feature-based access control
export const requireFeatureAccess = (feature) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('subscription_status')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Define feature access levels
      const featureAccess = {
        'submit_score': ['free', 'premium', 'pro'],
        'submit_draw_entry': ['free', 'premium', 'pro'],
        'view_advanced_stats': ['premium', 'pro'],
        'bulk_score_submission': ['premium', 'pro'],
        'priority_support': ['premium', 'pro'],
        'api_access': ['pro'],
        'custom_numbers': ['premium', 'pro'],
        'multiple_entries': ['premium', 'pro'],
        'early_access': ['pro']
      };
      
      const allowedPlans = featureAccess[feature];
      if (!allowedPlans) {
        return res.status(400).json({
          message: 'Invalid feature',
          code: 'INVALID_FEATURE'
        });
      }
      
      if (!allowedPlans.includes(profile.subscription_status)) {
        return res.status(403).json({
          message: `This feature requires ${allowedPlans.join(' or ')} subscription`,
          code: 'FEATURE_NOT_AVAILABLE',
          required_plan: allowedPlans[0]
        });
      }
      
      next();
    } catch (error) {
      console.error('Feature access error:', error);
      res.status(500).json({
        message: 'Error checking feature access',
        code: 'SERVER_ERROR'
      });
    }
  };
};

// Rate limiting based on subscription
export const rateLimitBySubscription = (limits) => {
  // limits = { free: 10, premium: 50, pro: 100 }
  const userRequests = new Map();
  
  return async (req, res, next) => {
    const userId = req.user.id;
    const endpoint = req.path;
    const key = `${userId}:${endpoint}`;
    
    // Get user's subscription
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status')
      .eq('id', userId)
      .single();
    
    const plan = profile?.subscription_status || 'free';
    const limit = limits[plan] || limits.free;
    
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    
    if (!userRequests.has(key)) {
      userRequests.set(key, []);
    }
    
    const requests = userRequests.get(key);
    const windowStart = now - windowMs;
    
    // Filter requests within current window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (recentRequests.length >= limit) {
      return res.status(429).json({
        message: `Rate limit exceeded. ${plan} users can make ${limit} requests per minute.`,
        code: 'RATE_LIMIT_EXCEEDED',
        limit,
        plan
      });
    }
    
    recentRequests.push(now);
    userRequests.set(key, recentRequests);
    
    next();
  };
};
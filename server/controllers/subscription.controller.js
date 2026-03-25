import {
  getUserSubscription,
  updateSubscription,
  getUserBalance,
  updateUserBalance
} from '../services/supabase.service.js';

// Get user's subscription
export const getSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { subscription, error } = await getUserSubscription(userId);
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_SUBSCRIPTION_ERROR'
      });
    }
    
    res.json({ subscription });
  } catch (error) {
    console.error('Get subscription controller error:', error);
    res.status(500).json({
      message: 'Error fetching subscription',
      code: 'SERVER_ERROR'
    });
  }
};

// Upgrade subscription
export const upgradeSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan } = req.body; // 'premium' or 'pro'
    
    if (!plan || !['premium', 'pro'].includes(plan)) {
      return res.status(400).json({
        message: 'Invalid subscription plan',
        code: 'INVALID_PLAN'
      });
    }
    
    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    const { subscription, error } = await updateSubscription(userId, plan, expiresAt.toISOString());
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'UPGRADE_ERROR'
      });
    }
    
    res.json({
      message: `Successfully upgraded to ${plan} plan!`,
      subscription
    });
  } catch (error) {
    console.error('Upgrade subscription controller error:', error);
    res.status(500).json({
      message: 'Error upgrading subscription',
      code: 'SERVER_ERROR'
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { subscription, error } = await updateSubscription(userId, 'free', null);
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'CANCEL_ERROR'
      });
    }
    
    res.json({
      message: 'Subscription cancelled successfully',
      subscription
    });
  } catch (error) {
    console.error('Cancel subscription controller error:', error);
    res.status(500).json({
      message: 'Error cancelling subscription',
      code: 'SERVER_ERROR'
    });
  }
};

// Get user's balance
export const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { balance, error } = await getUserBalance(userId);
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_BALANCE_ERROR'
      });
    }
    
    res.json({ balance });
  } catch (error) {
    console.error('Get balance controller error:', error);
    res.status(500).json({
      message: 'Error fetching balance',
      code: 'SERVER_ERROR'
    });
  }
};

// Get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { stats, recentScores, activeDraw, error } = await getDashboardStats(userId);
    
    if (error) {
      return res.status(400).json({
        message: error,
        code: 'FETCH_DASHBOARD_ERROR'
      });
    }
    
    res.json({
      stats,
      recentScores,
      activeDraw,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get dashboard data controller error:', error);
    res.status(500).json({
      message: 'Error fetching dashboard data',
      code: 'SERVER_ERROR'
    });
  }
};
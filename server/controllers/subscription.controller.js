import {
  getUserSubscription,
  updateSubscription,
  getUserBalance,
  updateUserBalance,
  getDashboardStats
} from '../services/supabase.service.js';
import { supabaseAdmin } from '../services/supabase.service.js';
import stripe from '../config/stripe.js';

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

// Create subscription checkout session
export const createSubscription = async (req, res) => {
  try {
    const user = req.user; // from Supabase JWT
    const { priceId } = req.body;

    // 1. Create customer in Stripe
    const customer = await stripe.customers.create({
      email: user.email,
    });

    // 2. Store customer ID in database
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        stripe_customer_id: customer.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error storing customer ID:', error);
      // Continue anyway, but log the error
    }

    // 3. Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
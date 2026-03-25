import { supabaseAdmin } from './supabase.service.js';
import notificationService from './notification.service.js';

class SubscriptionService {
  // Subscription plans and their features
  plans = {
    free: {
      name: 'Free',
      price: 0,
      features: {
        maxScores: 5,
        maxDrawEntries: 1,
        prizeMultiplier: 1,
        canSubmitScores: true,
        canEnterDraws: true,
        canViewStats: false,
        canBulkSubmit: false,
        prioritySupport: false,
        apiAccess: false,
        customNumbers: false,
        multipleEntries: false
      },
      limits: {
        scoresPerDay: 5,
        drawEntriesPerMonth: 3,
        apiCallsPerMinute: 10
      }
    },
    premium: {
      name: 'Premium',
      price: 19.99,
      features: {
        maxScores: 20,
        maxDrawEntries: 5,
        prizeMultiplier: 2,
        canSubmitScores: true,
        canEnterDraws: true,
        canViewStats: true,
        canBulkSubmit: true,
        prioritySupport: true,
        apiAccess: false,
        customNumbers: true,
        multipleEntries: true
      },
      limits: {
        scoresPerDay: 20,
        drawEntriesPerMonth: 15,
        apiCallsPerMinute: 50
      }
    },
    pro: {
      name: 'Pro',
      price: 49.99,
      features: {
        maxScores: 50,
        maxDrawEntries: 10,
        prizeMultiplier: 5,
        canSubmitScores: true,
        canEnterDraws: true,
        canViewStats: true,
        canBulkSubmit: true,
        prioritySupport: true,
        apiAccess: true,
        customNumbers: true,
        multipleEntries: true
      },
      limits: {
        scoresPerDay: 50,
        drawEntriesPerMonth: 50,
        apiCallsPerMinute: 100
      }
    }
  };

  // Get user's current plan and features
  async getUserPlan(userId) {
    try {
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('subscription_status, subscription_expires_at')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      const plan = profile.subscription_status || 'free';
      const planDetails = this.plans[plan];
      
      const isExpired = profile.subscription_expires_at && 
                        new Date(profile.subscription_expires_at) < new Date();
      
      return {
        plan,
        isActive: plan !== 'free' && !isExpired,
        isExpired,
        features: planDetails.features,
        limits: planDetails.limits,
        expiresAt: profile.subscription_expires_at,
        name: planDetails.name,
        price: planDetails.price
      };
    } catch (error) {
      console.error('Get user plan error:', error);
      return null;
    }
  }

  // Upgrade subscription
  async upgradeSubscription(userId, plan, duration = 'monthly') {
    try {
      if (!this.plans[plan]) {
        throw new Error('Invalid subscription plan');
      }
      
      const expiresAt = new Date();
      if (duration === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else if (duration === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }
      
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: plan,
          subscription_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Send confirmation email
      await notificationService.sendEmail(
        data.email,
        `Welcome to ${this.plans[plan].name} Plan!`,
        `
        <h2>Subscription Activated!</h2>
        <p>Your ${this.plans[plan].name} subscription is now active.</p>
        <p>Features included:</p>
        <ul>
          ${Object.entries(this.plans[plan].features)
            .filter(([_, value]) => value)
            .map(([key]) => `<li>${key.replace(/([A-Z])/g, ' $1').trim()}</li>`)
            .join('')}
        </ul>
        <p>Expires: ${expiresAt.toLocaleDateString()}</p>
        `
      );
      
      return { success: true, subscription: data };
    } catch (error) {
      console.error('Upgrade subscription error:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancel subscription
  async cancelSubscription(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: 'free',
          subscription_expires_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, subscription: data };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user can perform action
  async canPerformAction(userId, action, currentCount = 0) {
    const plan = await this.getUserPlan(userId);
    if (!plan) return false;
    
    switch (action) {
      case 'submit_score':
        return plan.features.canSubmitScores && currentCount < plan.features.maxScores;
      
      case 'enter_draw':
        return plan.features.canEnterDraws && currentCount < plan.features.maxDrawEntries;
      
      case 'view_stats':
        return plan.features.canViewStats;
      
      case 'bulk_submit':
        return plan.features.canBulkSubmit;
      
      default:
        return false;
    }
  }

  // Calculate prize with multiplier
  async calculatePrize(userId, basePrize) {
    const plan = await this.getUserPlan(userId);
    const multiplier = plan?.features.prizeMultiplier || 1;
    return basePrize * multiplier;
  }

  // Check rate limits
  async checkRateLimit(userId, action, count = 1) {
    const plan = await this.getUserPlan(userId);
    if (!plan) return false;
    
    const limits = plan.limits;
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's usage
    let table, field;
    switch (action) {
      case 'submit_score':
        table = 'scores';
        field = 'created_at';
        break;
      case 'enter_draw':
        table = 'draw_entries';
        field = 'created_at';
        break;
      default:
        return true;
    }
    
    const { data: usage } = await supabaseAdmin
      .from(table)
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .gte(field, `${today}T00:00:00Z`);
    
    const currentUsage = usage?.length || 0;
    const limit = action === 'submit_score' ? limits.scoresPerDay : limits.drawEntriesPerMonth;
    
    return currentUsage + count <= limit;
  }
}

export default new SubscriptionService();
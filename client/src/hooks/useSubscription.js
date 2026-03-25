import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch subscription
  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/subscription/my-subscription');
      setSubscription(response.data.subscription);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    try {
      const response = await api.get('/subscription/balance');
      setBalance(response.data.balance);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  }, []);

  // Upgrade subscription
  const upgradeSubscription = useCallback(async (plan, duration = 'monthly') => {
    setLoading(true);
    try {
      const response = await api.post('/subscription/upgrade', { plan, duration });
      setSubscription(response.data.subscription);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upgrade subscription');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.post('/subscription/cancel');
      setSubscription(response.data.subscription);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel subscription');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user can perform action
  const canPerformAction = useCallback((action) => {
    if (!subscription) return false;

    const features = {
      submit_score: true, // Allow all users to submit scores (with limits)
      enter_draw: true, // Allow all users to enter draws (with limits)
      view_stats: subscription.subscription_status !== 'free',
      bulk_submit: subscription.subscription_status === 'premium' || subscription.subscription_status === 'pro',
      api_access: subscription.subscription_status === 'pro'
    };

    return features[action] || false;
  }, [subscription]);

  // Get feature limit
  const getFeatureLimit = useCallback((feature) => {
    const limits = {
      free: { maxScores: 5, maxDrawEntries: 1, prizeMultiplier: 1 },
      premium: { maxScores: 20, maxDrawEntries: 5, prizeMultiplier: 2 },
      pro: { maxScores: 50, maxDrawEntries: 10, prizeMultiplier: 5 }
    };

    const plan = subscription?.subscription_status || 'free';
    return limits[plan][feature] || limits.free[feature];
  }, [subscription]);

  // Initial load
  useEffect(() => {
    fetchSubscription();
    fetchBalance();
  }, []);

  return {
    subscription,
    balance,
    loading,
    error,
    isPremium: subscription?.subscription_status === 'premium' || subscription?.subscription_status === 'pro',
    isPro: subscription?.subscription_status === 'pro',
    isFree: subscription?.subscription_status === 'free',
    isActive: subscription?.subscription_status !== 'free',
    fetchSubscription,
    fetchBalance,
    upgradeSubscription,
    cancelSubscription,
    canPerformAction,
    getFeatureLimit
  };
};
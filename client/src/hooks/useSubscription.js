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
  const upgradeSubscription = useCallback(async (plan) => {
    setLoading(true);
    try {
      const response = await api.post('/subscription/upgrade', { plan });
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
    isFree: subscription?.subscription_status === 'free',
    fetchSubscription,
    fetchBalance,
    upgradeSubscription,
    cancelSubscription
  };
};
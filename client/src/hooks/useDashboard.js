import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      scores: { total: 0, average: 0, highest: 0, count: 0 },
      winnings: { total: 0, pending: 0, claimed: 0, count: 0 },
      entriesCount: 0,
      hasActiveDraw: false
    },
    recentScores: [],
    activeDraw: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/subscription/dashboard');
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refreshDashboard: fetchDashboard
  };
};
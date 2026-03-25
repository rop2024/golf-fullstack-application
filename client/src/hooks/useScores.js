import { useState, useEffect, useCallback } from 'react';
import scoreService from '../services/score.service';

export const useScores = () => {
  const [scores, setScores] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    highest: 0,
    lowest: 0,
    count: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remainingSlots, setRemainingSlots] = useState(5);
  const [plan, setPlan] = useState('free');
  const [features, setFeatures] = useState(null);

  // Fetch scores
  const fetchScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await scoreService.getMyScores();
    
    if (result.success) {
      setScores(result.data.scores);
      setRemainingSlots(result.data.remaining_slots);
      setPlan(result.data.plan);
      setFeatures(result.data.features);
      
      // Use server-provided stats if available, otherwise calculate locally
      if (result.data.stats) {
        setStats(result.data.stats);
      } else {
        const calculatedStats = calculateStats(result.data.scores);
        setStats(calculatedStats);
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [calculateStats]);

  // Calculate stats from scores array
  const calculateStats = useCallback((scoresArray) => {
    if (scoresArray.length === 0) {
      return {
        total: 0,
        average: 0,
        highest: 0,
        lowest: 0,
        count: 0
      };
    }

    const values = scoresArray.map(s => s.value);
    const total = values.reduce((a, b) => a + b, 0);
    const average = Math.round(total / values.length);
    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    return {
      total,
      average,
      highest,
      lowest,
      count: scoresArray.length
    };
  }, []);

  // Add a new score
  const addScore = useCallback(async (value) => {
    setLoading(true);
    setError(null);
    
    const result = await scoreService.addScore(value);
    
    if (result.success) {
      setScores(result.data.scores);
      setRemainingSlots(result.data.remaining_slots);
      setPlan(result.data.plan || plan);
      setFeatures(result.data.features || features);
      
      // Calculate stats locally instead of making another API call
      const newStats = calculateStats(result.data.scores);
      setStats(newStats);
      
      setLoading(false);
      return { success: true, data: result.data };
    } else {
      setError(result.error);
      setLoading(false);
      return { success: false, error: result.error };
    }
  }, [plan, features, calculateStats]);

  // Delete a score
  const deleteScore = useCallback(async (scoreId) => {
    setLoading(true);
    setError(null);
    
    const result = await scoreService.deleteScore(scoreId);
    
    if (result.success) {
      setScores(result.data.scores);
      setRemainingSlots(result.data.remaining_slots);
      
      // Calculate stats locally instead of making another API call
      const newStats = calculateStats(result.data.scores);
      setStats(newStats);
      
      setLoading(false);
      return { success: true };
    } else {
      setError(result.error);
      setLoading(false);
      return { success: false, error: result.error };
    }
  }, [calculateStats]);

  // Bulk add scores (for testing)
  const bulkAddScores = useCallback(async (scoreValues) => {
    setLoading(true);
    setError(null);
    
    const result = await scoreService.bulkAddScores(scoreValues);
    
    if (result.success) {
      setScores(result.data.scores);
      setRemainingSlots(result.data.remaining_slots);
      
      // Calculate stats locally instead of making another API call
      const newStats = calculateStats(result.data.scores);
      setStats(newStats);
      
      setLoading(false);
      return { success: true, data: result.data };
    } else {
      setError(result.error);
      setLoading(false);
      return { success: false, error: result.error };
    }
  }, [calculateStats]);

  // Load scores on mount
  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return {
    scores,
    stats,
    loading,
    error,
    remainingSlots,
    plan,
    features,
    addScore,
    deleteScore,
    fetchScores,
    bulkAddScores,
    hasScores: scores.length > 0,
    isMaxScores: scores.length >= 5
  };
};
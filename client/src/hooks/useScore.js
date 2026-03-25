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

  // Fetch scores
  const fetchScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await scoreService.getMyScores();
    
    if (result.success) {
      setScores(result.data.scores);
      setStats(result.data.stats);
      setRemainingSlots(result.data.remaining_slots);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, []);

  // Add a new score
  const addScore = useCallback(async (value) => {
    setLoading(true);
    setError(null);
    
    const result = await scoreService.addScore(value);
    
    if (result.success) {
      setScores(result.data.scores);
      setRemainingSlots(result.data.remaining_slots);
      
      // Refresh stats
      const statsResult = await scoreService.getStats();
      if (statsResult.success) {
        setStats(statsResult.data.stats);
      }
      
      return { success: true, data: result.data };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
    
    setLoading(false);
  }, []);

  // Delete a score
  const deleteScore = useCallback(async (scoreId) => {
    setLoading(true);
    setError(null);
    
    const result = await scoreService.deleteScore(scoreId);
    
    if (result.success) {
      setScores(result.data.scores);
      setRemainingSlots(result.data.remaining_slots);
      
      // Refresh stats
      const statsResult = await scoreService.getStats();
      if (statsResult.success) {
        setStats(statsResult.data.stats);
      }
      
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
    
    setLoading(false);
  }, []);

  // Bulk add scores (for testing)
  const bulkAddScores = useCallback(async (scoreValues) => {
    setLoading(true);
    setError(null);
    
    const result = await scoreService.bulkAddScores(scoreValues);
    
    if (result.success) {
      setScores(result.data.scores);
      setRemainingSlots(result.data.remaining_slots);
      
      // Refresh stats
      const statsResult = await scoreService.getStats();
      if (statsResult.success) {
        setStats(statsResult.data.stats);
      }
      
      return { success: true, data: result.data };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
    
    setLoading(false);
  }, []);

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
    addScore,
    deleteScore,
    fetchScores,
    bulkAddScores,
    hasScores: scores.length > 0,
    isMaxScores: scores.length >= 5
  };
};
import { useState, useEffect, useCallback } from 'react';
import drawService from '../services/draw.service';

export const useDraw = () => {
  const [activeDraw, setActiveDraw] = useState(null);
  const [latestDraw, setLatestDraw] = useState(null);
  const [userEntries, setUserEntries] = useState([]);
  const [userWinnings, setUserWinnings] = useState([]);
  const [winningsStats, setWinningsStats] = useState({ totalWon: 0, unclaimed: 0, totalWins: 0 });
  const [draws, setDraws] = useState([]);
  const [drawStats, setDrawStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active draw
  const fetchActiveDraw = useCallback(async () => {
    setLoading(true);
    const result = await drawService.getActiveDraw();
    if (result.success) {
      setActiveDraw(result.data.draw);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Fetch latest draw
  const fetchLatestDraw = useCallback(async () => {
    setLoading(true);
    const result = await drawService.getLatestDraw();
    if (result.success) {
      setLatestDraw(result.data.draw);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Fetch user entries
  const fetchUserEntries = useCallback(async () => {
    setLoading(true);
    const result = await drawService.getUserEntries();
    if (result.success) {
      setUserEntries(result.data.entries);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Fetch user winnings
  const fetchUserWinnings = useCallback(async () => {
    setLoading(true);
    const result = await drawService.getUserWinnings();
    if (result.success) {
      setUserWinnings(result.data.winnings);
      setWinningsStats(result.data.stats);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Fetch all draws
  const fetchDraws = useCallback(async (status = null, limit = 10) => {
    setLoading(true);
    const result = await drawService.getDraws(status, limit);
    if (result.success) {
      setDraws(result.data.draws);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Fetch draw statistics
  const fetchDrawStats = useCallback(async () => {
    setLoading(true);
    const result = await drawService.getDrawStats();
    if (result.success) {
      setDrawStats(result.data.stats);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Submit entry to draw
  const submitEntry = useCallback(async (drawId, numbers) => {
    setLoading(true);
    const result = await drawService.submitEntry(drawId, numbers);
    if (result.success) {
      // Refresh user entries
      await fetchUserEntries();
      return { success: true, data: result.data };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
    setLoading(false);
  }, [fetchUserEntries]);

  // Claim prize
  const claimPrize = useCallback(async (winnerId) => {
    setLoading(true);
    const result = await drawService.claimPrize(winnerId);
    if (result.success) {
      // Refresh winnings
      await fetchUserWinnings();
      return { success: true, data: result.data };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
    setLoading(false);
  }, [fetchUserWinnings]);

  // Generate random numbers
  const generateRandomNumbers = useCallback(async () => {
    const result = await drawService.generateRandomNumbers();
    if (result.success) {
      return result.data.numbers;
    } else {
      setError(result.error);
      return null;
    }
  }, []);

  // Check if user has entered a specific draw
  const hasEnteredDraw = useCallback((drawId) => {
    return userEntries.some(entry => entry.draw_id === drawId);
  }, [userEntries]);

  // Get user's entry for a specific draw
  const getUserEntryForDraw = useCallback((drawId) => {
    return userEntries.find(entry => entry.draw_id === drawId);
  }, [userEntries]);

  // Initial load
  useEffect(() => {
    fetchActiveDraw();
    fetchLatestDraw();
    fetchUserEntries();
    fetchUserWinnings();
    fetchDrawStats();
  }, []);

  return {
    activeDraw,
    latestDraw,
    userEntries,
    userWinnings,
    winningsStats,
    draws,
    drawStats,
    loading,
    error,
    fetchActiveDraw,
    fetchLatestDraw,
    fetchUserEntries,
    fetchUserWinnings,
    fetchDraws,
    fetchDrawStats,
    submitEntry,
    claimPrize,
    generateRandomNumbers,
    hasEnteredDraw,
    getUserEntryForDraw
  };
};
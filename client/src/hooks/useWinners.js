import { useState, useEffect, useCallback } from 'react';
import winnersService from '../services/winners.service';

export const useWinners = () => {
  const [winnings, setWinnings] = useState([]);
  const [winningsStats, setWinningsStats] = useState({
    totalWon: 0,
    claimedWon: 0,
    pendingWon: 0,
    totalWins: 0,
    claimedWins: 0,
    pendingWins: 0,
    highestPrize: 0
  });
  const [topWinners, setTopWinners] = useState([]);
  const [winnerStats, setWinnerStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's winnings
  const fetchUserWinnings = useCallback(async (status = null) => {
    setLoading(true);
    const result = await winnersService.getUserWinnings(status);
    if (result.success) {
      setWinnings(result.data.winnings);
      setWinningsStats(result.data.stats);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Claim a prize
  const claimPrize = useCallback(async (winnerId) => {
    setLoading(true);
    const result = await winnersService.claimPrize(winnerId);
    if (result.success) {
      // Refresh winnings after claiming
      await fetchUserWinnings();
      return { success: true, data: result.data };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
    setLoading(false);
  }, [fetchUserWinnings]);

  // Fetch top winners
  const fetchTopWinners = useCallback(async (limit = 10) => {
    setLoading(true);
    const result = await winnersService.getTopWinners(limit);
    if (result.success) {
      setTopWinners(result.data.topWinners);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Fetch winner statistics
  const fetchWinnerStats = useCallback(async () => {
    setLoading(true);
    const result = await winnersService.getWinnerStats();
    if (result.success) {
      setWinnerStats(result.data.stats);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  // Get winners for a specific draw
  const getDrawWinners = useCallback(async (drawId) => {
    setLoading(true);
    const result = await winnersService.getDrawWinners(drawId);
    setLoading(false);
    return result;
  }, []);

  // Get prize distribution
  const getPrizeDistribution = useCallback(async (drawId) => {
    const result = await winnersService.getPrizeDistribution(drawId);
    return result;
  }, []);

  // Bulk claim prizes
  const bulkClaimPrizes = useCallback(async (winnerIds) => {
    setLoading(true);
    const result = await winnersService.bulkClaimPrizes(winnerIds);
    if (result.success) {
      await fetchUserWinnings();
    } else {
      setError(result.error);
    }
    setLoading(false);
    return result;
  }, [fetchUserWinnings]);

  // Initial load
  useEffect(() => {
    fetchUserWinnings();
    fetchTopWinners();
    fetchWinnerStats();
  }, []);

  return {
    winnings,
    winningsStats,
    topWinners,
    winnerStats,
    loading,
    error,
    fetchUserWinnings,
    claimPrize,
    fetchTopWinners,
    fetchWinnerStats,
    getDrawWinners,
    getPrizeDistribution,
    bulkClaimPrizes,
    hasWinnings: winnings.length > 0,
    hasUnclaimed: winningsStats.pendingWins > 0
  };
};
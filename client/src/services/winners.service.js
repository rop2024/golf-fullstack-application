import api from './api';

const winnersService = {
  // Get winners for a specific draw
  getDrawWinners: async (drawId) => {
    try {
      const response = await api.get(`/winners/draw/${drawId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch winners' 
      };
    }
  },
  
  // Get current user's winnings
  getUserWinnings: async (status = null) => {
    try {
      const params = status ? { status } : {};
      const response = await api.get('/winners/my-winnings', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch winnings' 
      };
    }
  },
  
  // Claim a prize
  claimPrize: async (winnerId) => {
    try {
      const response = await api.post(`/winners/${winnerId}/claim`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to claim prize' 
      };
    }
  },
  
  // Get prize distribution for a draw
  getPrizeDistribution: async (drawId) => {
    try {
      const response = await api.get(`/winners/draw/${drawId}/distribution`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch distribution' 
      };
    }
  },
  
  // Get top winners overall
  getTopWinners: async (limit = 10) => {
    try {
      const response = await api.get(`/winners/top?limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch top winners' 
      };
    }
  },
  
  // Get winner statistics
  getWinnerStats: async () => {
    try {
      const response = await api.get('/winners/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch stats' 
      };
    }
  },
  
  // Get winners by match count
  getWinnersByMatchCount: async (drawId = null, matchCount = null) => {
    try {
      const params = {};
      if (drawId) params.drawId = drawId;
      if (matchCount) params.matchCount = matchCount;
      
      const response = await api.get('/winners/by-match', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch winners' 
      };
    }
  },
  
  // Bulk claim prizes
  bulkClaimPrizes: async (winnerIds) => {
    try {
      const response = await api.post('/winners/bulk-claim', { winnerIds });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to claim prizes' 
      };
    }
  }
};

export default winnersService;
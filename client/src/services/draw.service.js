import api from './api';

const drawService = {
  // Get all draws
  getDraws: async (status = null, limit = 10) => {
    try {
      const params = {};
      if (status) params.status = status;
      if (limit) params.limit = limit;
      
      const response = await api.get('/draw', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch draws' 
      };
    }
  },
  
  // Get draw by ID
  getDrawById: async (drawId) => {
    try {
      const response = await api.get(`/draw/${drawId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch draw' 
      };
    }
  },
  
  // Get latest draw
  getLatestDraw: async () => {
    try {
      const response = await api.get('/draw/latest');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch latest draw' 
      };
    }
  },
  
  // Get active draw
  getActiveDraw: async () => {
    try {
      const response = await api.get('/draw/active');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch active draw' 
      };
    }
  },
  
  // Submit entry to draw
  submitEntry: async (drawId, numbers) => {
    try {
      const response = await api.post(`/draw/${drawId}/entry`, { numbers });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to submit entry' 
      };
    }
  },
  
  // Get user's draw entries
  getUserEntries: async (limit = 10) => {
    try {
      const response = await api.get('/draw/my/entries', { params: { limit } });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch entries' 
      };
    }
  },
  
  // Get user's winnings
  getUserWinnings: async () => {
    try {
      const response = await api.get('/draw/my/winnings');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch winnings' 
      };
    }
  },
  
  // Claim prize
  claimPrize: async (winnerId) => {
    try {
      const response = await api.post(`/draw/winners/${winnerId}/claim`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to claim prize' 
      };
    }
  },
  
  // Get draw winners
  getDrawWinners: async (drawId) => {
    try {
      const response = await api.get(`/draw/${drawId}/winners`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch winners' 
      };
    }
  },
  
  // Get draw statistics
  getDrawStats: async () => {
    try {
      const response = await api.get('/draw/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch stats' 
      };
    }
  },
  
  // Generate random numbers
  generateRandomNumbers: async () => {
    try {
      const response = await api.get('/draw/random-numbers');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to generate numbers' 
      };
    }
  },
  
  // Admin: Create new draw
  createDraw: async (prizePool = 1000) => {
    try {
      const response = await api.post('/draws/create', { prizePool });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create draw' 
      };
    }
  },
  
  // Admin: Execute draw
  executeDraw: async (drawId) => {
    try {
      const response = await api.post(`/draws/${drawId}/execute`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to execute draw' 
      };
    }
  }
};

export default drawService;
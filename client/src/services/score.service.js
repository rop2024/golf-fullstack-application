import api from './api';

const scoreService = {
  // Add a new score
  addScore: async (value) => {
    try {
      const response = await api.post('/scores/add', { value });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add score' 
      };
    }
  },
  
  // Get user's scores
  getMyScores: async (limit = 5) => {
    try {
      const response = await api.get(`/scores/me?limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch scores' 
      };
    }
  },
  
  // Delete a score
  deleteScore: async (scoreId) => {
    try {
      const response = await api.delete(`/scores/${scoreId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete score' 
      };
    }
  },
  
  // Get score statistics
  getStats: async () => {
    try {
      const response = await api.get('/scores/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch stats' 
      };
    }
  },
  
  // Bulk add scores (for testing)
  bulkAddScores: async (scores) => {
    try {
      const response = await api.post('/scores/bulk', { scores });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add scores' 
      };
    }
  }
};

export default scoreService;
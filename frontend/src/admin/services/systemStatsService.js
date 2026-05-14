import api from './api.js';

const systemStatsService = {
  getStats: async () => {
    const response = await api.get('/system-stats');
    return response;
  }
};

export default systemStatsService;

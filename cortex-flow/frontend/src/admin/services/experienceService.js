import api from './api.js';

export const experienceService = {
  // Get all experiences
  getAll: async () => {
    const response = await api.get('/experiences');
    return response.data;
  },

  // Get single experience
  getById: async (id) => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  },

  // Create new experience
  create: async (data) => {
    const response = await api.post('/experiences', data);
    return response.data;
  },

  // Update experience
  update: async (id, data) => {
    const response = await api.put(`/experiences/${id}`, data);
    return response.data;
  },

  // Delete experience
  delete: async (id) => {
    const response = await api.delete(`/experiences/${id}`);
    return response.data;
  },
};

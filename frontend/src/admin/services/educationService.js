import api from './api.js';

export const educationService = {
  // Get all education entries
  getAll: async () => {
    const response = await api.get('/education');
    return response.data;
  },

  // Get single education entry
  getById: async (id) => {
    const response = await api.get(`/education/${id}`);
    return response.data;
  },

  // Create new education entry
  create: async (data) => {
    const response = await api.post('/education', data);
    return response.data;
  },

  // Update education entry
  update: async (id, data) => {
    const response = await api.put(`/education/${id}`, data);
    return response.data;
  },

  // Delete education entry
  delete: async (id) => {
    const response = await api.delete(`/education/${id}`);
    return response.data;
  },
};

export default educationService;

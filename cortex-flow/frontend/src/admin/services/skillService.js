import api from './api.js';

export const skillService = {
  // Get all skills
  getAll: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  // Get skills by category
  getByCategory: async (category) => {
    const response = await api.get(`/skills/category/${category}`);
    return response.data;
  },

  // Get single skill
  getById: async (id) => {
    const response = await api.get(`/skills/${id}`);
    return response.data;
  },

  // Create skill
  create: async (skillData) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },

  // Update skill
  update: async (id, skillData) => {
    const response = await api.put(`/skills/${id}`, skillData);
    return response.data;
  },

  // Delete skill
  delete: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
};

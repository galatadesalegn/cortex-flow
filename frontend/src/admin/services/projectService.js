import api from './api.js';

export const projectService = {
  // Get all projects
  getAll: async (params = {}) => {
    const response = await api.get('/projects', {
      params: { ...params, _t: Date.now() } // Cache-busting timestamp
    });
    return response.data;
  },

  // Get single project
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create project
  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update project
  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

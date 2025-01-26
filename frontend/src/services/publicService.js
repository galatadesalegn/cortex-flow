import api from './api.js';

export const publicService = {
  // Projects - Public
  getProjects: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/projects?${queryString}` : '/projects';
    const response = await api.get(url);
    return response.data;
  },

  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Certificates - Public
  getCertificates: async () => {
    const response = await api.get('/certificates');
    return response.data;
  },

  // Skills - Public
  getSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  // Experiences - Public
  getExperiences: async () => {
    const response = await api.get('/experiences');
    return response.data;
  },

  // Services - Public
  getServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  // Contact Form - Public
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Profile - Public
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Testimonials - Public
  getTestimonials: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },
};

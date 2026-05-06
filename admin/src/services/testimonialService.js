import api from './api.js';

export const testimonialService = {
  // Get all testimonials (admin)
  getAll: async () => {
    const response = await api.get('/testimonials/admin', {
      params: { _t: Date.now() } // Cache-busting timestamp
    });
    return response.data;
  },

  // Get single testimonial
  getById: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  // Create testimonial
  create: async (testimonialData) => {
    const response = await api.post('/testimonials', testimonialData);
    return response.data;
  },

  // Update testimonial
  update: async (id, testimonialData) => {
    const response = await api.put(`/testimonials/${id}`, testimonialData);
    return response.data;
  },

  // Delete testimonial
  delete: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },

  // Toggle testimonial active status
  toggle: async (id) => {
    const response = await api.patch(`/testimonials/${id}/toggle`);
    return response.data;
  },
};

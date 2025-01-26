import api from './api.js';

export const certificateService = {
  // Get all certificates
  getAll: async () => {
    const response = await api.get('/certificates');
    return response.data;
  },

  // Get single certificate
  getById: async (id) => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
  },

  // Create certificate
  create: async (certificateData) => {
    const response = await api.post('/certificates', certificateData);
    return response.data;
  },

  // Update certificate
  update: async (id, certificateData) => {
    const response = await api.put(`/certificates/${id}`, certificateData);
    return response.data;
  },

  // Delete certificate
  delete: async (id) => {
    const response = await api.delete(`/certificates/${id}`);
    return response.data;
  },

  // Reorder certificates
  reorder: async (orders) => {
    const response = await api.post('/certificates/reorder', { orders });
    return response.data;
  },
};

import api from './api';

const serviceService = {
  // Get all services
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  // Get single service
  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Create service
  create: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  // Update service
  update: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  }
};

export default serviceService;

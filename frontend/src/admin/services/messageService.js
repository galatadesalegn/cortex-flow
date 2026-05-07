import api from './api.js';

export const messageService = {
  // Get all messages (admin only)
  getAll: async () => {
    const response = await api.get('/messages');
    return response.data;
  },

  // Get single message (admin only)
  getById: async (id) => {
    const response = await api.get(`/messages/${id}`);
    return response.data;
  },

  // Create message (public contact form)
  create: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Delete message (admin only)
  delete: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },

  // Reply to message (admin only)
  reply: async (id, replyData) => {
    const response = await api.post(`/messages/${id}/reply`, replyData);
    return response.data;
  },

  // Update message (admin only)
  update: async (id, updateData) => {
    const response = await api.put(`/messages/${id}`, updateData);
    return response.data;
  },
};

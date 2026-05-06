import api from './api';

const settingService = {
  // Admin Management
  getAllAdmins: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getAdmin: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createAdmin: async (adminData) => {
    const response = await api.post('/users', adminData);
    return response.data;
  },

  updateAdmin: async (id, adminData) => {
    const response = await api.put(`/users/${id}`, adminData);
    return response.data;
  },

  deleteAdmin: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  updatePermissions: async (id, permissions) => {
    const response = await api.put(`/users/${id}/permissions`, { permissions });
    return response.data;
  },

  // Security - Change Password
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  }
};

export default settingService;

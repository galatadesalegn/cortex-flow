import api from './api.js';

export const profileService = {
  // Get profile (public)
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update profile (admin only)
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
};

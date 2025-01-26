import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await profileService.updateProfile(data);
      setProfile(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, setProfile, loading, error, refetch: fetchProfile, updateProfile };
};

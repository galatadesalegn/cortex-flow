import { useState, useCallback } from 'react';
import { uploadService } from '../services';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadImage = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await uploadService.uploadImage(file);
      setProgress(100);
      return { 
        success: true, 
        url: response.data.url, 
        publicId: response.data.publicId 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Upload failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(async (files) => {
    setUploading(true);
    setError(null);
    
    try {
      const uploadPromises = files.map(file => uploadService.uploadImage(file));
      const responses = await Promise.all(uploadPromises);
      
      return {
        success: true,
        urls: responses.map(r => r.data.url),
        publicIds: responses.map(r => r.data.publicId),
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Upload failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadImage,
    uploadMultiple,
    uploading,
    error,
    progress,
    clearError,
  };
};

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Debug: Log API URL
console.log('🔍 API_URL:', API_URL);
console.log('🔍 VITE_API_URL env var:', import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
  timeout: 120000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;

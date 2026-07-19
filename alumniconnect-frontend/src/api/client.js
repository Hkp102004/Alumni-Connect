import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://lumnus-backend.onrender.com/api',
  timeout: 60000, // 60s timeout for Render cold-starts
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ac_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      error.message = 'Server is waking up or network error. Please wait a moment and try again.';
    }
    return Promise.reject(error);
  }
);

export default api;

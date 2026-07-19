import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

const primaryBaseURL = isLocalhost
  ? 'http://localhost:5050/api'
  : (import.meta.env.VITE_API_URL || 'https://lumnus-backend.onrender.com/api');

const fallbackBaseURL = 'https://lumnus-backend.onrender.com/api';

const api = axios.create({
  baseURL: primaryBaseURL,
  timeout: 20000,
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
  async (error) => {
    const originalRequest = error.config;

    // If local backend (http://localhost:5050/api) is not reachable, fallback to live production Render backend
    if (
      (error.code === 'ERR_NETWORK' || !error.response) &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.baseURL !== fallbackBaseURL
    ) {
      originalRequest._retry = true;
      originalRequest.baseURL = fallbackBaseURL;
      return api(originalRequest);
    }

    if (error.code === 'ERR_NETWORK' || !error.response) {
      error.message = 'Server is waking up or network error. Please wait a moment and try again.';
    }
    return Promise.reject(error);
  }
);

export default api;

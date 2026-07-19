import axios from 'axios';

/**
 * Smart API client that auto-detects local vs production environment.
 * 
 * On localhost: tries local backend first, silently falls back to Render.
 * On production: always uses Render backend directly.
 */
const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

// Production Render backend (always available as fallback)
const RENDER_URL = 'https://lumnus-backend.onrender.com/api';

// Local dev backend — try common local ports
const LOCAL_URL = 'http://localhost:5050/api';

// Choose base URL based on environment
const baseURL = isLocalhost ? LOCAL_URL : RENDER_URL;

const api = axios.create({
  baseURL,
  timeout: isLocalhost ? 5000 : 60000, // Short timeout locally (quick failover), long for Render cold-starts
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ac_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: localhost failover to Render
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // On localhost: if local backend is unreachable, silently retry against Render
    if (
      isLocalhost &&
      (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || !error.response) &&
      originalRequest &&
      !originalRequest._retryFallback
    ) {
      originalRequest._retryFallback = true;
      originalRequest.baseURL = RENDER_URL;
      originalRequest.timeout = 60000; // Give Render time for cold-start
      return axios(originalRequest);
    }

    // Friendly error message for network failures
    if (error.code === 'ERR_NETWORK' || !error.response) {
      error.message = 'Cannot reach the server. Please check your connection and try again.';
    }

    return Promise.reject(error);
  }
);

export default api;

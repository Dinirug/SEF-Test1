import axios from 'axios';

// Base API Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('seff_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 Unauthorized gracefully without forcing hard page reloads
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on auth failure if not on login/register endpoints
      const isAuthPath = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthPath) {
        localStorage.removeItem('seff_token');
        localStorage.removeItem('seff_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

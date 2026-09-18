import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('socialsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle unauthenticated or server errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Automatic logout on 401 unauthenticated error if token existed
      if (error.response.status === 401) {
        const token = localStorage.getItem('socialsphere_token');
        if (token) {
          localStorage.removeItem('socialsphere_token');
          localStorage.removeItem('socialsphere_user');
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
      }
      return Promise.reject(error.response.data || { message: error.message });
    }
    return Promise.reject({ message: 'Network error or server unreachable. Please try again.' });
  }
);

export default api;

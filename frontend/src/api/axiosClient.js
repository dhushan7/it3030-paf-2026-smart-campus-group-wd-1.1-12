import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: 'http://localhost:8087/api/v1',
  withCredentials: true, // This tells the browser to send credentials (cookies, auth headers) with CORS requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Session expired or unauthorized. Redirecting to login...");

      // Clear stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Prevent redirect loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

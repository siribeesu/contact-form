// src/services/api.js
// Axios instance with base URL and auth interceptor

import axios from 'axios';

// Base API URL from environment variable, or fallback based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor: attach JWT token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shecan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored credentials if token is invalid/expired
      localStorage.removeItem('shecan_token');
      localStorage.removeItem('shecan_admin');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

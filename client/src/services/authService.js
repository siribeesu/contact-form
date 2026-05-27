// src/services/authService.js
// Auth-related API calls

import api from './api';

/**
 * Login admin user
 * @param {{ email: string, password: string }} credentials
 */
export const loginAdmin = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Get current admin profile (protected)
 */
export const getAdminProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

/**
 * Logout admin (protected)
 */
export const logoutAdmin = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

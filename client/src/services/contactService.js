// src/services/contactService.js
// Contact form API calls

import api from './api';

/**
 * Submit a contact form message (public)
 * @param {{ name, email, phone, subject, message }} formData
 */
export const submitContact = async (formData) => {
  const response = await api.post('/contact', formData);
  return response.data;
};

/**
 * Get all contact messages (admin only)
 * @param {{ page, limit, search, sort }} params
 */
export const getContacts = async (params = {}) => {
  const response = await api.get('/contact', { params });
  return response.data;
};

/**
 * Delete a contact message by ID (admin only)
 * @param {string} id
 */
export const deleteContact = async (id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};

/**
 * Mark a message as read (admin only)
 * @param {string} id
 */
export const markAsRead = async (id) => {
  const response = await api.patch(`/contact/${id}/read`);
  return response.data;
};

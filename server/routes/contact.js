// routes/contact.js
// Contact form routes

const express = require('express');
const router = express.Router();

const {
  submitContact,
  getContacts,
  deleteContact,
  markAsRead,
  contactValidation,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { contactLimiter } = require('../middleware/rateLimiter');

// POST /api/contact — public route with rate limiting + validation
router.post('/', contactLimiter, contactValidation, validate, submitContact);

// GET /api/contact — protected: admin only
router.get('/', protect, getContacts);

// DELETE /api/contact/:id — protected: admin only
router.delete('/:id', protect, deleteContact);

// PATCH /api/contact/:id/read — protected: admin only
router.patch('/:id/read', protect, markAsRead);

module.exports = router;

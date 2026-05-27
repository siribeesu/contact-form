// routes/auth.js
// Authentication routes

const express = require('express');
const router = express.Router();

const {
  loginAdmin,
  loginValidation,
  getAdminProfile,
  logoutAdmin,
  seedAdminEndpoint,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

// GET /api/auth/seed — temporary route to bypass local network blocking
router.get('/seed', seedAdminEndpoint);

// POST /api/auth/login — apply auth rate limiter + validation
router.post('/login', authLimiter, loginValidation, validate, loginAdmin);

// GET /api/auth/profile — protected: only logged-in admins
router.get('/profile', protect, getAdminProfile);

// POST /api/auth/logout — protected
router.post('/logout', protect, logoutAdmin);

module.exports = router;

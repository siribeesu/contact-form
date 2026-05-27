// controllers/authController.js
// Handles admin authentication logic

const AdminUser = require('../models/AdminUser');
const generateToken = require('../utils/generateToken');
const { body } = require('express-validator');

// ─── Validation rules for login ──────────────────────────────────────────────
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
/**
 * Authenticate admin and return JWT token
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Sanitize inputs (fixes accidental copy-paste spaces)
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanPassword = password ? password.trim() : '';

    // Find admin by email — select password explicitly since it's hidden by default
    const admin = await AdminUser.findOne({ email: cleanEmail }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare provided password with stored hash
    const isMatch = await admin.matchPassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// ─── GET /api/auth/profile ────────────────────────────────────────────────────
/**
 * Get current admin's profile (protected route)
 */
const getAdminProfile = async (req, res) => {
  try {
    const admin = await AdminUser.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
/**
 * Logout — client should discard the token
 * JWT is stateless so we just send a success message
 */
const logoutAdmin = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// ─── GET /api/auth/seed ───────────────────────────────────────────────────────
/**
 * Temporary route to seed admin from the browser (bypassing local network issues)
 */
const seedAdminEndpoint = async (req, res) => {
  try {
    let admin = await AdminUser.findOne({ email: 'shecanfoundation@gmail.com' });
    
    if (admin) {
      // Force update the password in case it was created manually without hashing
      admin.password = 'shecanfoundation';
      await admin.save();
      return res.status(200).json({ success: true, message: '✅ Admin user already existed, but password has been successfully reset to shecanfoundation! You can log in now.' });
    }

    await AdminUser.create({
      username: 'She Can Admin',
      email: 'shecanfoundation@gmail.com',
      password: 'shecanfoundation',
      role: 'superadmin',
    });

    res.status(200).json({ success: true, message: '✅ Admin user created successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { loginAdmin, loginValidation, getAdminProfile, logoutAdmin, seedAdminEndpoint };

// middleware/authMiddleware.js
// Verifies JWT token and protects private routes

const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

/**
 * Middleware to protect routes — only authenticated admins can access
 * Reads token from Authorization header (Bearer token)
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch admin user from DB (excluding password)
      req.admin = await AdminUser.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({ message: 'Admin not found' });
      }

      next(); // Continue to the next middleware/controller
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

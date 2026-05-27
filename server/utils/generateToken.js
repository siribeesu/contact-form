// utils/generateToken.js
// Utility to generate JWT tokens for admin authentication

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token
 * @param {string} id - Admin user's MongoDB _id
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

module.exports = generateToken;

// middleware/validate.js
// Wrapper for express-validator that checks for validation errors

const { validationResult } = require('express-validator');

/**
 * Middleware that reads validation results from express-validator
 * If there are errors, returns 400 with details; otherwise proceeds
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = validate;

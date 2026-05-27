// middleware/errorHandler.js
// Global error handling middleware for Express

/**
 * Centralized error handler
 * Catches all errors passed via next(err) and returns a consistent JSON response
 */
const errorHandler = (err, req, res, next) => {
  // Use the status code from the error if set, otherwise default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log error in development mode for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only send stack trace in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Middleware to handle 404 not found routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };

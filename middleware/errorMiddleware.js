/**
 * Error handling middleware
 */
const { logError } = require('../utils/errorHandler');

/**
 * Middleware for handling 404 (Not Found) errors
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  
  // Log the 404 error
  logError(`Resource not found: ${req.originalUrl}`, req.params.id || null, error);
  
  res.status(404);
  next(error);
};

/**
 * Middleware for handling all errors
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    errorDetails: {
      path: req.path,
      method: req.method,
      params: req.params,
      resourceId: req.params.id || null
    }
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};

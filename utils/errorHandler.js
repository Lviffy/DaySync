/**
 * Utility for handling errors and logging
 */

// Configuration for logging
const logConfig = {
  enableConsoleLogging: true,
  enableFileLogging: false,
  logFilePath: './logs/error.log'
};

/**
 * Log an error with context information
 * @param {string} message - Error message
 * @param {string} resourceId - ID of the resource being accessed
 * @param {Error} error - Original error object
 */
const logError = (message, resourceId, error) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message,
    resourceId,
    errorDetails: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode || error.status
    } : null
  };
  
  if (logConfig.enableConsoleLogging) {
    console.error(`[${timestamp}] ERROR: ${message}`, logEntry);
  }
  
  // Add file logging implementation if needed
  return logEntry;
};

/**
 * Check if a resource exists before attempting to access it
 * @param {string} resourceId - ID of the resource to check
 * @param {Function} lookupFunction - Function to check if resource exists
 * @returns {Promise<boolean>} - Whether the resource exists
 */
const validateResourceExists = async (resourceId, lookupFunction) => {
  try {
    const exists = await lookupFunction(resourceId);
    if (!exists) {
      logError(`Resource not found`, resourceId, { 
        name: 'NotFoundError',
        statusCode: 404,
        message: `Resource with ID ${resourceId} was not found`
      });
    }
    return exists;
  } catch (error) {
    logError(`Error checking resource`, resourceId, error);
    throw error;
  }
};

/**
 * Handle API errors with appropriate responses
 * @param {Error} error - The error that occurred
 * @param {Object} res - Express response object
 */
const handleApiError = (error, res) => {
  const statusCode = error.statusCode || error.status || 500;
  const errorMessage = error.message || 'An unexpected error occurred';
  
  logError(errorMessage, null, error);
  
  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    errorCode: error.code || 'UNKNOWN_ERROR'
  });
};

module.exports = {
  logError,
  validateResourceExists,
  handleApiError
};

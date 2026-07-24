/**
 * Global Response Formatter Utility
 */

/**
 * Send standard success API response
 * @param {Object} res - Express response object
 * @param {any} data - Data to send back
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Optional status message
 * @param {Object} pagination - Optional pagination metadata
 */
const sendSuccess = (res, data, statusCode = 200, message = 'Operation successful', pagination = null) => {
  const response = {
    success: true,
    message,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  // Handle arrays & count fields
  if (Array.isArray(data)) {
    response.count = data.length;
    response.data = data;
  } else {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send standard error API response
 * @param {Object} res - Express response object
 * @param {string} message - Error description message
 * @param {number} statusCode - HTTP status code
 * @param {any} errors - Optional detailed validation error array/object
 */
const sendError = (res, message = 'An unexpected error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};

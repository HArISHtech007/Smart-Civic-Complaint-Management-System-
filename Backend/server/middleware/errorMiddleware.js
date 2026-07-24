const { sendError } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

// Middleware for 404 Page Not Found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let errors = null;

  // Log error stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
  }

  // Multer / File Upload Errors
  if (err.name === 'MulterError' || (err.message && err.message.includes('permitted.')) || (err.message && err.message.includes('are allowed!'))) {
    statusCode = 400;
  }

  // Mongoose Bad ObjectId (Cast Error)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Resource not found or invalid ID format';
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered. A record with this ${field} already exists.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
    message = 'Validation failed';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Not authorized, invalid token signature';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token expired';
  }

  // Attach stack trace if in non-production environment
  const errorPayload = process.env.NODE_ENV === 'production' 
    ? null 
    : { stack: err.stack };

  return sendError(res, message, statusCode, errors || errorPayload);
};

module.exports = { notFound, errorHandler };

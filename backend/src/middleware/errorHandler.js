const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error [${req.method} ${req.url}]:`, err.stack || err.message);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return ApiResponse.badRequest(res, 'Validation Error', errors);
  }

  // Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.badRequest(res, `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
  }

  // Mongoose Bad ObjectId CastError
  if (err.name === 'CastError') {
    return ApiResponse.badRequest(res, `Invalid ID format: ${err.value}`);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid authentication token');
  }
  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Authentication token has expired');
  }

  return ApiResponse.error(res, err.message || 'Internal Server Error', err.statusCode || 500);
};

module.exports = errorHandler;

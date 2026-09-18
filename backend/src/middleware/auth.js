const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const ApiResponse = require('../utils/apiResponse');
const User = require('../modules/user/userModel');

/**
 * Protect routes: Validates Bearer JWT token from Authorization header
 */
const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.unauthorized(res, 'Authentication token missing or invalid');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return ApiResponse.unauthorized(res, 'The user belonging to this token no longer exists');
    }

    if (user.isBanned) {
      return ApiResponse.forbidden(res, 'Your account has been suspended by a moderator');
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Session expired or invalid. Please sign in again.');
  }
};

/**
 * Optional Auth: Attaches req.user if a valid token is provided, otherwise continues
 */
const optionalAuth = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id).select('-password');
    req.user = user && !user.isBanned ? user : null;
  } catch (err) {
    req.user = null;
  }
  next();
};

module.exports = { protect, optionalAuth };

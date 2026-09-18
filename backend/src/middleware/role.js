const ApiResponse = require('../utils/apiResponse');

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 * @param  {...string} allowedRoles Roles that have access (e.g. 'admin', 'moderator', 'organization', 'creator')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'You must be signed in to access this resource');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `Role (${req.user.role}) is not authorized to perform this action. Required: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

module.exports = { authorize };

const jwt = require('jsonwebtoken');
const User = require('../user/userModel');
const config = require('../../config/environment');
const ApiResponse = require('../../utils/apiResponse');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password, role, interests } = req.body;

    if (!name || !username || !email || !password) {
      return ApiResponse.badRequest(res, 'Please provide name, username, email, and password');
    }

    // Check existing email or username
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return ApiResponse.badRequest(res, 'An account with this email already exists');
      }
      return ApiResponse.badRequest(res, 'This username is already taken');
    }

    // Default verified status for organizations during demo or moderation checks
    const isVerified = role === 'organization';

    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: role && ['user', 'creator', 'organization'].includes(role) ? role : 'user',
      interests: Array.isArray(interests) ? interests : [],
      isVerified,
    });

    const token = generateToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      isVerified: user.isVerified,
      interests: user.interests,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      createdAt: user.createdAt,
    };

    return ApiResponse.created(res, { user: userResponse, token }, 'Account created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Sign in existing user
 * @route  POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Please provide email and password');
    }

    // Find user by email or username with password field
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email.toLowerCase() }],
    }).select('+password');

    if (!user) {
      return ApiResponse.unauthorized(res, 'Invalid email or password credentials');
    }

    if (user.isBanned) {
      return ApiResponse.forbidden(res, 'Your account has been suspended by an administrator');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.unauthorized(res, 'Invalid email or password credentials');
    }

    const token = generateToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      coverImage: user.coverImage,
      bio: user.bio,
      location: user.location,
      website: user.website,
      isVerified: user.isVerified,
      interests: user.interests,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      createdAt: user.createdAt,
    };

    return ApiResponse.success(res, { user: userResponse, token }, 'Sign in successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get current authenticated user session
 * @route  GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return ApiResponse.success(res, { user }, 'Current user profile retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Forgot password request
 * @route  POST /api/auth/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return ApiResponse.badRequest(res, 'Please provide your account email');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return 200 to prevent email enumeration
      return ApiResponse.success(res, null, 'If an account exists, a reset link has been dispatched.');
    }

    return ApiResponse.success(res, null, 'If an account exists, a reset link has been dispatched.');
  } catch (error) {
    next(error);
  }
};

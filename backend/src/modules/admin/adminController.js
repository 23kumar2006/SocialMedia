const User = require('../user/userModel');
const Post = require('../post/postModel');
const Category = require('../category/categoryModel');
const Comment = require('../comment/commentModel');
const Report = require('../moderation/reportModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Get comprehensive platform analytics
 * @route  GET /api/admin/stats
 * @access Admin / Moderator
 */
exports.getSystemAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalComments,
      pendingReports,
      postsByCategory,
      usersByRole,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      Post.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
    ]);

    return ApiResponse.success(
      res,
      {
        overview: {
          totalUsers,
          totalPosts,
          totalComments,
          pendingReports,
        },
        postsByCategory,
        usersByRole,
      },
      'Platform analytics retrieved'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all users with search & role filters
 * @route  GET /api/admin/users
 * @access Admin
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      User.countDocuments(query),
    ]);

    return ApiResponse.success(res, { users, total }, 'User list retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update user role or ban status
 * @route  PATCH /api/admin/users/:id
 * @access Admin
 */
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, isBanned, isVerified } = req.body;
    const updates = {};

    if (role) updates.role = role;
    if (typeof isBanned === 'boolean') updates.isBanned = isBanned;
    if (typeof isVerified === 'boolean') updates.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    return ApiResponse.success(res, { user }, 'User account status updated');
  } catch (error) {
    next(error);
  }
};

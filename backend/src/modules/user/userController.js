const User = require('./userModel');
const Follow = require('../follow/followModel');
const Post = require('../post/postModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Get user profile by username
 * @route  GET /api/users/profile/:username
 * @access Public
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() }).select('-password');

    if (!user) {
      return ApiResponse.notFound(res, `User @${username} not found`);
    }

    let isFollowing = false;
    if (req.user) {
      const followDoc = await Follow.findOne({
        follower: req.user._id,
        targetType: 'user',
        followingUser: user._id,
      });
      isFollowing = !!followDoc;
    }

    return ApiResponse.success(
      res,
      { user: { ...user.toObject(), isFollowing } },
      'User profile fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update current user profile
 * @route  PUT /api/users/profile
 * @access Private
 */
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, bio, location, website, avatar, coverImage, interests } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name.trim();
    if (bio !== undefined) updateFields.bio = bio.trim();
    if (location !== undefined) updateFields.location = location.trim();
    if (website !== undefined) updateFields.website = website.trim();
    if (avatar) updateFields.avatar = avatar;
    if (coverImage) updateFields.coverImage = coverImage;
    if (Array.isArray(interests)) updateFields.interests = interests;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    }).select('-password');

    return ApiResponse.success(res, { user: updatedUser }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get recommended creators and organizations
 * @route  GET /api/users/suggested
 * @access Public
 */
exports.getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user._id : null;
    const query = {
      isBanned: false,
      role: { $in: ['creator', 'organization', 'user'] },
    };

    if (currentUserId) {
      query._id = { $ne: currentUserId };
    }

    const users = await User.find(query)
      .select('name username role avatar bio isVerified followersCount')
      .sort({ followersCount: -1, isVerified: -1 })
      .limit(6)
      .lean();

    return ApiResponse.success(res, { users }, 'Suggested profiles fetched');
  } catch (error) {
    next(error);
  }
};

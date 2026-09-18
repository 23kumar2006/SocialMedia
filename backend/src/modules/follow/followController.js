const Follow = require('./followModel');
const User = require('../user/userModel');
const Notification = require('../notification/notificationModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Follow or unfollow another user
 * @route  POST /api/users/:id/follow
 * @access Private
 */
exports.toggleFollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return ApiResponse.badRequest(res, 'You cannot follow yourself');
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return ApiResponse.notFound(res, 'User to follow not found');
    }

    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      targetType: 'user',
      followingUser: targetUserId,
    });

    let isFollowing = false;

    if (existingFollow) {
      await Follow.findByIdAndDelete(existingFollow._id);
      await Promise.all([
        User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } }),
        User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } }),
      ]);
      isFollowing = false;
    } else {
      await Follow.create({
        follower: currentUserId,
        targetType: 'user',
        followingUser: targetUserId,
      });
      await Promise.all([
        User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: 1 } }),
        User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } }),
      ]);
      isFollowing = true;

      // Create notification
      const notification = await Notification.create({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow',
        message: `${req.user.name} started following you.`,
      });

      // Emit real-time notification
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${targetUserId}`).emit('notification:new', notification);
      }
    }

    return ApiResponse.success(
      res,
      { isFollowing, targetUserId },
      isFollowing ? `Now following @${targetUser.username}` : `Unfollowed @${targetUser.username}`
    );
  } catch (error) {
    next(error);
  }
};

const Like = require('./likeModel');
const Post = require('../post/postModel');
const User = require('../user/userModel');
const Notification = require('../notification/notificationModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Toggle like on a post
 * @route  POST /api/posts/:id/like
 * @access Private
 */
exports.toggleLikePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return ApiResponse.notFound(res, 'Post not found');
    }

    const existingLike = await Like.findOne({
      user: userId,
      targetType: 'post',
      targetId: postId,
    });

    let isLiked = false;

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      isLiked = false;
    } else {
      await Like.create({
        user: userId,
        targetType: 'post',
        targetId: postId,
      });
      await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
      isLiked = true;

      // Notification to post author if not self
      if (post.author.toString() !== userId.toString()) {
        const notification = await Notification.create({
          recipient: post.author,
          sender: userId,
          type: 'like',
          post: postId,
          message: `${req.user.name} liked your post in ${post.category}.`,
        });

        const io = req.app.get('io');
        if (io) {
          io.to(`user_${post.author}`).emit('notification:new', notification);
        }
      }
    }

    const updatedPost = await Post.findById(postId).select('likesCount');

    return ApiResponse.success(
      res,
      { isLiked, likesCount: updatedPost.likesCount },
      isLiked ? 'Post liked' : 'Post unliked'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Toggle save/bookmark on a post
 * @route  POST /api/posts/:id/save
 * @access Private
 */
exports.toggleSavePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const isSaved = (user.savedPosts || []).some((id) => id.toString() === postId);

    if (isSaved) {
      await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
      await Post.findByIdAndUpdate(postId, { $inc: { savesCount: -1 } });
      return ApiResponse.success(res, { isSaved: false }, 'Removed from saved collection');
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: postId } });
      await Post.findByIdAndUpdate(postId, { $inc: { savesCount: 1 } });
      return ApiResponse.success(res, { isSaved: true }, 'Saved to your collection');
    }
  } catch (error) {
    next(error);
  }
};

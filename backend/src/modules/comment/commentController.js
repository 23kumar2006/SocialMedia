const Comment = require('./commentModel');
const Post = require('../post/postModel');
const Notification = require('../notification/notificationModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Get comments for a post with nested replies
 * @route  GET /api/posts/:postId/comments
 * @access Public
 */
exports.getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId, isFlagged: false })
      .populate('author', 'name username role avatar isVerified')
      .sort({ createdAt: 1 })
      .lean();

    // Group replies under top-level parent comments
    const topLevelComments = [];
    const replyMap = {};

    comments.forEach((c) => {
      if (c.parentComment) {
        const parentId = c.parentComment.toString();
        if (!replyMap[parentId]) replyMap[parentId] = [];
        replyMap[parentId].push(c);
      } else {
        topLevelComments.push(c);
      }
    });

    const structuredComments = topLevelComments.map((c) => ({
      ...c,
      replies: replyMap[c._id.toString()] || [],
    }));

    return ApiResponse.success(res, { comments: structuredComments }, 'Comments retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Add comment or reply to post
 * @route  POST /api/posts/:postId/comments
 * @access Private
 */
exports.addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, parentComment } = req.body;

    if (!content || !content.trim()) {
      return ApiResponse.badRequest(res, 'Comment cannot be empty');
    }

    const post = await Post.findById(postId);
    if (!post) {
      return ApiResponse.notFound(res, 'Post not found');
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content: content.trim(),
      parentComment: parentComment || null,
    });

    await comment.populate('author', 'name username role avatar isVerified');
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // Trigger notification for post author (if not self)
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
        comment: comment._id,
        message: `${req.user.name} commented on your post: "${content.slice(0, 50)}..."`,
      });

      const io = req.app.get('io');
      if (io) {
        io.to(`user_${post.author}`).emit('notification:new', notification);
      }
    }

    return ApiResponse.created(res, { comment }, 'Comment posted successfully');
  } catch (error) {
    next(error);
  }
};

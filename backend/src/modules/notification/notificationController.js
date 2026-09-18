const Notification = require('./notificationModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Get current user notifications
 * @route  GET /api/notifications
 * @access Private
 */
exports.getMyNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [notifications, unreadCount, total] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .populate('sender', 'name username role avatar isVerified')
        .populate('post', 'title category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Notification.countDocuments({ recipient: req.user._id, isRead: false }),
      Notification.countDocuments({ recipient: req.user._id }),
    ]);

    return ApiResponse.success(
      res,
      { notifications, unreadCount, total },
      'Notifications fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Mark notifications as read
 * @route  PATCH /api/notifications/read
 * @access Private
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.body;

    if (notificationId) {
      await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: req.user._id },
        { isRead: true }
      );
    } else {
      // Mark all as read
      await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    }

    return ApiResponse.success(res, null, 'Notifications marked as read');
  } catch (error) {
    next(error);
  }
};

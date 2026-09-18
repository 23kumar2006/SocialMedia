const Report = require('./reportModel');
const Post = require('../post/postModel');
const Comment = require('../comment/commentModel');
const User = require('../user/userModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Submit a moderation report
 * @route  POST /api/reports
 * @access Private
 */
exports.createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, reason, details } = req.body;

    if (!targetType || !targetId || !reason) {
      return ApiResponse.badRequest(res, 'Target type, target ID, and reason are required');
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      targetType,
      targetId,
      reason,
      details: details || '',
    });

    return ApiResponse.created(res, { report }, 'Report submitted to moderation queue');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get pending moderation reports
 * @route  GET /api/admin/reports
 * @access Moderator / Admin
 */
exports.getReports = async (req, res, next) => {
  try {
    const { status = 'pending' } = req.query;

    const reports = await Report.find({ status })
      .populate('reportedBy', 'name username')
      .populate('reviewedBy', 'name username')
      .sort({ createdAt: -1 })
      .lean();

    return ApiResponse.success(res, { reports }, 'Moderation reports retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Resolve report (dismiss or take moderation action)
 * @route  PATCH /api/admin/reports/:id
 * @access Moderator / Admin
 */
exports.resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, resolutionNote } = req.body; // 'dismissed' or 'action_taken'

    const report = await Report.findById(id);
    if (!report) {
      return ApiResponse.notFound(res, 'Report not found');
    }

    report.status = action === 'dismissed' ? 'dismissed' : 'action_taken';
    report.reviewedBy = req.user._id;
    report.resolutionNote = resolutionNote || '';
    await report.save();

    // If action taken, remove or flag target content
    if (action === 'action_taken') {
      if (report.targetType === 'post') {
        await Post.findByIdAndUpdate(report.targetId, { isFlagged: true });
      } else if (report.targetType === 'comment') {
        await Comment.findByIdAndUpdate(report.targetId, { isFlagged: true });
      } else if (report.targetType === 'user') {
        await User.findByIdAndUpdate(report.targetId, { isBanned: true });
      }
    }

    return ApiResponse.success(res, { report }, 'Report resolved successfully');
  } catch (error) {
    next(error);
  }
};

const Conversation = require('./conversationModel');
const Message = require('./messageModel');
const User = require('../user/userModel');
const ApiResponse = require('../../utils/apiResponse');

/**
 * @desc   Get or create a direct 1-on-1 conversation
 * @route  POST /api/messages/conversations
 * @access Private
 */
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    const currentUserId = req.user._id;

    if (!recipientId) {
      return ApiResponse.badRequest(res, 'Recipient ID is required');
    }

    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [currentUserId, recipientId] },
    }).populate('participants', 'name username role avatar isVerified');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, recipientId],
        isGroup: false,
      });
      await conversation.populate('participants', 'name username role avatar isVerified');
    }

    return ApiResponse.success(res, { conversation }, 'Conversation ready');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all conversations for current user
 * @route  GET /api/messages/conversations
 * @access Private
 */
exports.getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name username role avatar isVerified')
      .sort({ updatedAt: -1 })
      .lean();

    return ApiResponse.success(res, { conversations }, 'Conversations retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get messages for a conversation
 * @route  GET /api/messages/:conversationId
 * @access Private
 */
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return ApiResponse.forbidden(res, 'You are not a participant in this conversation');
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name username avatar')
      .sort({ createdAt: 1 })
      .lean();

    return ApiResponse.success(res, { messages }, 'Messages retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Send a message in a conversation
 * @route  POST /api/messages/:conversationId
 * @access Private
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { text, media } = req.body;

    if (!text && (!media || media.length === 0)) {
      return ApiResponse.badRequest(res, 'Message text or media is required');
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      return ApiResponse.forbidden(res, 'You are not a participant in this conversation');
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text ? text.trim() : '',
      media: Array.isArray(media) ? media : [],
      readBy: [req.user._id],
    });

    await message.populate('sender', 'name username role avatar isVerified');

    // Update conversation's last message and updatedAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text: message.text || 'Shared an attachment',
        sender: req.user._id,
        createdAt: new Date(),
      },
      updatedAt: new Date(),
    });

    // Real-time broadcast to conversation participants
    const io = req.app.get('io');
    if (io) {
      conversation.participants.forEach((pId) => {
        io.to(`user_${pId.toString()}`).emit('message:new', {
          conversationId,
          message,
        });
      });
    }

    return ApiResponse.created(res, { message }, 'Message sent successfully');
  } catch (error) {
    next(error);
  }
};

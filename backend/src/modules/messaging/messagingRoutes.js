const express = require('express');
const router = express.Router();
const messagingController = require('./messagingController');
const { protect } = require('../../middleware/auth');

router.get('/conversations', protect, messagingController.getMyConversations);
router.post('/conversations', protect, messagingController.getOrCreateConversation);
router.get('/:conversationId', protect, messagingController.getMessages);
router.post('/:conversationId', protect, messagingController.sendMessage);

module.exports = router;

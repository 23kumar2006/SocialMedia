const express = require('express');
const router = express.Router();
const notificationController = require('./notificationController');
const { protect } = require('../../middleware/auth');

router.get('/', protect, notificationController.getMyNotifications);
router.patch('/read', protect, notificationController.markAsRead);

module.exports = router;

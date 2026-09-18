const express = require('express');
const router = express.Router();
const adminController = require('./adminController');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/role');

router.get('/stats', protect, authorize('admin', 'moderator'), adminController.getSystemAnalytics);
router.get('/users', protect, authorize('admin'), adminController.getAllUsers);
router.patch('/users/:id', protect, authorize('admin'), adminController.updateUserStatus);

module.exports = router;

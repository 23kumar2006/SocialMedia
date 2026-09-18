const express = require('express');
const router = express.Router();
const authController = require('./authController');
const { protect } = require('../../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;

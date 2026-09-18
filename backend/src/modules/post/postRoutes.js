const express = require('express');
const router = express.Router();
const postController = require('./postController');
const commentController = require('../comment/commentController');
const interactionController = require('../interaction/interactionController');
const { protect, optionalAuth } = require('../../middleware/auth');

router.get('/', optionalAuth, postController.getPosts);
router.post('/', protect, postController.createPost);
router.get('/:id', optionalAuth, postController.getPostById);
router.delete('/:id', protect, postController.deletePost);

// Comments Sub-Routes
router.get('/:postId/comments', optionalAuth, commentController.getCommentsByPost);
router.post('/:postId/comments', protect, commentController.addComment);

// Interactions Sub-Routes (Like, Save)
router.post('/:id/like', protect, interactionController.toggleLikePost);
router.post('/:id/save', protect, interactionController.toggleSavePost);

module.exports = router;

const express = require('express');
const router = express.Router();
const categoryController = require('./categoryController');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/role');

router.get('/', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.post('/', protect, authorize('admin'), categoryController.createCategory);
router.post('/:slug/follow', protect, categoryController.toggleFollowCategory);

module.exports = router;

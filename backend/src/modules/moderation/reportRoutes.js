const express = require('express');
const router = express.Router();
const reportController = require('./reportController');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/role');

router.post('/', protect, reportController.createReport);
router.get('/', protect, authorize('admin', 'moderator'), reportController.getReports);
router.patch('/:id', protect, authorize('admin', 'moderator'), reportController.resolveReport);

module.exports = router;

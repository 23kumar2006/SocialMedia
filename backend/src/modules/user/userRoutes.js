const userController = require('./userController');
const followController = require('../follow/followController');
const { protect, optionalAuth } = require('../../middleware/auth');

router.get('/suggested', optionalAuth, userController.getSuggestedUsers);
router.get('/profile/:username', optionalAuth, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.post('/:id/follow', protect, followController.toggleFollowUser);

module.exports = router;

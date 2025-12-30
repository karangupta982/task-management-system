const express = require('express');
const router = express.Router();
const {
  searchUsers,
  getProfile,
  updateProfile,
  getNotifications
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/search', searchUsers);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/notifications', getNotifications);

module.exports = router;
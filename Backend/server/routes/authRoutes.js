const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (Require JWT)
router.get('/profile', protect, getUserProfile);
router.post('/logout', protect, logoutUser);

module.exports = router;

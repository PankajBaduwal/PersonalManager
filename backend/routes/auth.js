const express = require('express');
const { protect } = require('../middleware/auth');
const {
  signup,
  login,
  refresh,
  logout,
  getMe
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', signup);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.use(protect); // Apply auth middleware to all routes below
router.get('/me', getMe);
router.post('/logout', logout);

module.exports = router;

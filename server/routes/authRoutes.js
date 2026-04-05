const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
  updatePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  signupRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  updatePasswordRules,
} = require('../validators/authValidators');

// Public routes
router.post('/signup', signupRules, validate, signup);
router.post('/login', loginRules, validate, login);
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordRules, validate, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/update-password', protect, updatePasswordRules, validate, updatePassword);

module.exports = router;

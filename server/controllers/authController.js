const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../services/emailService');

// ─── Generate JWT Token ───────────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── Send Token Response ──────────────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// ─── @route  POST /api/auth/signup ───────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
        errors: { email: 'This email is already registered.' },
      });
    }

    // Create user
    const user = await User.create({ name, email, password });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Signup Error:', error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
        errors: { email: 'This email is already registered.' },
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again.',
    });
  }
};

// ─── @route  POST /api/auth/login ────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (explicitly select password & security fields)
    const user = await User.findOne({ email }).select(
      '+password +loginAttempts +lockUntil'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        errors: { email: 'No account found with this email.' },
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked due to too many failed login attempts. Please try again in ${lockTime} minute(s).`,
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      const remaining = Math.max(0, 5 - (user.loginAttempts + 1));
      return res.status(401).json({
        success: false,
        message: `Invalid email or password.${remaining > 0 ? ` ${remaining} attempt(s) remaining before lockout.` : ' Account will be locked.'}`,
        errors: { password: 'Incorrect password.' },
      });
    }

    // Reset login attempts on success
    if (user.loginAttempts > 0) {
      await user.updateOne({
        $set: { loginAttempts: 0, lastLogin: new Date() },
        $unset: { lockUntil: 1 },
      });
    } else {
      await user.updateOne({ $set: { lastLogin: new Date() } });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.',
    });
  }
};

// ─── @route  POST /api/auth/forgot-password ──────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl, user.name);
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);

      // Rollback token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again.',
      });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.',
    });
  }
};

// ─── @route  POST /api/auth/reset-password/:token ────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid (non-expired) token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired. Please request a new one.',
      });
    }

    // Update password & clear reset fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password.',
    });
  }
};

// ─── @route  GET /api/auth/me ─────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── @route  POST /api/auth/logout ───────────────────────────────────────────
const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

module.exports = { signup, login, forgotPassword, resetPassword, getMe, logout };

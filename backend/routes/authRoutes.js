const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const sendResetEmail = require('../utils/sendEmail');

// ✅ Login Rate Limiting (Security Against Brute-Force Attacks)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Max 10 login attempts per window
  message: "⚠ Too many login attempts. Please try again later.",
});

// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    await authController.register(req, res);
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// ✅ Login User with Rate-Limiting
router.post("/login", loginLimiter, async (req, res) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// ✅ Refresh Token (Automatic Session Handling)
router.post("/refresh-token", async (req, res) => {
  try {
    await authController.refreshToken(req, res);
  } catch (error) {
    console.error("❌ Refresh Token Error:", error);
    res.status(500).json({ message: "Server error refreshing token." });
  }
});

// ✅ Logout User (Clear Token)
router.post("/logout", async (req, res) => {
  try {
    await authController.logout(req, res);
  } catch (error) {
    console.error("❌ Logout Error:", error);
    res.status(500).json({ message: "Server error during logout." });
  }
});

// ✅ (Optional) Email Verification Route
router.get("/verify-email/:token", async (req, res) => {
  try {
    await authController.verifyEmail(req, res);
  } catch (error) {
    console.error("❌ Email Verification Error:", error);
    res.status(500).json({ message: "Email verification failed." });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const resetToken = Math.random().toString(36).slice(2);
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    // ✅ Use the modular email sender
    await sendResetEmail(user.email, resetToken);

    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    await authController.resetPassword(req, res);
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

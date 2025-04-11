const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

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

module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit"); // Import rate limiting

// Limit login attempts to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 20, // Max 5 attempts per window
  message: "Too many login attempts. Please try again later.",
});

// Register User
router.post("/register", authController.register);

// Login User with rate-limiting
router.post("/login", loginLimiter, authController.login);

router.post("/refresh-token", authController.refreshToken);

module.exports = router;

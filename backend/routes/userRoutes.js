const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getUserTicketHistory,
  changePassword,
} = require("../controllers/UserController");

// ✅ Password Change Rate Limiter (Security Feature)
const passwordChangeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit password changes to 5 times per window
  message: "⚠ Too many password change attempts. Try again later.",
});

// ✅ Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    await getUserProfile(req, res);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Server error fetching profile." });
  }
});

// ✅ Update User Profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    await updateUserProfile(req, res);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error updating profile." });
  }
});

// ✅ Change Password (with Rate Limiting)
router.put("/change-password", authMiddleware, passwordChangeLimiter, async (req, res) => {
  try {
    await changePassword(req, res);
  } catch (error) {
    console.error("❌ Error changing password:", error);
    res.status(500).json({ message: "Server error changing password." });
  }
});

// ✅ Get User Ticket History
router.get("/tickets/user", authMiddleware, async (req, res) => {
  try {
    await getUserTicketHistory(req, res);
  } catch (error) {
    console.error("❌ Error fetching ticket history:", error);
    res.status(500).json({ message: "Server error fetching ticket history." });
  }
});

module.exports = router;

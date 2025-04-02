const express = require("express");
const router = express.Router();

// Importing middleware
const { authMiddleware } = require("../middleware/authMiddleware");

// Importing controllers
const {
  getUserProfile,
  updateUserProfile,
  getUserTicketHistory,
  changePassword,
} = require("../controllers/UserController");

// User profile routes
router.get("/profile", authMiddleware, getUserProfile);  // Get user profile
router.put("/profile", authMiddleware, updateUserProfile);  // Update user profile
router.put("/change-password", authMiddleware, changePassword);  // Change password

// User ticket history route
router.get("/tickets/user", authMiddleware, getUserTicketHistory);  // Get user ticket history


module.exports = router;

const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware"); // Import the authMiddleware
const { getUserProfile, getUserTicketHistory } = require("../controllers/UserController"); // Import controller functions

// Route to fetch user profile
router.get("/profile", authMiddleware, getUserProfile);

// Route to fetch user ticket history
router.get("/tickets/user", authMiddleware, getUserTicketHistory);

module.exports = router;

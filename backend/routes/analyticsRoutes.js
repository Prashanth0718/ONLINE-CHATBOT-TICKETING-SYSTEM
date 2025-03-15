const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { authMiddleware, adminOnly, authorizeRoles } = require("../middleware/authMiddleware");

const { getAnalytics } = require("../controllers/analyticsController");
router.get("/", getAnalytics);

// ✅ Track Chatbot Queries (No Auth Required)
router.post("/track-query", analyticsController.trackChatbotQuery);

// ✅ Public Analytics Route (If needed)
router.get("/analytics", analyticsController.getAnalytics); 

// ✅ Admin-only Analytics Data
router.get("/admin-dashboard", authMiddleware, authorizeRoles("admin"), analyticsController.getAdminAnalytics);
router.get("/museum/:museumName", authMiddleware, authorizeRoles("admin"), analyticsController.getMuseumAnalytics);

// ✅ Reset Analytics (Admin Only)
router.post("/reset-daily", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    await analyticsController.resetDailyAnalytics();
    res.status(200).json({ message: "✅ Daily analytics reset successfully" });
  } catch (error) {
    console.error("❌ Error resetting daily analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-monthly", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    await analyticsController.resetMonthlyAnalytics();
    res.status(200).json({ message: "✅ Monthly analytics reset successfully" });
  } catch (error) {
    console.error("❌ Error resetting monthly analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

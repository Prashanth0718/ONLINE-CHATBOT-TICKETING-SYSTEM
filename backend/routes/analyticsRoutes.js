const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Ensure Only Admins Can Access the Admin Dashboard
router.get('/admin-dashboard', authMiddleware, (req, res, next) => {
    console.log('User Role:', req.user.role); // Debugging
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Forbidden: Admins Only' });
    }
    next();
}, analyticsController.getAnalyticsData);

// ✅ Track Chatbot Queries (No Auth Required)
router.post("/track-query", analyticsController.trackChatbotQuery);

// ✅ Public Analytics Route (If needed)
router.get("/analytics", analyticsController.getAnalytics);

// ✅ Museum Analytics (Admin Only)
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

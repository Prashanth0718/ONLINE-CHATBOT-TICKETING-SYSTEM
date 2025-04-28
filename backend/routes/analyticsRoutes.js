const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const { getAnalytics } = require("../controllers/analyticsController");

router.get("/", authMiddleware, getAnalytics);
// ✅ Admin Dashboard Analytics Route (Only Admins)
router.get(
    "/admin-dashboard",
    authMiddleware,
    authorizeRoles("admin"),
    async (req, res) => {
      try {
        // ✅ Call the function properly by passing `req` and `res`
        await analyticsController.getAnalyticsData(req, res);
      } catch (error) {
        console.error("❌ Error fetching analytics:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
  
  

// ✅ Track Chatbot Queries (No Auth Required)
router.post("/track-query", async (req, res) => {
  try {
    await analyticsController.trackChatbotQuery(req, res);
  } catch (error) {
    console.error("❌ Error tracking chatbot query:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Public Analytics Route (If needed)
// router.get("/analytics", async (req, res) => {
//     try {
//       const analytics = await analyticsController.getAnalytics();
//       if (!analytics) {
//         return res.status(404).json({ message: "No analytics data available" });
//       }
//       res.json(analytics);
//     } catch (error) {
//       console.error("❌ Error fetching analytics:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   });
  

// ✅ Museum Analytics (Admin Only)
router.get(
  "/museum/:museumName",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { museumName } = req.params;
      const museumAnalytics = await analyticsController.getMuseumAnalytics(museumName);

      if (!museumAnalytics) {
        return res.status(404).json({ message: `No analytics found for museum: ${museumName}` });
      }

      res.json(museumAnalytics);
    } catch (error) {
      console.error(`❌ Error fetching analytics for museum ${museumName}:`, error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ Reset Daily Analytics (Admin Only)
router.post("/reset-daily", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    await analyticsController.resetDailyAnalytics();
    res.status(200).json({ message: "✅ Daily analytics reset successfully" });
  } catch (error) {
    console.error("❌ Error resetting daily analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Reset Monthly Analytics (Admin Only)
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
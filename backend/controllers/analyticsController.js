const Analytics = require("../models/Analytics");

// 📌 Ensure Only One Analytics Document Exists
const getOrCreateAnalytics = async () => {
  let analytics = await Analytics.findOne({});
  if (!analytics) {
    analytics = new Analytics({
      totalBookings: 0,
      ticketBookings: 0,
      totalRevenue: 0,
      chatbotQueries: 0,
      museumBookings: {},
    });
    await analytics.save();
  }
  return analytics;
};

// 📌 Track Chatbot Query
const trackChatbotQuery = async (req, res) => {
  try {
    console.log("📌 Tracking chatbot query...");
    const analytics = await getOrCreateAnalytics();
    analytics.chatbotQueries += 1;
    await analytics.save();

    res.status(200).json({ message: "✅ Chatbot query tracked" });
  } catch (err) {
    console.error("❌ Error tracking chatbot query:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Track Ticket Booking
const trackBooking = async (museumName, price) => {
  try {
    const analytics = await getOrCreateAnalytics();

    analytics.totalBookings += 1;
    analytics.totalRevenue += price;
    analytics.museumBookings[museumName] = (analytics.museumBookings[museumName] || 0) + 1;

    await analytics.save();
    console.log(`📊 Analytics updated: ${museumName} - Bookings: ${analytics.totalBookings}, Revenue: ${analytics.totalRevenue}`);
  } catch (err) {
    console.error("❌ Error tracking booking:", err);
  }
};

// 📌 Get Overall Analytics
const getAnalytics = async (req, res) => {
  try {
    let { startDate, endDate, museum } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (museum) {
      query[`museumBookings.${museum}`] = { $exists: true };
    }

    const analyticsData = await Analytics.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        analytics: analyticsData,
        monthlyStats: analyticsData.map((data) => ({
          month: new Date(data.createdAt).toLocaleString("default", { month: "short" }),
          revenue: data.totalRevenue,
          tickets: data.ticketBookings,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📌 Get Analytics for a Specific Museum
const getMuseumAnalytics = async (req, res) => {
  try {
    const { museumName } = req.params;
    if (!museumName) {
      return res.status(400).json({ message: "Museum name is required" });
    }

    const analytics = await getOrCreateAnalytics();
    const museumBookings = analytics.museumBookings[museumName] || 0;
    const estimatedRevenue = museumBookings * 25; // Assuming fixed ticket price

    res.status(200).json({ museumName, totalBookings: museumBookings, totalRevenue: estimatedRevenue });
  } catch (error) {
    console.error("❌ Error fetching museum analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Reset Daily Analytics (Runs at Midnight)
const resetDailyAnalytics = async () => {
  try {
    console.log("🔄 Resetting daily analytics...");
    const analytics = await getOrCreateAnalytics();

    analytics.chatbotQueries = 0;
    analytics.ticketBookings = 0;
    await analytics.save();

    console.log("✅ Daily analytics reset!");
  } catch (error) {
    console.error("❌ Error resetting daily analytics:", error);
  }
};

// 📌 Reset Monthly Analytics (Runs on 1st of Each Month)
const resetMonthlyAnalytics = async () => {
  try {
    console.log("🔄 Resetting monthly analytics...");
    const analytics = await getOrCreateAnalytics();

    analytics.totalBookings = 0;
    analytics.totalRevenue = 0;
    analytics.museumBookings = {};
    await analytics.save();

    console.log("✅ Monthly analytics reset!");
  } catch (error) {
    console.error("❌ Error resetting monthly analytics:", error);
  }
};

// 📌 Fetch Full Admin Analytics (Only for Admins)
const getAdminAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const analytics = await getOrCreateAnalytics();

    res.status(200).json({
      totalBookings: analytics.totalBookings || 0,
      ticketBookings: analytics.ticketBookings || 0,
      totalRevenue: analytics.totalRevenue || 0,
      chatbotQueries: analytics.chatbotQueries || 0,
      museumBookings: analytics.museumBookings || {}, // Always return an object
    });
  } catch (error) {
    console.error("❌ Error fetching admin analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Get Analytics Data for Admin Dashboard
const getAnalyticsData = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const analytics = await getOrCreateAnalytics();

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("❌ Error fetching analytics data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📌 Export All Functions
module.exports = {
  trackChatbotQuery,
  trackBooking,
  getAnalytics,
  getMuseumAnalytics,
  resetDailyAnalytics,
  resetMonthlyAnalytics,
  getAdminAnalytics,
  getAnalyticsData,
};

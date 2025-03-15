const Analytics = require("../models/Analytics");

// 📌 Track Chatbot Query
const trackChatbotQuery = async (req, res) => {
  try {
    console.log("📌 Tracking chatbot query...");

    await Analytics.findOneAndUpdate(
      {},
      { $inc: { chatbotQueries: 1 } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "✅ Chatbot query tracked" });
  } catch (err) {
    console.error("❌ Error tracking chatbot query:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Track Ticket Booking
const trackBooking = async (museumName, price) => {
  try {
    const analytics = (await Analytics.findOne({})) || new Analytics();

    analytics.totalBookings += 1;
    analytics.totalRevenue += price;
    analytics.museumBookings.set(
      museumName,
      (analytics.museumBookings.get(museumName) || 0) + 1
    );

    await analytics.save();
    console.log(
      `📊 Analytics updated: ${museumName} - Bookings: ${analytics.totalBookings}, Revenue: ${analytics.totalRevenue}`
    );
  } catch (err) {
    console.error("❌ Error tracking booking:", err);
  }
};

// 📌 Get Overall Analytics
const getAnalytics = async (req, res) => {
    try {
        let { startDate, endDate, museum } = req.query;
        let query = {};

        // Convert dates to ISO format if provided
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Filter by museum if selected
        if (museum) {
            query[`museumBookings.${museum}`] = { $exists: true };
        }

        const analyticsData = await Analytics.find(query).sort({ createdAt: -1 });

        // ❌ FIX: Instead of 404, return an empty array
        res.json({
            success: true,
            data: {
                analytics: analyticsData,
                monthlyStats: analyticsData.map((data) => ({
                    month: new Date(data.createdAt).toLocaleString("default", { month: "short" }),
                    revenue: data.totalRevenue,
                    tickets: data.ticketBookings,
                }))
            }
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
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

    const analytics = await Analytics.findOne({});
    if (!analytics) {
      return res.status(404).json({ message: "No analytics data found" });
    }

    const museumBookings = analytics.museumBookings.get(museumName) || 0;
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

    await Analytics.findOneAndUpdate(
      {},
      { $set: { chatbotQueries: 0, ticketBookings: 0 } },
      { upsert: true }
    );

    console.log("✅ Daily analytics reset!");
  } catch (error) {
    console.error("❌ Error resetting daily analytics:", error);
  }
};

// 📌 Reset Monthly Analytics (Runs on 1st of Each Month)
const resetMonthlyAnalytics = async () => {
  try {
    console.log("🔄 Resetting monthly analytics...");

    await Analytics.findOneAndUpdate(
      {},
      { $set: { totalBookings: 0, totalRevenue: 0, museumBookings: {} } },
      { upsert: true }
    );

    console.log("✅ Monthly analytics reset!");
  } catch (error) {
    console.error("❌ Error resetting monthly analytics:", error);
  }
};

// 📌 Fetch Full Admin Analytics (Only for Admins)
const getAdminAnalytics = async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const analytics = await Analytics.findOne({});
    if (!analytics) return res.status(404).json({ message: "Analytics not found" });

    res.status(200).json({
      totalBookings: analytics.totalBookings || 0,
      ticketBookings: analytics.ticketBookings || 0,
      totalRevenue: analytics.totalRevenue || 0,
      chatbotQueries: analytics.chatbotQueries || 0,
      museumBookings: Object.fromEntries(analytics.museumBookings || []), // Convert Map to Object
    });
  } catch (error) {
    console.error("❌ Error fetching admin analytics:", error);
    res.status(500).json({ message: "Server error" });
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
  getAdminAnalytics
};

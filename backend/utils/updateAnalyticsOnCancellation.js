// utils/updateAnalyticsOnCancellation.js
const Analytics = require("../models/Analytics");

const updateAnalyticsOnCancellation = async (ticket) => {
  try {
    const analytics = await Analytics.findOne().sort({ createdAt: -1 });

    if (!analytics) {
      console.warn("⚠️ No analytics document found.");
      return;
    }

    // Decrease active ticket bookings and total revenue
    analytics.ticketBookings = Math.max(analytics.ticketBookings - 1, 0);
    analytics.totalRevenue = Math.max(analytics.totalRevenue - ticket.price, 0);

    // Decrease museum-specific bookings
    const museumName = ticket.museumName;
    if (analytics.museumBookings[museumName]) {
      analytics.museumBookings[museumName] = Math.max(
        analytics.museumBookings[museumName] - 1,
        0
      );
    }

    analytics.updatedAt = new Date();
    await analytics.save();

    console.log("📉 Analytics updated after ticket cancellation");
  } catch (error) {
    console.error("❌ Analytics update failed:", error.message);
  }
};

module.exports = updateAnalyticsOnCancellation;

const Analytics = require("../models/Analytics");

const updateAnalyticsOnCancellation = async (ticket) => {
  try {
    const analytics = await Analytics.findOne().sort({ createdAt: -1 });

    if (!analytics) {
      console.warn("⚠️ No analytics document found.");
      return;
    }

    // Log current values to debug
    console.log("📊 Current Analytics:", analytics);

    // Decrease active ticket bookings and total revenue
    analytics.ticketBookings = Math.max(analytics.ticketBookings - 1, 0);
    analytics.totalRevenue = Math.max(analytics.totalRevenue - ticket.price, 0);

    // Decrease totalBookings by 1
    analytics.totalBookings = Math.max(analytics.totalBookings - 1, 0);

    // Decrease museum-specific bookings
    const museumName = ticket.museumName;
    if (analytics.museumBookings[museumName]) {
      analytics.museumBookings[museumName] = Math.max(
        analytics.museumBookings[museumName] - 1,
        0
      );
    } else {
      console.warn(`⚠️ No booking found for museum: ${museumName}`);
    }

    // Use findOneAndUpdate to save updated analytics
    const updatedAnalytics = await Analytics.findOneAndUpdate(
      { _id: analytics._id },
      {
        $set: {
          ticketBookings: analytics.ticketBookings,
          totalRevenue: analytics.totalRevenue,
          totalBookings: analytics.totalBookings, // Update totalBookings explicitly
          museumBookings: analytics.museumBookings,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    // Log the updated analytics for verification
    console.log("📉 Analytics updated after ticket cancellation:", updatedAnalytics);
    
  } catch (error) {
    console.error("❌ Analytics update failed:", error.message);
  }
};

module.exports = updateAnalyticsOnCancellation;

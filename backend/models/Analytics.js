const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  totalBookings: { type: Number, default: 0 },
  ticketBookings: { type: Number, default: 0 }, // Daily ticket bookings
  totalRevenue: { type: Number, default: 0 },
  chatbotQueries: { type: Number, default: 0 },
  museumBookings: {
    type: Map,
    of: Number, // Stores bookings per museum { "Louvre": 10, "British Museum": 5 }
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model("Analytics", analyticsSchema);
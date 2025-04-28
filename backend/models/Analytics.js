const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  totalBookings: { type: Number, default: 0 },
  ticketBookings: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  chatbotQueries: { type: Number, default: 0 },
  museumBookings: {
    type: Object,
    of: Number, // Stores bookings per museum { "Louvre": 10, "British Museum": 5 }
    default: {},
  },
  dailyChatbotQueries: [{ 
    date: { type: Date, required: true },
    count: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Analytics", analyticsSchema);

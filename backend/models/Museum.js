const mongoose = require("mongoose");

const dailyStatsSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD format
  availableTickets: { type: Number, required: true },
  bookedTickets: { type: Number, required: true },
});

const museumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  availableTickets: { type: Number, required: true }, // Default for new dates
  dailyStats: [dailyStatsSchema], // ✅ New field
});

module.exports = mongoose.model("Museum", museumSchema);

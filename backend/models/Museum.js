const mongoose = require("mongoose");

const museumSchema = new mongoose.Schema({
  name: String,
  location: String,
  timings: String,
  ticketPrice: Number,
  details: String
});

module.exports = mongoose.model("Museum", museumSchema);

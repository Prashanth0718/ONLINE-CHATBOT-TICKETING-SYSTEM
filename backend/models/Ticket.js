const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  museumName: { type: String, required: true },
  date: { type: String, required: true },
  price: { type: Number, required: true },
  paymentId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
  visitors: { type: Number, required: true } // 🔴 This is missing in the request
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);

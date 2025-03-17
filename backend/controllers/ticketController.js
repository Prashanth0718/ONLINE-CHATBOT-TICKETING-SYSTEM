const Ticket = require("../models/Ticket");
const Analytics = require("../models/Analytics");
const Payment = require("../models/Payment");

const createTicket = async (req, res) => {
  console.log("🔍 Received Payment Data:", req.body);
  try {
    const { museumName, date, price, paymentId } = req.body;
    const userId = req.user.id;

    // ✅ Ensure payment is verified
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(400).json({ message: "Payment not verified" });
    }

    // ✅ Check if ticket already exists for the same user & event
    const existingTicket = await Ticket.findOne({ userId, museumName, date });
    if (existingTicket) {
      return res.status(400).json({ message: "Ticket already booked" });
    }

    // ✅ Create and save ticket
    const ticket = new Ticket({ userId, museumName, date, price, status: "booked" });
    await ticket.save();
    console.log("✅ Ticket saved in MongoDB:", ticket);
    // ✅ Update Analytics
    const analytics = await Analytics.findOneAndUpdate(
      {},
      {
        $inc: { totalBookings: 1, totalRevenue: price },
        $set: { [`museumBookings.${museumName}`]: (analytics?.museumBookings?.get(museumName) || 0) + 1 },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "✅ Ticket booked successfully", ticket });
  } catch (error) {
    console.error("❌ Error booking ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;

    const ticket = await Ticket.findOne({ _id: ticketId, userId });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // ✅ Prevent cancellation for past events
    if (new Date(ticket.date) <= new Date()) {
      return res.status(400).json({ message: "Cannot cancel past events" });
    }

    await Ticket.findByIdAndDelete(ticketId);

    // ✅ Update Analytics
    const analytics = await Analytics.findOneAndUpdate(
      {},
      {
        $inc: { totalBookings: -1, totalRevenue: -ticket.price },
        $set: { [`museumBookings.${ticket.museumName}`]: Math.max((analytics?.museumBookings?.get(ticket.museumName) || 1) - 1, 0) },
      },
      { new: true }
    );

    res.status(200).json({ message: "✅ Ticket canceled successfully" });
  } catch (error) {
    console.error("❌ Error canceling ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fetch user-specific tickets
const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await Ticket.find({ userId });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("❌ Error fetching tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fetch all tickets (Admin Only)
const getAllTickets = async (req, res) => {
  try {
    if (req.user.role !== "admin") {  // Access role from req.user
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("❌ Error fetching all tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createTicket, cancelTicket, getUserTickets, getAllTickets };


const Analytics = require("../models/Analytics");
const Payment = require("../models/Payment");
const Razorpay = require('razorpay');
const Ticket = require('../models/Ticket'); 
const axios = require('axios');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createTicket = async (req, res) => {
  console.log("🔍 Received Payment Data:", req.body);
  try {
    const { museumName, date: selectedDate, price, paymentId } = req.body;
    console.log("📆 Received Date:", selectedDate);
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
    // Convert date to YYYY-MM-DD format
    const formattedDate = new Date(date).toISOString().split("T")[0];

    const ticket = new Ticket({
      userId,
      museumName,
      date: formattedDate,  // ✅ Ensure correct format
      price,
      paymentId: razorpay_payment_id,
      status: "booked",
      visitors,
    });

    
    
    const savedTicket = await ticket.save();
    console.log("✅ Ticket saved in MongoDB:", ticket);
    if (!savedTicket) {
      return res.status(500).json({ message: "Ticket saving failed" });
  }
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
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status === "canceled") {
      return res.status(400).json({ message: "Ticket is already canceled" });
    }

    if (!ticket.paymentId) {
      return res.status(400).json({ message: "Invalid payment information. Refund not possible." });
    }

    let refundResponse;
    try {
      refundResponse = await axios.post(
        `https://api.razorpay.com/v1/payments/${ticket.paymentId}/refund`,
        {},
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_KEY_SECRET,
          },
        }
      );
    } catch (razorpayError) {
      console.error("❌ Razorpay Refund Failed:", razorpayError.response?.data || razorpayError.message);
      return res.status(500).json({ message: "Refund failed. Please try again later." });
    }

    // ✅ Update ticket status after successful refund
    ticket.status = "canceled";
    ticket.updatedAt = new Date();
    await ticket.save();

    res.status(200).json({
      message: "✅ Ticket canceled and refund initiated.",
      refundDetails: refundResponse.data,
      ticket, // ✅ Send updated ticket to match frontend state
    });
  } catch (error) {
    console.error("❌ Error canceling ticket:", error);
    res.status(500).json({ message: "Error canceling ticket", error: error.message });
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


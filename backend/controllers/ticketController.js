const Analytics = require("../models/Analytics");
const Payment = require("../models/Payment");
const Razorpay = require('razorpay');
const Ticket = require('../models/Ticket'); 
const axios = require('axios');
const updateAnalyticsOnCancellation = require("../utils/updateAnalyticsOnCancellation");
const Museum = require("../models/Museum");
const User = require("../models/User");
const sendCancellationEmail = require("../utils/sendCancellationEmail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// ✅ Create Ticket
const createTicket = async (req, res) => {
  console.log("🔍 Received Payment Data:", req.body);
  try {
    const { museumName, date: selectedDate, price, paymentId, visitors } = req.body;
    if (!visitors || visitors <= 0) {
      return res.status(400).json({ message: "Invalid number of visitors" });
    }
    if (!museumName || !selectedDate || !price || !paymentId) {
      return res.status(400).json({ message: "Missing required fields" });  
    }


    console.log("📆 Received Date:", selectedDate);
    const userId = req.user.id;

    // ✅ Convert & Validate Date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0); // Normalize time

    if (selectedDateObj < today) {
      return res.status(400).json({ message: "❌ Cannot book tickets for past dates." });
    }

    // ✅ Ensure payment is verified
    const payment = await Payment.findOne({ paymentId });
    if (!payment) {
      return res.status(400).json({ message: "Payment not verified" });
    }

    // ✅ Check if ticket already exists for the same user & event
    const existingTicket = await Ticket.findOne({ userId, museumName, date: selectedDateObj });
    if (existingTicket) {
      return res.status(400).json({ message: "Ticket already booked" });
    }

    // ✅ Create and save ticket
    const formattedDate = selectedDateObj.toISOString().split("T")[0];

    const ticket = new Ticket({
      userId,
      museumName,
      date: formattedDate,
      price,
      paymentId,
      status: "booked",
      visitors,
    });

    const savedTicket = await ticket.save();
    // try {
    //   await ticket.save();
    // } catch (error) {
    //   if (error.code === 11000) {
    //     return res.status(400).json({ message: "Duplicate Payment ID detected. Ticket already exists." });
    //   }
    //   throw error;
    // }
    
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


// ✅ Cancel Ticket
const cancelTicket = async (req, res) => {
  console.log("🛬 cancelTicket function hit");
  console.log("🔍 Cancel Ticket Request:", req.params);

  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "❌ Ticket not found" });
    }

    if (ticket.status === "cancelled") {
      return res.status(400).json({ message: "❌ Ticket is already cancelled." });
    }

    if (ticket.refundStatus === "processed") {
      return res.status(400).json({ message: "✅ Refund already processed for this ticket." });
    }

    if (!ticket.paymentId) {
      return res.status(400).json({ message: "❌ Invalid payment ID. Refund not possible." });
    }

    // 🛑 Proceed with Razorpay Refund if not refunded yet
    try {
      const refundResponse = await axios.post(
        `https://api.razorpay.com/v1/payments/${ticket.paymentId}/refund`,
        {},
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_KEY_SECRET,
          },
        }
      );

      // ✅ Update ticket status and refund details
      ticket.status = "cancelled";
      ticket.refundStatus = "processed";
      ticket.updatedAt = new Date();
      ticket.refundDetails = refundResponse.data;
      await ticket.save();
      await updateAnalyticsOnCancellation(ticket);

      // 📧 Send email to user about the cancellation
      const user = await User.findById(ticket.userId);
      if (user && user.email) {
        await sendCancellationEmail(user.email, ticket);
        console.log("📧 Cancellation email sent to:", user.email);
      }

      // ✅ Send response back
      return res.status(200).json({
        message: "✅ Ticket cancelled and refund initiated.",
        refundDetails: refundResponse.data,
        ticket,
      });

    } catch (razorpayError) {
      const rzpMsg = razorpayError.response?.data?.error?.description;

      // ⚠️ If refund has already been processed
      if (rzpMsg === "The payment has been fully refunded already") {
        ticket.status = "cancelled";
        ticket.refundStatus = "processed"; // Mark as done
        ticket.updatedAt = new Date();
        await ticket.save();

        return res.status(200).json({
          message: "⚠️ Ticket was already refunded earlier. Status updated.",
          ticket,
        });
      }

      console.error("❌ Razorpay Refund Failed:", rzpMsg);
      return res.status(500).json({ message: `Refund failed: ${rzpMsg}` });
    }

  } catch (error) {
    console.error("❌ Error canceling ticket:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Error canceling ticket", error: error.message });
    }
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
      const tickets = await Ticket.find()
          .populate("userId", "name email") // ✅ This will include user's name and email
          .sort({ createdAt: -1 });

      res.status(200).json(tickets);
  } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const oldStatus = ticket.status;
    if (oldStatus === status) {
      return res.status(200).json({ message: "No status change", ticket });
    }

    const museum = await Museum.findOne({ name: ticket.museumName });
    if (!museum) return res.status(404).json({ error: "Museum not found" });

    const dateKey = ticket.date.toISOString().slice(0, 10);
    let stats = museum.dailyStats.find(stat => stat.date === dateKey);
    if (!stats) {
      stats = {
        date: dateKey,
        availableTickets: museum.totalCapacity || 100,
        bookedTickets: 0,
      };
      museum.dailyStats.push(stats);
    }

    // Ensure stats values are numbers
    stats.bookedTickets = Number(stats.bookedTickets) || 0;
    stats.availableTickets = Number(stats.availableTickets) || 0;

    const ticketQty = Number(ticket.numTickets) || 0;
    const ticketRevenue = Number(ticket.amountPaid) || 0;

    console.log(`🛠 Status change: ${oldStatus} ➜ ${status}`);

    if (oldStatus === "booked") {
      stats.bookedTickets = Math.max(0, stats.bookedTickets - ticketQty);
      stats.availableTickets += ticketQty;
    }

    if (status === "booked") {
      if (stats.availableTickets < ticketQty) {
        return res.status(400).json({ error: "Not enough tickets available to rebook" });
      }
      stats.bookedTickets += ticketQty;
      stats.availableTickets = Math.max(0, stats.availableTickets - ticketQty);
    }

    // 🔥 Analytics updates
    let analytics = await Analytics.findOne({ museumName: ticket.museumName });
    console.log("🎯 Looking for analytics of museum:", ticket.museumName);

    
    

    if (!analytics) {
      analytics = new Analytics({
        museumName: ticket.museumName.toLowerCase(),
        totalBookings: 0,
        totalRevenue: 0,
        ticketBookings: 0,
      });
    }

    if (oldStatus === "booked") {
      analytics.ticketBookings = Math.max(0, analytics.ticketBookings - ticketQty);
      analytics.totalRevenue = Math.max(0, analytics.totalRevenue - ticketRevenue);
    }

    if (status === "booked") {
      analytics.ticketBookings += ticketQty;
      analytics.totalRevenue += ticketRevenue;
    }

    console.log("🧮 Final Analytics:", {
      bookings: analytics.ticketBookings,
      revenue: analytics.totalRevenue,
    });
    

    await analytics.save();
  
    
    ticket.status = status;
    await ticket.save();
    await museum.save();

    console.log("✅ Ticket, stats, and analytics updated");
    res.json({ message: "Ticket status updated", ticket });

  } catch (error) {
    console.error("❌ Error updating ticket:", error);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = { createTicket, cancelTicket, getUserTickets, getAllTickets, updateTicket };
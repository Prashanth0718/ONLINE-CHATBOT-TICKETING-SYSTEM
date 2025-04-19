const axios = require("axios");
const Ticket = require("../models/Ticket");
const Museum = require("../models/Museum");
const updateAnalyticsOnCancellation = require("./updateAnalyticsOnCancellation");

const cancelTicketChatbot = async (ticketId) => {
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return "❌ Ticket not found.";

    if (ticket.status === "cancelled") {
      return "⚠️ This ticket is already cancelled.";
    }

    // ❌ Prevent cancelling expired tickets
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight - ignore time

    const ticketDate = new Date(ticket.date);
    ticketDate.setHours(0, 0, 0, 0); // Ignore time for comparison

    if (ticketDate < today) {
      return "⚠️ This ticket has expired and cannot be cancelled.";
    }


    // ✅ Razorpay Refund if not already refunded
    if (ticket.paymentId && ticket.refundStatus !== "processed") {
      try {
        // Optional: Log payment ID and Razorpay credentials for debugging
        console.log("🔍 Attempting Razorpay refund for Payment ID:", ticket.paymentId);

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

        ticket.refundStatus = "processed";
        ticket.refundDetails = refundResponse.data;
      } catch (razorpayError) {
        const rzpMsg = razorpayError.response?.data?.error?.description || razorpayError.message;
        console.error("❌ Razorpay Refund Failed:", rzpMsg);

        if (rzpMsg === "The payment has been fully refunded already") {
          ticket.refundStatus = "processed"; // Still mark it as processed
        } else {
          return `⚠️ Refund failed: ${rzpMsg}`;
        }
      }
    }

    // ✅ Mark ticket as cancelled
    ticket.status = "cancelled";
    ticket.updatedAt = new Date();
    await ticket.save();
    await updateAnalyticsOnCancellation(ticket);

    // ✅ Update Museum stats
    const museum = await Museum.findOne({ name: ticket.museumName });
    if (museum) {
      const dateKey = ticket.date.toISOString().slice(0, 10);
      const stats = museum.dailyStats.find((stat) => stat.date === dateKey);

      if (stats) {
        stats.availableTickets += ticket.visitors;
        stats.bookedTickets -= ticket.visitors;

        if (stats.bookedTickets < 0) stats.bookedTickets = 0;
        await museum.save();
      }
    }

    return `✅ Your ticket for *${ticket.museumName}* on *${new Date(ticket.date).toLocaleDateString()}* has been cancelled successfully. A refund (if applicable) will be processed.`;

  } catch (error) {
    console.error("❌ Cancellation Error (Chatbot):", error);
    return "⚠️ Failed to cancel your ticket. Please try again later.";
  }
};

module.exports = cancelTicketChatbot;

const express = require("express");
const paymentController = require("../controllers/paymentController");
const Payment = require("../models/Payment");
const Ticket = require("../models/Ticket");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create Payment Order (Requires Auth)
router.post("/create-order", authMiddleware, paymentController.createOrder);

// ✅ Verify Payment (Requires Auth)
router.post("/verify", authMiddleware, paymentController.verifyPayment);

// ✅ Process Refund (Requires Auth)
router.post("/refund/:ticketId", authMiddleware, async (req, res) => {
  try {
      const { ticketId } = req.params;

      // Check if the ticket exists
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
          return res.status(404).json({ message: "Ticket not found" });
      }

      // Ensure the ticket has a valid payment ID before proceeding
      if (!ticket.paymentId) {
          return res.status(400).json({ message: "Invalid payment information. Refund not possible." });
      }

      // Proceed with refund
      req.body.paymentId = ticket.paymentId; // Attach paymentId to request body

      // ✅ Call refundPayment, but don't send response twice
      const refundResponse = await paymentController.refundPayment(req, res);

      // ✅ Only send response if the controller didn't send one
      if (!res.headersSent) {
          res.status(200).json(refundResponse);
      }

  } catch (error) {
      console.error("❌ Error processing refund:", error);

      // ✅ Ensure we only send one response
      if (!res.headersSent) {
          res.status(500).json({ message: "Error processing refund" });
      }
  }
});





// ✅ Fetch All Payments (Admin Only)
router.get("/all-payments", authMiddleware, adminOnly, async (req, res) => {
    try {
        const payments = await Payment.find();
        if (!payments.length) {
            return res.status(404).json({ message: "No payments found" });
        }
        res.status(200).json(payments);
    } catch (error) {
        console.error("❌ Error fetching payments:", error);
        res.status(500).json({ message: "Error fetching payments" });
    }
});

// ✅ Fetch All Tickets (Admin Only)
router.get("/all-tickets", authMiddleware, adminOnly, async (req, res) => {
    try {
        const tickets = await Ticket.find();
        if (!tickets.length) {
            return res.status(404).json({ message: "No tickets found" });
        }
        res.status(200).json(tickets);
    } catch (error) {
        console.error("❌ Error fetching tickets:", error);
        res.status(500).json({ message: "Error fetching tickets" });
    }
});

// ✅ Get all payments (Admin Only)
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
      const payments = await Payment.find().populate("userId", "name email"); // Fetch user details
      res.status(200).json(payments);
  } catch (error) {
      res.status(500).json({ error: "Error fetching payments" });
  }
});

// ✅ Update Payment Status (Admin Only)
router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;

      const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });

      if (!payment) {
          return res.status(404).json({ error: "Payment not found" });
      }

      res.status(200).json(payment);
  } catch (error) {
      res.status(500).json({ error: "Error updating payment status" });
  }
});

// ✅ Delete Payment (Admin Only)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
      const { id } = req.params;
      await Payment.findByIdAndDelete(id);
      res.status(200).json({ message: "Payment deleted successfully!" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting payment" });
  }
});


module.exports = router;

const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController"); 
const Payment = require("../models/Payment"); 
const Ticket = require("../models/Ticket");

const router = express.Router();

// ✅ Define routes properly with authentication
router.post("/create-order", authMiddleware, paymentController.createOrder);  
router.post("/verify", authMiddleware, paymentController.verifyPayment);      

// ✅ Fetch all payments (for testing)
router.get("/all-payments", authMiddleware, async (req, res) => {
    try {
      const payments = await Payment.find();
      res.status(200).json(payments.length ? payments : []); // Ensure response is an array
    } catch (error) {
      console.error("❌ Error fetching payments:", error);
      res.status(500).json({ message: "Error fetching payments" });
    }
});

// ✅ Fetch all tickets (for testing)
router.get("/all-tickets", authMiddleware, async (req, res) => {
    try {
      const tickets = await Ticket.find();
      res.status(200).json(tickets.length ? tickets : []); // Ensure response is an array
    } catch (error) {
      console.error("❌ Error fetching tickets:", error);
      res.status(500).json({ message: "Error fetching tickets" });
    }
});

module.exports = router;

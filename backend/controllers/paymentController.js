const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Ticket = require("../models/Ticket");
const Analytics = require("../models/Analytics"); // ✅ Import Analytics model

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * ✅ Step 1: Create a Razorpay Order (Frontend calls this first)
 */
exports.createOrder = async (req, res) => {
  const { amount, currency } = req.body;

  // 🛑 Validate amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: `receipt_${Date.now()}`, // Unique receipt ID
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * ✅ Step 2: Verify Payment & Book Ticket
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, museumName, date, price, visitors } = req.body;

    
    console.log("🔍 Received Payment Data:", req.body); // ✅ Debug log
    console.log("🔍 Payment API: Date Before Processing:", date);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log("❌ Missing fields:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!museumName || !date || !price || !visitors) {
      console.log("❌ Missing Ticket Fields:", { museumName, date, price, visitors });
      return res.status(400).json({ message: "Missing ticket details" });
    }

    console.log("✅ Authentication User:", req.user);
    if (!req.user) {
      console.log("❌ User not found in request");
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const userId = req.user.id;

    // 🔹 Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    console.log("✅ Payment Verified");

    // 🔹 Store Payment
    const existingPayment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!existingPayment) {
      const newPayment = new Payment({ userId, orderId: razorpay_order_id, paymentId: razorpay_payment_id, amount: price });
      await newPayment.save();
      console.log("✅ Payment Stored:", newPayment);
    }

    // 🔹 Store Ticket
    console.log("📌 Booking Ticket...");
    let savedTicket; // ✅ Declare savedTicket outside try block

    try {
      const ticket = new Ticket({
        userId,
        museumName,
        date,
        price,
        paymentId: razorpay_payment_id,
        status: "booked",
        visitors,
      });

      savedTicket = await ticket.save(); // ✅ Assign saved ticket to the variable
      console.log("✅ Ticket Created & Saved in DB:", savedTicket);
    } catch (error) {
      console.error("❌ Error Saving Ticket:", error);
      return res.status(500).json({ message: "Failed to save ticket" });
    }

    // 🔹 Update Analytics
    console.log("📊 Updating Analytics...");

    let analytics = await Analytics.findOne();
    if (!analytics) {
      console.log("⚠️ No analytics record found. Creating a new one...");
      analytics = new Analytics({
        totalBookings: 0,
        totalRevenue: 0,
        ticketBookings: 0,
        chatbotQueries: 0,
        museumBookings: {}
      });
    }

    // 🔹 Ensure `museumBookings` exists as an object
    if (!analytics.museumBookings || typeof analytics.museumBookings !== 'object') {
      analytics.museumBookings = {}; // ✅ Initialize if missing
    }

    // 🔹 Increment values
    analytics.totalBookings += 1;
    analytics.ticketBookings += 1;
    analytics.totalRevenue += price;
    analytics.museumBookings[museumName] = (analytics.museumBookings[museumName] || 0) + 1;

    // 🔹 Use `$set` to **force update museumBookings**
    await Analytics.findOneAndUpdate(
      {},
      {
        $inc: { totalBookings: 1, totalRevenue: price, ticketBookings: 1 },
        $set: { [`museumBookings.${museumName}`]: analytics.museumBookings[museumName] }
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Analytics Updated: ${analytics.totalBookings} bookings, ₹${analytics.totalRevenue} revenue`);
    console.log(`🏛️ Museum Bookings Updated:`, analytics.museumBookings);

    res.status(200).json({ message: "Payment successful & Ticket booked", paymentId: razorpay_payment_id, ticket: savedTicket });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refundPayment = async (req, res) => {
  try {
      const { ticketId } = req.params;

      // Find the ticket
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
          return res.status(404).json({ message: 'Ticket not found' });
      }

      // Prevent duplicate refund requests
      if (ticket.status === 'canceled') {
          return res.status(400).json({ message: 'Ticket is already canceled and refunded' });
      }

      // Initiate refund
      const refund = await razorpay.payments.refund(ticket.paymentId);

      // Update ticket status
      ticket.status = 'canceled';
      await ticket.save();

      res.status(200).json({
          message: 'Refund processed successfully',
          refund
      });
  } catch (error) {
      console.error('Refund Error:', error);
      res.status(500).json({ message: 'Refund failed', error: error.message });
  }
};



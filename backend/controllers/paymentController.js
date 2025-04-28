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
  console.log("🔍 Received Payment Verification Request:", req.body);
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

    const existingTicket = await Ticket.findOne({ paymentId: razorpay_payment_id });
    if (existingTicket) {
    return res.status(409).json({ message: "Ticket already exists for this payment" });
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

      console.log("📌 Saving ticket:", {
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

    // 📊 Updating Analytics
    console.log("📊 Updating Analytics...");

    // Step 1: Directly update analytics using `findOneAndUpdate` method
    await Analytics.findOneAndUpdate(
      {},
      {
        $inc: {
          totalBookings: 1,  // Increment totalBookings by 1
          totalRevenue: price,  // Add `price` to totalRevenue
          ticketBookings: 1,  // Increment ticketBookings by 1
          [`museumBookings.${museumName}`]: 1  // Increment the specific museum's booking count by 1
        }
      },
      { upsert: true, new: true }  // If no document exists, create one. Return the updated document.
    );

    // Step 2: Log the updated analytics for verification
    console.log("✅ Analytics Updated");

    const analytics = await Analytics.findOne({});
    if (analytics) {
      console.log(`📊 Total Bookings: ${analytics.totalBookings}, Total Revenue: ₹${analytics.totalRevenue}`);
      console.log(`📊 Museum Bookings: ${JSON.stringify(analytics.museumBookings)}`);
    } else {
      console.log("❌ Analytics document not found");
    } 




    res.status(200).json({ message: "Payment successful & Ticket booked", paymentId: razorpay_payment_id, ticket: savedTicket });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.refundPayment = async (req, res) => {
//   try {
//       const { ticketId } = req.params;

//       // 🔹 Find the ticket
//       const ticket = await Ticket.findById(ticketId);
//       if (!ticket) {
//           return res.status(404).json({ message: "Ticket not found" });
//       }

//       // 🔹 Prevent duplicate refund requests
//       if (ticket.status === "canceled") {
//           return res.status(400).json({ message: "Ticket has already been refunded" });
//       }

//       // 🔹 Check if the payment exists
//       const payment = await Payment.findOne({ paymentId: ticket.paymentId });
//       if (!payment) {
//           return res.status(400).json({ message: "Payment record not found, cannot process refund" });
//       }

//       // 🔹 Initiate refund with Razorpay
//       const refund = await razorpay.payments.refund(ticket.paymentId);
//       console.log("✅ Razorpay Refund Response:", refund);

//       if (!refund || refund.status !== "processed") {
//           return res.status(500).json({ message: "Refund request failed, please try again later" });
//       }

//       // 🔹 Update ticket status
//       ticket.status = "canceled";
//       await ticket.save();

//       // 🔹 Update Analytics
//       let analytics = await Analytics.findOne();
//       if (analytics) {
//           analytics.totalBookings -= 1;
//           analytics.totalRevenue -= ticket.price;
//           analytics.museumBookings[ticket.museumName] = (analytics.museumBookings[ticket.museumName] || 1) - 1;

//           await analytics.save();
//           console.log(`📉 Analytics Updated: ${analytics.totalBookings} bookings, ₹${analytics.totalRevenue} revenue`);
//       }

//       res.status(200).json({ message: "Refund processed successfully", refund });
//   } catch (error) {
//       console.error("❌ Refund Error:", error);
//       res.status(500).json({ message: "Refund failed", error: error.message });
//   }
// };

exports.refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "Payment ID is required for refund" });
    }

    console.log("🔍 Verifying Payment ID before refund:", paymentId);

    // Step 1: Fetch Payment Details from Razorpay
    let paymentDetails;
    try {
      paymentDetails = await razorpay.payments.fetch(paymentId);
      console.log("✅ Payment Exists in Razorpay:", paymentDetails);
    } catch (fetchError) {
      console.error("❌ Razorpay Fetch Payment Error:", fetchError);
      return res.status(400).json({
        message: "Invalid payment ID or payment does not exist",
        error: fetchError.error ? fetchError.error.description : fetchError.message
      });
    }

    // Step 2: Check if Payment is Captured and Not Already Refunded
    if (paymentDetails.status !== "captured") {
      return res.status(400).json({
        message: "Refund not possible. Payment must be captured.",
      });
    }

    if (paymentDetails.amount_refunded > 0) {
      return res.status(400).json({
        message: "Payment already refunded.",
      });
    }

    // Step 3: Convert Amount to Paisa and Refund
    const refundAmount = paymentDetails.amount; // Amount in paisa

    let refund;
    try {
      refund = await razorpay.payments.refund(paymentId, { amount: refundAmount });
      console.log("✅ Refund Successful:", refund);
    } catch (refundError) {
      console.error("❌ Razorpay Refund Error:", refundError);
      return res.status(400).json({
        message: "Failed to process refund via Razorpay",
        error: refundError.error ? refundError.error.description : refundError.message
      });
    }

    // Step 4: Update Ticket Status in Database
    const updatedTicket = await Ticket.findOneAndUpdate(
      { paymentId },
      { $set: { status: "canceled" } },
      { new: true }
    );

    console.log("✅ Ticket Status Updated:", updatedTicket);

    res.status(200).json({
      message: "Refund processed successfully",
      refund
    });
  } catch (error) {
    console.error("❌ Refund Error:", error);
    res.status(500).json({ message: "Refund failed", error: error.message });
  }
};






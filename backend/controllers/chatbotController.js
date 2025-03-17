const axios = require("axios");
const Museum = require("../models/Museum");
const Ticket = require("../models/Ticket");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.chatbotHandler = async (req, res) => {
  console.log("🟢 Raw userMessage:", JSON.stringify(req.body));

  try {
    let { userMessage, session } = req.body;

    if (!session) {
      session = {};
    }

    let response = { message: "", options: [] };

    console.log("🟢 Received Message:", userMessage);
    console.log("🔵 Current Session Step:", session.step);

    const normalizedMessage = userMessage.trim().toLowerCase();

    // ✅ Step 1: Initial Welcome
    if (!session.step) {
      response.message = "Welcome! How can I assist you today?";
      response.options = ["Book a ticket 🎟️", "Check my tickets 📜", "Ask something else ❓"];
      session.step = "main_menu";
    }

    // ✅ Step 2: Main Menu
    else if (session.step === "main_menu") {
      console.log("🟠 Checking Main Menu Options...");

      if (normalizedMessage.includes("book a ticket")) {
        console.log("✅ User selected 'Book a Ticket'!");

        const museums = await Museum.find({}, "name");
        console.log("🏛️ Available Museums:", museums);

        if (!museums.length) {
          response.message = "Sorry, no museums are available for booking at the moment.";
          session.step = "main_menu"; 
        } else {
          response.message = "Great! Which museum would you like to visit?";
          response.options = museums.map(m => m.name);
          session.step = "select_museum";
        }
      } 
      else if (normalizedMessage.includes("check my tickets")) {
        console.log("✅ User selected 'Check My Tickets'");
        response.message = "Please enter your registered email to check your bookings.";
        session.step = "check_tickets";
      } 
      else {
        console.log("❌ Unrecognized Input, sending default response.");
        response.message = "You can ask me anything related to museum bookings!";
        session.step = "ask_question";
      }
    }

    // ✅ Step 3: Select Museum
    else if (session.step === "select_museum") {
      session.selectedMuseum = userMessage;
      response = { message: "📅 Please enter the date you want to visit (YYYY-MM-DD)." };
      session.step = "select_date";
    }

    // ✅ Step 4: Select Date
    else if (session.step === "select_date") {
      session.selectedDate = userMessage;
      console.log("📆 Selected Date Before Sending API:", session.selectedDate);
      response = { message: `🎫 How many tickets would you like for ${session.selectedMuseum} on ${session.selectedDate}?` };
      session.step = "select_tickets";
    }

    // ✅ Step 5: Select Tickets
    else if (session.step === "select_tickets") {
      session.numTickets = parseInt(userMessage);
      response = {
        message: "✅ Tickets are available! Please proceed with payment.",
        options: ["Proceed to Payment 💳"],
      };
      session.step = "payment";
    }

    // ✅ Step 6: Payment Process
    else if (session.step === "payment" && userMessage.includes("Proceed to Payment")) {
      try {
        const amount = session.numTickets * 20 * 100; // Convert to paise
        const currency = "INR";

        // ✅ Create Razorpay Order
        const order = await razorpay.orders.create({
          amount: amount,
          currency: currency,
          receipt: `receipt_${Date.now()}`,
        });

        console.log("✅ Razorpay Order Created:", order);

        response = {
          message: `Please proceed with payment.`,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID, // Send public key to frontend
        };

        session.step = "verify_payment";
      } catch (error) {
        console.error("❌ Payment Processing Error:", error);
        response = { message: "Failed to process payment. Please try again later." };
      }
    }

    // ✅ Step 7: Verify Payment & Store Ticket
    else if (session.step === "verify_payment") {
      const userToken = req.headers.authorization; // Get user token from request

    try {
      const paymentId = "dummy_payment_id"; // Replace with actual payment ID from Razorpay
      const ticketResponse = await axios.post(
        "http://localhost:5000/api/tickets/create",
        {
          museumName: session.selectedMuseum,
          date: new Date(session.selectedDate).toISOString().split("T")[0], // Fix date format
          price: session.numTickets * 20,
          paymentId: paymentId,
        },
        {
          headers: { Authorization: userToken },
        }
      );
      

      console.log("✅ Ticket API Response:", ticketResponse.data);

      response = {
        message: "✅ Payment successful! Your ticket has been booked. 🎟️",
        options: ["Check my tickets 📜", "Back to Main Menu"],
      };

      session = {}; // Reset session after booking
    } catch (error) {
      console.error("❌ Error booking ticket via API:", error);
      response = { message: "Failed to book ticket. Please try again." };
    }


      response = {
        message: "✅ Payment successful! Your ticket has been booked. 🎟️",
        options: ["Check my tickets 📜", "Back to Main Menu"],
      };

      session = {}; // Reset session after booking
    }

    res.json({ response, session });
  } catch (error) {
    console.error("❌ Chatbot Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

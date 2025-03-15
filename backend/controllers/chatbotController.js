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

        // ✅ Debugging Logs
        console.log("🟢 Received Message:", userMessage);
        console.log("🔵 Current Session Step:", session.step);

        // ✅ Normalize user input
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
            if (normalizedMessage.includes("book a ticket")) { // ✅ Fixed condition
                console.log("✅ User selected 'Book a Ticket'!");

                // Fetch museums from DB
                const museums = await Museum.find({}, "name");
                console.log("🏛️ Available Museums:", museums);

                if (!museums.length) {
                    response.message = "Sorry, no museums are available for booking at the moment.";
                    session.step = "main_menu"; // Reset
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

        else if (session.step === "select_museum") {
            session.selectedMuseum = userMessage;
            response = { message: `How many tickets do you need for ${userMessage}?` };
            session.step = "select_tickets";
          } else if (session.step === "select_tickets") {
            session.numTickets = parseInt(userMessage);
            response = {
              message: "Tickets are available! Please proceed with payment.",
              options: ["Proceed to Payment 💳"],
            };
            session.step = "payment";
          } else if (session.step === "payment" && userMessage.includes("Proceed to Payment")) {
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
          
              // 🔹 Send order details (NOT a redirect URL)
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
           else if (session.step === "verify_payment") {
            // ✅ Booking Ticket after Payment Verification
            const ticket = new Ticket({
              userId,
              museumName: session.selectedMuseum,
              date: new Date().toISOString().split("T")[0],
              price: session.numTickets * 20,
              paymentId: "dummy_payment_id",
              status: "booked",
              visitors: session.numTickets,
            });
      
            await ticket.save();
      
            response = {
              message: "Payment successful! Your ticket has been booked. 🎟️",
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
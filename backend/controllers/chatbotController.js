const axios = require("axios");
const Museum = require("../models/Museum");
const Ticket = require("../models/Ticket");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const cancelTicketChatbot = async (ticketId, userToken) => {
  console.log("🔍 User Token before sending request:", userToken);
  try {
    const response = await axios.post(
      `http://localhost:5000/api/tickets/cancel/${ticketId}`, // ✅ Send ticketId in URL (matches backend)
      {}, // ✅ Empty request body (not needed)
      {
        headers: { Authorization: userToken },
      }
    );

    console.log("✅ Ticket cancellation response:", response.data);
    return response.data.message || "✅ Ticket has been canceled successfully! Refund is being processed.";
  } catch (error) {
    console.error("❌ Chatbot Ticket Cancellation Error:", error.response?.data || error.message);
    return error.response?.data?.message || "⚠️ Unable to cancel ticket. Please try again or contact support.";
  }
};



exports.chatbotHandler = async (req, res) => {
  console.log("🟢 Raw userMessage:", JSON.stringify(req.body));

  try {
    let { userMessage, session } = req.body;
    if (!session) session = {};

    let response = { message: "", options: [] };
    console.log("🟢 Received Message:", userMessage);
    console.log("🔵 Current Session Step:", session.step);

    const normalizedMessage = userMessage.trim().toLowerCase();

    // ✅ Step 1: Initial Welcome
    if (!session.step) {
      response.message = "Welcome! How can I assist you today?";
      response.options = [
        "Book a ticket 🎟️",
        "Check my tickets 📜",
        "Cancel my ticket ❌",
        "Ask something else ❓"
      ];
      session.step = "main_menu";
    }

    // ✅ Step 2: Main Menu
    else if (session.step === "main_menu") {
      console.log("🟠 Checking Main Menu Options...");

      if (normalizedMessage.includes("book a ticket")) {
        console.log("✅ User selected 'Book a Ticket'!");
        const museums = await Museum.find({}, "name");

        if (!museums.length) {
          response.message = "Sorry, no museums are available for booking at the moment.";
        } else {
          response.message = "Great! Which museum would you like to visit?";
          response.options = museums.map(m => m.name);
          session.step = "select_museum";
        }
      } 

      else if (normalizedMessage.includes("check my tickets")) {
        console.log("✅ User selected 'Check My Tickets'");
        const token = req.headers.authorization;

        if (!token) {
          response.message = "⚠️ You need to log in to check your tickets.";
        } else {
          try {
            const ticketResponse = await axios.get("http://localhost:5000/api/tickets/my-tickets", {
              headers: { Authorization: token },
            });

            const tickets = ticketResponse.data;
            if (tickets.length === 0) {
              response.message = "📭 You haven't booked any tickets yet!";
            } else {
              let replyMessage = "🎟️ *Your Booked Tickets:*\n\n";
              tickets.forEach((ticket, index) => {
                replyMessage += `🔹 *${index + 1}*\n`;
                replyMessage += `🏛️ *Museum:* ${ticket.museumName}\n`;
                replyMessage += `📅 *Date:* ${new Date(ticket.date).toLocaleDateString()}\n`;
                replyMessage += `💲 *Price:* ₹${ticket.price}\n`;
                replyMessage += `🟢 *Status:* ${ticket.status}\n`;
                replyMessage += "------------------------\n\n";
              });

              response.message = replyMessage;
            }
          } catch (error) {
            console.error("❌ Error fetching tickets:", error);
            response.message = "⚠️ Failed to fetch your tickets. Please try again later.";
          }
        }
        session.step = "main_menu";
      } 

      // ✅ Cancel Ticket Flow
      else if (normalizedMessage.includes("cancel my ticket")) {
        console.log("🟢 Fetching user's tickets for cancellation...");
        const token = req.headers.authorization;
    
        if (!token) {
            response.message = "⚠️ You need to log in to cancel a ticket.";
        } else {
            try {
              const ticketResponse = await axios.get("http://localhost:5000/api/tickets/my-tickets", {
                headers: { Authorization: token },
            });
            
            const tickets = ticketResponse.data;
            console.log("🔍 Fetched Tickets from API:", tickets);
            
            if (tickets.length === 0) {
                response.message = "📭 You haven't booked any tickets yet!";
            } else {
                // ✅ Filter out canceled tickets
                session.tickets = tickets.filter(ticket => ticket.status !== "canceled");
            
                if (session.tickets.length === 0) {
                    response.message = "📭 You have no active tickets to cancel.";
                    session.step = "main_menu";
                } else {
                    response.message = "Which ticket would you like to cancel? Select a number:";
                    response.options = session.tickets.map((ticket, index) => 
                        `${index + 1}. ${ticket.museumName} - ${new Date(ticket.date).toLocaleDateString()}`
                    );
                    console.log("🟢 Active Tickets Stored in Session:", session.tickets);
            
                    session.step = "confirm_cancel";
                }
            }            
            } catch (error) {
                console.error("❌ Error fetching tickets:", error.response?.data || error.message);
                response.message = "⚠️ Failed to fetch your tickets. Please try again later.";
            }
        }
    }
     

      else {
        console.log("❌ Unrecognized Input, sending default response.");
        response.message = "You can ask me anything related to museum bookings!";
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
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize time for accurate comparison

      const selectedDateObj = new Date(userMessage);
      selectedDateObj.setHours(0, 0, 0, 0); // Normalize user input date

      if (isNaN(selectedDateObj)) {
        response = { message: "❌ Invalid date format. Please enter a valid date in YYYY-MM-DD format." };
      } else if (selectedDateObj < today) {
        response = { message: "⚠️ You cannot book tickets for past dates. Please enter a future date." };
      } else {
        session.selectedDate = userMessage;
        response = { 
          message: `🎫 How many tickets would you like for *${session.selectedMuseum}* on *${session.selectedDate}*?`
        };
        session.step = "select_tickets";
      }
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

        const order = await razorpay.orders.create({
          amount: amount,
          currency: currency,
          receipt: `receipt_${Date.now()}`,
        });

        response = {
          message: `Please proceed with payment.`,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID,
        };

        session.step = "verify_payment";
      } catch (error) {
        console.error("❌ Payment Processing Error:", error);
        response = { message: "Failed to process payment. Please try again later." };
      }
    }

    // ✅ Step 7: Finalize Cancellation
    else if (session.step === "confirm_cancel") {
      console.log("🔍 Available Tickets in Session:", session.tickets);
      
      const selectedIndex = parseInt(userMessage) - 1;
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= session.tickets.length) {
          response.message = "⚠️ Invalid selection. Please enter a valid ticket number.";
      } else {
          session.selectedTicket = session.tickets[selectedIndex];  // ✅ Store the selected ticket correctly
          console.log("🟢 Selected Ticket Stored in Session:", session.selectedTicket);
  
          response.message = `⚠️ Are you sure you want to cancel your ticket for *${session.selectedTicket.museumName}* on *${new Date(session.selectedTicket.date).toLocaleDateString()}*?`;
          response.options = ["Yes, cancel it ❌", "No, go back 🔙"];
          session.step = "final_cancel";
      }
  }
  
  
  else if (session.step === "final_cancel") {
    console.log("🔍 Full Session Data Before Cancellation:", session);
    
    if (normalizedMessage.includes("yes, cancel it")) {
      try {
        if (!session.selectedTicket || !session.selectedTicket._id) {
          response.message = "⚠️ Ticket selection failed. Please try again.";
          session.step = "main_menu";
          return res.json({ response, session });
        }
  
        const ticketId = session.selectedTicket._id.toString(); // Convert to string
        const token = req.headers.authorization; // Get user token
  
        console.log("🔍 Sending Ticket ID for Cancellation:", ticketId);
  
        // ✅ Call the new function to cancel the ticket
        response.message = await cancelTicketChatbot(ticketId, token);
  
        session.step = "main_menu"; // Reset session
        session.selectedTicket = null;
      } catch (error) {
        console.error("❌ Ticket cancellation failed:", error.response?.data || error.message);
        response.message = "⚠️ Failed to cancel your ticket. Please try again later.";
      }
    } 
    else if (normalizedMessage.includes("no, go back")) {
      response.message = "🔙 No problem! Returning to the main menu.";
      session.step = "main_menu"; // Reset session
    } 
    else {
      response.message = "⚠️ Please select a valid option: 'Yes, cancel it ❌' or 'No, go back 🔙'.";
    }
  }
  
          

    res.json({ response, session });
  } catch (error) {
    console.error("❌ Chatbot Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

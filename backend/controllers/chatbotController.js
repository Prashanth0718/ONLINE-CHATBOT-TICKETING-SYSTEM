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

    // ✅ Add Session Timeout Handling Here
    // ✅ Add Session Timeout Handling Here
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const TIMEOUT_WARNING = 2 * 60 * 1000; // Additional 2 minutes before reset

    if (session.lastInteraction) {
      const now = Date.now();
      const timeSinceLast = now - session.lastInteraction;

      if (timeSinceLast > SESSION_TIMEOUT + TIMEOUT_WARNING) {
        console.log("⏳ User inactive for too long. Resetting session...");
        session = {}; // Reset session completely
      } 
      else if (timeSinceLast > SESSION_TIMEOUT) {
        response.message = "⚠️ You have been inactive for a while. If you don’t respond within 2 minutes, the session will reset.";
        return res.json({ response, session });
      }
    }

    session.lastInteraction = Date.now(); // ✅ Update interaction time
 // Update last interaction time

    let response = { message: "", options: [] };
    console.log("🟢 Received Message:", userMessage);
    console.log("🔵 Current Session Step:", session.step);

    const normalizedMessage = userMessage.trim().toLowerCase();

    // ✅ Step 1: Initial Welcome
    if (!session.step || normalizedMessage.includes("restart")) {
      session = {}; // Reset session
      response.message = "Welcome! How can I assist you today?";
      response.options = [
        "Book a ticket 🎟️",
        "Check my tickets 📜",
        "Cancel my ticket ❌",
        "Ask something else ❓",
        "Restart Chat 🔄"
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
      const museums = await Museum.find({}, "name");
      const availableMuseums = museums.map(m => m.name.toLowerCase());
    
      if (!availableMuseums.includes(userMessage.toLowerCase())) {
        response.message = "⚠️ Invalid museum name. Please choose from the available options.";
        response.options = museums.map(m => m.name);
      } else {
        session.selectedMuseum = userMessage;
        response.message = "📅 Please enter the date you want to visit (YYYY-MM-DD).";
        session.step = "select_date";
      }
    }
    

    else if (session.step === "select_date") {
      const userDate = userMessage.trim();
      const selectedDate = new Date(userDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      if (isNaN(selectedDate) || userDate.length !== 10) {
        response.message = "⚠️ Invalid date format. Please enter a valid date in YYYY-MM-DD format.";
      } else if (selectedDate < today) {
        response.message = "⚠️ You cannot book tickets for past dates. Please enter a future date.";
      } else {
        session.selectedDate = userDate;
    
        try {
          console.log("🔍 Searching for museum:", session.selectedMuseum);
          const museum = await Museum.findOne({ name: session.selectedMuseum });
    
          if (!museum) {
            console.log("❌ Museum not found!");
            response.message = "⚠️ Museum not found. Please try again.";
            session.step = "main_menu";
          } else {
            console.log("✅ Found Museum:", museum);
            console.log("🔍 Museum Data Keys:", Object.keys(museum.toObject())); // Debugging
    
            // Fix: Access availableTickets properly
            const availableTickets = museum.availableTickets || museum._doc?.availableTickets;
    
            console.log("🎟️ Available Tickets:", availableTickets);
    
            if (availableTickets === undefined) {
              response.message = "⚠️ Error retrieving available tickets.";
              session.step = "main_menu";
            } else {
              session.availableTickets = availableTickets;
              response.message = `🎫 There are *${session.availableTickets}* tickets available for *${session.selectedMuseum}* on *${session.selectedDate}*. How many tickets would you like?`;
              session.step = "select_tickets";
            }
          }
        } catch (error) {
          console.error("❌ Error fetching available tickets:", error);
          response.message = "⚠️ Failed to fetch available tickets. Please try again later.";
          session.step = "main_menu";
        }
      }
    }
    




    

    // ✅ Step 5: Select Tickets
    else if (session.step === "select_tickets") {
      const ticketCount = parseInt(userMessage, 10);
    
      if (isNaN(ticketCount) || ticketCount <= 0) {
        response.message = "⚠️ Please enter a valid number of tickets (minimum 1).";
      } else if (ticketCount > 10) {
        response.message = "⚠️ You can only book up to 10 tickets at a time.";
      } else {
        session.numTickets = ticketCount;
        response = {
          message: "✅ Tickets are available! Please proceed with payment.",
          options: ["Proceed to Payment 💳"],
        };
        session.step = "payment";
      }
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

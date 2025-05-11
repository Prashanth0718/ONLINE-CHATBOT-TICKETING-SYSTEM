const axios = require("axios");
const Museum = require("../../models/Museum");
import dotenv from 'dotenv';
dotenv.config();

const handleMainMenu = async ({ req, userMessage, session, response }) => {
  const normalizedInput = userMessage.trim().toLowerCase().replace(/[^\w\s]/g, "");
  const backendURL = process.env.BACKEND_URL;
  //const normalizedInput = userMessage.toLowerCase().replace(/[^\w\s]/g, "").trim();
  console.log("Normalized Input:", normalizedInput);
  // 🏠 Go Back to Main Menu
if (
  normalizedInput.includes("go back to main menu") ||
  normalizedInput.includes("back to menu") ||
  normalizedInput.includes("main menu")
) {
  response.message = "🏠 You're back at the Main Menu! What would you like to do?";
  response.options = [
    "Book a ticket 🎟️",
    "Check my tickets 📜",
    "Cancel my ticket ❌",
    "Ask something else ❓",
    "Restart Chat 🔄"
  ];
  session.step = "main_menu";
  return;
}

  // 🔄 Handle common greetings inside main menu too
  if (["hi", "hello", "hey"].includes(normalizedInput)) {
    response.message = "🙌 Welcome back! What would you like to do?";
    response.options = [
      "Book a ticket 🎟️",
      "Check my tickets 📜",
      "Cancel my ticket ❌",
      "Ask something else ❓",
      "Restart Chat 🔄"
    ];    
    
    session.step = "main_menu";
    return;
  }

  // 🎟️ Book a Ticket
  if (normalizedInput.includes("book a ticket")) {
    const museums = await Museum.find({}, "name");
    const museumNames = museums.map(m => m.name);
    response.message = "🖼️ Great! Which museum would you like to visit?";
    response.options = museumNames;
    session.step = "select_museum";
  }

  // 📜 Check My Tickets
  else if (
    normalizedInput.includes("check my tickets") ||
    normalizedInput.includes("view my tickets") ||
    normalizedInput.includes("show my tickets") ||
    normalizedInput.includes("my tickets")
  ) {
    console.log("✅ Matched ticket check input");
    const token = req.headers.authorization;
    if (!token) {
      response.message = "⚠️ You need to log in to check your tickets.";
      session.step = "main_menu";
    } else {
      try {
        const ticketResponse = await axios.get(`${backendURL}/api/tickets/my-tickets`, {
          headers: { Authorization: token },
        });
        const tickets = ticketResponse.data;
        if (tickets.length === 0) {
          response.message = "📭 You haven't booked any tickets yet!\n\nNo worries—I'm here to help you get started. You can choose one of the options below:";
          response.options = [
            "Book a ticket 🎟️",
            "Check my tickets 📜",
            "Cancel my ticket ❌",
            "Ask something else ❓",
            "Restart Chat 🔄"
          ];
          session.step = "main_menu";
          
        } else {
          let reply = "🎟️ *Your Booked Tickets:*\n\n";
          tickets.forEach((t, i) => {
            reply += `🔹 *${i + 1}*\n🏛️ *Museum:* ${t.museumName}\n📅 *Date:* ${new Date(t.date).toLocaleDateString()}\n💲 *Price:* ₹${t.price}\n🟢 *Status:* ${t.status}\n------------------------\n\n`;
          });
          response.message = reply;
          response.options = ["Back to Menu 🔙"];
          session.step = "after_ticket_check";
        }
      } catch (error) {
        console.error("❌ Error fetching tickets:", error);
        response.message = "⚠️ Failed to fetch your tickets. Try again.";
        session.step = "main_menu";
      }
    }
  }

  // ❌ Cancel My Ticket
  else if (normalizedInput.includes("cancel my ticket")) {
    const token = req.headers.authorization;
    if (!token) {
      response.message = "⚠️ You need to log in to cancel a ticket.";
      response.options = [
        "Book a ticket 🎟️",
        "Check my tickets 📜",
        "Cancel my ticket ❌",
        "Ask something else ❓",
        "Restart Chat 🔄"
      ];
      session.step = "main_menu";
    } else {
      try {
        const ticketResponse = await axios.get(`${backendURL}/api/tickets/my-tickets`, {
          headers: { Authorization: token },
        });
        const tickets = ticketResponse.data;
        session.tickets = tickets.filter(t => t.status !== "cancelled");
        if (session.tickets.length === 0) {
          response.message = "📭 You have no active tickets to cancel!\n\nNo worries—there's still plenty you can do. Choose one of the options below:";
          response.options = [
            "Book a ticket 🎟️",
            "Check my tickets 📜",
            "Cancel my ticket ❌",
            "Ask something else ❓",
            "Restart Chat 🔄"
          ];
          session.step = "main_menu";
        } else {
          response.message = "Which ticket would you like to cancel? Select a number:";
          response.options = session.tickets.map((ticket, i) =>
            `${i + 1}. ${ticket.museumName} - ${new Date(ticket.date).toLocaleDateString()}`
          );
          session.step = "confirm_cancel";
        }
      } catch (error) {
        console.error("❌ Error fetching tickets:", error.message);
        response.message = "⚠️ Could not fetch your tickets.";
        response.options = [
          "Book a ticket 🎟️",
          "Check my tickets 📜",
          "Cancel my ticket ❌",
          "Ask something else ❓",
          "Restart Chat 🔄"
        ];
        session.step = "main_menu";
      }
    }
  }

  // ❓ Unknown Input
  else {
    console.log("❌ Unrecognized Input in Main Menu");
    response.message = "❓ I didn't understand that. Please choose an option below:";
    response.options = [
      "Book a ticket 🎟️",
      "Check my tickets 📜",
      "Cancel my ticket ❌",
      "Ask something else ❓",
      "Restart Chat 🔄"
    ];
  }
};

module.exports = handleMainMenu;

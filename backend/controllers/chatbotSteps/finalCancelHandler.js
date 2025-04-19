const cancelTicketChatbot = require("../../utils/cancelTicketChatbot");

const handleFinalCancelStep = async ({ normalizedMessage, session, response, req }) => {
  console.log("🔍 Final Cancel Session Data:", session);

  if (normalizedMessage.includes("yes cancel it")) {
    try {
      if (!session.selectedTicket || !session.selectedTicket._id) {
        response.message = "⚠️ Ticket selection failed. Please try again.";
        session.step = "main_menu";  // Reset to main menu if selection fails
        return;
      }

      const ticketId = session.selectedTicket._id.toString();
      const token = req.headers.authorization;

      console.log("🧾 Cancelling Ticket ID:", ticketId);

      // ✅ Cancel the ticket using utility function
      const cancelResponse = await cancelTicketChatbot(ticketId, token);
      console.log("✅ Cancel Response:", cancelResponse);
      // Check if the cancellation was successful
      if (typeof cancelResponse === "string" && cancelResponse.toLowerCase().includes("success")) {
        response.message = `🎟️ Your ticket for *${session.selectedTicket.museumName}* on *${new Date(session.selectedTicket.date).toLocaleDateString()}* has been cancelled successfully.\n\n🏠 You're back at the main menu. What would you like to do next?`;
        response.options = [
          "Book a ticket 🎟️",
          "Check my tickets 📜",
          "Cancel my ticket ❌",
          "Ask something else ❓",
          "Restart Chat 🔄"
        ];
      } else {
        response.message = cancelResponse || "⚠️ Failed to cancel your ticket. Please try again later.";
      }
      
      

      // Reset session after cancellation
      session.step = "main_menu";
      session.selectedTicket = null;
    } catch (error) {
      console.error("❌ Ticket cancellation failed:", error.response?.data || error.message);
      response.message = "⚠️ Failed to cancel your ticket. Please try again later.";
    }
  }

  // Handle "No, go back"
  else if (normalizedMessage.includes("no go back")) {
    response.message = "🔙 No problem! Returning to the main menu.";
    response.options = [
      "Book a ticket 🎟️",
      "Check my tickets 📜",
      "Cancel my ticket ❌",
      "Ask something else ❓",
      "Restart Chat 🔄"
    ];
    session.step = "main_menu";
    session.selectedTicket = null;  // Optional: clear the selected ticket when going back
  }

  // Handle invalid responses
  else {
    response.message = "⚠️ Please select a valid option: 'Yes, cancel it ❌' or 'No, go back 🔙'.";
    response.options = ["Yes, cancel it ❌", "No, go back 🔙"]; // Show options again for invalid input
  }
};

module.exports = handleFinalCancelStep;

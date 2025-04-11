const cancelTicketChatbot = require("../../utils/cancelTicketChatbot");

const handleFinalCancelStep = async ({ userMessage, normalizedMessage, session, response, req }) => {
  console.log("🔍 Final Cancel Session Data:", session);

  if (normalizedMessage.includes("yes, cancel it")) {
    try {
      if (!session.selectedTicket || !session.selectedTicket._id) {
        response.message = "⚠️ Ticket selection failed. Please try again.";
        session.step = "main_menu";
        return;
      }

      const ticketId = session.selectedTicket._id.toString();
      const token = req.headers.authorization;

      console.log("🧾 Cancelling Ticket ID:", ticketId);

      // ✅ Cancel the ticket using utility function
      response.message = await cancelTicketChatbot(ticketId, token);

      // Reset session
      session.step = "main_menu";
      session.selectedTicket = null;
    } catch (error) {
      console.error("❌ Ticket cancellation failed:", error.response?.data || error.message);
      response.message = "⚠️ Failed to cancel your ticket. Please try again later.";
    }
  } else if (normalizedMessage.includes("no, go back")) {
    response.message = "🔙 No problem! Returning to the main menu.";
    session.step = "main_menu";
  } else {
    response.message = "⚠️ Please select a valid option: 'Yes, cancel it ❌' or 'No, go back 🔙'.";
  }
};

module.exports = handleFinalCancelStep;

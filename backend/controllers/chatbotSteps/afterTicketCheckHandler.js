// controllers/chatbotSteps/afterTicketCheckHandler.js

const handleAfterTicketCheck = async ({ session, response }) => {
    response.message = "You can ask me anything related to museum bookings!";
    response.options = [
      "Book a ticket 🎟️",
      "Cancel my ticket ❌",
      "Restart Chat 🔄"
    ];
    session.step = "main_menu";
  };
  
  module.exports = handleAfterTicketCheck;
  
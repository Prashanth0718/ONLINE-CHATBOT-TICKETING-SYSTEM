

const handleConfirmCancelStep = async ({ userMessage, session, response }) => {
    const selectedIndex = parseInt(userMessage) - 1;
  
    if (
      isNaN(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex >= session.tickets.length
    ) {
      response.message = "⚠️ Invalid selection. Please enter a valid ticket number.";
    } else {
      session.selectedTicket = session.tickets[selectedIndex]; // ✅ Store the selected ticket
      console.log("🟢 Selected Ticket Stored in Session:", session.selectedTicket);
  
      response.message = `⚠️ Are you sure you want to cancel your ticket for *${session.selectedTicket.museumName}* on *${new Date(session.selectedTicket.date).toLocaleDateString()}*?`;
      response.options = ["Yes, cancel it ❌", "No, go back 🔙"];
      session.step = "final_cancel";
    }
  };
  
  module.exports = handleConfirmCancelStep;
  
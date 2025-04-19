const handleConfirmCancelStep = async ({ userMessage, session, response }) => {
  const normalizedInput = userMessage.trim();

  // Check if the input is a valid number corresponding to a ticket
  const selectedIndex = parseInt(normalizedInput) - 1;

  // If the selection is invalid (either NaN or out of range)
  if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= session.tickets.length) {
    // Invalid ticket selection
    response.message = "⚠️ Invalid selection. Please enter a valid ticket number.";
    
    // Re-show the list of available tickets
    response.options = session.tickets.map(
      (ticket, i) => `${i + 1}. ${ticket.museumName} - ${new Date(ticket.date).toLocaleDateString()}`
    );
  } else {
    // Valid selection: store the selected ticket
    session.selectedTicket = session.tickets[selectedIndex];
    console.log("🟢 Selected Ticket Stored in Session:", session.selectedTicket);

    // Ask for confirmation to cancel the ticket
    response.message = `⚠️ Are you sure you want to cancel your ticket for *${session.selectedTicket.museumName}* on *${new Date(session.selectedTicket.date).toLocaleDateString()}*?`;
    response.options = ["Yes, cancel it ❌", "No, go back 🔙"];

    // Proceed to the confirmation step
    session.step = "final_cancel";
  }

  return response; // Ensure response is returned after processing
};

module.exports = handleConfirmCancelStep;

const handleSelectTickets = ({ userMessage, session, response }) => {
  const ticketCount = parseInt(userMessage.trim(), 10);

  if (isNaN(ticketCount) || ticketCount <= 0) {
    response.message = "⚠️ Please enter a valid number of tickets (minimum 1).";
    return;
  }

  // Maximum booking limit (customize as needed)
  if (ticketCount > 10) {
    response.message = "⚠️ You can only book up to 10 tickets at a time.";
    return;
  }

  // Check against available tickets
  const available = session.availableTickets || 0;
  if (ticketCount > available) {
    response.message = `🚫 Only *${available}* tickets are available for that date.\nPlease enter a lower number.`;
    return;
  }

  // Set session values
  session.numTickets = ticketCount;

  const ticketPrice = session.selectedTicketPrice || 0;
  const totalPrice = ticketCount * ticketPrice;
  session.totalPrice = totalPrice;

  response.message =
    `✅ You've selected *${ticketCount}* ticket(s) for *${session.selectedMuseum}* on *${session.selectedDate}*.\n\n` +
    `💵 *Price per Ticket:* ₹${ticketPrice}\n` +
    `🧾 *Total Price:* ₹${totalPrice}\n\n` +
    `Would you like to proceed to payment?`;

  response.options = ["Proceed to Payment 💳"];
  session.step = "payment";
};

module.exports = handleSelectTickets;

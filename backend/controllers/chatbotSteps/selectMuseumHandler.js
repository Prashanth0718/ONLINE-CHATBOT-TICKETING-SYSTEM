const Museum = require("../../models/Museum");

const handleSelectMuseum = async ({ userMessage, session, response }) => {
  const selectedMuseum = userMessage.trim().toLowerCase();

  try {
    const museums = await Museum.find({}, "name location ticketPrice");

    const matchedMuseum = museums.find(
      m => m.name.trim().toLowerCase() === selectedMuseum
    );

    if (!matchedMuseum) {
      response.message = "⚠️ Museum not found. Please select a valid museum from the list below:";

      // Enhanced options view
      response.options = museums.map(museum =>
        `🏛️ ${museum.name.trim()} - 📍 ${museum.location} - 💵 ₹${museum.ticketPrice}`
      );

      session.step = "select_museum";
      return;
    }

    // Save selection to session
    session.selectedMuseum = matchedMuseum.name.trim();
    session.selectedMuseumId = matchedMuseum._id;
    session.selectedTicketPrice = matchedMuseum.ticketPrice; // 🧾 Save ticket price to session

    // 🧠 Clean and professional response
    response.message =
      `✅ You've selected *${matchedMuseum.name.trim()}*!\n\n` +
      `📌 *Museum Details:*\n` +
      `📍 Location: ${matchedMuseum.location}\n` +
      `💵 Ticket Price: ₹${matchedMuseum.ticketPrice}\n\n` +
      `📅 Please enter the date you'd like to visit (in *YYYY-MM-DD* format).`;

    session.step = "select_date";
  } catch (error) {
    console.error("❌ Error during museum selection:", error.message);
    response.message = "⚠️ Something went wrong while selecting the museum. Please try again.";
    session.step = "main_menu";
  }
};

module.exports = handleSelectMuseum;

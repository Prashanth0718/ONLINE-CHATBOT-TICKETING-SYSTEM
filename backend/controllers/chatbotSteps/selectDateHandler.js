const Museum = require("../../models/Museum");

const handleSelectDate = async (userMessage, session, response) => {
  const userDate = typeof userMessage === "string" ? userMessage.trim() : "";
  const selectedDate = new Date(userDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ⛔ Invalid date format
  if (isNaN(selectedDate) || userDate.length !== 10) {
    response.message = "📅 *Invalid date format.*\nPlease enter the date in *YYYY-MM-DD* format (e.g., 2025-04-12).";
    return { session, response };
  }

  // ⛔ Date is in the past
  if (selectedDate < today) {
    response.message = "⛔ You cannot book tickets for past dates.\nPlease enter a *future* date in YYYY-MM-DD format.";
    return { session, response };
  }

  // ✅ Save valid date to session
  session.selectedDate = userDate;

  try {
    const museum = await Museum.findOne({ name: session.selectedMuseum });

    if (!museum) {
      response.message = "⚠️ Museum not found. Returning to main menu.";
      session.step = "main_menu";
      return { session, response };
    }

    // 📊 Check or initialize daily stats
    let stats = museum.dailyStats.find(stat => stat.date === userDate);

    if (!stats) {
      stats = {
        date: userDate,
        availableTickets: museum.availableTickets,
        bookedTickets: 0,
      };
      museum.dailyStats.push(stats);
      await museum.save();
    }

    session.availableTickets = stats.availableTickets;

    response.message =
      `📅 You've selected *${userDate}* to visit *${session.selectedMuseum}*.\n\n` +
      `🎫 *Available Tickets:* ${stats.availableTickets}\n\n` +
      `👉 How many tickets would you like to book?`;

    session.step = "select_tickets";
  } catch (error) {
    console.error("❌ Error in handleSelectDate:", error);
    response.message = "⚠️ Failed to fetch ticket availability. Please try again later.";
    session.step = "main_menu";
  }

  return { session, response };
};

module.exports = handleSelectDate;

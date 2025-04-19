const goToMainMenu = require("./goToMainMenu");

const handlePostInfoSuggestions = async ({ userMessage, session, response }) => {
  const input = userMessage.trim().toLowerCase();

  if (["1", "main menu"].includes(input)) {
    return goToMainMenu({ session, response });
  }

  if (["2", "ask another question", "question"].includes(input)) {
    session.step = "ask_something_else";
    session.awaitingCustomQuestion = true;
    response.message = "💬 Sure! Please type your question.";
    return;
  }

  if (["3", "cancel", "cancel ticket"].includes(input)) {
    session.step = "cancel_ticket";
    response.message = "🎫 Let's cancel a ticket. Fetching your tickets...";
    return;
  }

  if (["4", "book", "book ticket"].includes(input)) {
    session.step = "select_museum";
    response.message = "🖼️ Please choose a museum to book tickets.";
    return;
  }

  response.message = "❓ Please choose a valid option from 1 to 4.";
};

module.exports = handlePostInfoSuggestions;

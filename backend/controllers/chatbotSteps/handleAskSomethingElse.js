const { askGemini } = require("../../utils/gemini");

const handleAskSomethingElse = async ({ userMessage, session, response }) => {
  if (!session.awaitingCustomQuestion) {
    session.step = "ask_something_else";
    session.awaitingCustomQuestion = true;
    response.message = "💬 Sure! Please type your question.";
    return;
  }

  if (
    userMessage.toLowerCase().includes("ask another question") ||
    userMessage.toLowerCase().includes("go back to main menu")
  ) {
    response.message = "💬 Please type your actual question.";
    return;
  }

  try {
    const answer = await askGemini(userMessage);
    response.message = `🤖 ${answer}`;
    session.step = "post_info_suggestions";
    session.awaitingCustomQuestion = false;
    response.options = ["❓ Ask another question", "🏠 Go back to Main Menu"];
  } catch (error) {
    console.error("❌ Error in custom question flow:", error.message || error);
    response.message = "⚠️ Sorry, I couldn't get an answer for that. Please try again.";
    session.step = "post_info_suggestions";
    session.awaitingCustomQuestion = false;
  }
};


module.exports = handleAskSomethingElse;

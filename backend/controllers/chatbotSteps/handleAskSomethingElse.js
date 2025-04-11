const { askGemini } = require("../../utils/gemini");

const handleAskSomethingElse = async ({ userMessage, session, response }) => {
  if (!session.awaitingCustomQuestion) {
    session.step = "ask_something_else";
    session.awaitingCustomQuestion = true;
    response.message = "💬 Sure! Please type your question.";
    return;
  }

  try {
    const answer = await askGemini(userMessage);
    response.message = `🤖 ${answer}`;
    session.step = "main_menu";
    session.awaitingCustomQuestion = false;
  } catch (error) {
    console.error("❌ Error in custom question flow:", error.message || error);
    response.message = "⚠️ Sorry, I couldn't get an answer for that. Please try again.";
    session.step = "main_menu";
    session.awaitingCustomQuestion = false;
  }
};

module.exports = handleAskSomethingElse;

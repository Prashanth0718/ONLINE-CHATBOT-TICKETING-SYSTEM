//const { askGemini } = require("../../utils/gemini");
const Analytics = require("../../models/Analytics"); // ✅ Import Analytics model
const { askOpenRouter } = require("../../utils/askOpenRouter"); // ✅ Import OpenRouter function
const updateChatbotQueries = async () => {
  // Find current analytics
  let analytics = await Analytics.findOne();
  if (!analytics) {
    analytics = new Analytics({
      totalBookings: 0,
      ticketBookings: 0,
      totalRevenue: 0,
      chatbotQueries: 0,
      museumBookings: {},
      dailyChatbotQueries: []
    });
  }

  // Increment total chatbot queries
  analytics.chatbotQueries += 1;

  // Get today's date (formatted as YYYY-MM-DD)
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  // Check if there's an existing daily entry for today
  const existingDailyQuery = analytics.dailyChatbotQueries.find(
    entry => entry.date.toISOString().split('T')[0] === todayString
  );

  if (existingDailyQuery) {
    // If today's entry exists, increment the count
    existingDailyQuery.count += 1;
  } else {
    // Otherwise, create a new entry for today
    analytics.dailyChatbotQueries.push({ date: today, count: 1 });
  }

  // Save the updated analytics data
  await analytics.save();

  console.log("✅ Chatbot Queries updated!");
};

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

  // try {
  //   const answer = await askGemini(userMessage);
  //   response.message = `🤖 ${answer}`;
  //   session.step = "post_info_suggestions";
  //   session.awaitingCustomQuestion = false;
  //   response.options = ["❓ Ask another question", "🏠 Go back to Main Menu"];
    
  //   // Call the function to increment chatbot queries after processing the user's message
  //   await updateChatbotQueries();

  // } catch (error) {
  //   console.error("❌ Error in custom question flow:", error.message || error);
  //   response.message = "⚠️ Sorry, I couldn't get an answer for that. Please try again.";
  //   response.options = ["❓ Ask another question", "🏠 Go back to Main Menu"];
  //   session.step = "post_info_suggestions";
  //   session.awaitingCustomQuestion = false;
  // }


  try {
    const answer = await askOpenRouter(userMessage);
    response.message = `🤖 ${answer}`;
    session.step = "post_info_suggestions";
    session.awaitingCustomQuestion = false;
    response.options = ["❓ Ask another question", "🏠 Go back to Main Menu"];
    await updateChatbotQueries();
  } catch (error) {
    console.error("❌ Error in custom question flow:", error.message || error);
    response.message = "⚠️ Sorry, I couldn't get an answer for that. Please try again.";
    response.options = ["❓ Ask another question", "🏠 Go back to Main Menu"];
    session.step = "post_info_suggestions";
    session.awaitingCustomQuestion = false;
  }

};


module.exports = handleAskSomethingElse;

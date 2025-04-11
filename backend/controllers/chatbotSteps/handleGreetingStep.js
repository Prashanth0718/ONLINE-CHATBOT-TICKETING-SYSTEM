module.exports = async function handleGreetingStep({ userMessage, normalizedMessage, session, response }) {
  if (!session.step || session.step === "awaiting_greeting") {
    console.log("🟡 Greeting Step Triggered:", normalizedMessage);

    if (normalizedMessage === "hi") {
      session.step = "main_menu";
      response.message = "🙌 Great! What would you like to do today?";
      response.options = [
        "Book a ticket 🎟️",
        "Check my tickets 📜",
        "Cancel my ticket ❌",
        "Ask something else ❓",
        "Restart Chat 🔄"
      ];
    } else {
      session.step = "awaiting_greeting";
      response.message = "🤖 Please type *Hi* to begin the conversation.";
    }
    return true; // ✅ Step handled
  }
  return false; // ⛔ Not handled, continue with next step
};

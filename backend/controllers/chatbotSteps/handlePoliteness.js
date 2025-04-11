// controllers/chatbotSteps/handlePoliteness.js

const politeMatch = /^(thanks|thank you|thanku|ok|okay|got it)$/i;

const handlePoliteness = (userMessage) => {
  if (politeMatch.test(userMessage.trim())) {
    return {
      message: "😊 You're welcome! What would you like to do next?",
      options: [
        "Book a ticket 🎟️",
        "Check my tickets 📜",
        "Cancel my ticket ❌",
        "Ask something else ❓",
        "Restart Chat 🔄"
      ]
    };
  }
  return null; // Not a polite message
};

module.exports = handlePoliteness;

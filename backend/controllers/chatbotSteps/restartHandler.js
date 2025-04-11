module.exports = async ({ userMessage, session, response }) => {
    session = {};
    session.step = "awaiting_greeting";
    response.message = "🔄 Chat restarted. Please type *Hi* to begin.";
    return { session, response };
  };
  
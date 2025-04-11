const axios = require("axios");
const handleMainMenu = require("./chatbotSteps/mainMenuHandler");
const handleSelectMuseum = require("./chatbotSteps/selectMuseumHandler");
const handleSelectDate = require("./chatbotSteps/selectDateHandler");
const handleSelectTickets = require("./chatbotSteps/selectTicketsHandler");
const handlePaymentStep = require("./chatbotSteps/paymentHandler");
const handleConfirmCancelStep = require("./chatbotSteps/confirmCancelHandler");
const handleFinalCancelStep = require("./chatbotSteps/finalCancelHandler");
const handleAfterTicketCheck = require("./chatbotSteps/afterTicketCheckHandler");
const handleAskSomethingElse = require("./chatbotSteps/handleAskSomethingElse");
const handlePoliteness = require("./chatbotSteps/handlePoliteness");
const handleGreetingStep = require("./chatbotSteps/handleGreetingStep");
const handleRestart = require("./chatbotSteps/restartHandler");

exports.chatbotHandler = async (req, res) => {
  console.log("🟢 Raw userMessage:", JSON.stringify(req.body));

  try {
    let userMessage = req.body.userMessage || req.body.message;
    // 1. Handle polite responses (thanks, ok, etc.)
    const politeResponse = handlePoliteness(userMessage);
    if (politeResponse) {
      return res.json(politeResponse);
    }
    let session = req.body.session || {};

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ message: "❌ 'userMessage' is required in request body." });
    }
    
    if (!session) session = {};

    // ✅ Add Session Timeout Handling Here
    const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
    const TIMEOUT_WARNING = 2 * 60 * 1000; // Additional 2 minutes before reset

    if (session.lastInteraction) {
      const now = Date.now();
      const timeSinceLast = now - session.lastInteraction;

      if (timeSinceLast > SESSION_TIMEOUT + TIMEOUT_WARNING) {
        console.log("⏳ User inactive for too long. Resetting session...");
        session = {}; // Reset session completely
      } 
      else if (timeSinceLast > SESSION_TIMEOUT) {
        response.message = "⚠️ You have been inactive for a while. If you don’t respond within 2 minutes, the session will reset.";
        return res.json({ response, session });
      }
    }

    session.lastInteraction = Date.now(); // ✅ Update interaction time
 // Update last interaction time

      let response = { message: "", options: [] };
      console.log("🟢 Received Message:", userMessage);
      console.log("🔵 Current Session Step:", session.step);

       const normalizedMessage = userMessage.trim().toLowerCase();
       console.log("Normalized Input:", normalizedMessage);
      // const greetingResult = handleGreetingStep({ userMessage, normalizedMessage, session, response });
      // if (greetingResult?.end) {
      //   return res.json({ session: greetingResult.session, response: greetingResult.response });
      // }
      
      const greetingHandled = await handleGreetingStep({ userMessage, normalizedMessage, session, response });
      if (greetingHandled) return res.json({ response, session });

      
      else if (normalizedMessage.includes("restart")) {
        const result = await handleRestart({ userMessage, session, response });
        return res.json(result);
      }
      
        // ✅ Step: Ask Something Else (Freeform Q&A)
      else if (userMessage.toLowerCase().includes("ask something else") || session.step === "ask_something_else") {
        await handleAskSomethingElse({ userMessage, session, response });
      }

      // ✅ Step 2: Main Menu    
      else if (session.step === "main_menu") {
        await handleMainMenu({ req, userMessage, session, response });
      }

    // ✅ Step 3: Select Museum
    else if (session.step === "select_museum") {
      await handleSelectMuseum({ userMessage, session, response });
    }

    // ✅ Step 4: Select Date
    else if (session.step === "select_date") {
      const result = await handleSelectDate(userMessage, session, response);
    }

    // ✅ Step 5: Select Tickets
    else if (session.step === "select_tickets") {
      handleSelectTickets({ userMessage, session, response });
    }
    
    // ✅ Step 6: Payment Process
    else if (session.step === "payment") {
      await handlePaymentStep({ userMessage, session, response });
    }

    // ✅ Step 7: Finalize Cancellation
    else if (session.step === "confirm_cancel") {
      await handleConfirmCancelStep({ userMessage, session, response });
    }
  
    // ✅ Step 8: Final Cancel Confirmation
    else if (session.step === "final_cancel") {
      await handleFinalCancelStep({ userMessage, normalizedMessage, session, response, req });
    }
  
    // ✅ Step 9: After Ticket Check
    else if (session.step === "after_ticket_check") {
      await handleAfterTicketCheck({ session, response });
    }
    res.json({ response, session });
  } catch (error) {
    console.error("❌ Chatbot Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

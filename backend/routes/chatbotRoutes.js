const express = require("express");
const { chatbotHandler } = require("../controllers/chatbotController");
const router = express.Router();

// ✅ Middleware for basic rate limiting (optional)
const rateLimit = require("express-rate-limit");
const chatbotLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // Limit each IP to 10 chatbot requests per minute
    message: { message: "⚠ Too many requests, please try again later." }
});

// ✅ Chatbot Route
router.post("/", chatbotLimiter, async (req, res) => {
    try {
        console.log("💬 Chatbot query received:", req.body);

        await chatbotHandler(req, res);

    } catch (error) {
        console.error("❌ Chatbot processing error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

module.exports = router;

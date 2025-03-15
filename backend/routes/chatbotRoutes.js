const express = require("express");
const { chatbotHandler } = require("../controllers/chatbotController");
const router = express.Router();

router.post("/", chatbotHandler); 

module.exports = router;

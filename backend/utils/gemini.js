const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // ✅ No need to prefix with "models/"

const askGemini = async (prompt) => {
  try {
    console.log("🚀 Sending prompt to Gemini:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message || error);
    throw error;
  }
};

module.exports = { askGemini };

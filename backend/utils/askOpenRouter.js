const axios = require('axios');
require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Function to query OpenRouter LLaMA API
const askOpenRouter = async (prompt) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "nousresearch/deephermes-3-mistral-24b-preview:free", // ✅ Use a valid model from OpenRouter
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    return answer;
  } catch (error) {
    console.error("❌ OpenRouter API Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { askOpenRouter };

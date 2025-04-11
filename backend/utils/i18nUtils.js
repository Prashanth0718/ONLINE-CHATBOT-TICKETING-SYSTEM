const translations = {
  en: {
    defaultFallback: "🤖 I'm not sure about that, but I’ll try to improve!",
    geminiError: "⚠️ Oops! Something went wrong while getting a response. Try again later.",
  },
  hi: {
    defaultFallback: "🤖 मुझे उस बारे में निश्चित नहीं है, लेकिन मैं सुधारने की कोशिश करूंगा!",
    geminiError: "⚠️ कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।",
  },
  // Add other languages...
};

const getLocalizedText = (key, lang = "en") => {
  return translations[lang]?.[key] || translations.en[key];
};

module.exports = { getLocalizedText };

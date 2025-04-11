// utils/getLocalizedText.js
const translations = {
    greeting: {
      success: {
        en: "🙌 Great! What would you like to do today?",
        hi: "🙌 शानदार! आप आज क्या करना चाहेंगे?",
        kn: "🙌 ಉತ್ತಮ! ನೀವು ಇಂದು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
        te: "🙌 గొప్పది! మీరు ఈ రోజు ఏమి చేయాలనుకుంటున్నారు?",
        ta: "🙌 சிறப்பாக! இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
      },
      ask_hi: {
        en: "🤖 Please type *Hi* to begin the conversation.",
        hi: "🤖 कृपया बातचीत शुरू करने के लिए *Hi* टाइप करें।",
        kn: "🤖 ದಯವಿಟ್ಟು ಸಂಭಾಷನೆ ಆರಂಭಿಸಲು *Hi* ಅನ್ನು ಟೈಪ್ ಮಾಡಿ.",
        te: "🤖 దయచేసి సంభాషణ ప్రారంభించడానికి *Hi* టైప్ చేయండి.",
        ta: "🤖 உரையாடலை தொடங்க *Hi* என தட்டச்சு செய்யவும்.",
      },
    },
    main_menu: {
      book: {
        en: "Book a ticket 🎟️",
        hi: "टिकट बुक करें 🎟️",
        kn: "ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ 🎟️",
        te: "టికెట్ బుక్ చేయండి 🎟️",
        ta: "டிக்கெட் பதிவு செய்யவும் 🎟️",
      },
      check: {
        en: "Check my tickets 📜",
        hi: "मेरे टिकट देखें 📜",
        kn: "ನನ್ನ ಟಿಕೆಟ್ ಪರಿಶೀಲಿಸಿ 📜",
        te: "నా టిక్కెట్లు పరిశీలించండి 📜",
        ta: "எனது டிக்கெட்டுகளை சரிபார்க்கவும் 📜",
      },
      cancel: {
        en: "Cancel my ticket ❌",
        hi: "मेरा टिकट रद्द करें ❌",
        kn: "ನನ್ನ ಟಿಕೆಟ್ ರದ್ದುಮಾಡಿ ❌",
        te: "నా టిక్కెట్ రద్దు చేయండి ❌",
        ta: "எனது டிக்கெட்டை ரத்து செய்யவும் ❌",
      },
      ask: {
        en: "Ask something else ❓",
        hi: "कुछ और पूछें ❓",
        kn: "ಬೇರೆ ಏನಾದರೂ ಕೇಳಿ ❓",
        te: "ఇంకా ఏదైనా అడగండి ❓",
        ta: "வேறு ஏதேனும் கேளுங்கள் ❓",
      },
      restart: {
        en: "Restart Chat 🔄",
        hi: "चैट फिर से शुरू करें 🔄",
        kn: "ಚಾಟ್ ಮರುಪ್ರಾರಂಭಿಸಿ 🔄",
        te: "చాట్‌ను రీస్టార్ట్ చేయండి 🔄",
        ta: "அரட்டையை மறுதொடக்கம் செய்யவும் 🔄",
      },
    },
  };
  
  function getLocalizedText(path, language = "en") {
    const keys = path.split(".");
    let value = translations;
  
    for (const key of keys) {
      value = value[key];
      if (!value) return "🔍 Missing translation";
    }
  
    return value[language] || value["en"];
  }
  
  module.exports = getLocalizedText;
  
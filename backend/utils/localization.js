// utils/localization.js
const translations = require("./translations");

function getLocalizedText(key, language = "en") {
  return translations[language]?.[key] || translations.en[key] || key;
}

module.exports = { getLocalizedText };

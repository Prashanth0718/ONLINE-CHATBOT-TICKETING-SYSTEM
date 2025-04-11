// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationHI from "./locales/hi/translation.json";
// You can add more languages like Tamil, Kannada etc.

i18n
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass i18n to react-i18next
  .init({
    resources: {
      en: { translation: translationEN },
      hi: { translation: translationHI },
    },
    fallbackLng: "en", // use English if detected language is not available
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;

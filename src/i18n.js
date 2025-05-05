import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Import translation files
import enTranslation from "./locales/en.json";

import urTranslation from "./locales/ur.json";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: enTranslation },
      ur: { translation: urTranslation },
    },
  });

export default i18n;

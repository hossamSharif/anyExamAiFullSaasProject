import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import arCommon from './locales/ar/common.json';
import enCommon from './locales/en/common.json';

// Resources object
const resources = {
  ar: {
    common: arCommon,
  },
  en: {
    common: enCommon,
  },
};

// i18n configuration
i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'ar', // Arabic is the default fallback language
    lng: 'ar', // Set Arabic as the default language

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Set to false for React Native compatibility
    },

    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;

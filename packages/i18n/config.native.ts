import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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

// i18n configuration for React Native (Expo)
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'ar', // Arabic is the default fallback language
    lng: 'ar', // Set Arabic as the default language

    // No language detection for now - will be handled by AsyncStorage separately
    // This will be set up in Story 0.5 with proper AsyncStorage integration

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Set to false for React Native compatibility
    },

    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;

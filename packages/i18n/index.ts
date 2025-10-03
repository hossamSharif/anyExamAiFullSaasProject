// Export i18n instance
export { default as i18n } from './config';

// Export react-i18next hooks and components
export { useTranslation, Trans, Translation } from 'react-i18next';

// Export utility functions
export {
  isRTL,
  getDirection,
  changeLanguage,
  getCurrentLanguage,
  getAvailableLanguages,
} from './utils';

// Export types
export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

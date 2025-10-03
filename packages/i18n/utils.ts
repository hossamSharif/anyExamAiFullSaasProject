import i18n from './config';

/**
 * RTL languages list
 */
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/**
 * Check if the current language is RTL
 */
export const isRTL = (language?: string): boolean => {
  const lang = language || i18n.language;
  return RTL_LANGUAGES.includes(lang);
};

/**
 * Get the current text direction
 */
export const getDirection = (language?: string): 'rtl' | 'ltr' => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

/**
 * Change the app language
 */
export const changeLanguage = async (language: 'ar' | 'en'): Promise<void> => {
  await i18n.changeLanguage(language);
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

/**
 * Get available languages
 */
export const getAvailableLanguages = (): string[] => {
  return Object.keys(i18n.options.resources || {});
};

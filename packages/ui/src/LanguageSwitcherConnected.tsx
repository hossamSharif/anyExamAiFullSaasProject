'use client';

import { LanguageSwitcher, type LanguageSwitcherProps } from './LanguageSwitcher';
import { useLanguage } from '@anyexamai/api';
// @ts-ignore - i18n types
import { useTranslation } from 'react-i18next';

export type LanguageSwitcherConnectedProps = Omit<
  LanguageSwitcherProps,
  'currentLanguage' | 'onLanguageChange'
>;

/**
 * Connected Language Switcher that automatically integrates with:
 * - i18next for UI translation
 * - Supabase user metadata for persistence
 * - RTL layout changes
 *
 * Usage:
 * ```tsx
 * <LanguageSwitcherConnected variant="toggle" />
 * ```
 */
export function LanguageSwitcherConnected(props: LanguageSwitcherConnectedProps) {
  const { i18n } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleLanguageChange = async (lang: 'ar' | 'en') => {
    // Change i18n language
    await i18n.changeLanguage(lang);

    // Update user preference in database and handle RTL
    await changeLanguage(lang);
  };

  return (
    <LanguageSwitcher
      {...props}
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
    />
  );
}

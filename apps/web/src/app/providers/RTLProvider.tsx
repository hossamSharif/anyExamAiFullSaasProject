'use client';

import { useEffect } from 'react';
import i18n from '@anyexamai/i18n';

export function RTLProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize i18n for web
    if (!i18n.isInitialized) {
      i18n.init();
    }

    // Update document direction based on language
    const updateDirection = () => {
      const currentLang = i18n.language;
      const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', currentLang);
    };

    updateDirection();

    // Listen for language changes
    i18n.on('languageChanged', updateDirection);

    return () => {
      i18n.off('languageChanged', updateDirection);
    };
  }, []);

  return <>{children}</>;
}

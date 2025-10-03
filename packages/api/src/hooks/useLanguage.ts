import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { updateUserMetadata } from '../auth';
import { Platform, I18nManager } from 'react-native';

/**
 * Hook for managing user language preference
 * Integrates with Supabase user metadata and i18n
 */
export function useLanguage() {
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en'>(
    (user?.user_metadata?.preferredLanguage as 'ar' | 'en') ?? 'ar'
  );
  const [loading, setLoading] = useState(false);

  // Update local state when user changes
  useEffect(() => {
    if (user?.user_metadata?.preferredLanguage) {
      setCurrentLanguage(user.user_metadata.preferredLanguage as 'ar' | 'en');
    }
  }, [user]);

  /**
   * Change language and persist to database
   * Also handles RTL layout changes on mobile
   */
  const changeLanguage = useCallback(
    async (language: 'ar' | 'en') => {
      setLoading(true);
      try {
        // Update user metadata in database
        if (user) {
          const { error } = await updateUserMetadata({
            preferredLanguage: language,
          });

          if (error) {
            throw error;
          }
        }

        // Update local state
        setCurrentLanguage(language);

        // Handle RTL on mobile (requires app restart)
        if (Platform.OS !== 'web') {
          const shouldBeRTL = language === 'ar';
          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.forceRTL(shouldBeRTL);
            // Note: This will require an app restart to take effect
            // You might want to show a message to the user about this
          }
        } else {
          // On web, update the HTML dir attribute
          if (typeof document !== 'undefined') {
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = language;
          }
        }

        return { success: true };
      } catch (error) {
        console.error('Failed to change language:', error);
        return { success: false, error };
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    currentLanguage,
    changeLanguage,
    loading,
    isRTL: currentLanguage === 'ar',
  };
}

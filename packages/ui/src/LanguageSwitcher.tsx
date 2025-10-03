import { YStack, XStack, Button, Text } from 'tamagui';
import { useState } from 'react';

export interface LanguageSwitcherProps {
  /**
   * Current language
   */
  currentLanguage: 'ar' | 'en';
  /**
   * Callback when language changes
   */
  onLanguageChange: (language: 'ar' | 'en') => Promise<void>;
  /**
   * Variant style
   * Default: 'dropdown'
   */
  variant?: 'dropdown' | 'toggle' | 'buttons';
  /**
   * Whether to show flags/icons
   * Default: true
   */
  showIcons?: boolean;
}

/**
 * Language switcher component for Arabic/English toggle
 * Supports multiple variants and works on mobile and web
 *
 * Usage:
 * ```tsx
 * <LanguageSwitcher
 *   currentLanguage="ar"
 *   onLanguageChange={async (lang) => {
 *     await i18n.changeLanguage(lang);
 *     await updateUserLanguage(lang);
 *   }}
 * />
 * ```
 */
export function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  variant = 'dropdown',
  showIcons = true,
}: LanguageSwitcherProps) {
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLanguageChange = async (lang: 'ar' | 'en') => {
    if (lang === currentLanguage) return;

    setLoading(true);
    try {
      await onLanguageChange(lang);
      setMenuOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ] as const;

  const currentLang = languages.find((l) => l.code === currentLanguage);

  if (variant === 'toggle') {
    return (
      <XStack gap="$2" alignItems="center">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            size="sm"
            variant={currentLanguage === lang.code ? 'primary' : 'ghost'}
            onPress={() => handleLanguageChange(lang.code)}
            disabled={loading}
            paddingHorizontal="$3"
            paddingVertical="$2"
          >
            <XStack gap="$2" alignItems="center">
              {showIcons && <Text>{lang.flag}</Text>}
              <Text fontSize="$3" fontWeight="500">
                {lang.name}
              </Text>
            </XStack>
          </Button>
        ))}
      </XStack>
    );
  }

  if (variant === 'buttons') {
    return (
      <XStack gap="$3" alignItems="center">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            size="md"
            variant={currentLanguage === lang.code ? 'primary' : 'outline'}
            onPress={() => handleLanguageChange(lang.code)}
            disabled={loading}
            fullWidth
          >
            <XStack gap="$2" alignItems="center">
              {showIcons && <Text fontSize="$5">{lang.flag}</Text>}
              <Text fontSize="$4" fontWeight="500">
                {lang.name}
              </Text>
            </XStack>
          </Button>
        ))}
      </XStack>
    );
  }

  // Dropdown variant (default)
  return (
    <div style={{ position: 'relative' }}>
      <Button
        size="sm"
        variant="outline"
        onPress={() => setMenuOpen(!menuOpen)}
        disabled={loading}
      >
        <XStack gap="$2" alignItems="center">
          {showIcons && currentLang && <Text>{currentLang.flag}</Text>}
          <Text fontSize="$3" fontWeight="500">
            {currentLang?.name || 'Language'}
          </Text>
          <Text fontSize="$2">▼</Text>
        </XStack>
      </Button>

      {menuOpen && (
        <YStack
          position="absolute"
          top="100%"
          left={0}
          marginTop="$2"
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
          padding="$2"
          minWidth={150}
          gap="$2"
          zIndex={1000}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
        >
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant="ghost"
              size="sm"
              fullWidth
              justifyContent="flex-start"
              onPress={() => handleLanguageChange(lang.code)}
              backgroundColor={
                currentLanguage === lang.code ? '$backgroundHover' : 'transparent'
              }
            >
              <XStack gap="$2" alignItems="center">
                {showIcons && <Text>{lang.flag}</Text>}
                <Text fontSize="$3" fontWeight="500">
                  {lang.name}
                </Text>
                {currentLanguage === lang.code && (
                  <Text fontSize="$3" marginLeft="auto">
                    ✓
                  </Text>
                )}
              </XStack>
            </Button>
          ))}
        </YStack>
      )}
    </div>
  );
}

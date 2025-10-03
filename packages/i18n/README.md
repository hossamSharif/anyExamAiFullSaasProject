# @anyexamai/i18n

Internationalization package for anyExamAi with Arabic-first support.

## Features

- ✅ Arabic set as default language
- ✅ RTL (Right-to-Left) support
- ✅ Language switching (Arabic ⇄ English)
- ✅ Platform-specific configurations (Web & Mobile)
- ✅ Type-safe translation keys

## Usage

### Web (Next.js)

```tsx
import { i18n, useTranslation, isRTL } from '@anyexamai/i18n';

function MyComponent() {
  const { t } = useTranslation('common');

  return (
    <div dir={isRTL() ? 'rtl' : 'ltr'}>
      <h1>{t('welcome')}</h1>
    </div>
  );
}
```

### Mobile (Expo)

```tsx
import { useTranslation, isRTL } from '@anyexamai/i18n';
import { View, Text } from 'react-native';

function MyComponent() {
  const { t } = useTranslation('common');

  return (
    <View style={{ direction: isRTL() ? 'rtl' : 'ltr' }}>
      <Text>{t('welcome')}</Text>
    </View>
  );
}
```

## Available Functions

- `useTranslation(namespace)` - React hook to access translations
- `isRTL(language?)` - Check if current/specified language is RTL
- `getDirection(language?)` - Get text direction ('rtl' | 'ltr')
- `changeLanguage(language)` - Change app language
- `getCurrentLanguage()` - Get current language code
- `getAvailableLanguages()` - Get list of available languages

## Translation Files

Located in `packages/i18n/locales/`:
- `ar/common.json` - Arabic translations
- `en/common.json` - English translations

## Default Language

Arabic (ar) is set as the default language throughout the application.

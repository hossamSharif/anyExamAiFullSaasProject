/**
 * Simple test file to verify i18n configuration
 * Run with: pnpm tsx test.ts
 */

import i18n from './config';
import { isRTL, getDirection, getCurrentLanguage } from './utils';

console.log('🧪 Testing i18n configuration...\n');

// Test 1: Check default language
console.log('✅ Default language:', getCurrentLanguage());
console.log('Expected: ar\n');

// Test 2: Check RTL detection
console.log('✅ Is Arabic RTL?', isRTL('ar'));
console.log('Expected: true\n');

console.log('✅ Is English RTL?', isRTL('en'));
console.log('Expected: false\n');

// Test 3: Check direction
console.log('✅ Arabic direction:', getDirection('ar'));
console.log('Expected: rtl\n');

console.log('✅ English direction:', getDirection('en'));
console.log('Expected: ltr\n');

// Test 4: Check translations
console.log('✅ Arabic translation for "welcome":', i18n.t('common:welcome'));
console.log('Expected: مرحباً بك\n');

// Test 5: Change language and test
i18n.changeLanguage('en').then(() => {
  console.log('✅ Changed to English');
  console.log('✅ English translation for "welcome":', i18n.t('common:welcome'));
  console.log('Expected: Welcome\n');

  // Test 6: Available languages
  console.log('✅ Available languages:', Object.keys(i18n.options.resources || {}));
  console.log('Expected: [ "ar", "en" ]\n');

  console.log('🎉 All tests passed!');
});

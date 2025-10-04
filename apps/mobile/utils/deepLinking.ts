/**
 * Deep Linking Utilities
 *
 * Handles deep links for the mobile app
 * Primarily for subscription-related deep links after payment
 */

import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

export interface DeepLinkConfig {
  scheme: string;
  prefixes: string[];
}

export const DEEP_LINK_CONFIG: DeepLinkConfig = {
  scheme: 'anyexamai',
  prefixes: ['anyexamai://', 'https://anyexamai.com'],
};

/**
 * Parse deep link URL into route and params
 */
export function parseDeepLink(url: string): {
  path: string;
  params: Record<string, string>;
} | null {
  try {
    const parsed = Linking.parse(url);
    return {
      path: parsed.path || '',
      params: parsed.queryParams || {},
    };
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
}

/**
 * Handle subscription success deep link
 */
export async function handleSubscriptionSuccess(
  onSuccess?: () => void,
  onRefresh?: () => Promise<void>
) {
  try {
    // Refresh subscription status from database
    if (onRefresh) {
      await onRefresh();
    }

    // Show success message
    Alert.alert(
      'تم الاشتراك بنجاح! 🎉',
      'شكراً لاشتراكك في النسخة الاحترافية. يمكنك الآن الاستمتاع بجميع الميزات المتقدمة.',
      [
        {
          text: 'حسناً',
          onPress: onSuccess,
        },
      ]
    );
  } catch (error) {
    console.error('Error handling subscription success:', error);
    Alert.alert(
      'خطأ',
      'حدث خطأ أثناء تحديث الاشتراك. يرجى إعادة المحاولة.',
      [{ text: 'حسناً' }]
    );
  }
}

/**
 * Handle subscription cancellation deep link
 */
export function handleSubscriptionCancel(onCancel?: () => void) {
  Alert.alert(
    'تم إلغاء الدفع',
    'لم يتم إتمام عملية الدفع. يمكنك المحاولة مرة أخرى في أي وقت.',
    [
      {
        text: 'حسناً',
        onPress: onCancel,
      },
    ]
  );
}

/**
 * Initialize deep link listener
 */
export function initializeDeepLinking(
  onSubscriptionSuccess?: () => void,
  onRefreshSubscription?: () => Promise<void>,
  onSubscriptionCancel?: () => void
) {
  // Handle initial deep link (when app is opened via deep link)
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleDeepLinkURL(
        url,
        onSubscriptionSuccess,
        onRefreshSubscription,
        onSubscriptionCancel
      );
    }
  });

  // Handle deep links while app is running
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLinkURL(
      url,
      onSubscriptionSuccess,
      onRefreshSubscription,
      onSubscriptionCancel
    );
  });

  return () => {
    subscription.remove();
  };
}

/**
 * Handle deep link URL routing
 */
function handleDeepLinkURL(
  url: string,
  onSubscriptionSuccess?: () => void,
  onRefreshSubscription?: () => Promise<void>,
  onSubscriptionCancel?: () => void
) {
  const parsed = parseDeepLink(url);
  if (!parsed) return;

  console.log('Deep link received:', parsed);

  switch (parsed.path) {
    case 'subscription-success':
      handleSubscriptionSuccess(onSubscriptionSuccess, onRefreshSubscription);
      break;
    case 'subscription-cancel':
    case 'pricing':
      handleSubscriptionCancel(onSubscriptionCancel);
      break;
    default:
      console.log('Unhandled deep link path:', parsed.path);
  }
}

/**
 * Create deep link URL
 */
export function createDeepLink(path: string, params?: Record<string, string>): string {
  const queryString = params
    ? '?' +
      Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
    : '';

  return `${DEEP_LINK_CONFIG.scheme}://${path}${queryString}`;
}

/**
 * Get deep link URLs for subscription flow
 */
export function getSubscriptionDeepLinks() {
  return {
    success: createDeepLink('subscription-success'),
    cancel: createDeepLink('pricing'),
  };
}

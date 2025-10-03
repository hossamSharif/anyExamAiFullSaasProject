/**
 * Stripe Configuration
 *
 * This file contains Stripe product and pricing configuration for anyExamAi.
 *
 * Products:
 * - anyExamAi Pro (احترافي): Premium subscription tier
 *
 * Pricing:
 * - 37 SAR/month (Saudi Arabian Riyal) for Middle East market
 * - $9.99/month (USD) for international markets
 */

export const STRIPE_CONFIG = {
  /**
   * Product: anyExamAi Pro
   * Arabic Name: احترافي
   * Description: Premium tier with unlimited features
   */
  products: {
    pro: {
      // Product ID from Stripe Dashboard
      // TODO: Replace with actual product ID from Stripe after creation
      productId: 'prod_anyexamai_pro',

      // Price IDs for different currencies
      prices: {
        // Saudi Arabian Riyal (primary market)
        sar: {
          priceId: 'price_pro_37_sar_monthly',
          amount: 3700, // in halalas (smallest currency unit)
          currency: 'sar',
          interval: 'month',
          displayPrice: '٣٧ ريال/شهرياً',
        },
        // USD (international fallback)
        usd: {
          priceId: 'price_pro_999_usd_monthly',
          amount: 999, // in cents
          currency: 'usd',
          interval: 'month',
          displayPrice: '$9.99/month',
        },
      },

      // Product metadata
      name: {
        ar: 'احترافي',
        en: 'Pro',
      },
      description: {
        ar: 'النسخة الاحترافية مع ميزات غير محدودة',
        en: 'Professional tier with unlimited features',
      },

      // Features included
      features: {
        ar: [
          '٥٠ امتحان شهرياً',
          '٥٠ سؤال لكل امتحان',
          'رفع المستندات (٢٠ شهرياً)',
          'جميع أنواع الامتحانات',
          'معالجة ذات أولوية',
          'تحليلات متقدمة',
        ],
        en: [
          '50 exams per month',
          '50 questions per exam',
          'Document upload (20/month)',
          'All exam types',
          'Priority processing',
          'Advanced analytics',
        ],
      },
    },
  },

  /**
   * Free Tier Configuration
   * Arabic Name: مجاني
   */
  tiers: {
    free: {
      name: {
        ar: 'مجاني',
        en: 'Free',
      },
      limits: {
        examsPerMonth: 5,
        questionsPerExam: 10,
        documentsPerMonth: 0, // No document upload on free tier
      },
      features: {
        ar: [
          '٥ امتحانات شهرياً',
          '١٠ أسئلة لكل امتحان',
          'محتوى تعليمي منسق',
          'أنواع امتحانات أساسية',
          'سرعة معالجة قياسية',
        ],
        en: [
          '5 exams per month',
          '10 questions per exam',
          'Curated educational content',
          'Basic exam types',
          'Standard processing speed',
        ],
      },
    },
    pro: {
      name: {
        ar: 'احترافي',
        en: 'Pro',
      },
      limits: {
        examsPerMonth: 50,
        questionsPerExam: 50,
        documentsPerMonth: 20,
      },
      features: {
        ar: [
          '٥٠ امتحان شهرياً',
          '٥٠ سؤال لكل امتحان',
          'رفع المستندات (٢٠ شهرياً)',
          'جميع أنواع الامتحانات',
          'معالجة ذات أولوية',
          'تحليلات متقدمة',
        ],
        en: [
          '50 exams per month',
          '50 questions per exam',
          'Document upload (20/month)',
          'All exam types',
          'Priority processing',
          'Advanced analytics',
        ],
      },
    },
  },

  /**
   * Webhook Configuration
   * Events to listen for from Stripe
   */
  webhookEvents: [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
  ],
} as const;

/**
 * Get price ID based on currency preference
 */
export function getStripePriceId(currency: 'sar' | 'usd' = 'sar'): string {
  return STRIPE_CONFIG.products.pro.prices[currency].priceId;
}

/**
 * Get display price based on currency and language
 */
export function getDisplayPrice(currency: 'sar' | 'usd' = 'sar'): string {
  return STRIPE_CONFIG.products.pro.prices[currency].displayPrice;
}

/**
 * Get tier limits
 */
export function getTierLimits(tier: 'free' | 'pro') {
  return STRIPE_CONFIG.tiers[tier].limits;
}

/**
 * Get tier features in specified language
 */
export function getTierFeatures(tier: 'free' | 'pro', language: 'ar' | 'en' = 'ar') {
  return STRIPE_CONFIG.tiers[tier].features[language];
}

/**
 * Get tier name in specified language
 */
export function getTierName(tier: 'free' | 'pro', language: 'ar' | 'en' = 'ar') {
  return STRIPE_CONFIG.tiers[tier].name[language];
}

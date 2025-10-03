/**
 * Usage Tracking Hooks
 *
 * Hooks for tracking user usage and enforcing tier limits:
 * - Track exam generation
 * - Track question creation
 * - Track document uploads
 * - Monthly reset logic
 * - Tier limit enforcement
 */

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useTranslation } from 'react-i18next';

// Import tier limits from config
const TIER_LIMITS = {
  free: {
    examsPerMonth: 5,
    questionsPerExam: 10,
    documentsPerMonth: 0,
  },
  pro: {
    examsPerMonth: 50,
    questionsPerExam: 50,
    documentsPerMonth: 20,
  },
};

export interface UsageData {
  billingCycle: string; // Format: 'YYYY-MM'
  examsGenerated: number;
  questionsCreated: number;
  documentsUploaded: number;
}

export interface UsageLimits {
  examsPerMonth: number;
  questionsPerExam: number;
  documentsPerMonth: number;
}

/**
 * Get current billing cycle in YYYY-MM format
 */
function getCurrentBillingCycle(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Hook for tracking and managing user usage
 *
 * @example
 * ```tsx
 * const { usage, limits, canGenerateExam, trackExam, loading } = useUsageTracking();
 *
 * if (canGenerateExam(10)) {
 *   // User can generate exam with 10 questions
 *   await generateExam();
 *   await trackExam(10); // Track usage
 * }
 * ```
 */
export function useUsageTracking() {
  const { t } = useTranslation();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [limits, setLimits] = useState<UsageLimits>(TIER_LIMITS.free);
  const [tier, setTier] = useState<'free' | 'pro'>('free');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch current usage and subscription tier
   */
  const fetchUsage = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get subscription tier
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', user.id)
        .single();

      if (subError && subError.code !== 'PGRST116') {
        throw subError;
      }

      const userTier = subscription?.tier || 'free';
      setTier(userTier);
      setLimits(TIER_LIMITS[userTier]);

      // Get current billing cycle
      const currentCycle = getCurrentBillingCycle();

      // Get or create usage record for current cycle
      const { data: usageData, error: usageError } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('billing_cycle', currentCycle)
        .single();

      if (usageError && usageError.code !== 'PGRST116') {
        throw usageError;
      }

      if (!usageData) {
        // Create new usage record for this cycle
        const { data: newUsage, error: createError } = await supabase
          .from('usage_tracking')
          .insert({
            user_id: user.id,
            billing_cycle: currentCycle,
            exams_generated: 0,
            questions_created: 0,
            documents_uploaded: 0,
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        setUsage({
          billingCycle: currentCycle,
          examsGenerated: 0,
          questionsCreated: 0,
          documentsUploaded: 0,
        });
      } else {
        setUsage({
          billingCycle: usageData.billing_cycle,
          examsGenerated: usageData.exams_generated,
          questionsCreated: usageData.questions_created,
          documentsUploaded: usageData.documents_uploaded,
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchUsage();
  }, []);

  /**
   * Check if user can generate an exam with specified question count
   */
  const canGenerateExam = (questionCount: number): boolean => {
    if (!usage) return false;

    // Check exam limit
    if (usage.examsGenerated >= limits.examsPerMonth) {
      return false;
    }

    // Check question count limit
    if (questionCount > limits.questionsPerExam) {
      return false;
    }

    return true;
  };

  /**
   * Check if user can upload a document
   */
  const canUploadDocument = (): boolean => {
    if (!usage) return false;

    return usage.documentsUploaded < limits.documentsPerMonth;
  };

  /**
   * Track exam generation
   */
  const trackExam = async (questionCount: number): Promise<boolean> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentCycle = getCurrentBillingCycle();

      // Increment exam and question counts
      const { error: updateError } = await supabase
        .from('usage_tracking')
        .update({
          exams_generated: (usage?.examsGenerated || 0) + 1,
          questions_created: (usage?.questionsCreated || 0) + questionCount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('billing_cycle', currentCycle);

      if (updateError) {
        throw updateError;
      }

      // Refresh usage data
      await fetchUsage();

      return true;
    } catch (err) {
      console.error('Error tracking exam:', err);
      return false;
    }
  };

  /**
   * Track document upload
   */
  const trackDocumentUpload = async (): Promise<boolean> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentCycle = getCurrentBillingCycle();

      // Increment document count
      const { error: updateError } = await supabase
        .from('usage_tracking')
        .update({
          documents_uploaded: (usage?.documentsUploaded || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('billing_cycle', currentCycle);

      if (updateError) {
        throw updateError;
      }

      // Refresh usage data
      await fetchUsage();

      return true;
    } catch (err) {
      console.error('Error tracking document upload:', err);
      return false;
    }
  };

  /**
   * Get usage limit message in current language
   */
  const getLimitMessage = (type: 'exam' | 'question' | 'document'): string => {
    switch (type) {
      case 'exam':
        return t('usage.examLimitReached', {
          limit: limits.examsPerMonth,
          defaultValue: `لقد وصلت إلى الحد الأقصى من ${limits.examsPerMonth} امتحانات شهرياً`,
        });
      case 'question':
        return t('usage.questionLimitReached', {
          limit: limits.questionsPerExam,
          defaultValue: `الحد الأقصى هو ${limits.questionsPerExam} سؤال لكل امتحان`,
        });
      case 'document':
        return t('usage.documentLimitReached', {
          limit: limits.documentsPerMonth,
          defaultValue: `لقد وصلت إلى الحد الأقصى من ${limits.documentsPerMonth} مستندات شهرياً`,
        });
      default:
        return t('usage.limitReached', {
          defaultValue: 'لقد وصلت إلى الحد الأقصى',
        });
    }
  };

  /**
   * Get remaining usage counts
   */
  const remaining = {
    exams: limits.examsPerMonth - (usage?.examsGenerated || 0),
    documents: limits.documentsPerMonth - (usage?.documentsUploaded || 0),
  };

  return {
    usage,
    limits,
    tier,
    loading,
    error,
    canGenerateExam,
    canUploadDocument,
    trackExam,
    trackDocumentUpload,
    getLimitMessage,
    remaining,
    refetch: fetchUsage,
  };
}

/**
 * Hook to check if feature is available for current tier
 *
 * @example
 * ```tsx
 * const { canAccessFeature } = useFeatureAccess();
 *
 * if (canAccessFeature('document-upload')) {
 *   // Show document upload button
 * }
 * ```
 */
export function useFeatureAccess() {
  const { tier, loading } = useUsageTracking();

  const canAccessFeature = (feature: string): boolean => {
    const proFeatures = ['document-upload', 'advanced-analytics', 'priority-support'];

    if (proFeatures.includes(feature)) {
      return tier === 'pro';
    }

    return true; // All other features available to all tiers
  };

  return {
    canAccessFeature,
    tier,
    loading,
  };
}

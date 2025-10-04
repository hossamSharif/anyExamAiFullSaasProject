/**
 * Document Picker Component (Mobile)
 *
 * Allows users to pick documents from their device
 * - Checks Pro tier before allowing upload
 * - Supports PDF, DOCX, and images
 * - Shows Arabic error messages
 */

import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import { YStack, Button, Text, Spinner } from '@anyexamai/ui';
import { useTranslation } from 'react-i18next';
import { Upload } from '@tamagui/lucide-icons';
import { useDocumentUpload, useCanUploadDocument } from '@anyexamai/api';

// File type configurations
const ALLOWED_FILE_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface DocumentPickerProps {
  onUploadSuccess?: (documentId: string) => void;
  onUploadError?: (error: string) => void;
}

export function DocumentPicker({
  onUploadSuccess,
  onUploadError,
}: DocumentPickerProps) {
  const { t } = useTranslation();
  const { uploadFile, uploading, progress } = useDocumentUpload();
  const { canUpload, reason, loading: checkingAccess } = useCanUploadDocument();

  /**
   * Handle document selection
   */
  const handlePickDocument = async () => {
    // Check if upload is available
    if (!canUpload) {
      Alert.alert(
        t('documents.uploadNotAvailable', { defaultValue: 'رفع غير متاح' }),
        reason || t('documents.proRequired', {
          defaultValue: 'رفع المستندات متاح فقط للمشتركين في النسخة الاحترافية',
        }),
        [
          {
            text: t('common.ok', { defaultValue: 'حسناً' }),
            style: 'default',
          },
        ]
      );
      return;
    }

    try {
      // Dynamically import expo-document-picker
      const DocumentPickerModule = await import('expo-document-picker');

      // Pick document
      const result = await DocumentPickerModule.getDocumentAsync({
        type: Object.values(ALLOWED_FILE_TYPES),
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];

      // Validate file size
      if (file.size && file.size > MAX_FILE_SIZE) {
        const errorMsg = t('documents.fileTooLarge', {
          defaultValue: 'حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت',
        });

        Alert.alert(
          t('documents.uploadError', { defaultValue: 'خطأ في الرفع' }),
          errorMsg,
          [{ text: t('common.ok', { defaultValue: 'حسناً' }), style: 'default' }]
        );

        if (onUploadError) {
          onUploadError(errorMsg);
        }
        return;
      }

      // Upload file
      const uploadResult = await uploadFile(
        { uri: file.uri, type: file.mimeType || 'application/octet-stream' },
        file.name,
        file.mimeType || 'application/octet-stream',
        file.size || 0
      );

      if (uploadResult) {
        // Success
        Alert.alert(
          t('documents.uploadSuccess', { defaultValue: 'تم الرفع بنجاح' }),
          t('documents.uploadSuccessMessage', {
            fileName: file.name,
            defaultValue: `تم رفع ${file.name} بنجاح. جاري المعالجة...`,
          }),
          [{ text: t('common.ok', { defaultValue: 'حسناً' }), style: 'default' }]
        );

        if (onUploadSuccess) {
          onUploadSuccess(uploadResult.id);
        }
      } else {
        // Error
        const errorMsg = t('documents.uploadFailed', {
          defaultValue: 'فشل رفع المستند. يرجى المحاولة مرة أخرى',
        });

        Alert.alert(
          t('documents.uploadError', { defaultValue: 'خطأ في الرفع' }),
          errorMsg,
          [{ text: t('common.ok', { defaultValue: 'حسناً' }), style: 'default' }]
        );

        if (onUploadError) {
          onUploadError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);

      const errorMsg =
        error instanceof Error
          ? error.message
          : t('documents.uploadFailed', {
              defaultValue: 'فشل رفع المستند. يرجى المحاولة مرة أخرى',
            });

      Alert.alert(
        t('documents.uploadError', { defaultValue: 'خطأ في الرفع' }),
        errorMsg,
        [{ text: t('common.ok', { defaultValue: 'حسناً' }), style: 'default' }]
      );

      if (onUploadError) {
        onUploadError(errorMsg);
      }
    }
  };

  return (
    <YStack gap="$3" padding="$4">
      <Button
        onPress={handlePickDocument}
        disabled={uploading || checkingAccess || !canUpload}
        icon={uploading ? <Spinner /> : <Upload />}
        size="$5"
        theme="active"
      >
        {uploading
          ? t('documents.uploading', { defaultValue: 'جار الرفع...' })
          : t('documents.selectDocument', { defaultValue: 'اختر مستنداً' })}
      </Button>

      {/* Upload progress */}
      {progress && (
        <YStack gap="$2" padding="$3" backgroundColor="$background" borderRadius="$4">
          <Text fontSize="$3" fontWeight="600">
            {progress.fileName}
          </Text>
          <Text fontSize="$2" color="$gray11">
            {progress.status === 'uploading' &&
              t('documents.uploadingStatus', {
                progress: Math.round(progress.progress),
                defaultValue: `جار الرفع... ${Math.round(progress.progress)}%`,
              })}
            {progress.status === 'processing' &&
              t('documents.processingStatus', { defaultValue: 'جار المعالجة...' })}
            {progress.status === 'completed' &&
              t('documents.completedStatus', { defaultValue: 'اكتمل!' })}
            {progress.status === 'error' &&
              t('documents.errorStatus', {
                error: progress.error,
                defaultValue: `خطأ: ${progress.error}`,
              })}
          </Text>
        </YStack>
      )}

      {/* Pro tier message for free users */}
      {!canUpload && !checkingAccess && (
        <Text fontSize="$2" color="$orange10" textAlign="center">
          {reason}
        </Text>
      )}
    </YStack>
  );
}

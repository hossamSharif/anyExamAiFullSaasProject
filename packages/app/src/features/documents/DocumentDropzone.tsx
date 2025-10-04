/**
 * Document Dropzone Component (Web)
 *
 * Drag-and-drop file upload interface for web
 * - Checks Pro tier before allowing upload
 * - Supports PDF, DOCX, and images
 * - Shows Arabic instructions and error messages
 * - RTL layout support
 */

import { useCallback } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { YStack, XStack, Text, Button, Spinner } from '@anyexamai/ui';
import { useTranslation } from 'react-i18next';
import { Upload, FileText, X } from '@tamagui/lucide-icons';
import { useDocumentUpload, useCanUploadDocument } from '@anyexamai/api';

// File type configurations
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface DocumentDropzoneProps {
  onUploadSuccess?: (documentId: string) => void;
  onUploadError?: (error: string) => void;
}

export function DocumentDropzone({
  onUploadSuccess,
  onUploadError,
}: DocumentDropzoneProps) {
  const { t } = useTranslation();
  const { uploadFile, uploading, progress } = useDocumentUpload();
  const { canUpload, reason, loading: checkingAccess } = useCanUploadDocument();

  /**
   * Handle file drop
   */
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Check if upload is available
      if (!canUpload) {
        const errorMsg =
          reason ||
          t('documents.proRequired', {
            defaultValue: 'رفع المستندات متاح فقط للمشتركين في النسخة الاحترافية',
          });

        if (onUploadError) {
          onUploadError(errorMsg);
        }

        alert(errorMsg);
        return;
      }

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        let errorMsg = t('documents.uploadFailed', {
          defaultValue: 'فشل رفع المستند. يرجى المحاولة مرة أخرى',
        });

        if (rejection.errors[0]?.code === 'file-too-large') {
          errorMsg = t('documents.fileTooLarge', {
            defaultValue: 'حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت',
          });
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          errorMsg = t('documents.invalidFileType', {
            defaultValue: 'نوع الملف غير مدعوم. يرجى رفع PDF أو DOCX أو صورة',
          });
        }

        if (onUploadError) {
          onUploadError(errorMsg);
        }

        alert(errorMsg);
        return;
      }

      // Upload first accepted file
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        try {
          const uploadResult = await uploadFile(
            file,
            file.name,
            file.type,
            file.size
          );

          if (uploadResult && onUploadSuccess) {
            onUploadSuccess(uploadResult.id);
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error
              ? error.message
              : t('documents.uploadFailed', {
                  defaultValue: 'فشل رفع المستند. يرجى المحاولة مرة أخرى',
                });

          if (onUploadError) {
            onUploadError(errorMsg);
          }
        }
      }
    },
    [canUpload, reason, uploadFile, onUploadSuccess, onUploadError, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: uploading || checkingAccess || !canUpload,
  });

  return (
    <YStack gap="$3" padding="$4" width="100%">
      {/* Dropzone area */}
      <YStack
        {...getRootProps()}
        padding="$6"
        borderWidth={2}
        borderStyle="dashed"
        borderColor={isDragActive ? '$blue10' : '$gray7'}
        borderRadius="$4"
        backgroundColor={isDragActive ? '$blue2' : '$background'}
        cursor={uploading || !canUpload ? 'not-allowed' : 'pointer'}
        opacity={uploading || !canUpload ? 0.6 : 1}
        hoverStyle={{
          borderColor: !canUpload ? '$gray7' : '$blue8',
          backgroundColor: !canUpload ? '$background' : '$blue1',
        }}
        transition="all 200ms ease"
      >
        <input {...getInputProps()} />

        <YStack alignItems="center" gap="$3">
          {uploading ? (
            <Spinner size="large" color="$blue10" />
          ) : (
            <Upload size={48} color="$gray10" />
          )}

          <YStack alignItems="center" gap="$2">
            <Text fontSize="$5" fontWeight="600" textAlign="center">
              {isDragActive
                ? t('documents.dropHere', {
                    defaultValue: 'اسحب الملف هنا...',
                  })
                : uploading
                ? t('documents.uploading', { defaultValue: 'جار الرفع...' })
                : t('documents.dragAndDrop', {
                    defaultValue: 'اسحب وأفلت المستند هنا',
                  })}
            </Text>

            {!uploading && (
              <Text fontSize="$3" color="$gray11" textAlign="center">
                {t('documents.orClickToBrowse', {
                  defaultValue: 'أو انقر للتصفح',
                })}
              </Text>
            )}
          </YStack>

          {!uploading && (
            <Text fontSize="$2" color="$gray10" textAlign="center">
              {t('documents.supportedFormats', {
                defaultValue: 'PDF، DOCX، DOC، JPG، PNG (حتى 10 ميجابايت)',
              })}
            </Text>
          )}
        </YStack>
      </YStack>

      {/* Upload progress */}
      {progress && (
        <YStack
          gap="$2"
          padding="$3"
          backgroundColor="$blue2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$blue6"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$2" alignItems="center" flex={1}>
              <FileText size={20} color="$blue10" />
              <Text fontSize="$3" fontWeight="600" numberOfLines={1} flex={1}>
                {progress.fileName}
              </Text>
            </XStack>
            {progress.status === 'completed' && (
              <Text fontSize="$2" color="$green10" fontWeight="600">
                ✓
              </Text>
            )}
            {progress.status === 'error' && (
              <X size={20} color="$red10" />
            )}
          </XStack>

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

          {/* Progress bar */}
          {progress.status === 'uploading' && (
            <YStack
              height={4}
              backgroundColor="$gray5"
              borderRadius="$2"
              overflow="hidden"
            >
              <YStack
                height="100%"
                width={`${progress.progress}%`}
                backgroundColor="$blue10"
                transition="width 200ms ease"
              />
            </YStack>
          )}
        </YStack>
      )}

      {/* Pro tier message for free users */}
      {!canUpload && !checkingAccess && (
        <YStack
          padding="$3"
          backgroundColor="$orange2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$orange6"
        >
          <Text fontSize="$2" color="$orange11" textAlign="center">
            {reason}
          </Text>
        </YStack>
      )}

      {/* Alternative button for mobile-like experience */}
      {!uploading && (
        <Button
          onPress={() => {
            const input = document.querySelector(
              'input[type="file"]'
            ) as HTMLInputElement;
            input?.click();
          }}
          disabled={uploading || checkingAccess || !canUpload}
          icon={<Upload />}
          size="$4"
          variant="outlined"
        >
          {t('documents.selectDocument', { defaultValue: 'اختر مستنداً' })}
        </Button>
      )}
    </YStack>
  );
}

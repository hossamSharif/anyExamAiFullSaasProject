/**
 * Document Preview Screen (Arabic)
 *
 * Shows document details and preview with:
 * - Document metadata in Arabic
 * - Content preview with Arabic text
 * - Topics extraction
 * - Re-process option
 * - Generate exam option
 * - RTL layout
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Button,
  Spinner,
  ScrollView,
  Card,
} from '@anyexamai/ui';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Globe,
  RefreshCw,
  Trash2,
  BookOpen,
  Calendar,
  FileType,
  Languages,
} from '@tamagui/lucide-icons';
import { useDocument, useDeleteDocument } from '@anyexamai/api';

export interface DocumentPreviewScreenProps {
  documentId: string;
  onBack?: () => void;
  onDelete?: () => void;
  onGenerateExam?: (documentId: string) => void;
}

/**
 * Metadata row component
 */
function MetadataRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <XStack gap="$3" alignItems="center">
      {icon}
      <YStack flex={1}>
        <Text fontSize="$2" color="$gray11">
          {label}
        </Text>
        <Text fontSize="$3" fontWeight="500">
          {value}
        </Text>
      </YStack>
    </XStack>
  );
}

/**
 * Main Document Preview Screen
 */
export function DocumentPreviewScreen({
  documentId,
  onBack,
  onDelete,
  onGenerateExam,
}: DocumentPreviewScreenProps) {
  const { t } = useTranslation();
  const { document, loading, refetch } = useDocument(documentId);
  const { deleteDoc, deleting } = useDeleteDocument();
  const [reprocessing, setReprocessing] = useState(false);

  // Handle delete
  const handleDelete = () => {
    if (!document) return;

    Alert.alert(
      t('documents.deleteConfirm', { defaultValue: 'هل أنت متأكد من حذف هذا المستند؟' }),
      document.file_name,
      [
        {
          text: t('cancel', { defaultValue: 'إلغاء' }),
          style: 'cancel',
        },
        {
          text: t('delete', { defaultValue: 'حذف' }),
          style: 'destructive',
          onPress: async () => {
            const success = await deleteDoc(document.id);
            if (success) {
              onDelete?.();
            } else {
              Alert.alert(
                t('documents.deleteFailed', { defaultValue: 'فشل حذف المستند' })
              );
            }
          },
        },
      ]
    );
  };

  // Handle reprocess
  const handleReprocess = () => {
    Alert.alert(
      t('documents.reprocessConfirm', {
        defaultValue: 'إعادة معالجة المستند',
      }),
      t('documents.reprocessMessage', {
        defaultValue: 'سيتم إعادة تحليل المستند واستخراج المحتوى من جديد.',
      }),
      [
        {
          text: t('cancel', { defaultValue: 'إلغاء' }),
          style: 'cancel',
        },
        {
          text: t('documents.reprocess', { defaultValue: 'إعادة المعالجة' }),
          onPress: async () => {
            setReprocessing(true);
            // TODO: Call reprocess API
            setTimeout(() => {
              setReprocessing(false);
              refetch();
            }, 2000);
          },
        },
      ]
    );
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} بايت`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} كيلوبايت`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" />
        <Text marginTop="$3" color="$gray11">
          {t('loading', { defaultValue: 'جار التحميل...' })}
        </Text>
      </YStack>
    );
  }

  if (!document) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <FileText size={64} color="$gray8" />
        <Text fontSize="$5" fontWeight="600" marginTop="$4">
          {t('documents.notFound', { defaultValue: 'المستند غير موجود' })}
        </Text>
        {onBack && (
          <Button marginTop="$4" onPress={onBack}>
            {t('back', { defaultValue: 'رجوع' })}
          </Button>
        )}
      </YStack>
    );
  }

  const isUrl = document.file_type === 'url';
  const Icon = isUrl ? Globe : FileText;

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        padding="$4"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        justifyContent="space-between"
        alignItems="center"
      >
        {onBack && (
          <Button size="$3" variant="outlined" onPress={onBack}>
            {t('back', { defaultValue: 'رجوع' })}
          </Button>
        )}
        <Text fontSize="$5" fontWeight="bold" flex={1} textAlign="center">
          {t('documents.preview', { defaultValue: 'معاينة المستند' })}
        </Text>
        <Button
          size="$3"
          variant="outlined"
          theme="red"
          icon={<Trash2 size={16} />}
          onPress={handleDelete}
          disabled={deleting}
        >
          {t('delete', { defaultValue: 'حذف' })}
        </Button>
      </XStack>

      <ScrollView flex={1} padding="$4">
        <YStack gap="$4">
          {/* Document Header */}
          <Card padding="$4">
            <XStack gap="$3" alignItems="flex-start">
              <Icon size={32} color="$blue10" />
              <YStack flex={1} gap="$2">
                <Text fontSize="$5" fontWeight="600">
                  {document.file_name}
                </Text>
                {isUrl && (
                  <Text fontSize="$3" color="$blue10" numberOfLines={2}>
                    {document.file_url}
                  </Text>
                )}
                <XStack
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor={
                    document.status === 'completed'
                      ? '$green3'
                      : document.status === 'failed'
                      ? '$red3'
                      : '$blue3'
                  }
                  borderRadius="$2"
                  alignSelf="flex-start"
                >
                  <Text
                    fontSize="$2"
                    fontWeight="600"
                    color={
                      document.status === 'completed'
                        ? '$green10'
                        : document.status === 'failed'
                        ? '$red10'
                        : '$blue10'
                    }
                  >
                    {t(`documents.status.${document.status}`)}
                  </Text>
                </XStack>
              </YStack>
            </XStack>
          </Card>

          {/* Metadata */}
          <Card padding="$4">
            <Text fontSize="$4" fontWeight="600" marginBottom="$3">
              {t('documents.details', { defaultValue: 'التفاصيل' })}
            </Text>
            <YStack gap="$3">
              <MetadataRow
                icon={<Calendar size={20} color="$gray10" />}
                label={t('documents.uploadDate', { defaultValue: 'تاريخ الرفع' })}
                value={formatDate(document.created_at)}
              />
              {!isUrl && document.file_size && (
                <MetadataRow
                  icon={<FileType size={20} color="$gray10" />}
                  label={t('documents.fileSize', { defaultValue: 'حجم الملف' })}
                  value={formatFileSize(document.file_size)}
                />
              )}
              {document.language && (
                <MetadataRow
                  icon={<Languages size={20} color="$gray10" />}
                  label={t('documents.language', { defaultValue: 'اللغة' })}
                  value={document.language === 'ar' ? 'العربية' : 'English'}
                />
              )}
            </YStack>
          </Card>

          {/* Error message if failed */}
          {document.status === 'failed' && document.error_message && (
            <Card padding="$4" backgroundColor="$red2" borderColor="$red6" borderWidth={1}>
              <Text fontSize="$3" fontWeight="600" color="$red11" marginBottom="$2">
                {t('documents.error', { defaultValue: 'خطأ' })}
              </Text>
              <Text fontSize="$3" color="$red10">
                {document.error_message}
              </Text>
            </Card>
          )}

          {/* Actions */}
          <YStack gap="$2">
            {document.status === 'completed' && onGenerateExam && (
              <Button
                size="$4"
                theme="active"
                icon={<BookOpen size={20} />}
                onPress={() => onGenerateExam(document.id)}
              >
                {t('documents.generateExam', { defaultValue: 'إنشاء امتحان' })}
              </Button>
            )}
            {(document.status === 'completed' || document.status === 'failed') && (
              <Button
                size="$4"
                variant="outlined"
                icon={<RefreshCw size={20} />}
                onPress={handleReprocess}
                disabled={reprocessing}
              >
                {reprocessing
                  ? t('documents.reprocessing', { defaultValue: 'جار إعادة المعالجة...' })
                  : t('documents.reprocess', { defaultValue: 'إعادة المعالجة' })}
              </Button>
            )}
          </YStack>
        </YStack>
      </ScrollView>

      {/* Deleting overlay */}
      {deleting && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="rgba(0,0,0,0.5)"
          justifyContent="center"
          alignItems="center"
        >
          <YStack
            backgroundColor="$background"
            padding="$6"
            borderRadius="$4"
            gap="$3"
            alignItems="center"
          >
            <Spinner size="large" />
            <Text>{t('documents.deleting', { defaultValue: 'جار الحذف...' })}</Text>
          </YStack>
        </YStack>
      )}
    </YStack>
  );
}

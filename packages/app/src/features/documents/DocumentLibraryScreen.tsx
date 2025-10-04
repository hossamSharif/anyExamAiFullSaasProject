/**
 * Document Library Screen (Arabic)
 *
 * Displays user's uploaded documents with:
 * - List view with Arabic labels
 * - Status indicators in Arabic
 * - Search and filter functionality
 * - RTL layout support
 * - Swipe actions for delete
 */

import { useState } from 'react';
import { RefreshControl, Alert } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  Spinner,
  ScrollView,
  Card,
} from '@anyexamai/ui';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Search,
  Trash2,
  Eye,
  Globe,
  Upload,
} from '@tamagui/lucide-icons';
import {
  useUserDocuments,
  useDeleteDocument,
  type Document,
} from '@anyexamai/api';

export interface DocumentLibraryScreenProps {
  onDocumentPress?: (documentId: string) => void;
  onUploadPress?: () => void;
}

/**
 * Document status badge component
 */
function DocumentStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  const statusConfig = {
    pending: { color: '$gray10', bg: '$gray3', label: t('documents.status.pending') },
    processing: { color: '$blue10', bg: '$blue3', label: t('documents.status.processing') },
    completed: { color: '$green10', bg: '$green3', label: t('documents.status.completed') },
    failed: { color: '$red10', bg: '$red3', label: t('documents.status.failed') },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <XStack
      paddingHorizontal="$2"
      paddingVertical="$1"
      backgroundColor={config.bg}
      borderRadius="$2"
    >
      <Text fontSize="$1" color={config.color} fontWeight="600">
        {config.label}
      </Text>
    </XStack>
  );
}

/**
 * Document card component
 */
function DocumentCard({
  document,
  onPress,
  onDelete,
}: {
  document: Document;
  onPress: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();

  const isUrl = document.file_type === 'url';
  const Icon = isUrl ? Globe : FileText;

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
    }).format(date);
  };

  return (
    <Card
      padding="$4"
      marginBottom="$3"
      pressStyle={{ scale: 0.98 }}
      onPress={onPress}
    >
      <YStack gap="$3">
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="flex-start">
          <XStack gap="$3" flex={1} alignItems="flex-start">
            <Icon size={24} color="$blue10" />
            <YStack flex={1} gap="$1">
              <Text fontSize="$4" fontWeight="600" numberOfLines={2}>
                {document.file_name}
              </Text>
              {isUrl && (
                <Text fontSize="$2" color="$gray11" numberOfLines={1}>
                  {document.file_url}
                </Text>
              )}
            </YStack>
          </XStack>
          <DocumentStatusBadge status={document.status} />
        </XStack>

        {/* Metadata */}
        <XStack gap="$4" flexWrap="wrap">
          {!isUrl && document.file_size && (
            <Text fontSize="$2" color="$gray11">
              {formatFileSize(document.file_size)}
            </Text>
          )}
          <Text fontSize="$2" color="$gray11">
            {formatDate(document.created_at)}
          </Text>
          {document.language && (
            <Text fontSize="$2" color="$gray11">
              {document.language === 'ar' ? 'عربي' : 'English'}
            </Text>
          )}
        </XStack>

        {/* Error message if failed */}
        {document.status === 'failed' && document.error_message && (
          <Text fontSize="$2" color="$red10">
            {document.error_message}
          </Text>
        )}

        {/* Actions */}
        <XStack gap="$2" justifyContent="flex-end">
          <Button
            size="$3"
            variant="outlined"
            icon={<Eye size={16} />}
            onPress={onPress}
          >
            {t('documents.view', { defaultValue: 'عرض' })}
          </Button>
          <Button
            size="$3"
            variant="outlined"
            theme="red"
            icon={<Trash2 size={16} />}
            onPress={onDelete}
          >
            {t('delete', { defaultValue: 'حذف' })}
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
}

/**
 * Main Document Library Screen
 */
export function DocumentLibraryScreen({
  onDocumentPress,
  onUploadPress,
}: DocumentLibraryScreenProps) {
  const { t } = useTranslation();
  const { documents, loading, refetch } = useUserDocuments();
  const { deleteDoc, deleting } = useDeleteDocument();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Filter documents based on search
  const filteredDocuments = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Handle delete
  const handleDelete = (document: Document) => {
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
              Alert.alert(
                t('documents.deleteSuccess', { defaultValue: 'تم حذف المستند بنجاح' })
              );
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
        <Text fontSize="$6" fontWeight="bold">
          {t('documents.title', { defaultValue: 'مستنداتي' })}
        </Text>
        {onUploadPress && (
          <Button
            size="$3"
            icon={<Upload size={16} />}
            onPress={onUploadPress}
          >
            {t('documents.uploadDocument', { defaultValue: 'رفع مستند' })}
          </Button>
        )}
      </XStack>

      {/* Search bar */}
      <XStack padding="$4" gap="$2">
        <Input
          flex={1}
          placeholder={t('search', { defaultValue: 'بحث' })}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />
        <Button icon={<Search size={20} />} disabled />
      </XStack>

      {/* Document list */}
      <ScrollView
        flex={1}
        padding="$4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading && !refreshing ? (
          <YStack padding="$6" alignItems="center">
            <Spinner size="large" />
            <Text marginTop="$3" color="$gray11">
              {t('loading', { defaultValue: 'جار التحميل...' })}
            </Text>
          </YStack>
        ) : filteredDocuments.length === 0 ? (
          <YStack padding="$6" alignItems="center" gap="$3">
            <FileText size={64} color="$gray8" />
            <Text fontSize="$5" fontWeight="600" textAlign="center">
              {searchQuery
                ? t('documents.noSearchResults', {
                    defaultValue: 'لا توجد نتائج للبحث',
                  })
                : t('documents.noDocuments', { defaultValue: 'لا توجد مستندات' })}
            </Text>
            {!searchQuery && (
              <Text fontSize="$3" color="$gray11" textAlign="center">
                {t('documents.noDocumentsMessage', {
                  defaultValue: 'ابدأ برفع مستنداتك الدراسية لإنشاء امتحانات مخصصة',
                })}
              </Text>
            )}
            {!searchQuery && onUploadPress && (
              <Button
                marginTop="$3"
                icon={<Upload size={20} />}
                onPress={onUploadPress}
              >
                {t('documents.uploadDocument', { defaultValue: 'رفع مستند' })}
              </Button>
            )}
          </YStack>
        ) : (
          <YStack>
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onPress={() => onDocumentPress?.(doc.id)}
                onDelete={() => handleDelete(doc)}
              />
            ))}
          </YStack>
        )}
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
            <Text>
              {t('documents.deleting', { defaultValue: 'جار الحذف...' })}
            </Text>
          </YStack>
        </YStack>
      )}
    </YStack>
  );
}

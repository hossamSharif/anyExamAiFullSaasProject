import { YStack, Spinner, Text } from 'tamagui';

export interface LoadingScreenProps {
  message?: string;
}

/**
 * Full-screen loading component with Arabic support
 * Used while checking authentication state or loading data
 */
export function LoadingScreen({ message = 'جاري التحميل...' }: LoadingScreenProps) {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      padding="$6"
      gap="$4"
    >
      <Spinner size="large" color="$blue10" />
      {message && (
        <Text
          fontFamily="$body"
          fontSize="$5"
          fontWeight="500"
          color="$gray11"
          textAlign="center"
        >
          {message}
        </Text>
      )}
    </YStack>
  );
}

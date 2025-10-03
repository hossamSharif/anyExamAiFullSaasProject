import { YStack, Heading } from '@anyexamai/ui';

export default function HistoryScreen() {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      padding="$6"
    >
      <Heading
        fontFamily="$heading"
        fontSize="$8"
        fontWeight="600"
        color="$color"
      >
        سجل الامتحانات
      </Heading>
    </YStack>
  );
}

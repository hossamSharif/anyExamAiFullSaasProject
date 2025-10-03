import { YStack, Heading } from '@anyexamai/ui';

export default function ProfileScreen() {
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
        الملف الشخصي
      </Heading>
    </YStack>
  );
}

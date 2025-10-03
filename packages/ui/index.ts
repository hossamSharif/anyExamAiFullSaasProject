// Export Tamagui configuration and provider
export { default as config } from './tamagui.config'
export { TamaguiProvider } from './provider'
export type { TamaguiProviderProps } from './provider'

// Export fonts
export { cairoFont, tajawalFont, fonts } from './fonts'

// Re-export Tamagui core primitives
export {
  Stack,
  XStack,
  YStack,
  ZStack,
  Text,
  View,
  ScrollView,
  Image,
  useTheme,
  useMedia,
  styled,
  createStyledContext,
  type StackProps,
  type TextProps,
  type ViewProps,
  type ScrollViewProps,
  type ImageProps,
  type GetProps,
} from '@tamagui/core'

// Re-export styled primitives as common components
import { styled, Stack, Text as TamaguiText } from '@tamagui/core'

// Create commonly used styled components
export const Heading = styled(TamaguiText, {
  name: 'Heading',
  fontFamily: '$heading',
  fontWeight: '700',
  color: '$color',
})

export const Paragraph = styled(TamaguiText, {
  name: 'Paragraph',
  fontFamily: '$body',
  fontWeight: '400',
  color: '$color',
  lineHeight: '$5',
})

export const Button = styled(Stack, {
  name: 'Button',
  tag: 'button',
  focusable: true,
  backgroundColor: '$primary',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderRadius: '$4',
  cursor: 'pointer',

  hoverStyle: {
    backgroundColor: '$primaryHover',
  },

  pressStyle: {
    backgroundColor: '$primaryHover',
    scale: 0.98,
  },

  focusStyle: {
    outlineWidth: 2,
    outlineColor: '$borderColorFocus',
    outlineStyle: 'solid',
  },
})

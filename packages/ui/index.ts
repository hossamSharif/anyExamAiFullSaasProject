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

// Export all UI components
// Note: Some components are exported with different names to avoid conflicts with Tamagui primitives

// Button components
export {
  Button as ButtonComponent,
  ButtonFrame,
  ButtonText,
  type ButtonProps,
} from './components/Button'

// Input components
export {
  Input,
  InputFrame,
  InputLabel,
  InputHelper,
  InputContainer,
  TextArea,
  TextAreaFrame,
  type InputProps,
  type TextAreaProps,
} from './components/Input'

// Card components
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
} from './components/Card'

// Text components
export {
  Text as TextComponent,
  H1,
  H2,
  H3,
  H4,
  Paragraph as ParagraphComponent,
  Caption,
  Label,
  Muted,
  type TextProps as TextComponentProps,
  type H1Props,
  type H2Props,
  type H3Props,
  type H4Props,
  type ParagraphProps as ParagraphComponentProps,
  type CaptionProps,
  type LabelProps,
  type MutedProps,
} from './components/Text'

// Stack components (Layout)
export {
  Stack as StackComponent,
  XStack as XStackComponent,
  YStack as YStackComponent,
  Container,
  Spacer,
  type StackProps as StackComponentProps,
  type XStackProps as XStackComponentProps,
  type YStackProps as YStackComponentProps,
  type ContainerProps,
  type SpacerProps,
} from './components/Stack'

// Loading components
export {
  Loading,
  Spinner,
  InlineSpinner,
  LoadingContainer,
  LoadingText,
  Skeleton,
  type LoadingProps,
  type SpinnerProps,
  type LoadingContainerProps,
  type LoadingTextProps,
  type SkeletonProps,
} from './components/Loading'

// Icon components
export {
  Icon,
  IconPresets,
  type IconProps,
  type IconName,
  type LucideIconName,
} from './components/Icon'

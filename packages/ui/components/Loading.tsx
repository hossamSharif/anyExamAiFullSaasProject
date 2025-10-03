import { styled, Stack, Text } from '@tamagui/core'
import type { GetProps } from '@tamagui/core'

// Spinner component using CSS animation
export const Spinner = styled(Stack, {
  name: 'Spinner',
  borderRadius: 9999,
  borderWidth: 2,
  borderColor: 'transparent',
  borderTopColor: '$primary',
  borderRightColor: '$primary',

  animation: 'spin',

  variants: {
    size: {
      sm: {
        width: 16,
        height: 16,
        borderWidth: 2,
      },
      md: {
        width: 24,
        height: 24,
        borderWidth: 2,
      },
      lg: {
        width: 32,
        height: 32,
        borderWidth: 3,
      },
      xl: {
        width: 48,
        height: 48,
        borderWidth: 3,
      },
    },

    color: {
      primary: {
        borderTopColor: '$primary',
        borderRightColor: '$primary',
      },
      secondary: {
        borderTopColor: '$secondary',
        borderRightColor: '$secondary',
      },
      white: {
        borderTopColor: '#ffffff',
        borderRightColor: '#ffffff',
      },
    },
  },

  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

// Loading container with optional text
export const LoadingContainer = styled(Stack, {
  name: 'LoadingContainer',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$3',

  // RTL support
  direction: 'inherit',

  variants: {
    fullScreen: {
      true: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '$background',
        zIndex: 999,
      },
    },

    overlay: {
      true: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      },
    },

    padding: {
      none: { padding: '$0' },
      sm: { padding: '$3' },
      md: { padding: '$4' },
      lg: { padding: '$6' },
    },
  },

  defaultVariants: {
    padding: 'md',
  },
})

// Loading text
export const LoadingText = styled(Text, {
  name: 'LoadingText',
  fontFamily: '$body',
  fontSize: 14,
  color: '$color',
  textAlign: 'center',

  // RTL support
  direction: 'inherit',

  variants: {
    size: {
      sm: {
        fontSize: 12,
      },
      md: {
        fontSize: 14,
      },
      lg: {
        fontSize: 16,
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
})

export type SpinnerProps = GetProps<typeof Spinner>
export type LoadingContainerProps = GetProps<typeof LoadingContainer>
export type LoadingTextProps = GetProps<typeof LoadingText>

// Composite Loading component
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
  overlay?: boolean
  color?: 'primary' | 'secondary' | 'white'
}

export const Loading = ({ size = 'md', text, fullScreen = false, overlay = false, color = 'primary' }: LoadingProps) => {
  return (
    <LoadingContainer fullScreen={fullScreen} overlay={overlay}>
      <Spinner size={size} color={color} />
      {text && <LoadingText size={size === 'xl' ? 'lg' : size === 'lg' ? 'md' : 'sm'}>{text}</LoadingText>}
    </LoadingContainer>
  )
}

Loading.displayName = 'Loading'

// Inline spinner for buttons
export const InlineSpinner = ({ size = 'sm', color = 'primary' }: Pick<LoadingProps, 'size' | 'color'>) => {
  return <Spinner size={size} color={color} />
}

InlineSpinner.displayName = 'InlineSpinner'

// Skeleton loader for content placeholders
export const Skeleton = styled(Stack, {
  name: 'Skeleton',
  backgroundColor: '$backgroundHover',
  borderRadius: '$2',
  overflow: 'hidden',

  animation: 'pulse',

  variants: {
    width: {
      full: { width: '100%' },
      '3/4': { width: '75%' },
      '1/2': { width: '50%' },
      '1/3': { width: '33.333%' },
      '1/4': { width: '25%' },
    },

    height: {
      text: { height: 20 },
      sm: { height: 40 },
      md: { height: 60 },
      lg: { height: 100 },
      xl: { height: 200 },
    },

    rounded: {
      true: {
        borderRadius: 9999,
      },
    },
  },

  defaultVariants: {
    width: 'full',
    height: 'md',
  },
})

export type SkeletonProps = GetProps<typeof Skeleton>

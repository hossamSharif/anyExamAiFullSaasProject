import { styled, Stack as TamaguiStack, XStack as TamaguiXStack, YStack as TamaguiYStack } from '@tamagui/core'
import type { GetProps } from '@tamagui/core'

// Base Stack - Generic container
export const Stack = styled(TamaguiStack, {
  name: 'Stack',

  // RTL support - inherits direction
  direction: 'inherit',

  variants: {
    spacing: {
      none: { gap: '$0' },
      xs: { gap: '$1' },
      sm: { gap: '$2' },
      md: { gap: '$3' },
      lg: { gap: '$4' },
      xl: { gap: '$5' },
    },

    padding: {
      none: { padding: '$0' },
      xs: { padding: '$1' },
      sm: { padding: '$2' },
      md: { padding: '$3' },
      lg: { padding: '$4' },
      xl: { padding: '$5' },
    },

    centered: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },

    fullHeight: {
      true: {
        height: '100%',
      },
    },
  },
})

// XStack - Horizontal stack (automatically flips in RTL)
export const XStack = styled(TamaguiXStack, {
  name: 'XStack',

  // RTL support - will reverse flex direction in RTL
  direction: 'inherit',
  flexDirection: 'row', // Automatically becomes 'row-reverse' in RTL

  variants: {
    spacing: {
      none: { gap: '$0' },
      xs: { gap: '$1' },
      sm: { gap: '$2' },
      md: { gap: '$3' },
      lg: { gap: '$4' },
      xl: { gap: '$5' },
    },

    padding: {
      none: { padding: '$0' },
      xs: { padding: '$1' },
      sm: { padding: '$2' },
      md: { padding: '$3' },
      lg: { padding: '$4' },
      xl: { padding: '$5' },
    },

    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },

    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },

    wrap: {
      true: {
        flexWrap: 'wrap',
      },
      false: {
        flexWrap: 'nowrap',
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },

    reversed: {
      true: {
        // Force reverse even in LTR (or un-reverse in RTL)
        flexDirection: 'row-reverse',
      },
    },
  },

  defaultVariants: {
    align: 'center',
    justify: 'start',
    wrap: false,
  },
})

// YStack - Vertical stack
export const YStack = styled(TamaguiYStack, {
  name: 'YStack',

  // RTL support - content direction inherits
  direction: 'inherit',
  flexDirection: 'column',

  variants: {
    spacing: {
      none: { gap: '$0' },
      xs: { gap: '$1' },
      sm: { gap: '$2' },
      md: { gap: '$3' },
      lg: { gap: '$4' },
      xl: { gap: '$5' },
    },

    padding: {
      none: { padding: '$0' },
      xs: { padding: '$1' },
      sm: { padding: '$2' },
      md: { padding: '$3' },
      lg: { padding: '$4' },
      xl: { padding: '$5' },
    },

    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },

    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },

    fullHeight: {
      true: {
        height: '100%',
      },
    },
  },

  defaultVariants: {
    align: 'stretch',
    justify: 'start',
  },
})

// Container - Centered content with max width
export const Container = styled(Stack, {
  name: 'Container',
  width: '100%',
  marginHorizontal: 'auto',

  // RTL support
  direction: 'inherit',

  variants: {
    size: {
      sm: {
        maxWidth: 640,
      },
      md: {
        maxWidth: 768,
      },
      lg: {
        maxWidth: 1024,
      },
      xl: {
        maxWidth: 1280,
      },
      full: {
        maxWidth: '100%',
      },
    },

    padding: {
      none: { paddingHorizontal: '$0' },
      sm: { paddingHorizontal: '$3' },
      md: { paddingHorizontal: '$4' },
      lg: { paddingHorizontal: '$6' },
    },
  },

  defaultVariants: {
    size: 'lg',
    padding: 'md',
  },
})

// Spacer - Flexible space between elements
export const Spacer = styled(Stack, {
  name: 'Spacer',
  flex: 1,
})

export type StackProps = GetProps<typeof Stack>
export type XStackProps = GetProps<typeof XStack>
export type YStackProps = GetProps<typeof YStack>
export type ContainerProps = GetProps<typeof Container>
export type SpacerProps = GetProps<typeof Spacer>

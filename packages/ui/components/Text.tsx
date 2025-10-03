import { styled, Text as TamaguiText } from '@tamagui/core'
import type { GetProps } from '@tamagui/core'

// Base Text component with Arabic typography support
export const Text = styled(TamaguiText, {
  name: 'Text',
  fontFamily: '$body',
  color: '$color',

  // RTL support - critical for Arabic text
  direction: 'inherit',
  textAlign: 'start',
  writingDirection: 'inherit',

  variants: {
    size: {
      xs: {
        fontSize: 12,
        lineHeight: 16,
      },
      sm: {
        fontSize: 14,
        lineHeight: 20,
      },
      md: {
        fontSize: 16,
        lineHeight: 24,
      },
      lg: {
        fontSize: 18,
        lineHeight: 28,
      },
      xl: {
        fontSize: 20,
        lineHeight: 32,
      },
    },

    weight: {
      normal: {
        fontWeight: '400',
      },
      medium: {
        fontWeight: '500',
      },
      semibold: {
        fontWeight: '600',
      },
      bold: {
        fontWeight: '700',
      },
    },

    align: {
      start: {
        textAlign: 'start',
      },
      center: {
        textAlign: 'center',
      },
      end: {
        textAlign: 'end',
      },
      justify: {
        textAlign: 'justify',
      },
    },

    color: {
      default: {
        color: '$color',
      },
      muted: {
        color: '$placeholderColor',
      },
      primary: {
        color: '$primary',
      },
      secondary: {
        color: '$secondary',
      },
      success: {
        color: '$success',
      },
      warning: {
        color: '$warning',
      },
      error: {
        color: '$error',
      },
    },
  },

  defaultVariants: {
    size: 'md',
    weight: 'normal',
    align: 'start',
    color: 'default',
  },
})

// Heading 1 - Main titles
export const H1 = styled(TamaguiText, {
  name: 'H1',
  tag: 'h1',
  fontFamily: '$heading',
  fontSize: 32,
  lineHeight: 40,
  fontWeight: '700',
  color: '$color',

  // RTL support
  direction: 'inherit',
  textAlign: 'start',
  writingDirection: 'inherit',

  variants: {
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
  },

  defaultVariants: {
    align: 'start',
  },
})

// Heading 2 - Section titles
export const H2 = styled(TamaguiText, {
  name: 'H2',
  tag: 'h2',
  fontFamily: '$heading',
  fontSize: 28,
  lineHeight: 36,
  fontWeight: '700',
  color: '$color',

  // RTL support
  direction: 'inherit',
  textAlign: 'start',
  writingDirection: 'inherit',

  variants: {
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
  },

  defaultVariants: {
    align: 'start',
  },
})

// Heading 3 - Subsection titles
export const H3 = styled(TamaguiText, {
  name: 'H3',
  tag: 'h3',
  fontFamily: '$heading',
  fontSize: 24,
  lineHeight: 32,
  fontWeight: '600',
  color: '$color',

  // RTL support
  direction: 'inherit',
  textAlign: 'start',
  writingDirection: 'inherit',

  variants: {
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
  },

  defaultVariants: {
    align: 'start',
  },
})

// Heading 4 - Card titles
export const H4 = styled(TamaguiText, {
  name: 'H4',
  tag: 'h4',
  fontFamily: '$heading',
  fontSize: 20,
  lineHeight: 28,
  fontWeight: '600',
  color: '$color',

  // RTL support
  direction: 'inherit',
  textAlign: 'start',
  writingDirection: 'inherit',

  variants: {
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
  },

  defaultVariants: {
    align: 'start',
  },
})

// Paragraph - Body text
export const Paragraph = styled(TamaguiText, {
  name: 'Paragraph',
  tag: 'p',
  fontFamily: '$body',
  fontSize: 16,
  lineHeight: 24,
  fontWeight: '400',
  color: '$color',

  // RTL support with better line height for Arabic
  direction: 'inherit',
  textAlign: 'start',
  writingDirection: 'inherit',

  variants: {
    size: {
      sm: {
        fontSize: 14,
        lineHeight: 20,
      },
      md: {
        fontSize: 16,
        lineHeight: 24,
      },
      lg: {
        fontSize: 18,
        lineHeight: 28,
      },
    },

    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
      justify: { textAlign: 'justify' },
    },

    color: {
      default: { color: '$color' },
      muted: { color: '$placeholderColor' },
    },
  },

  defaultVariants: {
    size: 'md',
    align: 'start',
    color: 'default',
  },
})

// Caption - Small text
export const Caption = styled(TamaguiText, {
  name: 'Caption',
  fontFamily: '$body',
  fontSize: 12,
  lineHeight: 16,
  fontWeight: '400',
  color: '$placeholderColor',

  // RTL support
  direction: 'inherit',
  textAlign: 'start',
  writingDirection: 'inherit',

  variants: {
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
  },

  defaultVariants: {
    align: 'start',
  },
})

// Label - Form labels and UI labels
export const Label = styled(TamaguiText, {
  name: 'Label',
  tag: 'label',
  fontFamily: '$body',
  fontSize: 14,
  lineHeight: 20,
  fontWeight: '500',
  color: '$color',

  // RTL support
  direction: 'inherit',
  textAlign: 'start',
  writingDirection: 'inherit',

  variants: {
    required: {
      true: {
        '&::after': {
          content: '" *"',
          color: '$error',
        },
      },
    },
  },
})

// Muted text - Secondary information
export const Muted = styled(TamaguiText, {
  name: 'Muted',
  fontFamily: '$body',
  fontSize: 14,
  lineHeight: 20,
  fontWeight: '400',
  color: '$placeholderColor',

  // RTL support
  direction: 'inherit',
  textAlign: 'start',
  writingDirection: 'inherit',
})

export type TextProps = GetProps<typeof Text>
export type H1Props = GetProps<typeof H1>
export type H2Props = GetProps<typeof H2>
export type H3Props = GetProps<typeof H3>
export type H4Props = GetProps<typeof H4>
export type ParagraphProps = GetProps<typeof Paragraph>
export type CaptionProps = GetProps<typeof Caption>
export type LabelProps = GetProps<typeof Label>
export type MutedProps = GetProps<typeof Muted>

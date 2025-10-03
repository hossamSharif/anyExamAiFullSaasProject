import { styled, Stack, Text } from '@tamagui/core'
import type { GetProps } from '@tamagui/core'

// Base Card component
export const Card = styled(Stack, {
  name: 'Card',
  backgroundColor: '$background',
  borderRadius: '$4',
  borderWidth: 1,
  borderColor: '$borderColor',
  padding: '$4',
  gap: '$3',

  // RTL support - content direction inherits
  direction: 'inherit',

  variants: {
    variant: {
      elevated: {
        borderWidth: 0,
        shadowColor: '$color',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      outlined: {
        borderWidth: 1,
        borderColor: '$borderColor',
      },
      filled: {
        borderWidth: 0,
        backgroundColor: '$backgroundHover',
      },
    },

    padding: {
      none: {
        padding: '$0',
      },
      sm: {
        padding: '$2',
      },
      md: {
        padding: '$4',
      },
      lg: {
        padding: '$6',
      },
    },

    pressable: {
      true: {
        cursor: 'pointer',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
          borderColor: '$borderColorHover',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
          scale: 0.99,
        },
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  defaultVariants: {
    variant: 'outlined',
    padding: 'md',
  },
})

// Card Header component
export const CardHeader = styled(Stack, {
  name: 'CardHeader',
  flexDirection: 'column',
  gap: '$1',

  // RTL support
  direction: 'inherit',

  variants: {
    padding: {
      none: {
        padding: '$0',
      },
      sm: {
        paddingBottom: '$2',
      },
      md: {
        paddingBottom: '$3',
      },
      lg: {
        paddingBottom: '$4',
      },
    },
  },

  defaultVariants: {
    padding: 'md',
  },
})

// Card Title component
export const CardTitle = styled(Text, {
  name: 'CardTitle',
  fontFamily: '$heading',
  fontSize: 18,
  fontWeight: '600',
  color: '$color',
  lineHeight: 28,

  // RTL support
  direction: 'inherit',
  textAlign: 'start',

  variants: {
    size: {
      sm: {
        fontSize: 16,
        lineHeight: 24,
      },
      md: {
        fontSize: 18,
        lineHeight: 28,
      },
      lg: {
        fontSize: 20,
        lineHeight: 32,
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
})

// Card Description component
export const CardDescription = styled(Text, {
  name: 'CardDescription',
  fontFamily: '$body',
  fontSize: 14,
  color: '$placeholderColor',
  lineHeight: 20,

  // RTL support
  direction: 'inherit',
  textAlign: 'start',

  variants: {
    size: {
      sm: {
        fontSize: 12,
        lineHeight: 18,
      },
      md: {
        fontSize: 14,
        lineHeight: 20,
      },
      lg: {
        fontSize: 16,
        lineHeight: 24,
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
})

// Card Content component
export const CardContent = styled(Stack, {
  name: 'CardContent',
  flexDirection: 'column',
  gap: '$2',

  // RTL support
  direction: 'inherit',

  variants: {
    padding: {
      none: {
        padding: '$0',
      },
      sm: {
        paddingVertical: '$2',
      },
      md: {
        paddingVertical: '$3',
      },
      lg: {
        paddingVertical: '$4',
      },
    },
  },

  defaultVariants: {
    padding: 'md',
  },
})

// Card Footer component
export const CardFooter = styled(Stack, {
  name: 'CardFooter',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$2',

  // RTL support - will flip children order in RTL
  direction: 'inherit',

  variants: {
    padding: {
      none: {
        padding: '$0',
      },
      sm: {
        paddingTop: '$2',
      },
      md: {
        paddingTop: '$3',
      },
      lg: {
        paddingTop: '$4',
      },
    },

    justify: {
      start: {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      end: {
        justifyContent: 'flex-end',
      },
      between: {
        justifyContent: 'space-between',
      },
    },
  },

  defaultVariants: {
    padding: 'md',
    justify: 'end',
  },
})

export type CardProps = GetProps<typeof Card>
export type CardHeaderProps = GetProps<typeof CardHeader>
export type CardTitleProps = GetProps<typeof CardTitle>
export type CardDescriptionProps = GetProps<typeof CardDescription>
export type CardContentProps = GetProps<typeof CardContent>
export type CardFooterProps = GetProps<typeof CardFooter>

import { styled, Stack, Text } from '@tamagui/core'
import type { GetProps } from '@tamagui/core'

// Base Button component
export const ButtonFrame = styled(Stack, {
  name: 'Button',
  tag: 'button',
  focusable: true,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderRadius: '$4',
  cursor: 'pointer',
  gap: '$2',

  // RTL support - will automatically flip when direction is rtl
  direction: 'inherit',

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        borderWidth: 0,
        hoverStyle: {
          backgroundColor: '$primaryHover',
        },
        pressStyle: {
          backgroundColor: '$primaryHover',
          scale: 0.98,
        },
      },
      secondary: {
        backgroundColor: '$secondary',
        borderWidth: 0,
        hoverStyle: {
          backgroundColor: '$backgroundHover',
          borderColor: '$secondary',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
          scale: 0.98,
        },
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
          borderColor: '$borderColorHover',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
          scale: 0.98,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
          scale: 0.98,
        },
      },
    },

    size: {
      sm: {
        paddingHorizontal: '$3',
        paddingVertical: '$2',
        gap: '$1_5',
      },
      md: {
        paddingHorizontal: '$4',
        paddingVertical: '$3',
        gap: '$2',
      },
      lg: {
        paddingHorizontal: '$5',
        paddingVertical: '$4',
        gap: '$2_5',
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  focusStyle: {
    outlineWidth: 2,
    outlineColor: '$borderColorFocus',
    outlineStyle: 'solid',
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

// Button text component with variant-aware colors
export const ButtonText = styled(Text, {
  name: 'ButtonText',
  fontFamily: '$body',
  fontWeight: '600',
  textAlign: 'center',

  // RTL support
  direction: 'inherit',
  writingDirection: 'inherit',

  variants: {
    variant: {
      primary: {
        color: '#ffffff',
      },
      secondary: {
        color: '$secondary',
      },
      outline: {
        color: '$color',
      },
      ghost: {
        color: '$color',
      },
    },

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
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ButtonProps = GetProps<typeof ButtonFrame> & {
  children?: React.ReactNode
  textProps?: GetProps<typeof ButtonText>
}

// Composite Button component
export const Button = ({ children, variant = 'primary', size = 'md', textProps, ...props }: ButtonProps) => {
  return (
    <ButtonFrame variant={variant} size={size} {...props}>
      {typeof children === 'string' ? (
        <ButtonText variant={variant} size={size} {...textProps}>
          {children}
        </ButtonText>
      ) : (
        children
      )}
    </ButtonFrame>
  )
}

Button.displayName = 'Button'

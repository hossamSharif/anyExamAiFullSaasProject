import { styled, Stack, Text } from '@tamagui/core'
import type { GetProps } from '@tamagui/core'
import { forwardRef } from 'react'

// Base Input frame
export const InputFrame = styled(Stack, {
  name: 'Input',
  tag: 'input',
  focusable: true,
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$3',
  paddingHorizontal: '$3',
  paddingVertical: '$2_5',
  backgroundColor: '$background',
  fontFamily: '$body',
  fontSize: 16,
  color: '$color',
  outlineWidth: 0,

  // RTL support - automatically flips text direction
  direction: 'inherit',
  textAlign: 'start', // Uses start instead of left for RTL support

  // Placeholder styling
  placeholderTextColor: '$placeholderColor',

  variants: {
    size: {
      sm: {
        paddingHorizontal: '$2_5',
        paddingVertical: '$2',
        fontSize: 14,
      },
      md: {
        paddingHorizontal: '$3',
        paddingVertical: '$2_5',
        fontSize: 16,
      },
      lg: {
        paddingHorizontal: '$4',
        paddingVertical: '$3',
        fontSize: 18,
      },
    },

    error: {
      true: {
        borderColor: '$error',
        borderWidth: 1,
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
        backgroundColor: '$backgroundPress',
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  hoverStyle: {
    borderColor: '$borderColorHover',
  },

  focusStyle: {
    borderColor: '$borderColorFocus',
    borderWidth: 2,
    outlineWidth: 0,
  },

  defaultVariants: {
    size: 'md',
  },
})

// Label component for inputs
export const InputLabel = styled(Text, {
  name: 'InputLabel',
  fontFamily: '$body',
  fontSize: 14,
  fontWeight: '500',
  color: '$color',
  marginBottom: '$1_5',

  // RTL support
  direction: 'inherit',
  textAlign: 'start',

  variants: {
    required: {
      true: {
        '&::after': {
          content: '" *"',
          color: '$error',
        },
      },
    },

    error: {
      true: {
        color: '$error',
      },
    },
  },
})

// Helper text component (for errors or hints)
export const InputHelper = styled(Text, {
  name: 'InputHelper',
  fontFamily: '$body',
  fontSize: 12,
  color: '$placeholderColor',
  marginTop: '$1_5',

  // RTL support
  direction: 'inherit',
  textAlign: 'start',

  variants: {
    error: {
      true: {
        color: '$error',
      },
    },
  },
})

// Container for input with label and helper text
export const InputContainer = styled(Stack, {
  name: 'InputContainer',
  flexDirection: 'column',
  gap: '$0',

  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },
})

export type InputProps = GetProps<typeof InputFrame> & {
  label?: string
  helperText?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
  containerProps?: GetProps<typeof InputContainer>
}

// Composite Input component
export const Input = forwardRef<any, InputProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      required = false,
      size = 'md',
      fullWidth = false,
      containerProps,
      ...props
    },
    ref
  ) => {
    const showError = error && errorMessage
    const showHelper = !showError && helperText

    return (
      <InputContainer fullWidth={fullWidth} {...containerProps}>
        {label && (
          <InputLabel required={required} error={error}>
            {label}
          </InputLabel>
        )}
        <InputFrame ref={ref} size={size} error={error} fullWidth={fullWidth} {...props} />
        {showError && <InputHelper error>{errorMessage}</InputHelper>}
        {showHelper && <InputHelper>{helperText}</InputHelper>}
      </InputContainer>
    )
  }
)

Input.displayName = 'Input'

// TextArea variant for multi-line input
export const TextAreaFrame = styled(InputFrame, {
  name: 'TextArea',
  tag: 'textarea',
  minHeight: 100,
  paddingVertical: '$3',
  verticalAlign: 'top',
  resize: 'vertical',

  // RTL support for multiline text
  direction: 'inherit',
  textAlign: 'start',
})

export type TextAreaProps = GetProps<typeof TextAreaFrame> & {
  label?: string
  helperText?: string
  error?: boolean
  errorMessage?: string
  required?: boolean
  containerProps?: GetProps<typeof InputContainer>
}

export const TextArea = forwardRef<any, TextAreaProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorMessage,
      required = false,
      size = 'md',
      fullWidth = false,
      containerProps,
      ...props
    },
    ref
  ) => {
    const showError = error && errorMessage
    const showHelper = !showError && helperText

    return (
      <InputContainer fullWidth={fullWidth} {...containerProps}>
        {label && (
          <InputLabel required={required} error={error}>
            {label}
          </InputLabel>
        )}
        <TextAreaFrame ref={ref} size={size} error={error} fullWidth={fullWidth} {...props} />
        {showError && <InputHelper error>{errorMessage}</InputHelper>}
        {showHelper && <InputHelper>{helperText}</InputHelper>}
      </InputContainer>
    )
  }
)

TextArea.displayName = 'TextArea'

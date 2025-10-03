import { config as configDefault } from '@tamagui/config/v4'
import { createTamagui, createTokens } from '@tamagui/core'
import { createAnimations } from '@tamagui/animations-css'
import { fonts } from './fonts'

// RTL-aware spacing tokens
// These tokens work bidirectionally - use them with margin/padding
const tokens = createTokens({
  ...configDefault.tokens,
  // Add custom RTL-aware spacing
  space: {
    ...configDefault.tokens.space,
    // Standard spacing scale
    $0: 0,
    $0_5: 2,
    $1: 4,
    $1_5: 6,
    $2: 8,
    $2_5: 10,
    $3: 12,
    $3_5: 14,
    $4: 16,
    $5: 20,
    $6: 24,
    $7: 28,
    $8: 32,
    $9: 36,
    $10: 40,
    $12: 48,
    $14: 56,
    $16: 64,
    $20: 80,
    // Negative spacing for RTL layouts (using 'n' prefix for negative)
    '$-0.5': -2,
    '$-1': -4,
    '$-2': -8,
    '$-3': -12,
    '$-4': -16,
  },
  // Colors optimized for Arabic text readability
  color: {
    ...configDefault.tokens.color,
    // Custom colors for Arabic UI
    arabicPrimary: '#2563eb', // Blue - good for Arabic text
    arabicSecondary: '#7c3aed', // Purple
    arabicSuccess: '#16a34a', // Green
    arabicWarning: '#ea580c', // Orange
    arabicError: '#dc2626', // Red
  },
  // Radius tokens
  radius: {
    ...configDefault.tokens.radius,
  },
  // Z-index tokens
  zIndex: {
    ...configDefault.tokens.zIndex,
  },
  // Size tokens
  size: {
    ...configDefault.tokens.size,
  },
})

// Create animations for Loading components
const animations = createAnimations({
  // Spinner animation - continuous rotation
  spin: {
    type: 'timing',
    duration: 1000,
    loop: true,
    from: {
      transform: [{ rotate: '0deg' }],
    },
    to: {
      transform: [{ rotate: '360deg' }],
    },
  },
  // Skeleton pulse animation - breathing effect
  pulse: {
    type: 'timing',
    duration: 2000,
    loop: true,
    from: {
      opacity: 0.6,
    },
    to: {
      opacity: 1,
    },
  },
})

// Create Tamagui configuration
const config = createTamagui({
  ...configDefault,
  tokens,
  fonts,
  animations,
  themes: {
    // Light theme - optimized for Arabic readability
    light: {
      background: '#ffffff',
      backgroundHover: '#f9fafb',
      backgroundPress: '#f3f4f6',
      backgroundFocus: '#e5e7eb',
      borderColor: '#e5e7eb',
      borderColorHover: '#d1d5db',
      borderColorFocus: '#2563eb',
      color: '#111827', // Dark text for better Arabic readability
      colorHover: '#374151',
      colorPress: '#1f2937',
      colorFocus: '#111827',
      placeholderColor: '#9ca3af',
      // Custom theme colors
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      secondary: '#7c3aed',
      success: '#16a34a',
      warning: '#ea580c',
      error: '#dc2626',
    },
    // Dark theme - optimized for Arabic readability
    dark: {
      background: '#111827',
      backgroundHover: '#1f2937',
      backgroundPress: '#374151',
      backgroundFocus: '#4b5563',
      borderColor: '#374151',
      borderColorHover: '#4b5563',
      borderColorFocus: '#3b82f6',
      color: '#f9fafb', // Light text for dark mode
      colorHover: '#e5e7eb',
      colorPress: '#d1d5db',
      colorFocus: '#f9fafb',
      placeholderColor: '#6b7280',
      // Custom theme colors
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#8b5cf6',
      success: '#22c55e',
      warning: '#f97316',
      error: '#ef4444',
    },
  },
  // Enable shorthands
  shorthands: {
    ...configDefault.shorthands,
    // RTL-aware shorthands
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    // Start/End for RTL support
    ps: 'paddingStart',
    pe: 'paddingEnd',
    ms: 'marginStart',
    me: 'marginEnd',
  },
  // Media queries
  media: {
    ...configDefault.media,
    xs: { maxWidth: 660 },
    sm: { minWidth: 661, maxWidth: 800 },
    md: { minWidth: 801, maxWidth: 1020 },
    lg: { minWidth: 1021, maxWidth: 1280 },
    xl: { minWidth: 1281 },
    gtXs: { minWidth: 661 },
    gtSm: { minWidth: 801 },
    gtMd: { minWidth: 1021 },
    gtLg: { minWidth: 1281 },
  },
})

export type AppConfig = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config

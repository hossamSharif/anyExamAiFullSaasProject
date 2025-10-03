import { createFont } from '@tamagui/core'

// Cairo font - Modern Arabic font (used for headings)
export const cairoFont = createFont({
  family: 'Cairo',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 22,
    9: 30,
    10: 42,
    11: 52,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
  },
  lineHeight: {
    1: 14,
    2: 16,
    3: 18,
    4: 20,
    5: 22,
    6: 24,
    7: 28,
    8: 32,
    9: 38,
    10: 48,
    11: 58,
    12: 68,
    13: 78,
    14: 98,
    15: 120,
    16: 140,
  },
  weight: {
    1: '200', // ExtraLight
    2: '300', // Light
    3: '400', // Regular
    4: '500', // Medium
    5: '600', // SemiBold
    6: '700', // Bold
    7: '800', // ExtraBold
    8: '900', // Black
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: -1,
    4: -1.5,
    5: -2,
  },
  // Font faces
  face: {
    200: { normal: 'Cairo_200ExtraLight' },
    300: { normal: 'Cairo_300Light' },
    400: { normal: 'Cairo_400Regular' },
    500: { normal: 'Cairo_500Medium' },
    600: { normal: 'Cairo_600SemiBold' },
    700: { normal: 'Cairo_700Bold' },
    800: { normal: 'Cairo_800ExtraBold' },
    900: { normal: 'Cairo_900Black' },
  },
})

// Tajawal font - Clean Arabic font (used for body text)
export const tajawalFont = createFont({
  family: 'Tajawal',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 22,
    9: 30,
    10: 42,
    11: 52,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 134,
  },
  lineHeight: {
    1: 14,
    2: 16,
    3: 18,
    4: 20,
    5: 22,
    6: 24,
    7: 28,
    8: 32,
    9: 38,
    10: 48,
    11: 58,
    12: 68,
    13: 78,
    14: 98,
    15: 120,
    16: 140,
  },
  weight: {
    1: '200', // ExtraLight
    2: '300', // Light
    3: '400', // Regular
    4: '500', // Medium
    5: '700', // Bold
    6: '800', // ExtraBold
    7: '900', // Black
  },
  letterSpacing: {
    1: 0,
    2: -0.25,
    3: -0.5,
    4: -0.75,
    5: -1,
  },
  // Font faces
  face: {
    200: { normal: 'Tajawal_200ExtraLight' },
    300: { normal: 'Tajawal_300Light' },
    400: { normal: 'Tajawal_400Regular' },
    500: { normal: 'Tajawal_500Medium' },
    700: { normal: 'Tajawal_700Bold' },
    800: { normal: 'Tajawal_800ExtraBold' },
    900: { normal: 'Tajawal_900Black' },
  },
})

// Font configuration for Tamagui
export const fonts = {
  heading: cairoFont,
  body: tajawalFont,
  // Aliases
  cairo: cairoFont,
  tajawal: tajawalFont,
}

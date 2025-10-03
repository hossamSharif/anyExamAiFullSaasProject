# anyExamAi Mobile App

React Native mobile application built with Expo for iOS and Android.

## Features

- ✅ Expo 54 configured
- ✅ TypeScript support
- ✅ RTL (Right-to-Left) layout support for Arabic
- ✅ Arabic fonts (Cairo & Tajawal)
- ✅ Cross-platform (iOS, Android, Web)

## RTL Support

This app is configured with full RTL support for Arabic language:

- `I18nManager.forceRTL(true)` enabled in App.tsx
- RTL locale configured in app.json
- Arabic fonts preloaded via expo-font

## Setup

### 1. Install Dependencies

```bash
cd apps/mobile
pnpm install
```

### 2. Download Arabic Fonts

Download the following fonts and place them in `assets/fonts/`:

**Cairo Font:**
- https://fonts.google.com/specimen/Cairo
- Files needed: `Cairo-Regular.ttf`, `Cairo-Bold.ttf`

**Tajawal Font:**
- https://fonts.google.com/specimen/Tajawal
- Files needed: `Tajawal-Regular.ttf`, `Tajawal-Bold.ttf`

### 3. Run the App

```bash
# Start Expo dev server
pnpm dev

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run on web
pnpm web
```

## Scripts

- `pnpm dev` - Start Expo development server
- `pnpm ios` - Run on iOS simulator
- `pnpm android` - Run on Android emulator
- `pnpm web` - Run on web browser
- `pnpm build` - Export production build
- `pnpm type-check` - Run TypeScript type checking
- `pnpm lint` - Run ESLint

## Project Structure

```
apps/mobile/
├── App.tsx              # Main app component with RTL config
├── index.js             # Entry point
├── app.json             # Expo configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── assets/
    └── fonts/           # Arabic font files
```

## Arabic Text Rendering

The app uses Cairo and Tajawal fonts for optimal Arabic text rendering:

- **Cairo**: Modern geometric sans-serif, great for headings
- **Tajawal**: Highly readable, perfect for body text

Both fonts support:
- Full Arabic Unicode range
- Proper letter shaping and connections
- Diacritical marks (tashkeel)
- Right-to-left text flow

## Testing RTL Layout

The default App.tsx includes Arabic sample text to verify:
- RTL text direction
- Arabic font rendering
- Proper text alignment
- Letter shaping and connections

## Next Steps

After Phase 0 is complete, this app will integrate:
- Phase 1: Tamagui UI components with RTL
- Phase 1: Supabase authentication
- Phase 1: Navigation (Solito)
- Phase 2+: Exam generation and taking features

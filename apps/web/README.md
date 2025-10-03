# anyExamAi Web App

Next.js web application with Arabic-first RTL support.

## Features

- ✅ Next.js 15.5.4 with App Router
- ✅ TypeScript configured
- ✅ RTL (Right-to-Left) layout support
- ✅ Arabic language as default (`lang="ar"`, `dir="rtl"`)
- ✅ Cairo font from Google Fonts for Arabic text
- ✅ Integration with `@anyexamai/i18n` package
- ✅ Dynamic language switching (Arabic ↔ English)

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Structure

```
apps/web/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout with RTL and Arabic font
│       ├── page.tsx            # Home page with RTL test
│       ├── globals.css         # Global styles with RTL support
│       └── providers/
│           └── RTLProvider.tsx # i18n integration and direction management
├── next.config.ts              # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## RTL Support

The app automatically sets:
- `lang="ar"` and `dir="rtl"` on the `<html>` element
- Updates direction dynamically when language changes
- Supports both Arabic (RTL) and English (LTR) layouts

## Fonts

Cairo font is loaded with Arabic and Latin subsets for optimal Arabic text rendering.

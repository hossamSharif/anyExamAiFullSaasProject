# anyExamAi Product Requirements Document (PRD)
## Universal Mobile & Web Application - Arabic-First, Middle East Market

## Goals and Background Context

### Goals
- Provide Arabic-speaking students in the Middle East with rapid, AI-powered exam generation
- Support two primary pathways:
  - **Upload-based generation:** From student-uploaded materials (PDF, DOCX, images, web links)
  - **Curated Arabic content generation:** From pre-curated educational resources organized by subject and topic
- Deliver native mobile experiences on iOS and Android with web accessibility
- **Arabic as primary language with English as optional secondary language**
- **RTL (right-to-left) interface optimized for Arabic readers**
- Implement freemium model: Free tier with generous limits, paid Pro tier for power users
- Generate variable-length exams (5-50 questions) with interactive mobile-first interface
- Achieve sub-30 second processing time leveraging pre-embedded database content
- Create 1,000 active users and $10,000 MRR within the first year across Saudi Arabia, UAE, Egypt, and Jordan

### Background Context

anyExamAi addresses the critical inefficiency in Arabic-speaking student study preparation through a dual-pathway, universal application approach. Students can either upload their own Arabic study materials for personalized exam generation or access our curated library of Arabic educational content organized by subject and topic.

The platform is designed specifically for the Middle East market with Arabic as the default language, RTL layouts, and culturally appropriate design patterns. The freemium monetization model allows students to try the platform with 5 free exams per month, then upgrade to Pro (37 SAR/month or $9.99 equivalent) for unlimited access.

### Development Philosophy

This PRD is optimized for **solo developer speed-to-market** with:
- **Minimal testing overhead:** TypeScript + ESLint only (no unit/integration/E2E tests)
- **Arabic-first development:** RTL layouts, Arabic UI strings, Arabic content from day 1
- **Phased development:** Clear Phase 0 foundation, then parallel work streams
- **Independent stories:** Maximum parallelization opportunities
- **Web-only payments:** Mobile users pay via web browser to avoid 30% app store fees
- **Ship fast, iterate:** Launch MVP quickly, refine based on user feedback

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-09-02 | v1.0 | Initial PRD creation | John (PM Agent) |
| 2025-09-02 | v1.1 | Added dual-pathway approach | John (PM Agent) |
| 2025-10-03 | v2.0 | Refined for React Native universal app | Development Team |
| 2025-10-03 | v2.1 | Solo developer optimization with phases | Development Team |
| 2025-10-03 | v2.2 | Added Phase 1.5 monetization with freemium | Development Team |
| 2025-10-03 | v3.0 | **Arabic-first with RTL, i18n infrastructure** | Development Team |

## Requirements

### Functional Requirements

**FR1:** Document upload processing for PDF, DOCX, images, web links via platform-specific pickers and Supabase Edge Functions

**FR2:** Categorized library of pre-curated **Arabic educational content** with pre-computed pgvector embeddings

**FR3:** Intelligent topic refinement prompting for general subjects **in Arabic**

**FR4:** Variable-length exam generation (5-50 questions) using Claude API with semantic search of Arabic content

**FR5:** Real-time progress indicators with native animations during processing

**FR6:** Interactive mobile-first exam interfaces with touch-optimized interactions and **RTL layout**

**FR7:** User authentication via Supabase Auth with social OAuth support (Google, Apple)

**FR8:** Exam completion, scoring, and results storage in PostgreSQL

**FR9:** Native experiences on iOS, Android, and web with 80%+ code sharing

**FR10:** Deep linking for sharing exams and results across platforms

**FR11: Free Tier Limitations**
- System shall allow 5 free exams per month for non-paying users
- System shall limit free users to 10 questions per exam
- System shall restrict document upload to Pro tier only
- System shall track usage per user per billing cycle
- System shall display remaining free credits prominently **in Arabic**
- System shall block exam generation when monthly limit reached

**FR12: Subscription Management**
- System shall support Free and Pro subscription tiers
- System shall integrate with Stripe for web-based payment processing
- System shall redirect mobile users to web browser for payment via deep linking
- System shall handle subscription lifecycle (active, cancelled, expired)
- System shall sync subscription status across mobile and web platforms
- System shall allow users to upgrade, cancel subscriptions via web portal

**FR13: Feature Gating**
- System shall restrict features based on subscription tier
- System shall display upgrade prompts **in Arabic** when free limits reached
- System shall unlock Pro features immediately upon successful payment
- System shall enforce limits before exam generation and document upload

**FR14: Billing & Usage Tracking**
- System shall track monthly usage (exams generated, questions created)
- System shall reset usage counters at the start of each billing cycle
- System shall provide usage statistics in user profile
- System shall send **Arabic email notifications** for billing events via Resend

**FR15: Multi-Language Support (NEW)**
- System shall default to Arabic language and RTL layout
- System shall support English as optional secondary language
- System shall persist user's language preference
- System shall provide language switcher in settings
- System shall format dates, numbers, currency based on selected locale
- System shall support bidirectional text (mixed Arabic/English content)

**FR16: Accessibility (Arabic-specific)**
- System shall support Arabic screen readers (iOS VoiceOver, Android TalkBack in Arabic)
- System shall support Arabic text-to-speech for questions
- System shall use proper Arabic typography and letter shaping
- System shall support dynamic Arabic text sizing

### Non-Functional Requirements

**NFR1:** Sub-30 second document processing and exam generation

**NFR2:** 99.5% uptime with sub-2 second screen load times

**NFR3:** Concurrent user handling during peak periods without degradation

**NFR4:** API costs below 40% of revenue through optimization

**NFR5:** Educational data privacy compliance with secure handling

**NFR6:** 60fps animations on mobile with smooth scrolling

**NFR7:** 80%+ code sharing between platforms via universal architecture

**NFR8:** Payment processing via web-only (mobile redirects to browser) to avoid 30% app store fees

**NFR9:** RTL layout performance equivalent to LTR (no lag or rendering issues)

**NFR10:** Support for Arabic text input with proper keyboard layouts across platforms

### Subscription Tiers & Pricing

**Free Tier (مجاني):**
- **Price:** 0 ريال
- **Limits:**
  - 5 exams per month (٥ امتحانات شهرياً)
  - 10 questions maximum per exam (١٠ أسئلة كحد أقصى)
  - Curated Arabic content only (no document upload)
  - Basic exam types (multiple choice, short answer)
  - Standard processing speed
- **Use Case:** Students exploring the platform, occasional studiers

**Pro Tier (احترافي):**
- **Price:** 37 ريال/month (or $9.99 equivalent based on region)
- **Limits:**
  - 50 exams per month (٥٠ امتحان شهرياً)
  - 50 questions per exam (٥٠ سؤال)
  - Document upload (20 documents/month)
  - All exam types
  - Priority processing
  - Advanced analytics
- **Use Case:** Active students, finals preparation, regular users

### Quality Assurance Strategy (Minimal Testing)

**For speed-to-market, we use minimal testing:**
- ✅ **TypeScript strict mode:** Catches type errors at compile time
- ✅ **ESLint:** Code quality and consistency checks
- ✅ **Prettier:** Automatic code formatting
- ✅ **Manual testing:** Test features as you build them (test in Arabic!)
- ❌ **NO unit tests:** Skip Jest, React Testing Library
- ❌ **NO integration tests:** Skip API testing frameworks
- ❌ **NO E2E tests:** Skip Detox, Playwright, Cypress

**CI/CD Quality Gates (Automated):**
- TypeScript type checking (`tsc --noEmit`)
- ESLint linting (`eslint . --ext .ts,.tsx`)
- Prettier format check (`prettier --check .`)
- Successful build for all platforms

## Technical Stack

### Frontend (Universal - iOS/Android/Web)
```yaml
Core:
  - Expo SDK 51+ with React Native 0.74+
  - TypeScript strict mode
  - Turborepo monorepo
  
UI & Styling:
  - Tamagui (universal components with RTL support)
  - Lucide Icons via @tamagui/lucide-icons
  - Tamagui themes (light/dark)
  - RTL layout engine (direction: 'rtl' by default)
  
Internationalization (i18n):
  - i18next (core i18n library)
  - react-i18next (React bindings)
  - next-i18next (Next.js integration)
  - expo-localization (device locale detection)
  - Arabic locale files (ar.json) as default
  - English locale files (en.json) as fallback
  
Fonts & Typography:
  - Cairo or Tajawal (Arabic sans-serif fonts)
  - Expo Google Fonts (@expo-google-fonts/cairo)
  - System fonts fallback for English
  
Navigation:
  - Solito (universal navigation)
  - Expo Router (mobile)
  - Next.js 14 App Router (web)
  
State & Data:
  - Zustand (global state)
  - TanStack Query v5 (server state)
  - Supabase JS Client
  
Forms:
  - React Hook Form + Zod validation
  
File Handling:
  - expo-document-picker (mobile)
  - react-dropzone (web)
  - Supabase Storage
  
Deep Linking:
  - expo-linking (mobile)
  - expo-web-browser (in-app browser for payments)
  
RTL Support:
  - I18nManager (React Native RTL forcing)
  - CSS direction property (web)
  - Tamagui RTL utilities
```

### Backend (Supabase)
```yaml
Database:
  - PostgreSQL with pgvector
  - Prisma ORM
  
Services:
  - Supabase Auth (OAuth)
  - Supabase Storage
  - Supabase Realtime
  
Edge Functions (Deno):
  - parseDocument (PDF.js, mammoth.js)
  - generateEmbeddings (OpenAI)
  - generateExam (Claude API with Arabic prompts)
  - scoreExam (Claude API)
  - createCheckoutSession (Stripe)
  - stripeWebhook (handle payment events)
  - sendBillingEmail (Resend with Arabic templates)
  
Integrations:
  - Stripe Checkout (web payments)
  - Resend (email service with Arabic templates)
```

### Development & Deployment
```yaml
Mobile:
  - EAS Build (iOS/Android)
  - EAS Submit (App/Play Store)
  - EAS Update (OTA updates)
  
Web:
  - Vercel deployment
  
Tools:
  - TypeScript + ESLint + Prettier
  - GitHub for version control
```

## Development Phases

### 📊 Development Timeline Overview

| Phase | Duration | Focus | Parallel Work |
|-------|----------|-------|---------------|
| **Phase 0** | 4-5 days | Foundation + i18n (Sequential) | No - Must complete first |
| **Phase 1** | 6-8 days | Core UI + Auth + RTL | Yes - 3-4 parallel tracks |
| **Phase 1.5** | 10-14 days | Monetization & Subscription | Yes - 3 parallel tracks |
| **Phase 2** | 8-11 days | Arabic Curated Content | Yes - 3 parallel tracks |
| **Phase 3** | 8-12 days | Document Upload | Yes - 2 parallel tracks |
| **Phase 4** | 10-14 days | Exam Experience | Yes - 3-4 parallel tracks |
| **Phase 5** | 6-8 days | Deployment + Arabic Localization | Mostly sequential |

**Total Estimated Time:** 9-13 weeks solo development

---

## PHASE 0: Foundation + i18n Infrastructure (Sequential - Do First)

**Goal:** Set up infrastructure including i18n, RTL support, and Arabic fonts that everything else depends on.

**Total Time:** 4-5 days
**Parallel Work:** NO - These are dependencies for everything else

### Story 0.1: Turborepo Monorepo Initialization
**Time:** 0.5 day | **Dependencies:** None

Create the monorepo structure that will house all packages and apps.

#### Acceptance Criteria
1. Turborepo initialized with workspace configuration
2. Root package.json with workspace declarations
3. Directory structure created: apps/, packages/
4. Shared TypeScript config in root
5. Shared ESLint and Prettier configs
6. Git repository initialized with .gitignore
7. README with monorepo setup instructions

---

### Story 0.2: Supabase Project Setup
**Time:** 0.5 day | **Dependencies:** None (can do parallel with 0.1)

Create Supabase project and get credentials for all other services.

#### Acceptance Criteria
1. Supabase project created via dashboard
2. Project URL and anon key obtained
3. PostgreSQL database initialized
4. Environment variables documented (.env.example)
5. Supabase CLI installed locally
6. Project linked to local development environment

---

### Story 0.3: PostgreSQL Schema & pgvector Setup (UPDATED FOR ARABIC)
**Time:** 1.5 days | **Dependencies:** 0.2

Set up database schema with vector extension for embeddings, subscription tables, and user language preference.

#### Acceptance Criteria
1. pgvector extension enabled in Supabase
2. Prisma schema created in packages/db
3. **Core tables:** users (with preferredLanguage field), documents, exams, questions, curated_content, embeddings
4. **Monetization tables:** subscriptions, usage_tracking, payment_history
5. Foreign key relationships established
6. Indexes created for performance (including HNSW for pgvector)
7. Initial migration generated and applied
8. Database seed script with sample Arabic data

#### Updated Prisma Schema
```prisma
model User {
  id                String   @id @default(uuid())
  email             String   @unique
  name              String?
  preferredLanguage String   @default("ar") // 'ar' for Arabic, 'en' for English
  createdAt         DateTime @default(now())
  
  subscription      Subscription?
  usageTracking     UsageTracking[]
  paymentHistory    PaymentHistory[]
  exams             Exam[]
  documents         Document[]
}

model Subscription {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  
  tier      String   @default("free") // 'free', 'pro'
  status    String   @default("active") // 'active', 'cancelled', 'expired'
  
  stripeCustomerId      String?  @unique
  stripeSubscriptionId  String?  @unique
  stripePriceId         String?
  
  currentPeriodStart    DateTime?
  currentPeriodEnd      DateTime?
  cancelAtPeriodEnd     Boolean  @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model UsageTracking {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  billingCycle      String   // '2025-10' format
  examsGenerated    Int      @default(0)
  questionsCreated  Int      @default(0)
  documentsUploaded Int      @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, billingCycle])
}

model PaymentHistory {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  amount        Int      // in cents or halalas
  currency      String   @default("usd") // or 'sar' for Saudi Riyal
  status        String   // 'succeeded', 'failed', 'pending'
  
  stripePaymentIntentId String? @unique
  stripeInvoiceId       String?
  
  description   String?
  receiptUrl    String?
  
  createdAt DateTime @default(now())
}

model CuratedContent {
  id          String   @id @default(uuid())
  subject     String   // in Arabic
  topic       String   // in Arabic
  content     String   // in Arabic
  embedding   Unsupported("vector(1536)")
  difficulty  String   // 'easy', 'medium', 'hard'
  language    String   @default("ar") // 'ar' or 'en'
  createdAt   DateTime @default(now())
}

model Document {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  fileName    String
  fileUrl     String
  status      String   @default("pending") // 'pending', 'processing', 'completed', 'failed'
  createdAt   DateTime @default(now())
}

model Exam {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  title           String   // in Arabic or English based on content
  questionCount   Int
  difficulty      String
  status          String   @default("draft") // 'draft', 'completed'
  score           Float?
  language        String   @default("ar") // language exam was generated in
  createdAt       DateTime @default(now())
  completedAt     DateTime?
}
```

---

### Story 0.4: i18n Library Setup (NEW)
**Time:** 1 day | **Dependencies:** 0.1

Set up i18next for multi-language support with Arabic as default.

#### Acceptance Criteria
1. i18next, react-i18next, next-i18next installed
2. i18n configuration in packages/i18n
3. Arabic (ar) locale files structure: packages/i18n/locales/ar/
4. English (en) locale files structure: packages/i18n/locales/en/
5. Language detection setup (device locale, then user preference)
6. Default language set to Arabic ('ar')
7. Fallback language set to English ('en')
8. TypeScript types for translation keys
9. useTranslation hook working in both Expo and Next.js

#### Implementation
```typescript
// packages/i18n/config.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar/common.json'
import en from './locales/en/common.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en }
    },
    lng: 'ar', // Default to Arabic
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
```

```json
// packages/i18n/locales/ar/common.json
{
  "common": {
    "appName": "أي إمتحان",
    "upgrade": "ترقية",
    "cancel": "إلغاء",
    "save": "حفظ",
    "continue": "متابعة",
    "back": "رجوع",
    "next": "التالي",
    "previous": "السابق"
  },
  "auth": {
    "login": "تسجيل الدخول",
    "signup": "إنشاء حساب",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "forgotPassword": "نسيت كلمة المرور؟",
    "welcomeBack": "مرحباً بعودتك"
  },
  "exam": {
    "generateExam": "إنشاء امتحان",
    "questions": "أسئلة",
    "difficulty": "الصعوبة",
    "easy": "سهل",
    "medium": "متوسط",
    "hard": "صعب",
    "startExam": "بدء الامتحان",
    "submitExam": "تسليم الامتحان"
  },
  "subscription": {
    "free": "مجاني",
    "pro": "احترافي",
    "upgrade": "ترقية للنسخة الاحترافية",
    "examsPerMonth": "امتحان شهرياً",
    "questionsPerExam": "سؤال لكل امتحان",
    "unlimited": "غير محدود"
  }
}
```

---

### Story 0.5: Expo Project Setup with RTL Support (NEW)
**Time:** 1 day | **Dependencies:** 0.1, 0.4

Initialize Expo project for iOS and Android with RTL configuration.

#### Acceptance Criteria
1. Expo project created in apps/expo using Expo Router
2. TypeScript configured with strict mode
3. app.json configured with bundle identifier and deep linking scheme
4. **RTL support enabled via I18nManager**
5. Expo Router directory structure (app/ folder)
6. **Arabic fonts installed (Cairo or Tajawal via expo-google-fonts)**
7. Development build runs on iOS Simulator with RTL layout
8. Development build runs on Android Emulator with RTL layout
9. Basic splash screen and app icon placeholders
10. Deep linking scheme configured: anyexamai://

#### app.json Configuration
```json
{
  "expo": {
    "name": "أي إمتحان",
    "slug": "anyexamai",
    "scheme": "anyexamai",
    "ios": {
      "bundleIdentifier": "com.anyexamai.app",
      "associatedDomains": ["applinks:anyexamai.com"],
      "supportsTablet": true
    },
    "android": {
      "package": "com.anyexamai.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            { "scheme": "anyexamai" },
            { "scheme": "https", "host": "anyexamai.com" }
          ]
        }
      ]
    },
    "plugins": [
      [
        "expo-font",
        {
          "fonts": ["./assets/fonts/Cairo-Regular.ttf"]
        }
      ]
    ]
  }
}
```

#### RTL Setup
```typescript
// apps/expo/app/_layout.tsx
import { I18nManager } from 'react-native'
import * as Updates from 'expo-updates'

// Force RTL on first launch
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true)
  Updates.reloadAsync() // Requires app restart
}

export default function RootLayout() {
  return <Slot />
}
```

---

### Story 0.6: Next.js Web Project Setup with RTL Support (NEW)
**Time:** 0.5 day | **Dependencies:** 0.1, 0.4

Initialize Next.js project for web platform with RTL and i18n.

#### Acceptance Criteria
1. Next.js 14 project created with App Router
2. TypeScript configured with strict mode
3. **next-i18next configured for Arabic/English**
4. **RTL CSS support via direction property**
5. Directory structure: app/, components/, lib/
6. Development server runs without errors
7. Basic layout component with navigation placeholder
8. Favicon and metadata configured (Arabic title)
9. **Arabic fonts loaded via Google Fonts**

#### Next.js Configuration
```typescript
// apps/next/next.config.js
const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  // Other config...
}

// apps/next/next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    localeDetection: true
  }
}
```

```css
/* apps/next/app/globals.css */
html[dir='rtl'] {
  direction: rtl;
  text-align: right;
}

html[dir='ltr'] {
  direction: ltr;
  text-align: left;
}
```

---

### Story 0.7: Solito Universal Navigation Setup
**Time:** 0.5 day | **Dependencies:** 0.5, 0.6

Connect Expo Router and Next.js routing via Solito.

#### Acceptance Criteria
1. Solito installed in both apps/expo and apps/next
2. packages/app created for shared screens
3. Basic shared screen (HomeScreen) working on both platforms with Arabic text
4. Navigation links work on mobile and web
5. Route parameters pass correctly between platforms
6. TypeScript types for routes defined and working
7. **RTL navigation working (back button on right side, etc.)**

---

## PHASE 1: Core UI + Auth + RTL (6-8 days)

**Goal:** Build reusable Arabic/RTL UI components and authentication system with language switcher.

**Total Time:** 6-8 days
**Parallel Work:** YES - Up to 4 tracks simultaneously

### 🔄 Parallel Track A: UI Components with RTL (3 days)

#### Story 1.1: Tamagui Configuration & Arabic Theme (UPDATED)
**Time:** 1 day | **Dependencies:** 0.5, 0.6

Set up Tamagui with custom theme and RTL support.

#### Acceptance Criteria
1. Tamagui installed in apps/expo and apps/next
2. tamagui.config.ts in packages/ui with custom theme
3. **RTL-aware spacing and layout tokens**
4. Color tokens defined (primary, secondary, background, text)
5. **Arabic typography scale (Cairo font)**
6. Spacing scale defined (margin, padding work in RTL)
7. Light and dark themes configured
8. Theme provider wrapping app roots with direction support
9. **Test RTL layout with Arabic sample text**

```typescript
// packages/ui/tamagui.config.ts
import { createTamagui } from 'tamagui'

const config = createTamagui({
  fonts: {
    body: {
      family: 'Cairo',
      // Cairo font weights
    }
  },
  // RTL-aware tokens
  space: {
    // Spacing works in both directions
  },
  // Rest of config...
})
```

---

#### Story 1.2: Base UI Components Library with RTL
**Time:** 2 days | **Dependencies:** 1.1

Build reusable Tamagui components in packages/ui that work in RTL.

#### Acceptance Criteria
1. Button component with variants (primary, secondary, outline)
2. Input component with validation states (RTL text input)
3. Card component for content containers
4. Text components (Heading, Paragraph, Label) with Arabic typography
5. Stack components (XStack, YStack) with RTL-aware spacing
6. Loading spinner component
7. **All components tested with Arabic text**
8. **Icons that need mirroring are properly handled**
9. Components exported from packages/ui/index.ts

---

### 🔄 Parallel Track B: Authentication in Arabic (4 days)

#### Story 1.3: Supabase Auth Integration
**Time:** 1 day | **Dependencies:** 0.3

Integrate Supabase Auth SDK across platforms.

#### Acceptance Criteria
1. Supabase client initialized in packages/api
2. Auth methods: signUp, signIn, signOut, resetPassword
3. Session management with secure storage (expo-secure-store on mobile)
4. Auth state listener for real-time updates
5. useAuth hook for accessing current user
6. OAuth provider configuration (Google, Apple)
7. TypeScript types for user and session
8. **User's preferredLanguage stored on signup**

---

#### Story 1.4: Authentication Screens in Arabic (UPDATED)
**Time:** 2 days | **Dependencies:** 1.2, 1.3

Build login, signup, and password reset screens in Arabic.

#### Acceptance Criteria
1. LoginScreen in packages/app/features/auth with Arabic text
2. SignupScreen with Arabic labels and validation
3. ForgotPasswordScreen with Arabic instructions
4. Form validation using Zod schemas with Arabic error messages
5. Loading states during auth operations
6. **Arabic error messages displayed appropriately**
7. **RTL text input working correctly**
8. Navigation between auth screens working

**Example:**
```typescript
// packages/app/features/auth/login-screen.tsx
import { useTranslation } from 'react-i18next'

export function LoginScreen() {
  const { t } = useTranslation()
  
  return (
    <YStack padding="$4" gap="$4">
      <Heading>{t('auth.welcomeBack')}</Heading>
      <Input 
        placeholder={t('auth.email')}
        textAlign="right" // RTL
      />
      <Input 
        placeholder={t('auth.password')}
        secureTextEntry
        textAlign="right"
      />
      <Button>{t('auth.login')}</Button>
    </YStack>
  )
}
```

---

#### Story 1.5: Protected Routes & Navigation Guards
**Time:** 1 day | **Dependencies:** 1.3, 1.4

Implement route protection redirecting unauthenticated users.

#### Acceptance Criteria
1. useRequireAuth hook for protected screens
2. Automatic redirect to login if not authenticated
3. Redirect to home after successful login
4. Deep link handling with auth checks
5. Loading state while checking auth status
6. Works consistently on mobile and web
7. **Arabic loading messages**

---

### 🔄 Parallel Track C: Layout & Navigation with RTL (2 days)

#### Story 1.6: Bottom Tab Navigation (Mobile) RTL
**Time:** 1 day | **Dependencies:** 1.1, 0.5

Create bottom tab bar for primary mobile navigation with RTL.

#### Acceptance Criteria
1. Bottom tabs: Home, Browse, History, Profile
2. Tab icons using Lucide icons (mirrored if needed)
3. Active tab highlighting
4. **Arabic tab labels**
5. Platform-adaptive styling (iOS vs Android)
6. **RTL tab order (right to left)**
7. Screens for each tab created (placeholder content)

---

#### Story 1.7: Web Layout & Header Navigation RTL
**Time:** 1 day | **Dependencies:** 1.1, 0.6

Create web-specific header and layout components with RTL.

#### Acceptance Criteria
1. Header component with logo and navigation links
2. Responsive layout (mobile, tablet, desktop)
3. User menu dropdown for authenticated users
4. Footer component with links
5. Main layout wrapper for all pages
6. **RTL layout on web (logo on right, menu on left)**
7. Breadcrumb navigation working in RTL

---

### 🔄 Parallel Track D: Language & Utilities (2 days)

#### Story 1.8: Language Switcher Component (NEW)
**Time:** 1 day | **Dependencies:** 0.4, 1.2

Create language switcher for Arabic/English toggle.

#### Acceptance Criteria
1. Language switcher component (dropdown or toggle)
2. Shows current language with flag/icon
3. Options: العربية (Arabic), English
4. Switches UI language immediately
5. Persists language preference to database (user.preferredLanguage)
6. Updates i18n context
7. **Triggers layout direction change (RTL ↔ LTR)**
8. Works on mobile and web

```typescript
// packages/ui/src/LanguageSwitcher.tsx
export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [updateUser] = useUpdateUserLanguage()
  
  async function changeLanguage(lang: 'ar' | 'en') {
    await i18n.changeLanguage(lang)
    await updateUser({ preferredLanguage: lang })
    
    // Update RTL on mobile
    if (Platform.OS !== 'web') {
      const shouldBeRTL = lang === 'ar'
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.forceRTL(shouldBeRTL)
        Updates.reloadAsync()
      }
    }
  }
  
  return (
    <Select value={i18n.language} onValueChange={changeLanguage}>
      <Select.Item value="ar">العربية</Select.Item>
      <Select.Item value="en">English</Select.Item>
    </Select>
  )
}
```

---

#### Story 1.9: TanStack Query Setup
**Time:** 1 day | **Dependencies:** 0.3, 1.3

Configure data fetching and caching layer.

#### Acceptance Criteria
1. TanStack Query installed and configured
2. QueryClient setup with default options
3. QueryClientProvider wrapping app roots
4. Custom hooks: useProfile, useExams, useDocuments, useSubscription, useUsage
5. Mutation hooks for data updates
6. Error and loading state handling
7. Devtools enabled for development

---

## PHASE 1.5: Monetization & Subscription (10-14 days)

**Goal:** Implement freemium model with usage tracking, Stripe payments via web, and feature gating. **All in Arabic with web checkout in Arabic**.

**Total Time:** 10-14 days
**Parallel Work:** YES - Up to 3 tracks simultaneously

### 🔄 Parallel Track A: Backend & Stripe (5 days)

#### Story 1.5.1: Stripe Account & Product Setup
**Time:** 1 day | **Dependencies:** 0.3

Set up Stripe account and create products/prices with Arabic descriptions.

#### Acceptance Criteria
1. Stripe account created (test mode for development)
2. Product created: "anyExamAi Pro" with Arabic description
3. Price created: 37 SAR/month or $9.99/month (price_xxx in Stripe)
4. Webhook endpoint URL configured in Stripe dashboard
5. Stripe API keys stored in environment variables
6. Test mode verified working with test cards
7. **Arabic product name/description in Stripe dashboard**
8. Documentation of Stripe dashboard setup process

---

#### Story 1.5.2: Stripe Checkout Edge Function
**Time:** 2 days | **Dependencies:** 1.5.1, 0.3

Create Edge Function to generate Stripe Checkout sessions with Arabic locale.

#### Acceptance Criteria
1. Edge Function: createCheckoutSession in supabase/functions/
2. Accept userId, tier, successUrl, cancelUrl as parameters
3. Create or retrieve Stripe customer for user
4. Generate Stripe Checkout session URL with **Arabic locale**
5. Set metadata (userId) for webhook processing
6. Handle errors and return session URL
7. Callable from mobile and web via Supabase client

```typescript
// supabase/functions/create-checkout-session/index.ts
const session = await stripe.checkout.sessions.create({
  customer: customer.data[0].id,
  mode: 'subscription',
  locale: 'ar', // Arabic checkout interface
  payment_method_types: ['card'],
  line_items: [{
    price: STRIPE_CONFIG.products.pro.priceId,
    quantity: 1
  }],
  success_url: successUrl,
  cancel_url: cancelUrl,
  metadata: { userId, tier }
})
```

---

#### Story 1.5.3: Stripe Webhook Handler
**Time:** 2 days | **Dependencies:** 1.5.2

Create Edge Function to handle Stripe webhook events.

#### Acceptance Criteria
1. Edge Function: stripeWebhook in supabase/functions/
2. Verify webhook signature for security
3. Handle checkout.session.completed event (create subscription)
4. Handle customer.subscription.updated event (update subscription)
5. Handle customer.subscription.deleted event (cancel subscription)
6. Handle invoice.payment_failed event (handle failed payment)
7. Store payment history in payment_history table
8. Trigger Supabase Realtime event for subscription changes
9. **Send Arabic email notifications**

---

### 🔄 Parallel Track B: UI Components in Arabic (4 days)

#### Story 1.5.4: Usage Tracking System
**Time:** 2 days | **Dependencies:** 0.3

Implement usage tracking and limit checking.

#### Acceptance Criteria
1. useUsageTracking hook in packages/api
2. Track exam generation in usage_tracking table
3. Track questions created count
4. Track documents uploaded count
5. Monthly reset logic (check on access, reset if new cycle)
6. canGenerateExam() function checking limits
7. canUploadDocument() function checking limits
8. **Arabic limit messages**

---

#### Story 1.5.5: Pricing Page & Components in Arabic (UPDATED)
**Time:** 2 days | **Dependencies:** 1.2, 1.5.1

Create pricing page in Arabic with RTL layout.

#### Acceptance Criteria
1. PricingCard component showing tier details in Arabic
2. Feature comparison table (مجاني vs احترافي)
3. Pricing page in packages/app/features/pricing
4. **Price display: "٣٧ ريال/شهرياً" or "37 ريال/شهرياً"**
5. "اختر الخطة" button for each tier
6. Current plan badge display in Arabic
7. Responsive design (mobile, tablet, desktop)
8. **RTL layout for cards and pricing table**
9. Works on web and mobile

```typescript
// Example pricing display
const PRICING = {
  free: {
    name: 'مجاني',
    price: 0,
    currency: 'ريال',
    features: [
      '٥ امتحانات شهرياً',
      '١٠ أسئلة لكل امتحان',
      'محتوى تعليمي منسق',
      'أنواع امتحانات أساسية'
    ]
  },
  pro: {
    name: 'احترافي',
    price: 37,
    currency: 'ريال',
    features: [
      '٥٠ امتحان شهرياً',
      '٥٠ سؤال لكل امتحان',
      'رفع المستندات (٢٠ شهرياً)',
      'تحليلات متقدمة',
      'معالجة ذات أولوية'
    ]
  }
}
```

---

### 🔄 Parallel Track C: Feature Gating & UX in Arabic (5 days)

#### Story 1.5.6: Paywall Modal in Arabic (UPDATED)
**Time:** 2 days | **Dependencies:** 1.2, 1.5.2, 1.5.4

Create paywall modal in Arabic triggered when limits reached.

#### Acceptance Criteria
1. PaywallModal component in packages/ui with Arabic text
2. Triggered when free user hits 5 exam limit
3. Show usage stats in Arabic: "٥/٥ امتحانات مستخدمة هذا الشهر"
4. Display Pro tier benefits in Arabic
5. "الترقية للنسخة الاحترافية" button opens web payment flow
6. Mobile: Opens in-app browser with deep link return
7. Web: Redirects to Stripe Checkout directly
8. **RTL modal layout**

---

#### Story 1.5.7: Web Checkout Page in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 1.5.2, 1.5.5

Create Arabic web checkout page for mobile and web users.

#### Acceptance Criteria
1. Checkout page at /checkout in Next.js app with Arabic UI
2. Verify web auth token and auto-login user
3. Display selected tier and price in Arabic
4. "إتمام الدفع" button calls createCheckoutSession
5. Redirect to Stripe Checkout hosted page (Arabic locale)
6. Success page at /payment-success with Arabic text and deep link
7. Handle mobile source detection (show "العودة للتطبيق" button)
8. **Full RTL layout on checkout and success pages**

```typescript
// apps/next/app/[locale]/checkout/page.tsx
export default function CheckoutPage() {
  const { t } = useTranslation()
  
  return (
    <Container dir="rtl">
      <YStack padding="$6" gap="$4">
        <Heading>{t('checkout.completePayment')}</Heading>
        <Card>
          <Text>{t('subscription.pro')} - ٣٧ ريال/شهرياً</Text>
          <Text color="$gray10">{t('checkout.unlimitedFeatures')}</Text>
        </Card>
        <Button onPress={handleCheckout} size="$5" theme="active">
          {t('checkout.completePurchase')}
        </Button>
      </YStack>
    </Container>
  )
}
```

---

#### Story 1.5.8: Deep Link Handler & Subscription Sync
**Time:** 1.5 days | **Dependencies:** 1.5.7, 0.5

Handle deep links returning from web payment.

#### Acceptance Criteria
1. Deep link listener in Expo app root
2. Handle anyexamai://subscription-success URL
3. Refresh subscription status from database
4. Subscribe to Supabase Realtime for subscription updates
5. Show success toast in Arabic if subscription is Pro
6. Show error in Arabic if payment failed/cancelled
7. Navigate to appropriate screen after handling

---

#### Story 1.5.9: Usage Widget in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 1.5.4, 1.2

Display usage stats in Arabic throughout app.

#### Acceptance Criteria
1. UsageWidget component showing progress bars
2. Display in header/profile: "٣/٥ امتحانات مستخدمة هذا الشهر"
3. Color-coded progress (green, yellow, red as approaching limit)
4. Tap to see detailed usage breakdown in Arabic
5. Show "ترقية" button when nearing limit
6. Hide usage widget for Pro users (or show "غير محدود")
7. **RTL progress bar layout**
8. Works on mobile and web

---

#### Story 1.5.10: Subscription Management Screen in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 1.5.4, 1.5.8

Create screen for managing subscription in Arabic.

#### Acceptance Criteria
1. Subscription screen in profile tab with Arabic labels
2. Display current plan (مجاني or احترافي)
3. Show current billing cycle dates in Arabic format
4. Display usage statistics with Arabic charts
5. "الترقية للنسخة الاحترافية" button (for Free users)
6. "إدارة الفواتير" button redirecting to Stripe Customer Portal (for Pro users)
7. "إلغاء الاشتراك" option with Arabic confirmation dialog
8. **Full RTL layout**

---

## PHASE 2: Arabic Curated Content Pathway (8-11 days)

**Goal:** Implement browse and exam generation from Arabic curated content.

**Total Time:** 8-11 days
**Parallel Work:** YES - Up to 3 tracks simultaneously

### 🔄 Parallel Track A: Arabic Content Database (4 days)

#### Story 2.1: Arabic Content Ingestion Scripts (UPDATED)
**Time:** 2.5 days | **Dependencies:** 0.3

Create scripts to populate database with Arabic educational content.

#### Acceptance Criteria
1. Node.js script for content ingestion from Arabic text files
2. **Arabic text handling (UTF-8 encoding, right-to-left)**
3. Content chunking algorithm preserving Arabic word boundaries
4. Metadata extraction (subject, topic, difficulty) in Arabic
5. Content validation and cleaning
6. Bulk insert into curated_content table with language='ar'
7. **At least 1000 Arabic chunks across 10 subjects**
8. Script can be re-run to update content

**Subjects in Arabic:**
- الرياضيات (Mathematics)
- الفيزياء (Physics)
- الكيمياء (Chemistry)
- الأحياء (Biology)
- علوم الحاسوب (Computer Science)
- اللغة العربية (Arabic Language)
- التاريخ (History)
- الجغرافيا (Geography)
- الاقتصاد (Economics)
- الفلسفة (Philosophy)

---

#### Story 2.2: Embedding Generation Edge Function
**Time:** 1.5 days | **Dependencies:** 2.1

Create Edge Function to generate OpenAI embeddings for Arabic text.

#### Acceptance Criteria
1. Edge Function: generateEmbeddings in supabase/functions/
2. OpenAI API integration for text-embedding-3-small
3. **Handle Arabic text encoding properly**
4. Batch processing (up to 100 chunks per request)
5. Embeddings stored in pgvector column
6. Error handling and retry logic
7. Function callable via Supabase client
8. Cost logging for monitoring

---

#### Story 2.3: Vector Similarity Search Function
**Time:** 1 day | **Dependencies:** 2.2

Implement vector search for Arabic content retrieval.

#### Acceptance Criteria
1. Supabase function for similarity search using pgvector
2. HNSW index for fast nearest neighbor search
3. Search by Arabic subject, topic filters combined with vector similarity
4. Return top K most relevant chunks
5. Performance target: <500ms for search
6. TypeScript function in packages/api
7. useSearchContent hook for React components

---

### 🔄 Parallel Track B: Arabic Browse UI (4 days)

#### Story 2.4: Category Browser in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 1.2, 2.1

Build home screen showing Arabic subject categories.

#### Acceptance Criteria
1. Grid of subject cards with Arabic names
2. Card shows: icon, Arabic title, topic count in Arabic numerals
3. Touch-optimized tap targets (minimum 44x44pt)
4. Loading skeleton while fetching categories
5. Pull-to-refresh gesture on mobile
6. Arabic search bar at top for filtering
7. Empty state in Arabic if no categories
8. **RTL grid layout**

---

#### Story 2.5: Subject Detail Screen in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 2.4

Show Arabic topics within a selected subject.

#### Acceptance Criteria
1. List of topics in Arabic with metadata
2. Multi-select chips for topic selection with Arabic labels
3. Visual feedback for selected topics
4. "إنشاء امتحان" button (disabled until topics selected)
5. Topic recommendations in Arabic
6. Back navigation to category browser
7. **RTL layout for topic list**
8. Works on mobile and web

---

#### Story 2.6: Topic Refinement Flow in Arabic (UPDATED)
**Time:** 1 day | **Dependencies:** 2.5

Implement intelligent prompting in Arabic for general subjects.

#### Acceptance Criteria
1. Detection when user selects broad subject (e.g., "الكيمياء")
2. Bottom sheet (mobile) or modal (web) with subtopics in Arabic
3. Subtopics displayed as chips (عضوية، غير عضوية، فيزيائية)
4. Multi-select with visual confirmation
5. "متابعة" button proceeds to exam config
6. Option to skip refinement
7. **RTL modal/bottom sheet layout**

---

#### Story 2.7: Search & Filter Interface in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 2.4

Add Arabic search and filtering.

#### Acceptance Criteria
1. Arabic search input with debounce (300ms)
2. Real-time search results as user types Arabic text
3. Filters in Arabic: الموضوع، الصعوبة، المستوى
4. Active filter chips in Arabic with removal option
5. Search history (last 5 Arabic searches)
6. "مسح الكل" button
7. No results state in Arabic with suggestions
8. **RTL search layout**

---

### 🔄 Parallel Track C: Arabic Exam Generation (3 days)

#### Story 2.8: Exam Configuration Screen in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 2.5, 1.5.4

Arabic exam configuration with usage tracking.

#### Acceptance Criteria
1. Slider for question count with Arabic numbers: ٥-٥٠ or 5-50
2. Free tier: Max 10 questions, show "ترقية للمزيد"
3. Pro tier: Max 50 questions
4. Difficulty selector in Arabic (سهل، متوسط، صعب)
5. Estimated time in Arabic
6. Selected topics summary in Arabic
7. Check usage limits before generation
8. "إنشاء الامتحان" button with loading state
9. **RTL layout for sliders and selectors**

---

#### Story 2.9: Arabic Exam Generation Edge Function (UPDATED)
**Time:** 2.5 days | **Dependencies:** 2.3, 2.8

Generate exams in Arabic using Claude API.

#### Acceptance Criteria
1. Edge Function: generateExam in supabase/functions/
2. Vector search to get relevant Arabic content chunks
3. **Claude API with Arabic system prompts**
4. Generate Arabic questions (multiple choice, short answer)
5. Difficulty balancing across questions
6. Exam stored with language='ar'
7. Return exam ID and question data

**Claude API Prompt Example:**
```typescript
const prompt = `أنت مساعد تعليمي متخصص في إنشاء أسئلة امتحانات باللغة العربية.

المحتوى المرجعي:
${relevantChunks.join('\n\n')}

قم بإنشاء ${questionCount} سؤال ${difficulty} حول هذا المحتوى.

متطلبات الأسئلة:
- أسئلة واضحة ومباشرة
- إجابات متعددة الخيارات (4 خيارات لكل سؤال)
- الإجابة الصحيحة واحدة فقط
- تنوع في مستوى الصعوبة
- تغطية شاملة للمحتوى

صيغة الإخراج: JSON`
```

---

#### Story 2.10: Real-Time Progress in Arabic (UPDATED)
**Time:** 1 day | **Dependencies:** 2.9

Show generation progress with Arabic messages.

#### Acceptance Criteria
1. Progress indicator with Arabic stages: البحث → الإنشاء → الإنهاء
2. Supabase Realtime subscription
3. Animated transitions using Tamagui
4. Estimated time in Arabic
5. Cancellation option with Arabic confirmation
6. Error handling with Arabic messages
7. Auto navigation when complete

---

## PHASE 3: Document Upload Pathway (8-12 days)

**Goal:** Upload Arabic documents and generate exams. Pro tier only.

**Total Time:** 8-12 days
**Parallel Work:** YES - 2 tracks simultaneously

### 🔄 Parallel Track A: Upload UI (3 days)

#### Story 3.1: Mobile File Picker with Pro Check (UPDATED)
**Time:** 1.5 days | **Dependencies:** 1.2, 1.5.4

Arabic file picker with tier gating.

#### Acceptance Criteria
1. expo-document-picker installed
2. Check Pro tier before upload
3. Show Arabic upgrade prompt for Free tier
4. File type filtering (PDF, DOCX, images)
5. Multiple file selection
6. File size validation (10MB) with Arabic error
7. Platform-specific permission handling with Arabic dialogs

---

#### Story 3.2: Web Drag-and-Drop in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 1.2

Arabic drag-and-drop interface.

#### Acceptance Criteria
1. react-dropzone configured
2. Arabic drag-and-drop instructions
3. Click-to-browse with Arabic button
4. File validation with Arabic errors
5. Preview with Arabic labels
6. Remove option in Arabic
7. **RTL layout**

---

#### Story 3.3: Upload to Supabase Storage
**Time:** 1 day | **Dependencies:** 3.1, 3.2

Upload with Arabic progress indicators.

#### Acceptance Criteria
1. Upload to Supabase Storage
2. Unique file naming
3. Progress bar with Arabic labels
4. Retry logic with Arabic prompts
5. Success confirmation in Arabic
6. Store metadata in documents table

---

### 🔄 Parallel Track B: Document Processing (5 days)

#### Story 3.4: Arabic Document Parser Edge Function (UPDATED)
**Time:** 3 days | **Dependencies:** 0.3

Parse Arabic PDFs and documents.

#### Acceptance Criteria
1. Edge Function: parseDocument
2. **PDF.js with Arabic text extraction**
3. **DOCX with Arabic text preservation**
4. **Handle RTL text properly**
5. Text cleaning for Arabic
6. Chunking preserving Arabic semantics
7. Parsed content stored

**Challenge:** PDF.js and Arabic text can have issues with character shaping and RTL. Need thorough testing.

---

#### Story 3.5: Document Embedding Generation
**Time:** 1 day | **Dependencies:** 3.4

Generate embeddings for Arabic document content.

#### Acceptance Criteria
1. Reuse generateEmbeddings Edge Function
2. Handle Arabic document chunks
3. Store embeddings with language='ar'
4. Batch processing
5. Progress updates in Arabic
6. Error handling

---

#### Story 3.6: Processing Status in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 3.4, 3.5

Real-time Arabic status updates.

#### Acceptance Criteria
1. Status in Arabic: قيد الانتظار، معالجة، مكتمل، فشل
2. Realtime subscription
3. Multi-stage in Arabic: رفع → تحليل → إنشاء الفهرس → اكتمال
4. Progress percentage
5. Estimated time in Arabic
6. Arabic error messages
7. Retry in Arabic

---

#### Story 3.7: Web Link Scraper (Arabic Support)
**Time:** 2 days | **Dependencies:** 0.3

Scrape Arabic web content.

#### Acceptance Criteria
1. Edge Function: scrapeWebContent
2. URL validation with Arabic errors
3. HTML parsing with Arabic text support
4. Content cleaning
5. Robots.txt compliance
6. Store with language detection
7. Same pipeline as documents

---

### 🔄 Parallel Track C: Document Library in Arabic (2 days)

#### Story 3.8: Document Library Screen in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 3.3, 3.6

Arabic document management.

#### Acceptance Criteria
1. List with Arabic labels
2. Metadata in Arabic format
3. Status indicators in Arabic
4. Swipe/context menu with Arabic options
5. Arabic search
6. Empty state in Arabic
7. **RTL layout**

---

#### Story 3.9: Document Preview in Arabic (UPDATED)
**Time:** 1 day | **Dependencies:** 3.8

Preview Arabic documents.

#### Acceptance Criteria
1. Preview with Arabic text
2. Topics in Arabic
3. Re-process in Arabic
4. Delete with Arabic confirmation
5. Generate exam in Arabic
6. Works on all platforms

---

#### Story 3.10: Upload-Based Exam Generation
**Time:** 1.5 days | **Dependencies:** 2.9, 3.5

Generate from Arabic documents.

#### Acceptance Criteria
1. Reuse generateExam function
2. Search user's Arabic documents
3. Same config options in Arabic
4. Source attribution in Arabic
5. Sub-30s performance
6. Multiple exams from same doc

---

## PHASE 4: Interactive Exam Experience (10-14 days)

**Goal:** Arabic exam interface, scoring, and results.

**Total Time:** 10-14 days
**Parallel Work:** YES - Up to 4 tracks simultaneously

### 🔄 Parallel Track A: Arabic Exam Interface (4 days)

#### Story 4.1: Exam Start Screen in Arabic (UPDATED)
**Time:** 0.5 day | **Dependencies:** 2.9 or 3.10

Arabic exam overview.

#### Acceptance Criteria
1. Arabic title and description
2. Question count in Arabic numerals
3. Estimated time in Arabic
4. Topics in Arabic
5. Difficulty chart with Arabic labels
6. "بدء الامتحان" button
7. "حفظ لوقت لاحق" option

---

#### Story 4.2: Arabic Question Display (UPDATED)
**Time:** 2.5 days | **Dependencies:** 1.2

Render Arabic questions properly.

#### Acceptance Criteria
1. Multiple choice with Arabic text
2. Short answer with RTL text input
3. True/False in Arabic (صح/خطأ)
4. **Arabic text rendering with proper letter shaping**
5. Question number in Arabic format
6. Progress in Arabic
7. **RTL layout for all question types**

**Critical:** Arabic text must render correctly with connected letters (contextual forms).

---

#### Story 4.3: RTL Swipe Navigation (UPDATED)
**Time:** 1 day | **Dependencies:** 4.2

Swipe gestures adapted for RTL.

#### Acceptance Criteria
1. **Swipe right: next question (reversed for RTL)**
2. **Swipe left: previous question**
3. Haptic feedback
4. Swipe threshold
5. Previous/Next in Arabic
6. Keyboard shortcuts work
7. Disabled appropriately

---

#### Story 4.4: Question List in Arabic (UPDATED)
**Time:** 1 day | **Dependencies:** 4.2

Arabic question navigation.

#### Acceptance Criteria
1. Bottom sheet/sidebar with Arabic labels
2. Status indicators in Arabic
3. Tap to jump
4. Flag with Arabic label
5. "مراجعة المعلمة" button
6. Close in Arabic
7. **RTL layout**

---

#### Story 4.5: Answer Auto-Save
**Time:** 0.5 day | **Dependencies:** 4.2

Auto-save with Arabic feedback.

#### Acceptance Criteria
1. Debounced auto-save
2. Save to Supabase
3. "محفوظ" indicator in Arabic
4. Optimistic UI
5. Recover on restart
6. Handle network errors with Arabic messages
7. No data loss

---

### 🔄 Parallel Track B: Arabic Scoring (3 days)

#### Story 4.6: Exam Submission in Arabic (UPDATED)
**Time:** 0.5 day | **Dependencies:** 4.5

Arabic submission flow.

#### Acceptance Criteria
1. "تسليم الامتحان" button
2. Arabic confirmation dialog
3. Validation with Arabic warnings
4. Review option in Arabic
5. Triggers scoring
6. Loading in Arabic
7. Navigate to results

---

#### Story 4.7: Arabic Scoring Edge Function (UPDATED)
**Time:** 2.5 days | **Dependencies:** 4.6

Score Arabic exams with Claude.

#### Acceptance Criteria
1. Edge Function: scoreExam
2. Auto-score multiple choice
3. **Claude evaluation of Arabic short answers**
4. Partial credit
5. Overall score calculation
6. Topic-wise breakdown
7. Store with language='ar'

**Claude Scoring Prompt:**
```typescript
const prompt = `قم بتقييم هذه الإجابة العربية:

السؤال: ${question}
الإجابة الصحيحة: ${correctAnswer}
إجابة الطالب: ${userAnswer}

قيّم الإجابة من 0-1 (0 = خطأ تماماً، 1 = صحيحة تماماً)
قدم شرحاً موجزاً بالعربية.`
```

---

#### Story 4.8: Immediate Feedback in Arabic (UPDATED)
**Time:** 1 day | **Dependencies:** 4.2, 4.7

Arabic instant feedback.

#### Acceptance Criteria
1. Toggle in Arabic
2. Visual feedback
3. Haptic feedback
4. Correct answer in Arabic
5. Arabic explanation
6. "السؤال التالي" button
7. Works for all types

---

### 🔄 Parallel Track C: Arabic Results (4 days)

#### Story 4.9: Score Reveal in Arabic (UPDATED)
**Time:** 1 day | **Dependencies:** 4.7

Arabic score animation.

#### Acceptance Criteria
1. Animated counting
2. Confetti for ≥70%
3. Haptic celebration
4. Arabic percentage display
5. Letter grade in Arabic (ممتاز، جيد جداً، جيد، etc.)
6. Pass/Fail in Arabic (نجح/رسب)
7. Smooth Tamagui animation

---

#### Story 4.10: Performance Breakdown in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 4.9

Arabic analytics dashboard.

#### Acceptance Criteria
1. Score card with Arabic labels
2. Charts with Arabic text
3. Question-type analysis in Arabic
4. Time analysis in Arabic format
5. Comparison in Arabic
6. Strength/weakness in Arabic
7. **RTL charts and graphs**

---

#### Story 4.11: Question Review in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 4.10

Review with Arabic text.

#### Acceptance Criteria
1. List with Arabic questions
2. Answers in Arabic
3. Explanations in Arabic
4. Source reference in Arabic
5. Filter: الكل، صحيح، خطأ، متجاوز
6. Navigate with RTL swipes
7. Flag in Arabic

---

#### Story 4.12: Results Export in Arabic (UPDATED)
**Time:** 1 day | **Dependencies:** 4.10

Export Arabic results.

#### Acceptance Criteria
1. PDF export with Arabic text (web)
2. Image share with Arabic (mobile)
3. Shareable link
4. Social sharing
5. Copy to clipboard
6. Email in Arabic
7. **RTL PDF layout**

**Challenge:** PDF generation with Arabic text requires special handling (fonts, RTL).

---

### 🔄 Parallel Track D: Arabic Exam History (2 days)

#### Story 4.13: Exam History in Arabic (UPDATED)
**Time:** 1 day | **Dependencies:** 4.7

Arabic history list.

#### Acceptance Criteria
1. Chronological with Arabic dates
2. Card with Arabic labels
3. Search/filter in Arabic
4. Sort options in Arabic
5. Swipe/menu in Arabic
6. Pull-to-refresh
7. Empty state in Arabic

---

#### Story 4.14: Progress Tracking in Arabic (UPDATED)
**Time:** 1.5 days | **Dependencies:** 4.13

Arabic progress visualization.

#### Acceptance Criteria
1. Charts with Arabic labels
2. Subject progress in Arabic
3. Average scores
4. Streak in Arabic
5. Badges in Arabic
6. Improvement in Arabic
7. **RTL charts**

---

#### Story 4.15: Exam Retry in Arabic
**Time:** 0.5 day | **Dependencies:** 4.13

Arabic retry flow.

#### Acceptance Criteria
1. "إعادة الامتحان" button
2. New questions generated
3. Randomized order
4. Track attempt in Arabic
5. Compare in Arabic
6. Review option in Arabic
7. Limit with Arabic message

---

### Story 4.16: Responsive & Accessible (Arabic)
**Time:** 2 days | **Dependencies:** All Track A-D

Arabic accessibility compliance.

#### Acceptance Criteria
1. Responsive RTL layouts
2. Touch/mouse/keyboard support
3. **Arabic VoiceOver/TalkBack support**
4. High contrast
5. Dynamic type for Arabic
6. Reduce motion
7. **Arabic keyboard navigation**

---

## PHASE 5: Deployment + Arabic Localization (6-8 days)

**Goal:** Deploy with Arabic app store listings and localization.

**Total Time:** 6-8 days
**Parallel Work:** Limited

### Story 5.1: iOS App Store Prep (Arabic) (UPDATED)
**Time:** 1.5 days | **Dependencies:** All Phase 0-4

Arabic App Store presence.

#### Acceptance Criteria
1. App Store Connect account
2. Bundle identifier
3. App icons
4. Launch screen
5. Privacy policy (Arabic + English)
6. **App Store listing in Arabic**
7. **Arabic screenshots for all devices**
8. **Arabic app preview video (optional)**
9. Keywords in Arabic
10. Subscription compliance

**Arabic App Store Listing:**
- Title: "أي إمتحان - امتحانات ذكية"
- Subtitle: "إنشاء امتحانات بالذكاء الاصطناعي"
- Description: Full Arabic description
- Keywords: امتحانات، دراسة، تعليم، ذكاء اصطناعي

---

### Story 5.2: Android Play Store Prep (Arabic) (UPDATED)
**Time:** 1.5 days | **Dependencies:** All Phase 0-4

Arabic Play Store presence.

#### Acceptance Criteria
1. Play Console account
2. Package name
3. App icons
4. Splash screen
5. Privacy policy
6. **Play Store listing in Arabic**
7. **Arabic screenshots**
8. Feature graphic in Arabic

---

### Story 5.3: EAS Build & Submit
**Time:** 1 day | **Dependencies:** 5.1, 5.2

Build configuration.

#### Acceptance Criteria
1. EAS Build profiles
2. iOS provisioning
3. Android keystore
4. Version bumping
5. Build triggers
6. EAS Submit configured
7. Test builds successful

---

### Story 5.4: Beta Testing (Arabic Users)
**Time:** 2-3 days | **Dependencies:** 5.3

Test with Arabic speakers.

#### Acceptance Criteria
1. TestFlight (iOS)
2. Internal testing (Android)
3. **Test with native Arabic speakers**
4. Feedback collection in Arabic
5. Bug tracking
6. Payment flow testing
7. 3+ days stable beta
8. Positive feedback

---

### Story 5.5: Web Deployment with Arabic
**Time:** 0.5 day | **Dependencies:** All Phase 0-4

Deploy Arabic web app.

#### Acceptance Criteria
1. Vercel deployment
2. Custom domain
3. Environment variables
4. Build optimization
5. CDN caching
6. Analytics
7. Health check
8. **Stripe webhook at /api/stripe-webhook**
9. **Arabic landing page at /ar**

---

### Story 5.6: Monitoring & Analytics
**Time:** 1 day | **Dependencies:** 5.5

Monitoring setup.

#### Acceptance Criteria
1. Sentry (all platforms)
2. Analytics events (Arabic context)
3. Dashboards (MRR, conversion, churn)
4. Alert rules
5. Performance monitoring
6. Stripe webhook logging
7. Privacy compliance

---

### Story 5.7: App Store Submission
**Time:** 1 day + review | **Dependencies:** 5.4

Submit to stores.

#### Acceptance Criteria
1. iOS submitted via EAS
2. Android submitted via EAS
3. Review notes in English (for reviewers)
4. Demo account
5. Compliance disclosures
6. Submission accepted
7. Apps approved and live

---

### Story 5.8: OTA Update Configuration
**Time:** 0.5 day | **Dependencies:** 5.7

OTA updates setup.

#### Acceptance Criteria
1. EAS Update configured
2. Update channels
3. Automatic updates
4. Rollback capability
5. Update optimization
6. Monitoring
7. First OTA deployed

---

### Story 5.9: Arabic Email Templates (NEW)
**Time:** 1 day | **Dependencies:** 1.5.3

Create Arabic email templates.

#### Acceptance Criteria
1. Welcome email in Arabic
2. Payment success in Arabic
3. Payment failed in Arabic
4. Subscription cancelled in Arabic
5. Approaching limit warning in Arabic
6. Password reset in Arabic
7. All templates tested

**Example:**
```
Subject: مرحباً بك في أي إمتحان! 🎉

مرحباً {name}،

شكراً لانضمامك إلى أي إمتحان!

بدأت الآن في الخطة المجانية:
✓ ٥ امتحانات شهرياً
✓ ١٠ أسئلة لكل امتحان
✓ محتوى تعليمي منسق

هل تريد المزيد؟ قم بالترقية للنسخة الاحترافية للحصول على:
✓ ٥٠ امتحان شهرياً
✓ ٥٠ سؤال لكل امتحان
✓ رفع المستندات الخاصة بك

ابدأ الآن: [إنشاء امتحانك الأول]

بالتوفيق!
فريق أي إمتحان
```

---

## Launch Checklist

**Pre-Launch:**
- [ ] Privacy policy (Arabic + English) written and hosted
- [ ] Terms of service (Arabic + English) written
- [ ] App Store accounts created
- [ ] Domain purchased (anyexamai.com)
- [ ] Supabase production project
- [ ] OpenAI API key
- [ ] Anthropic API key
- [ ] **Stripe account (supports SAR currency)**
- [ ] **Stripe products (37 SAR/month)**
- [ ] Stripe webhook configured
- [ ] **Arabic content ready (1000+ chunks)**
- [ ] **Arabic fonts licensed**

**Technical Pre-Launch:**
- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings fixed
- [ ] **RTL layouts tested on real devices**
- [ ] **Arabic text rendering verified**
- [ ] Database migrations tested
- [ ] Edge Functions tested
- [ ] **Payment flow tested (Arabic checkout)**
- [ ] **Webhook events verified**
- [ ] **Arabic email templates tested**
- [ ] API rate limits configured
- [ ] Cost monitoring enabled

**Post-Launch:**
- [ ] Monitor errors (Sentry)
- [ ] Track metrics (MRR, conversion, churn)
- [ ] Respond to Arabic app store reviews
- [ ] Collect Arabic user feedback
- [ ] Track payment failures
- [ ] Plan iteration 2

---

## Success Metrics

**Technical Success:**
- <30s exam generation
- <2s screen loads
- 60fps animations
- 99.5% uptime
- <5% error rate
- **RTL performance = LTR performance**

**Business Success (Year 1):**
- 1,000 active users (Middle East)
- $10,000 MRR (1,000 Pro × $9.99 or 270 Pro × 37 SAR)
- 5% free-to-paid conversion
- <5% monthly churn
- 4.5+ stars (Arabic reviews)
- <40% API costs vs revenue

**Geographic Distribution Target:**
- Saudi Arabia: 40%
- UAE: 25%
- Egypt: 20%
- Jordan/Kuwait/Other: 15%

---

## Total Time Estimate: 9-13 Weeks

**Breakdown:**
- Phase 0: 4-5 days (Foundation + i18n + RTL)
- Phase 1: 6-8 days (UI + Auth + Language)
- Phase 1.5: 10-14 days (Monetization in Arabic)
- Phase 2: 8-11 days (Arabic Content)
- Phase 3: 8-12 days (Document Upload)
- Phase 4: 10-14 days (Exam Experience)
- Phase 5: 6-8 days (Deployment + Localization)

**Critical Success Factors:**
1. ✅ Arabic content quality (your existing content)
2. ✅ RTL testing on real devices
3. ✅ Arabic text rendering (proper letter shaping)
4. ✅ Cultural appropriateness (colors, images, language)
5. ✅ Payment flow in Arabic
6. ✅ App store optimization in Arabic

---

**Ready to start Phase 0 with Arabic-first development?** 🚀🇸🇦

**Would you like me to:**
1. Create Week-by-Week Development Plan?
2. Create Arabic Translation Template (all UI strings)?
3. Provide guidance on Arabic fonts and typography?
4. Help with Arabic app store listing copy?
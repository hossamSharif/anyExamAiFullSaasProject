# Authentication Setup Guide

## Overview

The `@anyexamai/api` package provides a complete authentication solution with:
- Email/password authentication
- Google OAuth
- Apple OAuth
- Session management with automatic persistence
- Arabic-first language support

## Features Implemented

### ✅ Auth Methods
- `signUp()` - Register new users with email/password
- `signIn()` - Sign in existing users
- `signOut()` - Sign out current user
- `signInWithGoogle()` - OAuth with Google
- `signInWithApple()` - OAuth with Apple
- `resetPassword()` - Send password reset email
- `updatePassword()` - Update user password
- `updateUserMetadata()` - Update user preferences

### ✅ Session Management
- Automatic session persistence (handled by Supabase)
- Auto-refresh tokens
- Secure storage (platform-specific)
- `useAuth()` hook for React components

### ✅ Arabic-First Support
- `preferredLanguage` stored on signup (defaults to 'ar')
- `usePreferredLanguage()` hook
- User metadata includes language preference

## Setup Instructions

### 1. Environment Variables

Ensure these variables are set in your environment:

```env
# Root .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Web app (apps/web/.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Mobile app (apps/mobile/.env)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
4. Go to Supabase Dashboard > Authentication > Providers
5. Enable Google and add your Client ID and Secret

#### Apple OAuth
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create a Sign in with Apple service
3. Add redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
4. Generate a private key
5. Go to Supabase Dashboard > Authentication > Providers
6. Enable Apple and configure with Service ID, Team ID, and Key

### 3. Mobile Deep Links

#### iOS (apps/mobile/ios/anyexamai/Info.plist)
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>anyexamai</string>
    </array>
  </dict>
</array>
```

#### Android (apps/mobile/android/app/src/main/AndroidManifest.xml)
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="anyexamai" />
</intent-filter>
```

## Usage Examples

### Sign Up with Email
```typescript
import { signUp } from '@anyexamai/api';

const result = await signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  preferredLanguage: 'ar', // defaults to 'ar'
  fullName: 'أحمد محمد',
});

if (result.error) {
  console.error('Sign up failed:', result.error);
} else {
  console.log('User created:', result.user);
}
```

### Sign In
```typescript
import { signIn } from '@anyexamai/api';

const result = await signIn({
  email: 'user@example.com',
  password: 'securePassword123',
});

if (result.error) {
  console.error('Sign in failed:', result.error);
} else {
  console.log('Signed in:', result.user);
}
```

### OAuth (Google/Apple)
```typescript
import { signInWithGoogle, signInWithApple } from '@anyexamai/api';

// Google
await signInWithGoogle({
  platform: 'mobile', // or 'web'
});

// Apple
await signInWithApple({
  platform: 'mobile', // or 'web'
});
```

### Using the Auth Hook
```typescript
import { useAuth } from '@anyexamai/api';

function MyComponent() {
  const { user, session, loading, isAuthenticated } = useAuth();

  if (loading) return <Text>Loading...</Text>;
  if (!isAuthenticated) return <Text>Please sign in</Text>;

  return <Text>Welcome {user.email}!</Text>;
}
```

### Get User's Preferred Language
```typescript
import { usePreferredLanguage } from '@anyexamai/api';

function MyComponent() {
  const language = usePreferredLanguage(); // 'ar' or 'en'

  return <Text>Current language: {language}</Text>;
}
```

## Story Checkpoints

### Story 1.3: Supabase Auth Integration

- [x] Initialize Supabase client in packages/api
- [x] Setup auth methods (signUp, signIn, signOut)
- [x] Session management with secure storage
- [x] OAuth configuration (Google, Apple)
- [x] Store preferredLanguage on signup

## Next Steps

1. **Story 1.4**: Create authentication screens in Arabic
2. **Story 1.5**: Implement protected routes and auth guards
3. Configure OAuth providers in Supabase dashboard (when ready to test)
4. Set up mobile deep link handlers for OAuth callbacks

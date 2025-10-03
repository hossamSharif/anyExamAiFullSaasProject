import { supabase } from './supabase';
import { getOAuthRedirectUrl } from './config/oauth';
import type { Session, User, AuthError } from '@supabase/supabase-js';

/**
 * Authentication API module
 * Provides authentication methods with Arabic language support
 */

export interface SignUpCredentials {
  email: string;
  password: string;
  preferredLanguage?: 'ar' | 'en';
  fullName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

/**
 * Sign up a new user with email and password
 * Stores preferredLanguage in user metadata for Arabic-first support
 */
export async function signUp({
  email,
  password,
  preferredLanguage = 'ar',
  fullName,
}: SignUpCredentials): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        preferredLanguage,
        fullName,
      },
    },
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn({
  email,
  password,
}: SignInCredentials): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the current session
 */
export async function getSession(): Promise<{
  session: Session | null;
  error: AuthError | null;
}> {
  const { data, error } = await supabase.auth.getSession();
  return {
    session: data.session,
    error,
  };
}

/**
 * Get the current user
 */
export async function getUser(): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  const { data, error } = await supabase.auth.getUser();
  return {
    user: data.user,
    error,
  };
}

/**
 * Sign in with Google OAuth
 * Automatically uses the correct redirect URL for platform
 */
export async function signInWithGoogle(options?: {
  redirectTo?: string;
  platform?: 'mobile' | 'web';
}): Promise<{ error: AuthError | null }> {
  const redirectTo = options?.redirectTo ?? getOAuthRedirectUrl(options?.platform);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { error };
}

/**
 * Sign in with Apple OAuth
 * Automatically uses the correct redirect URL for platform
 */
export async function signInWithApple(options?: {
  redirectTo?: string;
  platform?: 'mobile' | 'web';
}): Promise<{ error: AuthError | null }> {
  const redirectTo = options?.redirectTo ?? getOAuthRedirectUrl(options?.platform);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo,
    },
  });

  return { error };
}

/**
 * Send password reset email
 */
export async function resetPassword(
  email: string
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
}

/**
 * Update password (must be authenticated)
 */
export async function updatePassword(
  newPassword: string
): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { error };
}

/**
 * Update user metadata (e.g., preferredLanguage)
 */
export async function updateUserMetadata(metadata: {
  preferredLanguage?: 'ar' | 'en';
  fullName?: string;
  [key: string]: any;
}): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.updateUser({
    data: metadata,
  });
  return { error };
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

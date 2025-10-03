import { useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { getSession, getUser } from '../auth';

/**
 * Custom hook for auth state management
 * Automatically syncs with Supabase auth state changes
 * Session is persisted securely by Supabase client
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    getSession().then(({ session }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
  };
}

/**
 * Get user's preferred language from metadata
 */
export function usePreferredLanguage(): 'ar' | 'en' {
  const { user } = useAuth();
  return (user?.user_metadata?.preferredLanguage as 'ar' | 'en') ?? 'ar';
}

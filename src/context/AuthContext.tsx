import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, supabaseUrl, supabaseAnonKey } from '../lib/supabase';
import { Profile } from '../types';

export type AuthTab = 'login' | 'signup' | 'forgot' | 'reset';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  isPasswordRecoveryMode: boolean;
  isGoogleOAuthEnabled: boolean | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ user: User | null; session: Session | null; requiresConfirmation: boolean; error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalTab: AuthTab;
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function formatAuthError(error: AuthError | any): string {
  if (!error) return 'An unknown error occurred.';
  const msg = error.message || error.msg || error.error_description || String(error);

  if (msg.includes('Unsupported provider') || msg.includes('provider is not enabled')) {
    return 'Google Sign-In is not enabled in your Supabase project yet. In your Supabase Dashboard, go to Authentication → Providers → Google, enable it with your Google Client ID/Secret, or sign up with your email and password below.';
  }
  if (msg.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }
  if (msg.includes('User already registered') || msg.includes('already exists')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (msg.includes('Password should be at least') || msg.includes('weak_password')) {
    return 'Password must be at least 6 characters long.';
  }
  if (msg.includes('over_email_send_rate_limit') || msg.includes('rate limit') || msg.includes('rate_limit')) {
    return 'Supabase free tier email rate limit reached (typically 3 emails/hour on default SMTP). Please wait a few minutes before requesting another reset email, or configure custom SMTP in your Supabase dashboard.';
  }
  if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
    return 'Your email address is not confirmed yet. Please check your inbox for the confirmation link from Supabase.';
  }
  if (msg.includes('User not found')) {
    return 'No account was found with this email address. Please sign up first.';
  }
  if (msg.includes('Auth session missing') || msg.includes('session_missing')) {
    return 'Password reset link has expired or is invalid. Please request a new password reset email.';
  }
  return msg;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const configured = isSupabaseConfigured();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState(false);
  const [isGoogleOAuthEnabled, setIsGoogleOAuthEnabled] = useState<boolean | null>(null);

  // Check if Google OAuth provider is active in Supabase to provide clean UX
  useEffect(() => {
    if (!configured) {
      setIsGoogleOAuthEnabled(false);
      return;
    }
    const checkGoogleOAuth = async () => {
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/authorize?provider=google`, {
          method: 'GET',
          headers: {
            'apikey': supabaseAnonKey,
          },
        });
        if (res.status === 400) {
          const json = await res.json().catch(() => null);
          if (json?.error_code === 'validation_failed' || json?.msg?.includes('not enabled')) {
            setIsGoogleOAuthEnabled(false);
            return;
          }
        }
        setIsGoogleOAuthEnabled(res.ok || res.status < 400 || res.status === 302);
      } catch {
        setIsGoogleOAuthEnabled(false);
      }
    };
    checkGoogleOAuth();
  }, [configured]);

  const fetchProfile = async (userId: string, userEmail?: string, userMeta?: any) => {
    if (!configured) return;
    try {
      // Check by primary key id or user_id
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`id.eq.${userId},user_id.eq.${userId}`)
        .maybeSingle();

      if (data) {
        setProfile({
          id: data.id || userId,
          user_id: data.user_id || data.id || userId,
          full_name: data.name || data.full_name || userMeta?.full_name || userMeta?.name || (userEmail ? userEmail.split('@')[0] : 'Food Decode Member'),
          avatar_url: data.avatar_url || userMeta?.avatar_url || null,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString()
        });
      } else {
        // Fallback or seed initial profile
        const defaultName = userMeta?.full_name || userMeta?.name || (userEmail ? userEmail.split('@')[0] : 'Food Decode Member');
        const defaultAvatar = userMeta?.avatar_url || userMeta?.picture || null;
        
        // Attempt insert if permitted with both schemas
        const insertPayload: any = {
          id: userId,
          user_id: userId,
          name: defaultName,
          full_name: defaultName,
          email: userEmail,
          avatar_url: defaultAvatar
        };

        const { data: inserted } = await supabase
          .from('profiles')
          .insert(insertPayload)
          .select()
          .maybeSingle();

        if (inserted) {
          setProfile({
            id: inserted.id || userId,
            user_id: inserted.user_id || inserted.id || userId,
            full_name: inserted.name || inserted.full_name || defaultName,
            avatar_url: inserted.avatar_url || defaultAvatar,
            created_at: inserted.created_at || new Date().toISOString(),
            updated_at: inserted.updated_at || new Date().toISOString()
          });
        } else {
          setProfile({
            id: userId,
            user_id: userId,
            full_name: defaultName,
            avatar_url: defaultAvatar,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
    } catch {
      // Graceful fallback from metadata
      const defaultName = userMeta?.full_name || userMeta?.name || (userEmail ? userEmail.split('@')[0] : 'Food Decode Member');
      setProfile({
        id: userId,
        user_id: userId,
        full_name: defaultName,
        avatar_url: userMeta?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    // Check for recovery flow in URL hash or query parameters
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const isRecovery = 
        hash.includes('type=recovery') || 
        search.includes('type=recovery') ||
        (hash.includes('access_token=') && hash.includes('type=recovery')) ||
        search.includes('error=');

      if (isRecovery) {
        setIsPasswordRecoveryMode(true);
        setAuthModalTab('reset');
        setIsAuthModalOpen(true);
      }
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // 2. Listen for auth changes (including PASSWORD_RECOVERY & TOKEN_REFRESHED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecoveryMode(true);
          setAuthModalTab('reset');
          setIsAuthModalOpen(true);
        }

        if (newSession?.user) {
          await fetchProfile(newSession.user.id, newSession.user.email, newSession.user.user_metadata);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [configured]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!configured) {
      return { user: null, session: null, requiresConfirmation: false, error: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.' };
    }
    try {
      const emailRedirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
      });

      if (error) {
        return { user: null, session: null, requiresConfirmation: false, error: formatAuthError(error) };
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        if (data.user) {
          await fetchProfile(data.user.id, email, data.user.user_metadata);
        }
        return { user: data.user, session: data.session, requiresConfirmation: false, error: null };
      }

      // If user was created but session is null, email confirmation is enabled on Supabase
      const requiresConfirmation = Boolean(data.user && !data.session);
      return { user: data.user, session: null, requiresConfirmation, error: null };
    } catch (err: any) {
      return { user: null, session: null, requiresConfirmation: false, error: formatAuthError(err) };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!configured) {
      return { user: null, error: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: formatAuthError(error) };
      }

      if (data.user) {
        await fetchProfile(data.user.id, email, data.user.user_metadata);
      }

      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: formatAuthError(err) };
    }
  };

  const signInWithGoogle = async () => {
    if (!configured) {
      return { error: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.' };
    }
    try {
      const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      if (error) {
        return { error: formatAuthError(error) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  };

  const signOut = async () => {
    if (!configured) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    }
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: error ? formatAuthError(error) : null };
    } catch (err: any) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: formatAuthError(err) };
    }
  };

  const resetPassword = async (email: string) => {
    if (!configured) {
      return { error: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.' };
    }
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/#type=recovery` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      return { error: error ? formatAuthError(error) : null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!configured) {
      return { error: 'Supabase is not configured.' };
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        return { error: formatAuthError(error) };
      }
      setIsPasswordRecoveryMode(false);
      return { error: null };
    } catch (err: any) {
      return { error: formatAuthError(err) };
    }
  };

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!configured || !user) {
      return { error: 'You must be signed in to update your profile.' };
    }
    try {
      const payload: any = {
        updated_at: new Date().toISOString()
      };
      if (updates.full_name !== undefined) {
        payload.full_name = updates.full_name;
        payload.name = updates.full_name;
      }
      if (updates.avatar_url !== undefined) {
        payload.avatar_url = updates.avatar_url;
      }

      // Try updating where id = user.id
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (error) {
        // Fallback update where user_id = user.id
        await supabase
          .from('profiles')
          .update(payload)
          .eq('user_id', user.id);
      }

      setProfile((prev) => (prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null));
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to update profile.' };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email, user.user_metadata);
    }
  };

  const openAuthModal = (tab: AuthTab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    if (authModalTab === 'reset' && !isPasswordRecoveryMode) {
      setAuthModalTab('login');
    }
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: configured,
        isPasswordRecoveryMode,
        isGoogleOAuthEnabled,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshProfile,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';

export type AuthTab = 'login' | 'signup' | 'forgot' | 'reset';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  isPasswordRecoveryMode: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ user: User | null; error: string | null }>;
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
  const msg = error.message || String(error);
  if (msg.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }
  if (msg.includes('User already registered')) {
    return 'An account with this email already exists. Please log in instead.';
  }
  if (msg.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (msg.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (msg.includes('Email not confirmed')) {
    return 'Please confirm your email address or check your inbox.';
  }
  return msg;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState(false);

  const configured = isSupabaseConfigured();

  const fetchProfile = async (userId: string, userEmail?: string, userMeta?: any) => {
    if (!configured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data as Profile);
      } else {
        // Fallback or seed initial profile
        const defaultName = userMeta?.full_name || userMeta?.name || (userEmail ? userEmail.split('@')[0] : 'Food Decode Member');
        const defaultAvatar = userMeta?.avatar_url || userMeta?.picture || null;
        
        // Attempt insert if permitted
        const { data: inserted } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            full_name: defaultName,
            avatar_url: defaultAvatar
          })
          .select()
          .maybeSingle();

        if (inserted) {
          setProfile(inserted as Profile);
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

    // Check for recovery flow in URL hash
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setIsPasswordRecoveryMode(true);
      setAuthModalTab('reset');
      setIsAuthModalOpen(true);
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
      return { user: null, error: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.' };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          },
        },
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
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        return { error: error.message || 'Failed to update profile.' };
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

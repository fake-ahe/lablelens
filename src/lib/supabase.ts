import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types';

// Retrieve public frontend credentials from Vite environment variables
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

/**
 * Validates whether the required Supabase frontend environment variables are present.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim() !== '' &&
    supabaseAnonKey.trim() !== '' &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('placeholder')
  );
}

// Fallback placeholder values to prevent runtime instantiation crashes before user adds credentials
const clientUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-project.supabase.co';
const clientKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key';

/**
 * Clean, typed Supabase client for frontend database queries.
 * Note: Never expose SUPABASE_SERVICE_ROLE_KEY here.
 */
export const supabase: SupabaseClient = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});


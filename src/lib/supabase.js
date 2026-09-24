import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Checks whether Supabase environment variables are properly configured.
 * @returns {boolean}
 */
export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl.trim() !== '' && 
    supabaseKey.trim() !== '' &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('placeholder')
  );
}

// Ensure createClient receives valid string shapes to prevent initialization crashes
const validUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-project.supabase.co';
const validKey = isSupabaseConfigured() ? supabaseKey : 'placeholder-anon-key';

/**
 * Centralized Supabase Client instance
 */
export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

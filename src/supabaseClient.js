import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If Supabase credentials are not set, we'll use localStorage fallback
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co');

let supabase = null;
if (isSupabaseConfigured) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

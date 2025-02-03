import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button.');
}

export const supabase = createClient(
  supabaseUrl || 'placeholder-url',
  supabaseAnonKey || 'placeholder-key'
);
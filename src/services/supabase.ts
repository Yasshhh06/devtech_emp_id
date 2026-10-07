"use client";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isPlaceholderKey = (key?: string): boolean => {
  if (!key) return true;
  const k = key.trim();
  return (
    k === '' ||
    k === 'https://your-project.supabase.co' ||
    k === 'your-anon-key-here' ||
    k.includes('your-') ||
    k.includes('placeholder')
  );
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !isPlaceholderKey(supabaseUrl) &&
  !isPlaceholderKey(supabaseAnonKey)
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

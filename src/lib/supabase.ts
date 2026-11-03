import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type QrHistoryItem = {
  id: string;
  content: string;
  dark_color: string | null;
  light_color: string | null;
  size: number | null;
  has_logo: boolean;
  image_data: string | null;
  filename: string | null;
  created_at: string;
};

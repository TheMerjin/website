import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,     // <--- This enables session persistence
      autoRefreshToken: true,   // <--- This automatically refreshes the token before expiry
      detectSessionInUrl: false,
    }
  }
);
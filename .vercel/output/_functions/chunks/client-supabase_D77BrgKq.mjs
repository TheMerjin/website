import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://dgnyoigstpidxskpysra.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbnlvaWdzdHBpZHhza3B5c3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTcyNTcsImV4cCI6MjA2MzczMzI1N30.F2kczQmUPGLJAwC6OOpWehlHv22xZ049gwq3Cjfdmt8",
  {
    auth: {
      persistSession: true,
      // <--- This enables session persistence
      autoRefreshToken: true,
      // <--- This automatically refreshes the token before expiry
      detectSessionInUrl: false
    }
  }
);

export { supabase as s };

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://dgnyoigstpidxskpysra.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbnlvaWdzdHBpZHhza3B5c3JhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE1NzI1NywiZXhwIjoyMDYzNzMzMjU3fQ.yXNWEemCixysMgZm1OitCdFBJyZ0UqIbzyruOx2i320",
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

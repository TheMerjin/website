
import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';

export const GET: APIRoute = async ({ request }) => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    console.error("Error fetching user:", error?.message || "No user found");
  } else {
    const userId = user.id; // This is the UUID
    console.log("User ID (UUID):", userId);
    }
    const { data, error } = await supabase
  .from('profiles')
  .select()
  .eq('id', userId)

    
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
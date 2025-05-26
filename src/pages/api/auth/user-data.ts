export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';

export const GET: APIRoute = async ({ request }) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
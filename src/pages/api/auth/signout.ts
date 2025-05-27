export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Clear auth cookies or tokens here, e.g.:
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });
      // Supabase refresh token cookie name example

    // Respond with success
    return new Response(JSON.stringify({ message: 'Signed out successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to sign out' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};


import { supabase } from '../../../lib/client-supabase';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { password, accessToken } = await request.json();

  const { error } = await supabase.auth.updateUser(
    { password },
    { accessToken }
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
};
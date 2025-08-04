import { supabase } from '../../../lib/client-supabase';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { password, accessToken, refreshToken } = await request.json();
  supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
  const { error } = await supabase.auth.updateUser(
    { password },
    { accessToken }
  );
  
  console.log(error);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
};
import type { APIRoute, APIContext } from 'astro';
import { supabase } from '../../../lib/supabase.js';

async function getUserFromRequest(cookies: APIContext['cookies']) {
  const access_token = cookies.get('sb-access-token')?.value;
  if (!access_token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(access_token);
  if (error || !user) return null;
  return user;
}

export const GET: APIRoute = async ({ cookies, url }) => {
  const user = await getUserFromRequest(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const file_path = url.searchParams.get('file_path');
  if (!file_path) {
    return new Response(JSON.stringify({ error: 'Missing file_path' }), { status: 400 });
  }
  const { data, error } = await supabase.storage.from('archive').createSignedUrl(file_path, 60 * 60); // 1 hour
  if (error || !data?.signedUrl) {
    return new Response(JSON.stringify({ error: error?.message || 'Could not generate signed URL' }), { status: 500 });
  }
  return Response.redirect(data.signedUrl, 302);
}; 
import type { APIRoute, APIContext } from 'astro';
import { supabase } from '../../../lib/supabase.js';

async function getUserFromRequest(cookies: APIContext['cookies']) {
  const access_token = cookies.get('sb-access-token')?.value;
  if (!access_token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(access_token);
  if (error || !user) return null;
  return user;
}

export const GET: APIRoute = async ({ cookies }) => {
  const user = await getUserFromRequest(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const { data, error } = await supabase
    .from('digital_archive')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ entries: data }), { status: 200 });
};

export const POST: APIRoute = async ({ cookies, request }) => {
  const user = await getUserFromRequest(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const body = await request.json();
  const { subject, title, description, file_path } = body;
  if (!subject || !title || !file_path) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('digital_archive')
    .insert([{ user_id: user.id, subject, title, description, file_path }])
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ entry: data }), { status: 201 });
}; 
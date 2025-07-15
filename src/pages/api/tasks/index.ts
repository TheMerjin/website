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
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ tasks: data }), { status: 200 });
};

export const POST: APIRoute = async ({ cookies, request }) => {
  const user = await getUserFromRequest(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const body = await request.json();
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...body, user_id: user.id }])
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ task: data }), { status: 201 });
};

export const PATCH: APIRoute = async ({ cookies, request }) => {
  const user = await getUserFromRequest(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const { id, status } = await request.json();
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ task: data }), { status: 200 });
}; 
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const { id, time_left } = await request.json();
  if (!id || typeof time_left === 'undefined') {
    return new Response(JSON.stringify({ error: 'Missing id or time_left' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('tasks')
    .update({ time_left })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ task: data }), { status: 200 });
}; 
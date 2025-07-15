import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase.js';

export const POST: APIRoute = async ({ request }) => {
  const { id, status } = await request.json();
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
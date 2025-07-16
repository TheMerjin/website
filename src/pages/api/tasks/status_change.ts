import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase.js';

export const POST: APIRoute = async ({ request }) => {
  const { id, status } = await request.json();
  console.log(id, status);
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
  console.log(error);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
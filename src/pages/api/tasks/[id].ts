import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase.js';

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Task ID required' }), { status: 400 });
  }
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}; 
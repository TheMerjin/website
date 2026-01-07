import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, status, _update } = body;

    if (!id || !status) {
      return new Response(JSON.stringify({ error: 'Missing required fields: id, status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating task status:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

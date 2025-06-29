import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { user, title } = body;
    if (!user || !user.id || !title) {
      return new Response(JSON.stringify({ error: 'Missing user or noteId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { error: deleteError } = await supabase
      .from('notes')
      .delete()
      .eq('user_id', user.id)
      .eq('title', title);
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 
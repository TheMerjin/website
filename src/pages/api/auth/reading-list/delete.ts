import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const prerender = false;

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const user = body?.user;
    const id = body?.id?.toString();

    if (!user?.id || !id) {
      return new Response(JSON.stringify({ error: 'Missing user or id' }), { status: 400 });
    }

    const { error } = await supabase
      .from('reading_list_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};

import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const prerender = false;

const VALID_STATUS = new Set(['to_read', 'reading', 'finished']);

export const GET: APIRoute = async ({ request }) => {
  const userId = new URL(request.url).searchParams.get('user_id');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('reading_list_items')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ items: data || [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const user = body?.user;
    const id = body?.id?.toString();
    const title = body?.title?.toString()?.trim();
    const author = body?.author?.toString()?.trim() || '';
    const url = body?.url?.toString()?.trim() || '';
    const status = body?.status?.toString() || 'to_read';
    const notes = body?.notes?.toString() ?? '';

    if (!user?.id || !title) {
      return new Response(JSON.stringify({ error: 'Missing user or title' }), { status: 400 });
    }
    if (!VALID_STATUS.has(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });
    }

    const row = {
      user_id: user.id,
      title,
      author,
      url,
      status,
      notes,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { data, error } = await supabase
        .from('reading_list_items')
        .update(row)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
      return new Response(JSON.stringify({ item: data }), { status: 200 });
    }

    const { data, error } = await supabase
      .from('reading_list_items')
      .insert(row)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ item: data }), { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};

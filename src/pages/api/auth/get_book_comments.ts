import type { APIRoute } from 'astro';
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const book_id = url.searchParams.get('book_id');
  if (!book_id) {
    return new Response(JSON.stringify({ error: 'Missing book_id' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('book_comments')
    .select('*, profiles(username)')
    .eq('book_id', book_id)
    .order('created_at', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ comments: data }), { status: 200 });
}; 
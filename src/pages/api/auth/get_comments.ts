import type { APIRoute } from 'astro';
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const post_id = url.searchParams.get('post_id');
  if (!post_id) {
    return new Response(JSON.stringify({ error: 'Missing post_id' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', post_id)
    .order('created_at', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ comments: data }), { status: 200 });
}; 
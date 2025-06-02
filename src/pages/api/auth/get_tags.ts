import type { APIRoute } from 'astro';
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
const tag = url.searchParams.get("tag");

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq("name", tag).single()
  const tag_id = data.id

  const { data : comment_data, error: comment_error } = await supabase
  .from('comment_tags')
  .select('*')
    .eq("tag_id", tag_id).single()
  if (comment_error) {
    return new Response(JSON.stringify({ error: comment_error.message }), { status: 500 });
  }
    


  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ comments: data }), { status: 200 });
}; 
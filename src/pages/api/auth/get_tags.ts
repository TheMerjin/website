import type { APIRoute } from 'astro';
import { supabase } from "../../../lib/supabase";
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const comment_id = url.searchParams.get("comment_id");

  if (!comment_id) {
    return new Response(JSON.stringify({ error: "Missing comment_id" }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('comment_tags')
    .select('tag_id, tags(name)') // Assuming you have a relation to the tags table
    .eq('comment_id', comment_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const tags = data.map(row => row.tags.name); // Extract tag names
  return new Response(JSON.stringify({ tags }), { status: 200 });
};
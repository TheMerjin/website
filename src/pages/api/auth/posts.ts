import type { APIRoute } from 'astro';
import { supabase } from "../../../lib/supabase";
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { title, content, userId, username } = body;

  if (!userId) {
    return new Response(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
  }

  const { error } = await supabase.from('posts').insert({ author_id: userId, title, content, username : username});

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Post saved' }), { status: 200 });
};
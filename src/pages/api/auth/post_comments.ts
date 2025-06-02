import type { APIRoute } from 'astro';
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate fields as they actually appear
    if (!body || !body.content || !body.post_id) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log(body.username);
    const { data, error } = await supabase.from('comments').insert({
      content: body.content,
      post_id: body.post_id,
      author_id: user.id,
      parent_id: body.parent_id || null,
      username : body.username
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ comment : data}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Malformed JSON or server error' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
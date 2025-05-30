import type { APIRoute } from 'astro';
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Optional: validate expected fields
    if (!body || !body.comment || !body.postId) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Optional Supabase insert (comment this out if not needed yet)
    /*
    const { data, error } = await supabase.from('comments').insert({
      content: body.comment,
      post_id: body.postId,
      user_id: body.userId || null, // or get from session if applicable
      parent_id: body.parentId || null,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    */

    return new Response(JSON.stringify({ success: true }), {
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
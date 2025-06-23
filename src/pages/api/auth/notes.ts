import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

function isEmpty(obj: any): boolean {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { user, title, content } = body;

    if (isEmpty(user) || !title || !content) {
      return new Response(JSON.stringify({ error: "Missing user, title, or content" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { error: insertError } = await supabase
      .from('notes')
      .upsert(
        {
          user_id: user.id,
          title,
          content,
        },
        {
          onConflict: ['user_id', 'title'], // ⚠️ This requires a UNIQUE constraint in DB!
        }
      );

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

function isEmpty(obj: any): boolean {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { white, fen, status } = body;
    const username = white?.user_metadata?.username
    // Prevent duplicate open requests for the same user
    const { data: existing, error: checkError } = await supabase
      .from('games')
      .select('id')
      .eq('white', white.id)
      .eq('status', 'waiting')
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "You already have an open challenge." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Better validation for user object
    if (!white || !white.id || !status ) {
      console.error('Validation failed:', { user: !!white, userId: white?.id, status: !!status, fen: !!fen });
      return new Response(JSON.stringify({ error: "Missing user, title, or content" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { error: insertError } = await supabase
      .from('games')
      .insert(
        {
          white: white.id,
          fen: fen,
          status : status,
          white_username : username
        }
      );

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, white }), {
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
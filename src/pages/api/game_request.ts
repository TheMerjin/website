import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

function isEmpty(obj: any): boolean {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { white, fen, status, guest_opponent_name, is_guest_game } = body;
    const username = white?.user_metadata?.username;
    
    // Prevent duplicate open requests for the same user (only if not a guest game)
    if (!is_guest_game) {
      const { data: existing, error: checkError } = await supabase
        .from('games')
        .select('id')
        .eq('white', white.id)
        .eq('status', 'waiting')
        .is('is_guest_game', false)
        .maybeSingle();

      if (existing) {
        return new Response(JSON.stringify({ error: "You already have an open challenge." }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Better validation for user object
    if (!white || !white.id || !status ) {
      console.error('Validation failed:', { user: !!white, userId: white?.id, status: !!status, fen: !!fen });
      return new Response(JSON.stringify({ error: "Missing user or status" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For guest games, set black_username immediately if provided
    const gameData: any = {
      white: white.id,
      fen: fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      status: status,
      white_username: username,
      is_guest_game: is_guest_game || false,
    };

    if (is_guest_game && guest_opponent_name) {
      gameData.black_username = guest_opponent_name;
      // For guest games, set status to in_progress immediately so it can be played
      gameData.status = 'in_progress';
    }

    const {data: game, error: insertError } = await supabase
      .from('games')
      .insert(gameData)
      .select();
      

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: insertError.message, game : game }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, game : game  }), {
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
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { gameId, blackPlayer, guestName } = body;
    
    // Fetch the game
    const { data: game, error: fetchError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .maybeSingle();

    if (fetchError || !game) {
      return new Response(JSON.stringify({ error: 'Game not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if this is a guest game
    if (game.is_guest_game && !blackPlayer && !guestName) {
      return new Response(JSON.stringify({ error: 'Guest name required for guest games.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (game.status !== 'waiting' && !game.is_guest_game) {
      return new Response(JSON.stringify({ error: 'Game is not available to join.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the game: set black player and status to active
    const updateData: any = {
      status: 'in_progress'
    };

    if (blackPlayer && blackPlayer.id) {
      // Registered user joining
      updateData.black = blackPlayer.id;
      updateData.black_username = blackPlayer?.user_metadata?.username;
    } else if (guestName) {
      // Guest joining
      updateData.black_username = guestName;
      // black stays null for guests
    }

    const { data: updated, error: updateError } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', gameId)
      .select()
      .maybeSingle();

    if (updateError || !updated) {
      return new Response(JSON.stringify({ error: updateError ? updateError.message : 'No updated game returned.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const url = `${import.meta.env.PUBLIC_API_URL}chess/games/${gameId}`;
    return new Response(JSON.stringify({ game: updated, url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

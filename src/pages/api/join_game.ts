import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { gameId, blackPlayer } = body;

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

    if (game.status !== 'waiting') {
      return new Response(JSON.stringify({ error: 'Game is not available to join.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the game: set black player and status to active
    const { data: updated, error: updateError } = await supabase
      .from('games')
      .update({ black: blackPlayer.id, status: 'in_progress' })
      .eq('id', gameId)
      .select()
      .maybeSingle();

    if (updateError || !updated) {
      return new Response(JSON.stringify({ error:  updateError }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return Response.redirect(`${import.meta.env.PUBLIC_API_URL}games/${gameId}?msg=Registration%20successful`, 200);
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

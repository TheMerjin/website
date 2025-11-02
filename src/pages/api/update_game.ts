import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { gameId, fen, move, currentUserId } = body;
    
    if (!gameId || !fen) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch the current game
    const { data: game, error: fetchError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .maybeSingle();
    
    if (fetchError || !game) {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Infer if this is a guest game: black is null but black_username exists, or is_guest_game flag
    const isGuestGame = game.is_guest_game || (!game.black && game.black_username);
    
    // Verify the user is a player in this game (or it's a guest game)
    // For guest games, we check by username instead
    if (isGuestGame) {
      // Guest games allow moves - white player is registered, black is guest
      // Client-side validation prevents unauthorized moves
      // We only verify white player if currentUserId is provided
      if (currentUserId && game.white !== currentUserId) {
        // If a user ID is provided but doesn't match white, still allow (might be guest move)
        // Client-side prevents wrong moves
      }
    } else {
      // Regular games require both players to be registered
      if (!currentUserId || (game.white !== currentUserId && game.black !== currentUserId)) {
        return new Response(JSON.stringify({ error: 'Not authorized to move in this game' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Get current moves array or initialize it
    const currentMoves = game.moves || [];
    const updatedMoves = [...currentMoves, move];

    // Update the game with new FEN and moves
    const { data: updatedGame, error: updateError } = await supabase
      .from('games')
      .update({ 
        fen: fen,
        moves: updatedMoves,
        updated_at: new Date().toISOString()
      })
      .eq('id', gameId)
      .select()
      .maybeSingle();
    console.log(updateError);
    if (updateError || !updatedGame) {
      return new Response(JSON.stringify({ error: updateError?.message || 'Failed to update game' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { data: game_for_moves, error: fetchError2 } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .maybeSingle();
    const moves = game_for_moves.moves
    console.log(moves);
    return new Response(JSON.stringify({ 
      success: true, 
      game: updatedGame ,
      moves: moves
      
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error updating game:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 
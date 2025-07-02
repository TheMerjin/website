import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { gameId, fen,currentUserId, result,  winnerColor} = body;
    
    if (!gameId || !fen || !currentUserId) {
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
    const whiteUserid = game.white;
    const blackUserId =  game.black;
    let winner_id = null;
    if (winnerColor){
        winner_id = game[winnerColor];
    }
    
    if (fetchError || !game) {
      return new Response(JSON.stringify({ error: 'Game not found', fetchError : fetchError }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify the user is a player in this game
    if (game.white !== currentUserId && game.black !== currentUserId) {
      return new Response(JSON.stringify({ error: 'Not authorized to move in this game' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get current moves array or initialize it
    const currentMoves = game.moves || [];


    // Update the game with new FEN and moves
    const { data: updatedGame, error: updateError } = await supabase
    if   .from('games')
      .update({ 
        status : "completed",
        result : result,
        winner_id : winner_id
        

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
    const moves = game_for_moves.moves;
    
    console.log(moves);

    /*
    const {data: white_data, error : white_error} =  await supabase
    .from('profiles')
    .select('*')
    .eq('id', whiteUserid)
    .maybeSingle();
    const white_mean = white_data.skill_mean;
    const white_var = white_data.skill_variance;
    const {data: black_data, error : black_error} =  await supabase
    .from('profiles')
    .select('*')
    .eq('id', whiteUserid)
    .maybeSingle();
    const black_mean = black_data.skill_mean;
    const black_var = black_data.skill_variance;
    if (result === "Draw"){
	
     } else {
    if (winnerColor === "White") {
    const winner_mean = white_mean;
    const winner_var = white_var;    
    const loser_mean = black_mean; const loser_var = black_var;	
    const elo_diff = winner_mean-loser_mean;
    const 
     } else {
     const winner_mean = black_mean; const winner_var = black_var;
     const loser_mean = white_mean; const loser_var = white_var;	

     }
     
     
     
     }
	


    */








     

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

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { jStat } from 'jstat';
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
      .from('games')
      .update({ 
        status: "completed",
        result: result,
        winner_id: winner_id
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
    .eq('id', blackUserId)
    .maybeSingle();
    const black_mean = black_data.skill_mean;
    const black_var = black_data.skill_variance;
    if (result === "Draw"){
      // For draws, we don't update ratings
      console.log("Game ended in draw - no rating updates needed");
     } else {
    if (winnerColor === "White") {
    const winner_mean = white_mean;
    const winner_var = white_var;    
    const loser_mean = black_mean; const loser_var = black_var;	
    const c = Math.sqrt(800+ winner_var + loser_var);
    const z = (winner_mean- loser_mean)/ c;
    let pWin = jStat.normal.cdf(z, 0, 1);
    const error = 1- pWin;
    const v  = (jStat.normal.pdf(z, Math.sqrt(800)))/(jStat.normal.cdf(z, 0, 1));
    const w = v* (v+z);
    const new_winner_mean = winner_mean+ winner_var*v/c;
    const new_loser_mean = loser_mean-winner_var* v/c;
    const new_winner_var = winner_var * (1- w*(winner_var/c));
    const new_loser_var = loser_var * (1- w* (winner_var/c));
    
    // Update winner (white) profile
    const { error: updateWinnerError } = await supabase
      .from('profiles')
      .update({ 
        skill_mean: new_winner_mean,
        skill_variance: new_winner_var
      })
      .eq('id', whiteUserid);
    
    if (updateWinnerError) {
      console.error('Error updating winner profile:', updateWinnerError);
    }

    // Update loser (black) profile
    const { error: updateLoserError } = await supabase
      .from('profiles')
      .update({ 
        skill_mean: new_loser_mean,
        skill_variance: new_loser_var
      })
      .eq('id', blackUserId);
    
    if (updateLoserError) {
      console.error('Error updating loser profile:', updateLoserError);
    }

     } else {
     const winner_mean = black_mean; const winner_var = black_var;
     const loser_mean = white_mean; const loser_var = white_var;	
     const c = Math.sqrt(800+ winner_var + loser_var);
     const z = (winner_mean- loser_mean)/ c;
     let pWin = jStat.normal.cdf(z, 0, 1);
     const error = 1- pWin;
     const v  = (jStat.normal.pdf(z, Math.sqrt(800)))/(jStat.normal.cdf(z, 0, 1));
     const w = v* (v+z);
     const new_winner_mean = winner_mean+ winner_var*v/c;
     const new_loser_mean = loser_mean-winner_var* v/c;
     const new_winner_var = winner_var * (1- w*(winner_var/c));
     const new_loser_var = loser_var * (1- w* (winner_var/c));
     
    // Update winner (black) profile
    const { error: updateWinnerError } = await supabase
      .from('profiles')
      .update({ 
        skill_mean: new_winner_mean,
        skill_variance: new_winner_var
      })
      .eq('id', blackUserId);
    
    if (updateWinnerError) {
      console.error('Error updating winner profile:', updateWinnerError);
    }

    // Update loser (white) profile
    const { error: updateLoserError } = await supabase
      .from('profiles')
      .update({ 
        skill_mean: new_loser_mean,
        skill_variance: new_loser_var
      })
      .eq('id', whiteUserid);
    
    if (updateLoserError) {
      console.error('Error updating loser profile:', updateLoserError);
    }

     }
     
     
     
     }
	








     

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

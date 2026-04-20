import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
import pkg from 'jstat';
export { renderers } from '../../renderers.mjs';

const { jStat } = pkg;
const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { gameId, fen, currentUserId, result, winnerColor } = body;
    if (!gameId || !fen || !currentUserId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: game, error: fetchError } = await supabase.from("games").select("*").eq("id", gameId).maybeSingle();
    const whiteUserid = game.white;
    const blackUserId = game.black;
    let winner_id = null;
    if (winnerColor) {
      winner_id = game[winnerColor];
    }
    if (game.status === "completed") {
      return new Response(JSON.stringify({
        success: true,
        game,
        message: "Game already completed"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (fetchError || !game) {
      return new Response(JSON.stringify({ error: "Game not found", fetchError }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (game.white !== currentUserId && game.black !== currentUserId) {
      return new Response(JSON.stringify({ error: "Not authorized to move in this game" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const currentMoves = game.moves || [];
    if (game.status === "completed") {
      return new Response(JSON.stringify({
        success: true,
        game,
        message: "Game already completed"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: updatedGame, error: updateError } = await supabase.from("games").update({
      status: "completed",
      result,
      winner_id
    }).eq("id", gameId).select().maybeSingle();
    console.log(updateError);
    if (updateError || !updatedGame) {
      return new Response(JSON.stringify({ error: updateError?.message || "Failed to update game" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: game_for_moves, error: fetchError2 } = await supabase.from("games").select("*").eq("id", gameId).maybeSingle();
    const moves = game_for_moves.moves;
    console.log(moves);
    const { data: white_data, error: white_error } = await supabase.from("profiles").select("*").eq("id", whiteUserid).maybeSingle();
    const white_mean = white_data.skill_mean;
    const white_var = white_data.skill_variance;
    const { data: black_data, error: black_error } = await supabase.from("profiles").select("*").eq("id", blackUserId).maybeSingle();
    const black_mean = black_data.skill_mean;
    const black_var = black_data.skill_variance;
    if (result === "Draw") {
      console.log("Game ended in draw - no rating updates needed");
    } else {
      if (winnerColor === "White") {
        const winner_mean = white_mean;
        const winner_var = white_var;
        const loser_mean = black_mean;
        const loser_var = black_var;
        const c = Math.sqrt(800 + winner_var + loser_var);
        const z = (winner_mean - loser_mean) / c;
        let pWin = jStat.normal.cdf(z, 0, 1);
        const error = 1 - pWin;
        const v = jStat.normal.pdf(z, 0, 1) / jStat.normal.cdf(z, 0, 1);
        const w = v * (v + z);
        const new_winner_mean = winner_mean + winner_var * v / c;
        const new_loser_mean = loser_mean - winner_var * v / c;
        const beta_squared = 800;
        const new_winner_var = 1 / (1 / winner_var + 1 / beta_squared);
        const new_loser_var = 1 / (1 / loser_var + 1 / beta_squared);
        const { error: updateWinnerError } = await supabase.from("profiles").update({
          skill_mean: new_winner_mean,
          skill_variance: new_winner_var
        }).eq("id", whiteUserid);
        if (updateWinnerError) {
          console.error("Error updating winner profile:", updateWinnerError);
        }
        const { error: updateLoserError } = await supabase.from("profiles").update({
          skill_mean: new_loser_mean,
          skill_variance: new_loser_var
        }).eq("id", blackUserId);
        if (updateLoserError) {
          console.error("Error updating loser profile:", updateLoserError);
        }
        console.log("White (Winner) - Old mean:", white_mean, "New mean:", new_winner_mean, "Old var:", white_var, "New var:", new_winner_var);
        console.log("Black (Loser) - Old mean:", black_mean, "New mean:", new_loser_mean, "Old var:", black_var, "New var:", new_loser_var);
      } else {
        const winner_mean = black_mean;
        const winner_var = black_var;
        const loser_mean = white_mean;
        const loser_var = white_var;
        const c = Math.sqrt(800 + winner_var + loser_var);
        const z = (winner_mean - loser_mean) / c;
        let pWin = jStat.normal.cdf(z, 0, 1);
        const error = 1 - pWin;
        const v = jStat.normal.pdf(z, 0, 1) / jStat.normal.cdf(z, 0, 1);
        const w = v * (v + z);
        const new_winner_mean = winner_mean + winner_var * v / c;
        const new_loser_mean = loser_mean - winner_var * v / c;
        const beta_squared = 800;
        const new_winner_var = 1 / (1 / winner_var + 1 / beta_squared);
        const new_loser_var = 1 / (1 / loser_var + 1 / beta_squared);
        const { error: updateWinnerError } = await supabase.from("profiles").update({
          skill_mean: new_winner_mean,
          skill_variance: new_winner_var
        }).eq("id", blackUserId);
        if (updateWinnerError) {
          console.error("Error updating winner profile:", updateWinnerError);
        }
        const { error: updateLoserError } = await supabase.from("profiles").update({
          skill_mean: new_loser_mean,
          skill_variance: new_loser_var
        }).eq("id", whiteUserid);
        if (updateLoserError) {
          console.error("Error updating loser profile:", updateLoserError);
        }
        console.log("Black (Winner) - Old mean:", black_mean, "New mean:", new_winner_mean, "Old var:", black_var, "New var:", new_winner_var);
        console.log("White (Loser) - Old mean:", white_mean, "New mean:", new_loser_mean, "Old var:", white_var, "New var:", new_loser_var);
      }
    }
    return new Response(JSON.stringify({
      success: true,
      game: updatedGame,
      moves
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating game:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

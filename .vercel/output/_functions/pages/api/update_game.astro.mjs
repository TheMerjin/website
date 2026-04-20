import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { gameId, fen, move, currentUserId } = body;
    if (!gameId || !fen) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: game, error: fetchError } = await supabase.from("games").select("*").eq("id", gameId).maybeSingle();
    if (fetchError || !game) {
      return new Response(JSON.stringify({ error: "Game not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const isGuestGame = game.is_guest_game || !game.black && game.black_username;
    if (isGuestGame) {
      if (currentUserId && game.white !== currentUserId) {
      }
    } else {
      if (!currentUserId || game.white !== currentUserId && game.black !== currentUserId) {
        return new Response(JSON.stringify({ error: "Not authorized to move in this game" }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const currentMoves = game.moves || [];
    const updatedMoves = [...currentMoves, move];
    const { data: updatedGame, error: updateError } = await supabase.from("games").update({
      fen,
      moves: updatedMoves,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
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

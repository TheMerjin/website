import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { gameId, blackPlayer, guestName } = body;
    const { data: game, error: fetchError } = await supabase.from("games").select("*").eq("id", gameId).maybeSingle();
    if (fetchError || !game) {
      return new Response(JSON.stringify({ error: "Game not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const isGuestGame = game.is_guest_game || !game.black && game.black_username;
    if (isGuestGame && !blackPlayer && !guestName) {
      return new Response(JSON.stringify({ error: "Guest name required for guest games." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (game.status !== "waiting" && !isGuestGame) {
      return new Response(JSON.stringify({ error: "Game is not available to join." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const updateData = {
      status: "in_progress"
    };
    if (blackPlayer && blackPlayer.id) {
      updateData.black = blackPlayer.id;
      updateData.black_username = blackPlayer?.user_metadata?.username;
    } else if (guestName) {
      updateData.black_username = guestName;
    }
    const { data: updated, error: updateError } = await supabase.from("games").update(updateData).eq("id", gameId).select().maybeSingle();
    if (updateError || !updated) {
      return new Response(JSON.stringify({ error: updateError ? updateError.message : "No updated game returned." }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }
    const url = `${"http://localhost:4321/"}chess/games/${gameId}`;
    return new Response(JSON.stringify({ game: updated, url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
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

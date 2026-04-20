import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { white, fen, status, guest_opponent_name, is_guest_game } = body;
    const username = white?.user_metadata?.username;
    if (!is_guest_game) {
      const { data: existing, error: checkError } = await supabase.from("games").select("id").eq("white", white.id).eq("status", "waiting").not("black", "is", null).maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ error: "You already have an open challenge." }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (!white || !white.id || !status) {
      console.error("Validation failed:", { user: !!white, userId: white?.id, status: !!status, fen: !!fen });
      return new Response(JSON.stringify({ error: "Missing user or status" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const gameData = {
      white: white.id,
      fen: fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      status,
      white_username: username
      // black stays null for guest games (this is how we identify them)
    };
    if (is_guest_game && guest_opponent_name) {
      gameData.black_username = guest_opponent_name;
      gameData.status = "in_progress";
    }
    const { data: game, error: insertError } = await supabase.from("games").insert(gameData).select();
    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: insertError.message, game }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true, game }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Server error:", error);
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

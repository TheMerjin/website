import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async () => {
  try {
    const { data: players, error } = await supabase.from("profiles").select("id, username, skill_mean, skill_variance").order("skill_mean", { ascending: false }).limit(50);
    if (error) {
      console.error("Error fetching leaderboard:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch leaderboard" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const playersWithGames = await Promise.all(
      players.map(async (player) => {
        const { count: gamesPlayed } = await supabase.from("games").select("*", { count: "exact", head: true }).or(`white.eq.${player.id},black.eq.${player.id}`).eq("status", "completed");
        return {
          ...player,
          games_played: gamesPlayed || 0
        };
      })
    );
    return new Response(JSON.stringify({
      success: true,
      players: playersWithGames
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in leaderboard API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

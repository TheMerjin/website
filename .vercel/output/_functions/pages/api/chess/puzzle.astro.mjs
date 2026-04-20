export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  try {
    let response = await fetch("https://lichess.org/api/puzzle/daily");
    if (!response.ok) {
      const rating = Math.floor(Math.random() * 500) + 1500;
      response = await fetch(`https://lichess.org/api/puzzle?rating=${rating}`);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch puzzle from Lichess: ${response.status}`);
    }
    const data = await response.json();
    if (data.game?.id && data.puzzle?.initialPly !== void 0) {
      try {
        const gameResponse = await fetch(`https://lichess.org/game/export/${data.game.id}?pgnInJson=true`);
        if (gameResponse.ok) {
          const gameExport = await gameResponse.json();
          data.game.pgn = gameExport.pgn;
        }
      } catch (e) {
        console.warn("Failed to fetch game PGN:", e);
      }
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error fetching puzzle:", error);
    return new Response(JSON.stringify({ error: error.message }), {
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

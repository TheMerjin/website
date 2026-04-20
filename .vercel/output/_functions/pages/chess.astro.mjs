import { c as createComponent, d as renderTemplate, b as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$ChessWebsiteLayout } from '../chunks/ChessWebsiteLayout_DPkXQmpV.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from '../chunks/client-supabase_D77BrgKq.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

function ChallengesRealtime() {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  async function loadGameRequests() {
    setLoading(true);
    try {
      const response = await fetch("/api/get_game_requests");
      const data = await response.json();
      if (data.error) {
        setError("Error loading challenges");
        setChallenges([]);
      } else {
        console.log(data.games);
        setChallenges(data.games || []);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load challenges");
      setChallenges([]);
    }
    setLoading(false);
  }
  async function joinGame(gameId) {
    try {
      const res = await fetch("/api/auth/user-data");
      const data = await res.json();
      const user = data.user;
      if (!user || !user.id) {
        alert("Please log in to join a game");
        return;
      }
      const response = await fetch("/api/join_game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, blackPlayer: user })
      });
      if (response.ok) {
        loadGameRequests();
        const data2 = await response.json();
        if (data2.url) {
          window.location.href = data2.url;
        }
        alert("Game joined successfully!");
      } else {
        alert("Failed to join game");
      }
    } catch (error2) {
      alert("Error joining game");
    }
  }
  useEffect(() => {
    console.log("NEW GAME LOADING!!!");
    loadGameRequests();
    const channel = supabase.channel("public:games").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "games" },
      (payload) => {
        console.log("Supabase Realtime event received:", payload);
        loadGameRequests();
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "challenges-list", id: "game-requests-list", children: [
    loading && /* @__PURE__ */ jsx("div", { className: "loading", children: "Loading challenges..." }),
    error && /* @__PURE__ */ jsx("div", { className: "error", children: error }),
    !loading && !error && challenges.length === 0 && /* @__PURE__ */ jsx("div", { className: "no-games", children: "No challenges available" }),
    !loading && !error && challenges.map((game) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "challenge-row",
        tabIndex: 0,
        "data-game-id": game.id,
        onClick: () => joinGame(game.id),
        children: /* @__PURE__ */ jsx("span", { className: "challenge-player", children: game?.white_username || "Anonymous" })
      },
      game.id
    ))
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Chess = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", " <script type=\"module\">\n    let pollInterval = 2;\n    if (document){\n    const correspondenceButton = document.getElementById(\"correspondence-buttton\");\n    if (correspondenceButton) {\n      correspondenceButton.addEventListener(\"click\", gameRequest); \n    }\n    const createGuestBtn = document.getElementById(\"create-guest-game-btn\");\n    if (createGuestBtn) {\n      createGuestBtn.addEventListener(\"click\", createGuestGame);\n    }\n    }\n    async function createGuestGame() {\n      const guestName = prompt(\"Enter the name of your guest opponent:\");\n      if (!guestName || !guestName.trim()) {\n        return;\n      }\n      try {\n        const res = await fetch('/api/auth/user-data');\n        const data = await res.json();\n        const user = data.user;\n        if (!user || !user.id) {\n          alert('Please log in to create a game');\n          return;\n        }\n        const gameRequestRes = await fetch('/api/game_request', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({\n            white: user,\n            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',\n            status: 'waiting',\n            guest_opponent_name: guestName.trim(),\n            is_guest_game: true,\n          }),\n        });\n        const body = await gameRequestRes.json();\n        if (!gameRequestRes.ok || !body.success) {\n          alert(body.error || 'Failed to create game');\n          return;\n        }\n        const game = body.game[0];\n        const gameUrl = `${window.location.origin}/chess/games/${game.id}`;\n        try {\n          await navigator.clipboard.writeText(gameUrl);\n          alert(`Game created! Link copied to clipboard:\\n${gameUrl}\\n\\nShare this link with ${guestName} - no account needed!`);\n        } catch (e) {\n          alert(`Game created! Share this link with ${guestName}:\\n${gameUrl}`);\n        }\n      } catch (err) {\n        console.error('Error creating guest game:', err);\n        alert('Something went wrong');\n      }\n    }\n    async function gameRequest() {\n  try {\n    const res = await fetch('/api/auth/user-data');\n    const data = await res.json();\n\n    const user = data.user;\n    console.log(user);\n    if (!user || !user.id) {\n      console.error('No user data available');\n      return;\n    }\n    const gameRequestRes = await fetch('/api/game_request', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json', // Tell server we're sending JSON\n    },\n    body: JSON.stringify({\n      white: user,\n      fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',\n      status : \"waiting\"\n    }),\n  });\n  const body = await gameRequestRes.json();\n  console.log(body);\n  const game = body.game;\n  const gameId = game[0].id;\n  console.log(game[0].id);\n  if (gameId){\n    pollInterval = setInterval(() => pollGameStatus(gameId), 2000);\n    console.log(pollInterval);\n  }\n\n  } catch (err) {\n    console.error('Something went wrong:', err);\n  }\n}\n\nasync function pollGameStatus(gameId) {\n  try {\n    const res = await fetch(`api/get_active_game_requests`);\n    const data = await res.json();\n    const correctPost = data.games.find((game) => game.id == gameId);\n    console.log(data);\n    if (correctPost.status === 'in_progress') {\n      clearInterval(pollInterval);\n      window.location.href = `/chess/games/${gameId}`;\n    }\n  } catch (err) {\n    console.error('Error polling game status:', err);\n  }\n}\n\n\n<\/script> "], ["", " <script type=\"module\">\n    let pollInterval = 2;\n    if (document){\n    const correspondenceButton = document.getElementById(\"correspondence-buttton\");\n    if (correspondenceButton) {\n      correspondenceButton.addEventListener(\"click\", gameRequest); \n    }\n    const createGuestBtn = document.getElementById(\"create-guest-game-btn\");\n    if (createGuestBtn) {\n      createGuestBtn.addEventListener(\"click\", createGuestGame);\n    }\n    }\n    async function createGuestGame() {\n      const guestName = prompt(\"Enter the name of your guest opponent:\");\n      if (!guestName || !guestName.trim()) {\n        return;\n      }\n      try {\n        const res = await fetch('/api/auth/user-data');\n        const data = await res.json();\n        const user = data.user;\n        if (!user || !user.id) {\n          alert('Please log in to create a game');\n          return;\n        }\n        const gameRequestRes = await fetch('/api/game_request', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({\n            white: user,\n            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',\n            status: 'waiting',\n            guest_opponent_name: guestName.trim(),\n            is_guest_game: true,\n          }),\n        });\n        const body = await gameRequestRes.json();\n        if (!gameRequestRes.ok || !body.success) {\n          alert(body.error || 'Failed to create game');\n          return;\n        }\n        const game = body.game[0];\n        const gameUrl = \\`\\${window.location.origin}/chess/games/\\${game.id}\\`;\n        try {\n          await navigator.clipboard.writeText(gameUrl);\n          alert(\\`Game created! Link copied to clipboard:\\\\n\\${gameUrl}\\\\n\\\\nShare this link with \\${guestName} - no account needed!\\`);\n        } catch (e) {\n          alert(\\`Game created! Share this link with \\${guestName}:\\\\n\\${gameUrl}\\`);\n        }\n      } catch (err) {\n        console.error('Error creating guest game:', err);\n        alert('Something went wrong');\n      }\n    }\n    async function gameRequest() {\n  try {\n    const res = await fetch('/api/auth/user-data');\n    const data = await res.json();\n\n    const user = data.user;\n    console.log(user);\n    if (!user || !user.id) {\n      console.error('No user data available');\n      return;\n    }\n    const gameRequestRes = await fetch('/api/game_request', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json', // Tell server we're sending JSON\n    },\n    body: JSON.stringify({\n      white: user,\n      fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',\n      status : \"waiting\"\n    }),\n  });\n  const body = await gameRequestRes.json();\n  console.log(body);\n  const game = body.game;\n  const gameId = game[0].id;\n  console.log(game[0].id);\n  if (gameId){\n    pollInterval = setInterval(() => pollGameStatus(gameId), 2000);\n    console.log(pollInterval);\n  }\n\n  } catch (err) {\n    console.error('Something went wrong:', err);\n  }\n}\n\nasync function pollGameStatus(gameId) {\n  try {\n    const res = await fetch(\\`api/get_active_game_requests\\`);\n    const data = await res.json();\n    const correctPost = data.games.find((game) => game.id == gameId);\n    console.log(data);\n    if (correctPost.status === 'in_progress') {\n      clearInterval(pollInterval);\n      window.location.href = \\`/chess/games/\\${gameId}\\`;\n    }\n  } catch (err) {\n    console.error('Error polling game status:', err);\n  }\n}\n\n\n<\/script> "])), renderComponent($$result, "ChessWebsiteLayout", $$ChessWebsiteLayout, { "data-astro-cid-3twrxe3h": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="chess-header" data-astro-cid-3twrxe3h> <h1 data-astro-cid-3twrxe3h>Agora Chess</h1> <div class="chess-tagline" data-astro-cid-3twrxe3h>Simple, clean, and focused chess play. <span class="small-text" data-astro-cid-3twrxe3h>#only correspondence works for now :). </span> </div> </div> <div class="chess-main" data-astro-cid-3twrxe3h> <div class="pairing-grid" data-astro-cid-3twrxe3h> <button class="pairing-btn" data-astro-cid-3twrxe3h>2+1<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Bullet</span></button> <button class="pairing-btn" data-astro-cid-3twrxe3h>3+0<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Blitz</span></button> <button class="pairing-btn" data-astro-cid-3twrxe3h>3+2<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Blitz</span></button> <button class="pairing-btn" data-astro-cid-3twrxe3h>5+0<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Blitz</span></button> <button class="pairing-btn" data-astro-cid-3twrxe3h>5+3<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Blitz</span></button> <button class="pairing-btn" data-astro-cid-3twrxe3h>10+0<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Rapid</span></button> <button class="pairing-btn" data-astro-cid-3twrxe3h>10+5<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Rapid</span></button> <button class="pairing-btn" data-astro-cid-3twrxe3h>15+10<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Rapid</span></button> <button class="pairing-btn" data-astro-cid-3twrxe3h>30+0<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Classical</span></button> <button class="pairing-btn" data-astro-cid-3twrxe3h>30+20<br data-astro-cid-3twrxe3h><span data-astro-cid-3twrxe3h>Classical</span></button> <button class="pairing-btn" id="correspondence-buttton" data-astro-cid-3twrxe3h>Correspondence</button> <button class="pairing-btn" data-astro-cid-3twrxe3h>Custom</button> </div> <div class="side-panel" data-astro-cid-3twrxe3h> <a href="/chess/sreekgames" class="side-btn leaderboard-btn" data-astro-cid-3twrxe3h>Annotated Games</a> <button class="side-btn" data-astro-cid-3twrxe3h>Play with Computer</button> <button class="side-btn" data-astro-cid-3twrxe3h>Tournaments</button> <a href="/chess/puzzles" class="side-btn leaderboard-btn" data-astro-cid-3twrxe3h>Puzzles</a> <a href="/leaderboard" class="side-btn leaderboard-btn" data-astro-cid-3twrxe3h>
Leaderboard
</a> <button class="side-btn primary" id="create-guest-game-btn" data-astro-cid-3twrxe3h>Create Guest Game</button> <div class="stats" data-astro-cid-3twrxe3h> <div data-astro-cid-3twrxe3h>Online: 1,234</div> <div data-astro-cid-3twrxe3h>Games: 567</div> </div> </div> <div class="challenges-panel" data-astro-cid-3twrxe3h> <h3 data-astro-cid-3twrxe3h>General Challenges</h3> ${renderComponent($$result2, "ChallengesRealtime", ChallengesRealtime, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/ChallengesRealtime", "client:component-export": "default", "data-astro-cid-3twrxe3h": true })} </div> </div> <div class="featured-row" data-astro-cid-3twrxe3h> <div class="featured-card" data-astro-cid-3twrxe3h>Live Game: FM The_Fawkes vs GM TexasMustang</div> <a href="/chess/puzzles" class="featured-card" style="text-decoration: none; color: inherit;" data-astro-cid-3twrxe3h>Puzzle of the Day</a> <div class="featured-card" data-astro-cid-3twrxe3h>How NOT to Learn Chess</div> <div class="featured-card" data-astro-cid-3twrxe3h>Crazyhouse World Championship</div> </div> <footer class="chess-footer" data-astro-cid-3twrxe3h> <a href="#" data-astro-cid-3twrxe3h>Donate</a> <a href="#" data-astro-cid-3twrxe3h>Store</a> <a href="#" data-astro-cid-3twrxe3h>About</a> </footer> ` }));
}, "C:/Users/Sreek/website/src/pages/chess.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/chess.astro";
const $$url = "/chess";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Chess,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

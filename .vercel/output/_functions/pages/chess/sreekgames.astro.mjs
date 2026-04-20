import { c as createComponent, d as renderTemplate, b as renderComponent, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../../renderers.mjs';

function CreateGuestGame() {
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gameUrl, setGameUrl] = useState("");
  async function createGuestGame() {
    if (!guestName.trim()) {
      setError("Please enter a name for your guest opponent");
      return;
    }
    setLoading(true);
    setError("");
    setGameUrl("");
    try {
      const res = await fetch("/api/auth/user-data");
      const data = await res.json();
      const user = data.user;
      if (!user || !user.id) {
        setError("Please log in to create a game");
        setLoading(false);
        return;
      }
      const gameRequestRes = await fetch("/api/game_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          white: user,
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          status: "waiting",
          guest_opponent_name: guestName.trim(),
          is_guest_game: true
        })
      });
      const body = await gameRequestRes.json();
      if (!gameRequestRes.ok || !body.success) {
        setError(body.error || "Failed to create game");
        setLoading(false);
        return;
      }
      const game = body.game[0];
      const url = `/chess/games/${game.id}`;
      setGameUrl(url);
      const fullUrl = `${window.location.origin}${url}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
      } catch (e) {
        console.error("Failed to copy to clipboard:", e);
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#fff4ec",
    border: "1px solid #e6e1d7",
    borderRadius: 0,
    padding: "1.5rem",
    margin: "1.5rem 0"
  }, children: [
    /* @__PURE__ */ jsx("h3", { style: { margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: 600, color: "#333" }, children: "Challenge a Guest Player" }),
    /* @__PURE__ */ jsx("p", { style: { margin: "0 0 1rem 0", color: "#666", fontSize: "0.95rem" }, children: "Create a correspondence chess game and share the link with anyone - no account needed!" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Guest player name (e.g., Friend, Colleague)",
          value: guestName,
          onChange: (e) => setGuestName(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && !loading && createGuestGame(),
          style: {
            flex: 1,
            padding: "0.6rem",
            border: "1px solid #e6e1d7",
            fontSize: "0.95rem"
          },
          disabled: loading
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: createGuestGame,
          disabled: loading,
          style: {
            padding: "0.6rem 1.2rem",
            background: "#456650",
            color: "#fff4ec",
            border: "1px solid #456650",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.95rem",
            opacity: loading ? 0.6 : 1
          },
          children: loading ? "Creating..." : "Create Game"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { style: { color: "#b00020", marginBottom: "0.75rem", fontSize: "0.9rem" }, children: error }),
    gameUrl && /* @__PURE__ */ jsxs("div", { style: {
      background: "#f8f4f0",
      border: "1px solid #e6e1d7",
      padding: "0.75rem",
      borderRadius: 0
    }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, marginBottom: "0.5rem", color: "#333" }, children: "Game created! Link copied to clipboard." }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: gameUrl,
            style: {
              color: "#456650",
              textDecoration: "underline",
              fontSize: "0.9rem",
              wordBreak: "break-all"
            },
            children: [
              window.location.origin,
              gameUrl
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              const fullUrl = `${window.location.origin}${gameUrl}`;
              navigator.clipboard.writeText(fullUrl);
            },
            style: {
              padding: "0.35rem 0.7rem",
              background: "#f8f4f0",
              border: "1px solid #e6e1d7",
              fontSize: "0.85rem",
              cursor: "pointer"
            },
            children: "Copy"
          }
        )
      ] })
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  function parseEventFromPgn(pgn) {
    if (!pgn) return "Unknown Event";
    const eventMatch = pgn.match(/^\[Event\s+"([^"]*)"\]/m);
    return eventMatch ? eventMatch[1] : "Unknown Event";
  }
  let games = [];
  let error = null;
  let gamesByEvent = {};
  try {
    const { data, error: fetchError } = await supabase.from("sreekgames").select('id, "White", "Black", pgn').order("id", { ascending: false });
    if (fetchError) {
      error = fetchError.message;
    } else {
      games = (data || []).map((g) => ({
        ...g,
        event: parseEventFromPgn(g.pgn || "")
      }));
      gamesByEvent = games.reduce((acc, game) => {
        const event = game.event || "Unknown Event";
        if (!acc[event]) {
          acc[event] = [];
        }
        acc[event].push(game);
        return acc;
      }, {});
    }
  } catch (e) {
    error = e.message;
  }
  return renderTemplate(_a || (_a = __template(["", " <script type=\"module\">\n  const form = document.getElementById('add-game-form');\n  const errorEl = document.getElementById('add-game-error');\n  const container = document.getElementById('games-container');\n  const filter = document.getElementById('game-filter');\n  const sort = document.getElementById('game-sort');\n  \n  function applyFilterAndSort() {\n    if (!container) return;\n    \n    const q = (filter?.value || '').toLowerCase();\n    const eventGroups = Array.from(container.querySelectorAll('.event-group'));\n    \n    eventGroups.forEach((group) => {\n      const games = Array.from(group.querySelectorAll('li[data-id]'));\n      let hasVisibleGames = false;\n      \n      games.forEach((li) => {\n        const w = (li.getAttribute('data-white') || '').toLowerCase();\n        const b = (li.getAttribute('data-black') || '').toLowerCase();\n        const event = (li.getAttribute('data-event') || '').toLowerCase();\n        const shouldShow = !q || w.includes(q) || b.includes(q) || event.includes(q);\n        li.style.display = shouldShow ? '' : 'none';\n        if (shouldShow) hasVisibleGames = true;\n      });\n      \n      // Hide entire event group if no games are visible\n      group.style.display = hasVisibleGames ? '' : 'none';\n      \n      // Sort games within each event group\n      const visible = games.filter((li) => li.style.display !== 'none');\n      const mode = sort?.value || 'new';\n      const list = group.querySelector('.games-list');\n      if (list) {\n        visible.sort((a, b) => {\n          if (mode === 'new') return Number(b.getAttribute('data-id')) - Number(a.getAttribute('data-id'));\n          if (mode === 'old') return Number(a.getAttribute('data-id')) - Number(b.getAttribute('data-id'));\n          if (mode === 'white') return (a.getAttribute('data-white') || '').localeCompare(b.getAttribute('data-white') || '');\n          if (mode === 'black') return (a.getAttribute('data-black') || '').localeCompare(b.getAttribute('data-black') || '');\n          return 0;\n        });\n        visible.forEach((li) => list.appendChild(li));\n      }\n    });\n  }\n  \n  filter?.addEventListener('input', applyFilterAndSort);\n  sort?.addEventListener('change', applyFilterAndSort);\n  applyFilterAndSort();\n  if (form) {\n    form.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      errorEl.style.display = 'none';\n      const white = /** @type {HTMLInputElement} */ (document.getElementById('white')).value.trim();\n      const black = /** @type {HTMLInputElement} */ (document.getElementById('black')).value.trim();\n      const pgn = /** @type {HTMLTextAreaElement} */ (document.getElementById('pgn')).value.trim();\n\n      try {\n        const res = await fetch('/api/sreekgames', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ White: white, Black: black, pgn })\n        });\n        const data = await res.json();\n        if (!res.ok || !data.success) {\n          throw new Error(data.error || 'Failed to insert');\n        }\n        if (data.id) {\n          window.location.href = `/chess/sreekgames/${data.id}`;\n        } else {\n          window.location.reload();\n        }\n      } catch (err) {\n        errorEl.textContent = err?.message || 'Something went wrong';\n        errorEl.style.display = 'block';\n      }\n    });\n  }\n<\/script>"], ["", " <script type=\"module\">\n  const form = document.getElementById('add-game-form');\n  const errorEl = document.getElementById('add-game-error');\n  const container = document.getElementById('games-container');\n  const filter = document.getElementById('game-filter');\n  const sort = document.getElementById('game-sort');\n  \n  function applyFilterAndSort() {\n    if (!container) return;\n    \n    const q = (filter?.value || '').toLowerCase();\n    const eventGroups = Array.from(container.querySelectorAll('.event-group'));\n    \n    eventGroups.forEach((group) => {\n      const games = Array.from(group.querySelectorAll('li[data-id]'));\n      let hasVisibleGames = false;\n      \n      games.forEach((li) => {\n        const w = (li.getAttribute('data-white') || '').toLowerCase();\n        const b = (li.getAttribute('data-black') || '').toLowerCase();\n        const event = (li.getAttribute('data-event') || '').toLowerCase();\n        const shouldShow = !q || w.includes(q) || b.includes(q) || event.includes(q);\n        li.style.display = shouldShow ? '' : 'none';\n        if (shouldShow) hasVisibleGames = true;\n      });\n      \n      // Hide entire event group if no games are visible\n      group.style.display = hasVisibleGames ? '' : 'none';\n      \n      // Sort games within each event group\n      const visible = games.filter((li) => li.style.display !== 'none');\n      const mode = sort?.value || 'new';\n      const list = group.querySelector('.games-list');\n      if (list) {\n        visible.sort((a, b) => {\n          if (mode === 'new') return Number(b.getAttribute('data-id')) - Number(a.getAttribute('data-id'));\n          if (mode === 'old') return Number(a.getAttribute('data-id')) - Number(b.getAttribute('data-id'));\n          if (mode === 'white') return (a.getAttribute('data-white') || '').localeCompare(b.getAttribute('data-white') || '');\n          if (mode === 'black') return (a.getAttribute('data-black') || '').localeCompare(b.getAttribute('data-black') || '');\n          return 0;\n        });\n        visible.forEach((li) => list.appendChild(li));\n      }\n    });\n  }\n  \n  filter?.addEventListener('input', applyFilterAndSort);\n  sort?.addEventListener('change', applyFilterAndSort);\n  applyFilterAndSort();\n  if (form) {\n    form.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      errorEl.style.display = 'none';\n      const white = /** @type {HTMLInputElement} */ (document.getElementById('white')).value.trim();\n      const black = /** @type {HTMLInputElement} */ (document.getElementById('black')).value.trim();\n      const pgn = /** @type {HTMLTextAreaElement} */ (document.getElementById('pgn')).value.trim();\n\n      try {\n        const res = await fetch('/api/sreekgames', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ White: white, Black: black, pgn })\n        });\n        const data = await res.json();\n        if (!res.ok || !data.success) {\n          throw new Error(data.error || 'Failed to insert');\n        }\n        if (data.id) {\n          window.location.href = \\`/chess/sreekgames/\\${data.id}\\`;\n        } else {\n          window.location.reload();\n        }\n      } catch (err) {\n        errorEl.textContent = err?.message || 'Something went wrong';\n        errorEl.style.display = 'block';\n      }\n    });\n  }\n<\/script>"])), renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Chess Games</h1> <div style="display:flex; gap:0.75rem; align-items:center; margin: 0.5rem 0 1rem 0; flex-wrap: wrap;"> <input id="game-filter" placeholder="Filter by player name or event..." style="flex:1; padding:0.5rem; border:1px solid #e6e1d7;"> <select id="game-sort" style="padding:0.5rem; border:1px solid #e6e1d7;"> <option value="new">Newest</option> <option value="old">Oldest</option> <option value="white">White A–Z</option> <option value="black">Black A–Z</option> </select> </div> <div style="margin: 1rem 0; padding: 1rem; background: #fff4ec; border: 1px solid #e6e1d7; border-radius: 0;"> <details> <summary style="cursor: pointer; font-weight: 700; color: #333;">Add a new PGN</summary> <form id="add-game-form" style="display: grid; gap: 0.75rem; margin-top: 0.75rem;"> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem;"> <div> <label for="white" style="display:block; font-weight:600; color:#333; margin-bottom:0.25rem;">White</label> <input id="white" name="white" type="text" placeholder="White player" style="width:100%; padding:0.5rem; border:1px solid #e6e1d7;" required> </div> <div> <label for="black" style="display:block; font-weight:600; color:#333; margin-bottom:0.25rem;">Black</label> <input id="black" name="black" type="text" placeholder="Black player" style="width:100%; padding:0.5rem; border:1px solid #e6e1d7;" required> </div> </div> <div> <label for="pgn" style="display:block; font-weight:600; color:#333; margin-bottom:0.25rem;">PGN</label> <textarea id="pgn" name="pgn" rows="8" placeholder="Paste PGN with annotations here" style="width:100%; padding:0.5rem; border:1px solid #e6e1d7; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;" required></textarea> </div> <div style="display:flex; gap:0.5rem;"> <button type="submit" style="background:#456650; color:#fff4ec; border:1px solid #456650; padding:0.6rem 1rem; font-weight:600; cursor:pointer;">Insert</button> <button type="reset" style="background:#f8f4f0; color:#333; border:1px solid #e6e1d7; padding:0.6rem 1rem; font-weight:600; cursor:pointer;">Clear</button> </div> <div id="add-game-error" style="color:#b00020; display:none;"></div> </form> </details> </div> ${renderComponent($$result2, "CreateGuestGame", CreateGuestGame, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/CreateGuestGame.jsx", "client:component-export": "default" })} ${error ? renderTemplate`<div style="color: #b00020">${error}</div>` : renderTemplate`<div id="games-container"> ${Object.keys(gamesByEvent).length === 0 && renderTemplate`<div style="color: #666">No games found.</div>`} ${Object.entries(gamesByEvent).map(([event, eventGames]) => renderTemplate`<div class="event-group"${addAttribute(event, "data-event")}> <h2 style="margin: 1.5rem 0 0.75rem 0; font-size: 1.25rem; font-weight: 600; color: #333; border-bottom: 2px solid #e6e1d7; padding-bottom: 0.5rem;"> ${event} <span style="color: #999; font-weight: 400; font-size: 0.9rem; margin-left: 0.5rem;">
(${eventGames.length} ${eventGames.length === 1 ? "game" : "games"})
</span> </h2> <ul class="games-list" style="list-style: none; padding: 0; margin: 0.5rem 0 1.5rem 0; display: grid; gap: 0.75rem;"> ${eventGames.map((g) => renderTemplate`<li${addAttribute(g.id, "data-id")}${addAttribute(g.White, "data-white")}${addAttribute(g.Black, "data-black")}${addAttribute(event, "data-event")}> <a${addAttribute(`/chess/sreekgames/${g.id}`, "href")} style="text-decoration: none;"> <div style="padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 8px; background: #fff;"> <strong>${g.White}</strong> vs <strong>${g.Black}</strong> <span style="color: #999; margin-left: 0.5rem">#${g.id}</span> </div> </a> </li>`)} </ul> </div>`)} </div>`}` }));
}, "C:/Users/Sreek/website/src/pages/chess/sreekgames/index.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/chess/sreekgames/index.astro";
const $$url = "/chess/sreekgames";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

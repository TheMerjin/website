import { c as createComponent, a as renderHead, b as renderComponent, d as renderTemplate } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/get_leaderboard", {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const data = await response.json();
      setPlayers(data.players || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };
  const getRatingColor = (rating) => {
    if (rating >= 2e3) return "#28a745";
    if (rating >= 1600) return "#17a2b8";
    if (rating >= 1200) return "#ffc107";
    return "#6c757d";
  };
  const LeaderboardHeader = () => /* @__PURE__ */ jsxs("div", { className: "leaderboard-header", style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 1.5rem 0.5rem 1.5rem" }, children: [
    /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontWeight: 700, fontSize: "1.3rem", color: "#222", fontFamily: "Inter, sans-serif", letterSpacing: "-0.5px" }, children: "Leaderboard" }),
    /* @__PURE__ */ jsx("button", { className: "refresh-btn", onClick: fetchLeaderboard, style: { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#888", borderRadius: "0", padding: "0.2rem 0.5rem", transition: "background 0.2s" }, title: "Refresh", children: "↻" })
  ] });
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "leaderboard-container lesswrong-leaderboard", children: [
      /* @__PURE__ */ jsx(LeaderboardHeader, {}),
      /* @__PURE__ */ jsxs("div", { className: "loading-state", children: [
        /* @__PURE__ */ jsx("div", { className: "loading-spinner" }),
        /* @__PURE__ */ jsx("span", { children: "Loading rankings..." })
      ] })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "leaderboard-container lesswrong-leaderboard", children: [
      /* @__PURE__ */ jsx(LeaderboardHeader, {}),
      /* @__PURE__ */ jsxs("div", { className: "error-state", children: [
        /* @__PURE__ */ jsx("span", { children: error }),
        /* @__PURE__ */ jsx("button", { className: "retry-btn", onClick: fetchLeaderboard, children: "Try Again" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "leaderboard-container lesswrong-leaderboard", children: [
    /* @__PURE__ */ jsx(LeaderboardHeader, {}),
    /* @__PURE__ */ jsx("div", { className: "leaderboard-table-wrapper", children: /* @__PURE__ */ jsxs("div", { className: "leaderboard-table", children: [
      /* @__PURE__ */ jsxs("div", { className: "leaderboard-row leaderboard-header-row", children: [
        /* @__PURE__ */ jsx("div", { className: "leaderboard-col rank-col", children: "Rank" }),
        /* @__PURE__ */ jsx("div", { className: "leaderboard-col user-col", children: "Username" }),
        /* @__PURE__ */ jsx("div", { className: "leaderboard-col games-col", children: "Games" }),
        /* @__PURE__ */ jsx("div", { className: "leaderboard-col elo-col", children: "ELO" })
      ] }),
      players.length === 0 ? /* @__PURE__ */ jsx("div", { className: "empty-state", children: /* @__PURE__ */ jsx("span", { children: "No players found" }) }) : players.map((player, index) => /* @__PURE__ */ jsxs("div", { className: "leaderboard-row", children: [
        /* @__PURE__ */ jsx("div", { className: "leaderboard-col rank-col", children: index + 1 }),
        /* @__PURE__ */ jsx("div", { className: "leaderboard-col user-col", children: player.username || "Anonymous" }),
        /* @__PURE__ */ jsx("div", { className: "leaderboard-col games-col", children: player.games_played || 0 }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "leaderboard-col elo-col",
            style: { color: getRatingColor(player.skill_mean), fontWeight: 700, textAlign: "right" },
            children: Math.round(player.skill_mean || 1500)
          }
        )
      ] }, player.id))
    ] }) }),
    /* @__PURE__ */ jsx("style", { jsx: true, children: `
        .lesswrong-leaderboard {
          background: #f8f4f0;
          border: 1px solid #e6e1d7;
          border-radius: 0;
          box-shadow: 0 4px 24px 0 rgba(60,60,60,0.10);
          width: 100%;
          max-width: none;
          margin: 0;
          padding-bottom: 1.5rem;
        }
        .leaderboard-table-wrapper {
          overflow-x: auto;
        }
        .leaderboard-table {
          width: 100%;
          min-width: 350px;
          margin-top: 0.5rem;
        }
        .leaderboard-row {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ececec;
          transition: background 0.18s;
          background: none;
        }
        .leaderboard-row:last-child {
          border-bottom: none;
        }
        .leaderboard-row:hover:not(.leaderboard-header-row) {
          background: #f3ede6;
        }
        .leaderboard-header-row {
          background: #f5f3ef;
          font-weight: 600;
          color: #555;
          font-size: 1.01rem;
          border-bottom: 2px solid #e6e1d7;
        }
        .leaderboard-col {
          padding: 0.7rem 0.7rem;
          font-size: 1.05rem;
          font-family: 'Inter', sans-serif;
          color: #222;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rank-col {
          flex: 0.5;
          text-align: right;
          color: #888;
        }
        .user-col {
          flex: 2.2;
          text-align: left;
        }
        .games-col {
          flex: 1.1;
          text-align: right;
          color: #888;
        }
        .elo-col {
          flex: 1.1;
          text-align: right;
        }
        .loading-state, .error-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          color: #6c757d;
          font-size: 0.98rem;
        }
        .loading-spinner {
          width: 22px;
          height: 22px;
          border: 2px solid #e9ecef;
          border-top: 2px solid #6c757d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 0.7rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .retry-btn {
          background: #456650;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0;
          font-size: 0.9rem;
          cursor: pointer;
          margin-top: 0.7rem;
          transition: background-color 0.2s;
        }
        .retry-btn:hover {
          background: #333;
        }
      ` })
  ] });
}

const $$Leaderboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-qw5dklun> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Chess Leaderboard - Agora</title>${renderHead()}</head> <body style="background-color: #fff4ec; color: #333; margin: 0; padding: 0;" data-astro-cid-qw5dklun> ${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-qw5dklun": true }, { "default": ($$result2) => renderTemplate` <div class="leaderboard-page" data-astro-cid-qw5dklun> <div class="page-header" data-astro-cid-qw5dklun> <h1 data-astro-cid-qw5dklun>Chess Leaderboard</h1> <p class="page-subtitle" data-astro-cid-qw5dklun>Rankings based on TrueSkill ELO ratings</p> </div> <div class="leaderboard-content" data-astro-cid-qw5dklun> ${renderComponent($$result2, "Leaderboard", Leaderboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/Leaderboard", "client:component-export": "default", "data-astro-cid-qw5dklun": true })} </div> <div class="info-section" data-astro-cid-qw5dklun> <h3 data-astro-cid-qw5dklun>About the Rankings</h3> <div class="info-grid" data-astro-cid-qw5dklun> <div class="info-card" data-astro-cid-qw5dklun> <h4 data-astro-cid-qw5dklun>Rating System</h4> <p data-astro-cid-qw5dklun>We use TrueSkill, a Bayesian rating system that provides more accurate skill estimates than traditional ELO.</p> </div> <div class="info-card" data-astro-cid-qw5dklun> <h4 data-astro-cid-qw5dklun>Rating Tiers</h4> <ul data-astro-cid-qw5dklun> <li data-astro-cid-qw5dklun><span class="rating-excellent" data-astro-cid-qw5dklun>2000+</span> - Excellent</li> <li data-astro-cid-qw5dklun><span class="rating-good" data-astro-cid-qw5dklun>1600-1999</span> - Good</li> <li data-astro-cid-qw5dklun><span class="rating-average" data-astro-cid-qw5dklun>1200-1599</span> - Average</li> <li data-astro-cid-qw5dklun><span class="rating-beginner" data-astro-cid-qw5dklun>Below 1200</span> - Beginner</li> </ul> </div> <div class="info-card" data-astro-cid-qw5dklun> <h4 data-astro-cid-qw5dklun>Updates</h4> <p data-astro-cid-qw5dklun>Ratings update after each completed game. The more games you play, the more accurate your rating becomes.</p> </div> </div> </div> </div>  ` })} </body> </html>`;
}, "C:/Users/Sreek/website/src/pages/leaderboard.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/leaderboard.astro";
const $$url = "/leaderboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Leaderboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

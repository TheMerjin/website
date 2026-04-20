import { c as createComponent, f as createAstro, d as renderTemplate, b as renderComponent, m as maybeRenderHead, g as addAttribute } from '../../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$ChessWebsiteLayout } from '../../../chunks/ChessWebsiteLayout_DPkXQmpV.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useState, useEffect } from 'react';
import { s as supabase } from '../../../chunks/client-supabase_D77BrgKq.mjs';
/* empty css                                          */
export { renderers } from '../../../renderers.mjs';

function GameBoard({ initialFen, onMove, gameId, currentUserId, whiteUsername, blackUsername, isGuestGame = false }) {
  const [moves, setMoves] = useState([]);
  const [whiteProfile, setWhiteProfile] = useState(null);
  const [blackProfile, setBlackProfile] = useState(null);
  const sanitizeFen = (fen) => {
    if (!fen || fen === "startpos") {
      return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    return fen;
  };
  const getSkillDisplay = (profile) => {
    if (!profile) return { skill: "N/A", confidence: "N/A", color: "#666" };
    const skill = profile.skill_mean || 25;
    const variance = profile.skill_variance || 8.3333;
    const confidence = Math.sqrt(variance);
    let color = "#666";
    if (skill >= 30) color = "#28a745";
    else if (skill >= 25) color = "#17a2b8";
    else if (skill >= 20) color = "#ffc107";
    else color = "#dc3545";
    return {
      skill: skill.toFixed(1),
      confidence: confidence.toFixed(1),
      color
    };
  };
  const [game, setGame] = useState(() => {
    try {
      return new Chess(sanitizeFen(initialFen));
    } catch (error) {
      console.error("Invalid FEN string:", initialFen, error);
      return new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    }
  });
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [userData, setUserData] = useState(null);
  const [winner, setWinner] = useState(null);
  useEffect(() => {
    if (!gameId) {
      console.log("Missing gameId:", { gameId });
      return;
    }
    const guestGameFlag = isGuestGame || false;
    const fetchUserData = async () => {
      try {
        let user = null;
        try {
          const res = await fetch("/api/auth/user-data");
          const data = await res.json();
          user = data.user;
        } catch (authError) {
        }
        if (!user && guestGameFlag) {
          let guestInfo = localStorage.getItem(`chess_guest_${gameId}`);
          if (!guestInfo) {
            if (blackUsername) {
              const guestData = { name: blackUsername, color: "black" };
              localStorage.setItem(`chess_guest_${gameId}`, JSON.stringify(guestData));
              setCurrentPlayer("black");
              const currentTurn2 = game.turn();
              setIsMyTurn(currentTurn2 === "b");
            } else {
              setCurrentPlayer(null);
            }
          } else {
            try {
              const { name, color } = JSON.parse(guestInfo);
              setCurrentPlayer(color);
              const currentTurn2 = game.turn();
              setIsMyTurn(color === "white" && currentTurn2 === "w" || color === "black" && currentTurn2 === "b");
            } catch (e) {
              if (blackUsername) {
                const guestData = { name: blackUsername, color: "black" };
                localStorage.setItem(`chess_guest_${gameId}`, JSON.stringify(guestData));
                setCurrentPlayer("black");
                const currentTurn2 = game.turn();
                setIsMyTurn(currentTurn2 === "b");
              }
            }
          }
          return;
        }
        if (!user) {
          setCurrentPlayer(null);
          return;
        }
        setUserData(user);
        const userUsername = (user.user_metadata?.username || "").trim();
        const whiteUser = (whiteUsername || "").trim();
        const blackUser = (blackUsername || "").trim();
        const isWhite = userUsername.toLowerCase() === whiteUser.toLowerCase();
        const isBlack = userUsername.toLowerCase() === blackUser.toLowerCase();
        if (!isWhite && !isBlack) {
          setCurrentPlayer(null);
          return;
        }
        const playerColor = isWhite ? "white" : "black";
        setCurrentPlayer(playerColor);
        const currentGameState = game.fen();
        const currentTurn = game.turn();
        const myTurn = isWhite && currentTurn === "w" || isBlack && currentTurn === "b";
        setIsMyTurn(myTurn);
        const fetchGameState = async () => {
          try {
            const response = await fetch(`/api/get_game_state?gameId=${gameId}`);
            const data = await response.json();
            if (data.success && data.game) {
              setMoves(data.game.moves || []);
              if (data.game.fen && data.game.fen !== game.fen()) {
                setGame(new Chess(sanitizeFen(data.game.fen)));
              }
            }
          } catch (error) {
            console.error("Error fetching game state:", error);
          }
        };
        fetchGameState();
        const fetchPlayerProfiles = async () => {
          try {
            const [whiteRes, blackRes] = await Promise.all([
              fetch(`/api/get_profile?username=${whiteUsername}`),
              fetch(`/api/get_profile?username=${blackUsername}`)
            ]);
            const whiteData = await whiteRes.json();
            const blackData = await blackRes.json();
            if (whiteData.success) setWhiteProfile(whiteData.profile);
            if (blackData.success) setBlackProfile(blackData.profile);
          } catch (error) {
            console.error("Error fetching player profiles:", error);
          }
        };
        fetchPlayerProfiles();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [gameId, whiteUsername, blackUsername, isGuestGame]);
  useEffect(() => {
    if (!currentPlayer || !game) return;
    const currentTurn = game.turn();
    const myTurn = currentPlayer === "white" && currentTurn === "w" || currentPlayer === "black" && currentTurn === "b";
    setIsMyTurn(myTurn);
  }, [game.fen(), currentPlayer]);
  useEffect(() => {
    if (!gameId) return;
    const channel = supabase.channel(`game:${gameId}`).on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "games",
        filter: `id=eq.${gameId}`
      },
      (payload) => {
        const newFen = payload.new.fen;
        const newMoves = payload.new.moves || [];
        if (newFen) {
          try {
            setGame(new Chess(sanitizeFen(newFen)));
          } catch (error) {
            console.error("Invalid FEN in update:", newFen, error);
          }
          setMoves(newMoves);
          const updatedGame = new Chess(newFen);
          const currentTurn = updatedGame.turn();
          if (currentPlayer) {
            const myTurn = currentPlayer === "white" && currentTurn === "w" || currentPlayer === "black" && currentTurn === "b";
            setIsMyTurn(myTurn);
          } else if (userData) {
            const userUsername = (userData.user_metadata?.username || "").trim().toLowerCase();
            const whiteUser = (whiteUsername || "").trim().toLowerCase();
            const blackUser = (blackUsername || "").trim().toLowerCase();
            const isWhite = userUsername === whiteUser;
            const isBlack = userUsername === blackUser;
            const myTurn = isWhite && currentTurn === "w" || isBlack && currentTurn === "b";
            setIsMyTurn(myTurn);
          }
        }
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, currentPlayer, isGuestGame]);
  useEffect(() => {
    const checkGameEnd = async () => {
      if (game.isCheckmate()) {
        const winnerColor = game.turn() === "w" ? "Black" : "White";
        await fetch("/api/game_over", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            gameId,
            fen: game.fen(),
            // Standard Algebraic Notation
            currentUserId: userData?.id,
            result: `Win: ${winnerColor}`,
            winnerColor
          })
        });
        setWinner(winnerColor);
      } else if (game.isDraw()) {
        await fetch("/api/game_over", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            gameId,
            fen: game.fen(),
            // Standard Algebraic Notation
            currentUserId: userData?.id,
            result: `Draw`,
            winnerColor: null
          })
        });
        setWinner("Draw");
      } else {
        setWinner(null);
      }
    };
    checkGameEnd();
  }, [game.fen(), gameId, userData?.id]);
  function makeMove(sourceSquare, targetSquare) {
    if (!currentPlayer) {
      return false;
    }
    const currentTurn = game.turn();
    const playerTurn = currentPlayer === "white" && currentTurn === "w" || currentPlayer === "black" && currentTurn === "b";
    if (!playerTurn) {
      return false;
    }
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    });
    if (move) {
      const newFen = game.fen();
      setIsMyTurn(false);
      updateGameInBackend(game, newFen, move);
      if (onMove) {
        onMove(move, newFen);
      }
    }
    return move != null;
  }
  async function updateGameInBackend(game2, newFen, move) {
    try {
      const userId = userData?.id || null;
      const response = await fetch("/api/update_game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gameId,
          fen: newFen,
          move: move.san,
          // Standard Algebraic Notation
          currentUserId: userId
        })
      });
      const body = await response.json();
      setMoves(body.moves || []);
      if (!response.ok) {
      }
    } catch (error) {
    }
  }
  return /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      winner && /* @__PURE__ */ jsx("div", { style: {
        margin: "1rem 0",
        padding: "1rem",
        background: winner === "Draw" ? "#ffeeba" : "#d4edda",
        color: "#155724",
        borderRadius: "6px",
        fontWeight: "bold",
        textAlign: "center"
      }, children: winner === "Draw" ? "Game drawn!" : `Checkmate! ${winner} wins!` }),
      /* @__PURE__ */ jsx("div", { style: {
        marginBottom: "1rem",
        padding: "0.75rem 1rem",
        backgroundColor: isMyTurn ? "#e8f5e8" : "#f5f5f5",
        border: "1px solid #ddd",
        borderRadius: "6px",
        fontSize: "0.9rem",
        color: "#333"
      }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Current Turn:" }),
          " ",
          game.turn() === "w" ? "White" : "Black"
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Your Color:" }),
          " ",
          currentPlayer ? currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1) : "Unknown"
        ] }),
        /* @__PURE__ */ jsx("div", { style: {
          padding: "0.25rem 0.5rem",
          backgroundColor: isMyTurn ? "#28a745" : "#dc3545",
          color: "white",
          borderRadius: "4px",
          fontSize: "0.8rem",
          fontWeight: "600"
        }, children: isMyTurn ? "Your Turn" : "Opponent's Turn" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { style: { maxWidth: "800px", margin: "0 auto" }, children: /* @__PURE__ */ jsx(
        Chessboard,
        {
          position: game.fen(),
          onPieceDrop: makeMove,
          boardOrientation: currentPlayer === "black" ? "black" : "white",
          boardWidth: 400
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1.5rem" }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "6px",
        padding: "1rem"
      }, children: [
        /* @__PURE__ */ jsx("h3", { style: { margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "600", color: "#333" }, children: "Move History" }),
        /* @__PURE__ */ jsx("div", { style: {
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxHeight: "200px",
          overflowY: "auto"
        }, children: moves.length > 0 ? moves.map((move, index) => /* @__PURE__ */ jsxs("span", { style: {
          fontFamily: "Courier New, monospace",
          fontSize: "0.9rem",
          color: "#333",
          padding: "0.25rem 0"
        }, children: [
          Math.floor(index / 2) + 1,
          ". ",
          move
        ] }, index)) : /* @__PURE__ */ jsx("div", { style: { color: "#666", fontStyle: "italic" }, children: "No moves yet" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "6px",
        padding: "1rem"
      }, children: [
        /* @__PURE__ */ jsx("h3", { style: { margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "600", color: "#333" }, children: "Player Skills" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            background: "white",
            border: "2px solid #ddd",
            borderRadius: "6px",
            padding: "0.75rem",
            borderLeft: "4px solid #fff"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }, children: [
              /* @__PURE__ */ jsxs("span", { style: { fontWeight: "600", color: "#333" }, children: [
                "⚪ ",
                whiteUsername
              ] }),
              /* @__PURE__ */ jsx("span", { style: {
                padding: "0.25rem 0.5rem",
                backgroundColor: getSkillDisplay(whiteProfile).color,
                color: "white",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "600"
              }, children: getSkillDisplay(whiteProfile).skill })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666" }, children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "Skill: ",
                getSkillDisplay(whiteProfile).skill
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "±",
                getSkillDisplay(whiteProfile).confidence
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            background: "white",
            border: "2px solid #ddd",
            borderRadius: "6px",
            padding: "0.75rem",
            borderLeft: "4px solid #000"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }, children: [
              /* @__PURE__ */ jsxs("span", { style: { fontWeight: "600", color: "#333" }, children: [
                "⚫ ",
                blackUsername
              ] }),
              /* @__PURE__ */ jsx("span", { style: {
                padding: "0.25rem 0.5rem",
                backgroundColor: getSkillDisplay(blackProfile).color,
                color: "white",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "600"
              }, children: getSkillDisplay(blackProfile).skill })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666" }, children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "Skill: ",
                getSkillDisplay(blackProfile).skill
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "±",
                getSkillDisplay(blackProfile).confidence
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "6px",
        padding: "1rem"
      }, children: [
        /* @__PURE__ */ jsx("h3", { style: { margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "600", color: "#333" }, children: "Game Details" }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: "600", color: "#333" }, children: "FEN:" }),
            /* @__PURE__ */ jsx("span", { style: {
              color: "#666",
              fontFamily: "Courier New, monospace",
              fontSize: "0.8rem",
              wordBreak: "break-all"
            }, children: game.fen() })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: "600", color: "#333" }, children: "Moves:" }),
            /* @__PURE__ */ jsx("span", { style: { color: "#666" }, children: game.history().length })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontWeight: "600", color: "#333" }, children: "Status:" }),
            /* @__PURE__ */ jsx("span", { style: { color: "#666" }, children: game.isCheckmate() ? "Checkmate" : game.isDraw() ? "Draw" : game.isCheck() ? "Check" : "In Progress" })
          ] })
        ] })
      ] })
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$gameid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$gameid;
  const { gameid } = Astro2.params;
  const res = await fetch(`${"http://localhost:4321/"}api/get_active_game_requests`);
  const { games } = await res.json();
  if (!games) {
    throw new Error("Game not found");
  }
  const correctPost = games.find((game) => game.id == gameid);
  if (!correctPost) {
    throw new Error("Game not found");
  }
  const gameFen = correctPost.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const isGuestGame = correctPost.is_guest_game === true || correctPost.black_username && !correctPost.black;
  console.log("Game detection:", {
    id: correctPost.id,
    is_guest_game: correctPost.is_guest_game,
    black: correctPost.black,
    black_username: correctPost.black_username,
    white_username: correctPost.white_username,
    isGuestGame
  });
  return renderTemplate(_a || (_a = __template(["", " <script>\n  // Guest games now work automatically for unlogged-in users\n  // No join form needed - the GameBoard component handles guest identification\n</script> "])), renderComponent($$result, "ChessWebsiteLayout", $$ChessWebsiteLayout, { "data-astro-cid-davwt2l4": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="game-container"${addAttribute(gameid, "data-game-id")} data-astro-cid-davwt2l4> <div class="game-header" data-astro-cid-davwt2l4> <div class="game-info" data-astro-cid-davwt2l4> <div class="game-title" data-astro-cid-davwt2l4>Game #${gameid?.slice(0, 8) || "Unknown"}</div> <div class="game-status" data-astro-cid-davwt2l4>${correctPost.status}</div> ${isGuestGame && renderTemplate`<div class="guest-badge" data-astro-cid-davwt2l4>Guest Game</div>`} </div> <div class="player-info" data-astro-cid-davwt2l4> <div class="player white-player" data-astro-cid-davwt2l4> <div class="player-name" data-astro-cid-davwt2l4>${correctPost.white_username || "White"}</div> <div class="player-color" data-astro-cid-davwt2l4>White</div> </div> <div class="vs" data-astro-cid-davwt2l4>vs</div> <div class="player black-player" data-astro-cid-davwt2l4> <div class="player-name" data-astro-cid-davwt2l4>${correctPost.black_username || "Black"}</div> <div class="player-color" data-astro-cid-davwt2l4>Black</div> </div> </div> </div> <div class="game-main" data-astro-cid-davwt2l4>  ${(correctPost.status === "in_progress" || correctPost.status === "completed") && renderTemplate`${renderComponent($$result2, "GameBoard", GameBoard, { "initialFen": gameFen, "gameId": gameid, "currentUserId": void 0, "whiteUsername": correctPost.white_username, "blackUsername": correctPost.black_username, "isGuestGame": isGuestGame, "onMove": (move, fen) => {
    console.log("Move made:", move, "New FEN:", fen);
  }, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/GameBoard.jsx", "client:component-export": "default", "data-astro-cid-davwt2l4": true })}`} </div> </div> ` }));
}, "C:/Users/Sreek/website/src/pages/chess/games/[gameid].astro", void 0);
const $$file = "C:/Users/Sreek/website/src/pages/chess/games/[gameid].astro";
const $$url = "/chess/games/[gameid]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$gameid,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

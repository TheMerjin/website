import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$ChessWebsiteLayout } from '../../chunks/ChessWebsiteLayout_DPkXQmpV.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

function PuzzleSolver() {
  const [puzzle, setPuzzle] = useState(null);
  const [game, setGame] = useState(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [rating, setRating] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const fetchPuzzle = async () => {
    setIsLoading(true);
    setFeedback("");
    setIsSolved(false);
    setCurrentMoveIndex(0);
    setAttempts(0);
    setShowHint(false);
    try {
      const response = await fetch("/api/chess/puzzle");
      if (!response.ok) {
        throw new Error("Failed to fetch puzzle");
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log("Puzzle API response:", data);
      const puzzleData = data.puzzle;
      const gameData = data.game;
      if (!puzzleData) {
        console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
        throw new Error("Puzzle data not found in response");
      }
      if (!puzzleData.solution || !Array.isArray(puzzleData.solution) || puzzleData.solution.length === 0) {
        console.error("Invalid puzzle solution:", puzzleData);
        throw new Error("Puzzle solution not found or invalid");
      }
      console.log("Puzzle data:", {
        rating: puzzleData.rating,
        solutionLength: puzzleData.solution.length,
        themes: puzzleData.themes,
        initialPly: puzzleData.initialPly,
        gameData
      });
      let initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      if (gameData?.fen) {
        initialFen = gameData.fen;
      } else if (puzzleData.fen) {
        initialFen = puzzleData.fen;
      } else if (gameData?.pgn) {
        try {
          const tempGame = new Chess();
          const initialPly = puzzleData.initialPly || 0;
          const pgnText = typeof gameData.pgn === "string" ? gameData.pgn : JSON.stringify(gameData.pgn);
          const movesSection = pgnText.split("\n\n")[1] || pgnText;
          const moveMatches = Array.from(movesSection.matchAll(/\d+\.\s+(\S+)(?:\s+(\S+))?/g));
          const allMoves = [];
          for (const match of moveMatches) {
            if (match[1]) allMoves.push(match[1]);
            if (match[2]) allMoves.push(match[2]);
          }
          for (let i = 0; i < Math.min(initialPly, allMoves.length); i++) {
            try {
              tempGame.move(allMoves[i], { sloppy: true });
            } catch (e) {
              console.warn(`Failed to play move ${i} (${allMoves[i]}):`, e);
            }
          }
          initialFen = tempGame.fen();
          console.log(`Reconstructed FEN from PGN: played ${Math.min(initialPly, allMoves.length)} moves`);
        } catch (e) {
          console.warn("Failed to reconstruct FEN from PGN:", e);
        }
      }
      const puzzleObj = {
        fen: initialFen,
        moves: puzzleData.solution,
        // Array of UCI moves
        rating: puzzleData.rating,
        themes: puzzleData.themes || [],
        initialPly: puzzleData.initialPly || 0
      };
      console.log("Initial FEN:", initialFen);
      setPuzzle(puzzleObj);
      setRating(puzzleData.rating || null);
      const newGame = new Chess(initialFen);
      setGame(newGame);
    } catch (error) {
      console.error("Error fetching puzzle:", error);
      setFeedback("Failed to load puzzle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPuzzle();
  }, []);
  const handlePieceDrop = (sourceSquare, targetSquare) => {
    if (!game || !puzzle || !puzzle.moves || !Array.isArray(puzzle.moves) || isSolved) return false;
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    });
    if (!move) return false;
    const expectedMoveUCI = puzzle.moves[currentMoveIndex * 2];
    if (!expectedMoveUCI) return false;
    const moveUCI = move.from + move.to + (move.promotion || "");
    const isCorrect = moveUCI === expectedMoveUCI || move.san === expectedMoveUCI;
    if (isCorrect) {
      if (currentMoveIndex * 2 + 1 < puzzle.moves.length) {
        const opponentMoveUCI = puzzle.moves[currentMoveIndex * 2 + 1];
        const opponentMove = gameCopy.move({
          from: opponentMoveUCI.substring(0, 2),
          to: opponentMoveUCI.substring(2, 4),
          promotion: opponentMoveUCI.length > 4 ? opponentMoveUCI[4] : void 0
        });
        if (opponentMove) {
          setGame(gameCopy);
        }
      } else {
        setGame(gameCopy);
      }
      setCurrentMoveIndex((prev) => prev + 1);
      setAttempts(0);
      setShowHint(false);
      const totalPlayerMoves = Math.ceil(puzzle.moves.length / 2);
      if (currentMoveIndex + 1 >= totalPlayerMoves) {
        setIsSolved(true);
        setFeedback("🎉 Puzzle solved! Great job!");
      } else {
        setFeedback("✓ Correct! Now find the next move...");
        setTimeout(() => setFeedback(""), 1500);
      }
    } else {
      setAttempts((prev) => prev + 1);
      setFeedback(`✗ Not quite. Try again! (Attempt ${attempts + 1})`);
      setTimeout(() => setFeedback(""), 2e3);
    }
    return true;
  };
  const resetPuzzle = () => {
    if (puzzle) {
      const newGame = new Chess(puzzle.fen);
      setGame(newGame);
      setCurrentMoveIndex(0);
      setFeedback("");
      setIsSolved(false);
      setAttempts(0);
      setShowHint(false);
    }
  };
  const getHint = () => {
    if (!puzzle || !puzzle.moves || !Array.isArray(puzzle.moves) || isSolved) return;
    const expectedMoveUCI = puzzle.moves[currentMoveIndex * 2];
    if (!expectedMoveUCI) return;
    const fromSquare = expectedMoveUCI.substring(0, 2);
    const toSquare = expectedMoveUCI.substring(2, 4);
    setShowHint(true);
    setFeedback(`Hint: Move from ${fromSquare} to ${toSquare}`);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { style: {
      textAlign: "center",
      padding: "3rem",
      color: "#666",
      fontSize: "1.1rem"
    }, children: "Loading puzzle..." });
  }
  if (!puzzle || !game || !puzzle.moves || !Array.isArray(puzzle.moves) || puzzle.moves.length === 0) {
    return /* @__PURE__ */ jsxs("div", { style: {
      textAlign: "center",
      padding: "3rem",
      color: "#666"
    }, children: [
      /* @__PURE__ */ jsx("p", { children: "Failed to load puzzle." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchPuzzle,
          style: {
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            background: "#456650",
            color: "#fff4ec",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600
          },
          children: "Try Again"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { style: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "#f8f4f0",
    border: "1px solid #e6e1d7",
    borderRadius: "8px",
    padding: "2rem",
    fontFamily: "Inter, sans-serif"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem"
    }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { style: {
          margin: "0 0 0.5rem 0",
          color: "#333",
          fontSize: "1.5rem",
          fontWeight: 700
        }, children: isSolved ? "Puzzle Solved!" : "Solve the Puzzle" }),
        rating && puzzle?.moves && Array.isArray(puzzle.moves) && puzzle.moves.length > 0 && /* @__PURE__ */ jsxs("p", { style: {
          margin: 0,
          color: "#666",
          fontSize: "0.9rem"
        }, children: [
          "Rating: ",
          rating,
          " • Move ",
          currentMoveIndex + 1,
          " of ",
          Math.ceil(puzzle.moves.length / 2)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "0.5rem", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: getHint,
            disabled: isSolved || showHint,
            style: {
              padding: "0.5rem 1rem",
              background: showHint ? "#e6e1d7" : "#fff4ec",
              color: "#456650",
              border: "1px solid #e6e1d7",
              borderRadius: "4px",
              fontSize: "0.9rem",
              cursor: showHint || isSolved ? "not-allowed" : "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              opacity: showHint || isSolved ? 0.6 : 1
            },
            children: showHint ? "Hint Used" : "Hint"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: resetPuzzle,
            style: {
              padding: "0.5rem 1rem",
              background: "#fff4ec",
              color: "#456650",
              border: "1px solid #e6e1d7",
              borderRadius: "4px",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600
            },
            children: "Reset"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: fetchPuzzle,
            style: {
              padding: "0.5rem 1rem",
              background: "#456650",
              color: "#fff4ec",
              border: "1px solid #456650",
              borderRadius: "4px",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600
            },
            children: "New Puzzle"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1.5rem"
    }, children: /* @__PURE__ */ jsx(
      Chessboard,
      {
        position: game.fen(),
        boardWidth: typeof window !== "undefined" ? Math.min(500, window.innerWidth - 100) : 500,
        onPieceDrop: handlePieceDrop,
        arePiecesDraggable: !isSolved
      }
    ) }),
    feedback && /* @__PURE__ */ jsx("div", { style: {
      textAlign: "center",
      padding: "1rem",
      marginBottom: "1rem",
      background: feedback.includes("✓") || feedback.includes("🎉") ? "#e8f5e9" : feedback.includes("✗") ? "#ffebee" : "#fff3e0",
      color: feedback.includes("✓") || feedback.includes("🎉") ? "#2e7d32" : feedback.includes("✗") ? "#c62828" : "#e65100",
      borderRadius: "4px",
      fontSize: "1rem",
      fontWeight: 600,
      border: `1px solid ${feedback.includes("✓") || feedback.includes("🎉") ? "#a5d6a7" : feedback.includes("✗") ? "#ef9a9a" : "#ffcc80"}`
    }, children: feedback }),
    isSolved && /* @__PURE__ */ jsxs("div", { style: {
      textAlign: "center",
      padding: "1.5rem",
      background: "#e8f5e9",
      borderRadius: "4px",
      border: "1px solid #a5d6a7",
      marginTop: "1rem"
    }, children: [
      /* @__PURE__ */ jsx("p", { style: {
        margin: "0 0 1rem 0",
        color: "#2e7d32",
        fontSize: "1.1rem",
        fontWeight: 600
      }, children: "Congratulations! You solved the puzzle!" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchPuzzle,
          style: {
            padding: "0.75rem 1.5rem",
            background: "#456650",
            color: "#fff4ec",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600
          },
          children: "Try Another Puzzle"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      marginTop: "2rem",
      padding: "1rem",
      background: "#f5f3ef",
      borderRadius: "4px",
      border: "1px solid #e6e1d7",
      fontSize: "0.9rem",
      color: "#666"
    }, children: [
      /* @__PURE__ */ jsx("p", { style: { margin: "0 0 0.5rem 0", fontWeight: 600, color: "#333" }, children: "How to play:" }),
      /* @__PURE__ */ jsxs("ul", { style: { margin: 0, paddingLeft: "1.5rem" }, children: [
        /* @__PURE__ */ jsx("li", { children: "Find the best move in the position" }),
        /* @__PURE__ */ jsx("li", { children: "Drag and drop pieces to make your move" }),
        /* @__PURE__ */ jsx("li", { children: "You'll need to find all moves in the sequence to solve the puzzle" }),
        /* @__PURE__ */ jsx("li", { children: "Use the hint button if you're stuck" })
      ] })
    ] })
  ] });
}

const $$Puzzles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ChessWebsiteLayout", $$ChessWebsiteLayout, { "data-astro-cid-j4nngkfr": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="puzzles-header" data-astro-cid-j4nngkfr> <h1 data-astro-cid-j4nngkfr>Chess Puzzles</h1> <p class="puzzles-tagline" data-astro-cid-j4nngkfr>Test your tactical skills with daily puzzles</p> </div> <div class="puzzles-container" data-astro-cid-j4nngkfr> ${renderComponent($$result2, "PuzzleSolver", PuzzleSolver, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/PuzzleSolver", "client:component-export": "default", "data-astro-cid-j4nngkfr": true })} </div> ` })} `;
}, "C:/Users/Sreek/website/src/pages/chess/puzzles.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/chess/puzzles.astro";
const $$url = "/chess/puzzles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Puzzles,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { c as createComponent, f as createAstro, b as renderComponent, d as renderTemplate, F as Fragment$1, g as addAttribute, m as maybeRenderHead } from '../../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../../../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

function parseHeaders(pgn) {
  const headers = {};
  const headerRegex = /^\[(\w+)\s+"([^"]*)"\]$/gm;
  let m;
  while ((m = headerRegex.exec(pgn)) !== null) {
    headers[m[1]] = m[2];
  }
  return headers;
}
function stripHeaders(pgn) {
  return pgn.replace(/^\[[^\]]*\]\s*$/gm, "").trim();
}
function stripVariationsAndNags(body) {
  let s = body.replace(/\([^)]*\)/g, " ").replace(/\$\d+/g, "");
  return s;
}
function parseMovesWithComments(pgn) {
  const commentMap = /* @__PURE__ */ new Map();
  let commentIndex = 0;
  const bodyWithComments = stripVariationsAndNags(stripHeaders(pgn)).replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
  let processedBody = bodyWithComments;
  const commentRegex = /\{([^}]*)\}/g;
  let commentMatch;
  while ((commentMatch = commentRegex.exec(bodyWithComments)) !== null) {
    const placeholder = `__COMMENT_${commentIndex}__`;
    commentMap.set(placeholder, commentMatch[1].trim());
    processedBody = processedBody.replace(commentMatch[0], ` ${placeholder} `);
    commentIndex++;
  }
  processedBody = processedBody.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, "").trim();
  const tokens = processedBody.split(/\s+/).filter((t) => t.length > 0);
  const moves = [];
  let i = 0;
  let currentComment = "";
  console.log(`Tokenized PGN into ${tokens.length} tokens`);
  while (i < tokens.length) {
    const token = tokens[i];
    if (token.startsWith("__COMMENT_") && token.endsWith("__")) {
      currentComment = commentMap.get(token) || "";
      i++;
      continue;
    }
    if (/^\d+\.(\.\.)?$/.test(token)) {
      i++;
      continue;
    }
    if (/^(1-0|0-1|1\/2-1\/2|\*)$/.test(token)) {
      break;
    }
    let cleanToken = token.replace(/[!?]+$/, "");
    if (/^\d+$/.test(cleanToken)) {
      i++;
      continue;
    }
    if (cleanToken.length > 0 && cleanToken.length <= 10 && /[a-zA-Z]/.test(cleanToken)) {
      if (/^[a-zA-Z0-9x+#=\-]+$/.test(cleanToken)) {
        const color = moves.length % 2 === 0 ? "w" : "b";
        moves.push({
          color,
          san: cleanToken.trim(),
          comment: currentComment
        });
        currentComment = "";
        i++;
        continue;
      }
    }
    if (i < 50 && token.length > 0) {
      console.log(`Skipping token at index ${i}: "${token}"`);
    }
    i++;
  }
  console.log(`Parsed ${moves.length} moves from ${tokens.length} tokens`);
  if (moves.length > 0) {
    console.log(`First move: ${moves[0].san} (${moves[0].color}), Last move: ${moves[moves.length - 1].san} (${moves[moves.length - 1].color})`);
  }
  return moves;
}
function PgnPlayer({ pgn, gameId }) {
  const [pgnText, setPgnText] = useState(pgn || "");
  useEffect(() => {
    setPgnText(pgn || "");
  }, [pgn]);
  const headers = useMemo(() => parseHeaders(pgnText || ""), [pgnText]);
  const moves = useMemo(() => parseMovesWithComments(pgnText || ""), [pgnText]);
  const [ply, setPly] = useState(0);
  const [fen, setFen] = useState("start");
  const [isAuto, setIsAuto] = useState(false);
  const [orientation, setOrientation] = useState("white");
  const [speedMs, setSpeedMs] = useState(1e3);
  const [guessMode, setGuessMode] = useState(false);
  const [guessFeedback, setGuessFeedback] = useState("");
  const [transientFen, setTransientFen] = useState(null);
  const wrapperRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const effectiveBoard = Math.max(280, Math.min(520, Math.floor(containerWidth - 24)));
  const isNarrow = containerWidth < 860;
  const [stockfishEnabled, setStockfishEnabled] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [bestLine, setBestLine] = useState([]);
  const [depth, setDepth] = useState(0);
  const [stockfishError, setStockfishError] = useState(null);
  const stockfishRef = useRef(null);
  const uciOkRef = useRef(false);
  const readyOkRef = useRef(false);
  useEffect(() => {
    const game = new Chess();
    game.reset();
    for (let i = 0; i < ply && i < moves.length; i++) {
      try {
        const move = game.move(moves[i].san, { sloppy: true });
        if (!move) {
          console.warn(`Failed to play move ${i + 1} (${moves[i].color}): ${moves[i].san}`, {
            fen: game.fen(),
            availableMoves: game.moves({ verbose: true }).map((m) => m.san)
          });
          break;
        }
      } catch (e) {
        console.error(`Error playing move ${i + 1} (${moves[i].color}): ${moves[i].san}`, e, {
          fen: game.fen(),
          availableMoves: game.moves({ verbose: true }).map((m) => m.san)
        });
        break;
      }
    }
    if (!transientFen) {
      setFen(game.fen());
    }
  }, [ply, moves, transientFen]);
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        setContainerWidth(w);
      }
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!isAuto) return;
    const id = setInterval(() => {
      setPly((p) => p < moves.length ? p + 1 : p);
    }, speedMs);
    return () => clearInterval(id);
  }, [isAuto, moves.length, speedMs]);
  useEffect(() => {
    setPly(0);
  }, [pgn]);
  useEffect(() => {
    if (!stockfishEnabled) {
      if (stockfishRef.current) {
        stockfishRef.current.postMessage("quit");
        stockfishRef.current.terminate();
        stockfishRef.current = null;
      }
      setEvaluation(null);
      setBestLine([]);
      setDepth(0);
      setStockfishError(null);
      uciOkRef.current = false;
      readyOkRef.current = false;
      return;
    }
    setStockfishError(null);
    uciOkRef.current = false;
    readyOkRef.current = false;
    const wasmSupported = typeof WebAssembly === "object" && WebAssembly.validate(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
    const workerPath = wasmSupported ? "https://unpkg.com/stockfish.js@10.0.2/stockfish.wasm.js" : "https://unpkg.com/stockfish.js@10.0.2/stockfish.js";
    let engine;
    try {
      engine = new Worker(workerPath);
    } catch (error) {
      console.error("Failed to create Stockfish worker:", error);
      setStockfishError("Failed to load Stockfish engine");
      setStockfishEnabled(false);
      return;
    }
    stockfishRef.current = engine;
    engine.addEventListener("message", (e) => {
      const line = e.data;
      if (typeof line !== "string") return;
      if (line.startsWith("id name")) {
        console.log("Stockfish:", line);
      }
      if (line === "uciok") {
        uciOkRef.current = true;
        engine.postMessage("isready");
      }
      if (line === "readyok") {
        readyOkRef.current = true;
        const game = new Chess();
        game.reset();
        for (let i = 0; i < ply && i < moves.length; i++) {
          try {
            game.move(moves[i].san, { sloppy: true });
          } catch {
          }
        }
        engine.postMessage(`position fen ${game.fen()}`);
        engine.postMessage("go depth 15");
      }
      if (line.startsWith("info depth")) {
        const depthMatch = line.match(/depth (\d+)/);
        if (depthMatch) {
          setDepth(parseInt(depthMatch[1], 10));
        }
        const mateMatch = line.match(/score mate ([\-\d]+)/);
        if (mateMatch) {
          const mateIn = parseInt(mateMatch[1], 10);
          setEvaluation({ type: "mate", value: mateIn });
        } else {
          const cpMatch = line.match(/score cp ([\-\d]+)/);
          if (cpMatch) {
            const cp = parseInt(cpMatch[1], 10);
            const game = new Chess();
            game.reset();
            for (let i = 0; i < ply && i < moves.length; i++) {
              try {
                game.move(moves[i].san, { sloppy: true });
              } catch {
              }
            }
            const pawns = (game.turn() === "w" ? cp : -cp) / 100;
            setEvaluation({ type: "cp", value: pawns });
          }
        }
        const pvMatch = line.match(/pv ([a-h1-8NBRQKOx+#=\- ]+)/);
        if (pvMatch) {
          const pvMoves = pvMatch[1].trim().split(/\s+/).filter((m) => m.length > 0);
          setBestLine(pvMoves);
        }
      }
    });
    engine.addEventListener("error", (error) => {
      console.error("Stockfish worker error:", error);
      setStockfishError("Stockfish engine error");
      setStockfishEnabled(false);
    });
    engine.postMessage("uci");
    return () => {
      if (engine) {
        try {
          engine.postMessage("quit");
          engine.terminate();
        } catch (e) {
          console.error("Error terminating Stockfish:", e);
        }
      }
    };
  }, [stockfishEnabled, ply, moves]);
  useEffect(() => {
    if (!stockfishEnabled || !stockfishRef.current || !readyOkRef.current) return;
    const engine = stockfishRef.current;
    const game = new Chess();
    game.reset();
    for (let i = 0; i < ply && i < moves.length; i++) {
      try {
        game.move(moves[i].san, { sloppy: true });
      } catch {
      }
    }
    try {
      engine.postMessage("stop");
      engine.postMessage(`position fen ${game.fen()}`);
      engine.postMessage("go depth 15");
    } catch (error) {
      console.error("Error sending position to Stockfish:", error);
    }
  }, [fen, stockfishEnabled, ply, moves]);
  const goFirst = () => setPly(0);
  const goPrev = () => setPly((p) => Math.max(0, p - 1));
  const goNext = () => setPly((p) => Math.min(moves.length, p + 1));
  const goLast = () => setPly(moves.length);
  const currentMoveIndex = Math.max(0, Math.min(ply - 1, moves.length - 1));
  const currentMove = moves[currentMoveIndex] || null;
  const currentComment = currentMove?.comment || "";
  function updatePgnWithComment(originalPgn, moveIndex, newComment) {
    const headerLines = [];
    const lines = (originalPgn || "").split(/\r?\n/);
    let i = 0;
    while (i < lines.length && /^\[[^\]]+\]$/.test(lines[i].trim())) {
      headerLines.push(lines[i]);
      i++;
    }
    const headerPart = headerLines.join("\n");
    const bodyPart = lines.slice(i).join(" ").replace(/\s+/g, " ").trim();
    let sanitized = bodyPart.replace(/\([^)]*\)/g, "");
    const tokens = sanitized.split(" ");
    let count = -1;
    const rebuilt = [];
    for (let t = 0; t < tokens.length; t++) {
      const tok = tokens[t];
      if (/^\d+\.(\.\.)?$/.test(tok)) {
        rebuilt.push(tok);
        continue;
      }
      if (/^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok)) {
        rebuilt.push(tok);
        continue;
      }
      if (!tok) continue;
      count += 1;
      if (count === moveIndex) {
        rebuilt.push(tok);
        if (newComment && newComment.trim()) {
          rebuilt.push(`{${newComment.trim()}}`);
        }
      } else {
        rebuilt.push(tok);
      }
    }
    const newBody = rebuilt.join(" ").replace(/\s+/g, " ").trim();
    return headerPart ? `${headerPart}

${newBody}` : newBody;
  }
  async function saveAnnotation(newComment) {
    if (!gameId) return;
    const updated = updatePgnWithComment(pgnText, currentMoveIndex, newComment || "");
    try {
      const res = await fetch(`/api/sreekgames/${gameId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pgn: updated })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save");
      setPgnText(updated);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsAuto((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const panelStyle = { background: "#fff4ec", border: "1px solid #e6e1d7", borderRadius: 0, boxShadow: "none" };
  const headerStyle = { background: "#f8f4f0", border: "1px solid #e6e1d7", borderRadius: 0 };
  const btnStyle = {
    background: "#f8f4f0",
    color: "#333",
    border: "1px solid #e6e1d7",
    fontSize: isNarrow ? "0.85rem" : "0.95rem",
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    padding: isNarrow ? "0.4rem 0.5rem" : "0.5rem 0.75rem",
    cursor: "pointer",
    whiteSpace: "nowrap"
  };
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, style: { display: "grid", gridTemplateColumns: isNarrow ? "1fr" : "minmax(320px, 520px) 1fr", gap: "1.25rem" }, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { style: { ...panelStyle, padding: isNarrow ? "0.5rem" : "0.75rem" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: isNarrow ? "column" : "row", justifyContent: "space-between", alignItems: isNarrow ? "stretch" : "center", marginBottom: "0.5rem", gap: isNarrow ? "0.5rem" : "0" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { color: "#456650", fontWeight: 600, fontSize: isNarrow ? "0.85rem" : "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
            headers.Result || "",
            " ",
            headers.ECO ? `• ${headers.ECO}` : "",
            " ",
            headers.Opening ? `• ${headers.Opening}` : ""
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "0.4rem", flexWrap: "nowrap", justifyContent: "flex-end", overflowX: "auto", WebkitOverflowScrolling: "touch" }, children: [
            /* @__PURE__ */ jsx("button", { style: { ...btnStyle, fontSize: isNarrow ? "0.75rem" : btnStyle.fontSize, padding: isNarrow ? "0.35rem 0.4rem" : btnStyle.padding }, onClick: () => setOrientation((o) => o === "white" ? "black" : "white"), children: "Flip" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                style: { ...btnStyle, background: guessMode ? "#e6e1d7" : btnStyle.background, fontSize: isNarrow ? "0.75rem" : btnStyle.fontSize, padding: isNarrow ? "0.35rem 0.4rem" : btnStyle.padding },
                onClick: () => {
                  setGuessMode((m) => {
                    const next = !m;
                    if (next) setIsAuto(false);
                    return next;
                  });
                  setGuessFeedback("");
                },
                children: "Guess"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                style: { ...btnStyle, background: stockfishEnabled ? "#e6e1d7" : btnStyle.background, fontSize: isNarrow ? "0.75rem" : btnStyle.fontSize, padding: isNarrow ? "0.35rem 0.4rem" : btnStyle.padding },
                onClick: () => setStockfishEnabled((e) => !e),
                children: "Engine"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                style: { ...btnStyle, fontSize: isNarrow ? "0.75rem" : btnStyle.fontSize, padding: isNarrow ? "0.35rem 0.4rem" : btnStyle.padding },
                onClick: () => {
                  try {
                    navigator.clipboard.writeText(pgn || "");
                  } catch {
                  }
                },
                children: "Copy"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                style: { ...btnStyle, fontSize: isNarrow ? "0.75rem" : btnStyle.fontSize, padding: isNarrow ? "0.35rem 0.4rem" : btnStyle.padding },
                onClick: () => {
                  const blob = new Blob([pgn || ""], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${headers.White || "White"}_vs_${headers.Black || "Black"}.pgn`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                },
                children: "DL"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Chessboard,
          {
            position: transientFen ?? fen,
            boardWidth: effectiveBoard,
            boardOrientation: orientation,
            animationDuration: 350,
            onPieceDrop: (sourceSquare, targetSquare) => {
              if (!guessMode) return false;
              const game = new Chess();
              try {
                for (let i = 0; i < ply && i < moves.length; i++) {
                  game.move(moves[i].san, { sloppy: true });
                }
              } catch {
              }
              const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
              if (!move) return false;
              const expected = moves[ply]?.san;
              if (!expected) return true;
              const correct = move.san === expected;
              if (correct) {
                setGuessFeedback("Correct!");
                window.setTimeout(() => {
                  setPly((p) => Math.min(p + 1, moves.length));
                }, 180);
              } else {
                setGuessFeedback(`Wrong. Correct move: ${expected}`);
                setTransientFen(game.fen());
                window.setTimeout(() => {
                  setTransientFen(null);
                  setPly((p) => Math.min(p + 1, moves.length));
                }, 700);
              }
              window.setTimeout(() => setGuessFeedback(""), 1500);
              return true;
            }
          }
        ),
        guessMode && /* @__PURE__ */ jsx("div", { style: { marginTop: "0.5rem", color: guessFeedback.startsWith("Correct") ? "#2e7d32" : "#b00020", minHeight: "1.2rem" }, children: guessFeedback }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: isNarrow ? "0.3rem" : "0.5rem", marginTop: "0.75rem", alignItems: "center", flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch" }, children: [
          /* @__PURE__ */ jsx("button", { style: { ...btnStyle, padding: isNarrow ? "0.4rem 0.5rem" : btnStyle.padding, minWidth: isNarrow ? "2.2rem" : "auto" }, onClick: goFirst, children: "<<" }),
          /* @__PURE__ */ jsx("button", { style: { ...btnStyle, padding: isNarrow ? "0.4rem 0.5rem" : btnStyle.padding, minWidth: isNarrow ? "2rem" : "auto" }, onClick: goPrev, children: "<" }),
          /* @__PURE__ */ jsx("button", { style: { ...btnStyle, padding: isNarrow ? "0.4rem 0.5rem" : btnStyle.padding, minWidth: isNarrow ? "3rem" : "auto" }, onClick: () => setIsAuto((v) => !v), children: isAuto ? "Pause" : "Play" }),
          /* @__PURE__ */ jsx("button", { style: { ...btnStyle, padding: isNarrow ? "0.4rem 0.5rem" : btnStyle.padding, minWidth: isNarrow ? "2rem" : "auto" }, onClick: goNext, children: ">" }),
          /* @__PURE__ */ jsx("button", { style: { ...btnStyle, padding: isNarrow ? "0.4rem 0.5rem" : btnStyle.padding, minWidth: isNarrow ? "2.2rem" : "auto" }, onClick: goLast, children: ">>" }),
          /* @__PURE__ */ jsxs("div", { style: { marginLeft: "auto", color: "#456650", fontWeight: 600, fontSize: isNarrow ? "0.85rem" : "1rem", whiteSpace: "nowrap", paddingLeft: "0.5rem" }, children: [
            Math.ceil(ply / 2),
            " / ",
            Math.ceil(moves.length / 2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center", flexWrap: "nowrap" }, children: [
          /* @__PURE__ */ jsx("div", { style: { color: "#666", fontSize: isNarrow ? "0.85rem" : "1rem", whiteSpace: "nowrap" }, children: "Speed" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "300",
              max: "2000",
              step: "100",
              value: speedMs,
              onChange: (e) => setSpeedMs(parseInt(e.target.value, 10)),
              style: { flex: 1, minWidth: isNarrow ? "120px" : "160px" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: { width: isNarrow ? "36px" : "46px", textAlign: "right", color: "#666", fontSize: isNarrow ? "0.85rem" : "1rem", whiteSpace: "nowrap" }, children: [
            Math.round(speedMs / 1e3),
            "s"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { ...headerStyle, padding: isNarrow ? "0.6rem 0.75rem" : "0.75rem 1rem", marginTop: "0.75rem" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: "0.5rem" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, color: "#333", fontSize: isNarrow ? "0.9rem" : "1rem" }, children: "Annotation" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              style: { background: "#456650", color: "#fff4ec", border: "1px solid #456650", padding: isNarrow ? "0.3rem 0.5rem" : "0.35rem 0.7rem", fontWeight: 600, cursor: "pointer", fontSize: isNarrow ? "0.8rem" : "0.9rem", whiteSpace: "nowrap" },
              onClick: () => {
                const input = window.prompt("Edit annotation for this move:", currentComment || "");
                if (input !== null) {
                  saveAnnotation(input);
                }
              },
              children: "Edit"
            }
          )
        ] }),
        currentComment ? /* @__PURE__ */ jsx("div", { style: { color: "#333", lineHeight: 1.5, marginTop: 6, fontSize: isNarrow ? "0.9rem" : "1rem", wordBreak: "break-word" }, children: currentComment }) : /* @__PURE__ */ jsx("div", { style: { color: "#888", fontStyle: "italic", marginTop: 6, fontSize: isNarrow ? "0.85rem" : "1rem" }, children: "No annotation for this move." })
      ] }),
      stockfishEnabled && /* @__PURE__ */ jsxs("div", { style: { ...headerStyle, padding: isNarrow ? "0.6rem 0.75rem" : "0.75rem 1rem", marginTop: "0.75rem" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: "0.5rem", marginBottom: "0.5rem" }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, color: "#333", fontSize: isNarrow ? "0.9rem" : "1rem" }, children: "Stockfish Evaluation" }),
          depth > 0 && /* @__PURE__ */ jsxs("div", { style: { color: "#666", fontSize: isNarrow ? "0.75rem" : "0.85rem" }, children: [
            "Depth: ",
            depth
          ] })
        ] }),
        stockfishError ? /* @__PURE__ */ jsx("div", { style: { color: "#b00020", fontSize: isNarrow ? "0.85rem" : "1rem" }, children: stockfishError }) : evaluation ? /* @__PURE__ */ jsx("div", { style: { marginBottom: "0.5rem" }, children: evaluation.type === "mate" ? /* @__PURE__ */ jsx("div", { style: { color: evaluation.value > 0 ? "#2e7d32" : "#b00020", fontWeight: 600, fontSize: isNarrow ? "0.9rem" : "1rem" }, children: evaluation.value > 0 ? `Mate in ${evaluation.value}` : `Mate in ${Math.abs(evaluation.value)}` }) : /* @__PURE__ */ jsxs("div", { style: { color: evaluation.value > 0 ? "#2e7d32" : evaluation.value < 0 ? "#b00020" : "#666", fontWeight: 600, fontSize: isNarrow ? "0.9rem" : "1rem" }, children: [
          evaluation.value > 0 ? "+" : "",
          evaluation.value.toFixed(2)
        ] }) }) : /* @__PURE__ */ jsx("div", { style: { color: "#888", fontStyle: "italic", fontSize: isNarrow ? "0.85rem" : "1rem" }, children: "Loading engine..." }),
        bestLine.length > 0 && /* @__PURE__ */ jsxs("div", { style: { marginTop: "0.5rem" }, children: [
          /* @__PURE__ */ jsx("div", { style: { color: "#666", fontSize: isNarrow ? "0.8rem" : "0.9rem", marginBottom: "0.25rem" }, children: "Best line:" }),
          /* @__PURE__ */ jsxs("div", { style: { color: "#333", fontSize: isNarrow ? "0.85rem" : "0.95rem", fontFamily: "ui-monospace, monospace", wordBreak: "break-word" }, children: [
            bestLine.slice(0, 6).join(" "),
            bestLine.length > 6 && "..."
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "0.75rem" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { ...headerStyle, padding: isNarrow ? "0.6rem 0.75rem" : "0.75rem 1rem" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, color: "#333", marginBottom: 6, fontSize: isNarrow ? "0.9rem" : "1rem" }, children: headers.Event || "Game" }),
        /* @__PURE__ */ jsxs("div", { style: { color: "#456650", fontWeight: 600, fontSize: isNarrow ? "0.85rem" : "1rem", wordBreak: "break-word" }, children: [
          headers.White || "White",
          " vs ",
          headers.Black || "Black"
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { color: "#666", marginTop: 4, fontSize: isNarrow ? "0.8rem" : "0.9rem", wordBreak: "break-word" }, children: [
          headers.Site || "",
          " ",
          headers.Date ? `• ${headers.Date}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { ...panelStyle, padding: isNarrow ? "0.6rem 0.75rem" : "0.75rem 1rem", maxHeight: isNarrow ? 300 : 420, overflowY: "auto" }, children: moves.length === 0 ? /* @__PURE__ */ jsx("div", { style: { color: "#777", fontSize: isNarrow ? "0.85rem" : "1rem" }, children: "No moves parsed." }) : /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: isNarrow ? "32px 1fr 1fr" : "40px 1fr 1fr", gap: isNarrow ? "0.3rem 0.4rem" : "0.35rem 0.5rem", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: { color: "#666", fontSize: isNarrow ? "0.8rem" : "0.9rem" }, children: "#" }),
        /* @__PURE__ */ jsx("div", { style: { color: "#666", fontSize: isNarrow ? "0.8rem" : "0.9rem" }, children: "White" }),
        /* @__PURE__ */ jsx("div", { style: { color: "#666", fontSize: isNarrow ? "0.8rem" : "0.9rem" }, children: "Black" }),
        Array.from({ length: Math.ceil(moves.length / 2) }).map((_, idx) => {
          const w = moves[idx * 2];
          const b = moves[idx * 2 + 1];
          const wActive = ply === idx * 2 + 1;
          const bActive = ply === idx * 2 + 2;
          const activeStyle = { background: "#e6e1d7", borderRadius: 4 };
          const wHidden = guessMode && idx * 2 >= ply;
          const bHidden = guessMode && idx * 2 + 1 >= ply;
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { style: { color: "#333", fontWeight: 600 }, children: idx + 1 }, `n-${idx}`),
            /* @__PURE__ */ jsx("div", { style: { padding: "0.15rem 0.35rem", cursor: w && !wHidden ? "pointer" : "default", ...wActive ? activeStyle : {} }, onClick: () => w && !wHidden && setPly(idx * 2 + 1), children: wHidden ? "" : w?.san || "" }, `w-${idx}`),
            /* @__PURE__ */ jsx("div", { style: { padding: "0.15rem 0.35rem", cursor: b && !bHidden ? "pointer" : "default", ...bActive ? activeStyle : {} }, onClick: () => b && !bHidden && setPly(idx * 2 + 2), children: bHidden ? "" : b?.san || "" }, `b-${idx}`)
          ] });
        })
      ] }) })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  let game = null;
  let error = null;
  try {
    const { data, error: fetchError } = await supabase.from("sreekgames").select('id, pgn, "White", "Black"').eq("id", id).single();
    if (fetchError) {
      error = fetchError.message || "Game not found";
    } else {
      game = data;
    }
  } catch (e) {
    error = e?.message || "Unknown error";
  }
  if (error || !game) {
    return Astro2.redirect("/404");
  }
  function parseHeaders(pgn) {
    const headers2 = {};
    const headerRegex = /^\[(\w+)\s+"([^"]*)"\]$/gm;
    let m;
    while ((m = headerRegex.exec(pgn)) !== null) {
      headers2[m[1]] = m[2];
    }
    return headers2;
  }
  function stripHeaders(pgn) {
    return pgn.replace(/^\[[^\]]*\]\s*$/gm, "").trim();
  }
  function getFinalPosition(pgn) {
    try {
      let body = stripHeaders(pgn || "");
      body = body.replace(/\([^)]*\)/g, "").replace(/\{[^}]*\}/g, "").replace(/\$\d+/g, "").replace(/\r?\n/g, " ").replace(/\s+/g, " ").replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, "").trim();
      const moves = [];
      const tokens = body.split(/\s+/);
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].trim();
        if (!token) continue;
        if (/^\d+\.(\.\.)?$/.test(token)) {
          continue;
        }
        if (/^(1-0|0-1|1\/2-1\/2|\*)$/.test(token)) {
          break;
        }
        const moveMatch = token.match(/^([a-zA-Z0-9+\-x#=!?]+)/);
        if (moveMatch && moveMatch[1]) {
          const san = moveMatch[1].replace(/[!?]+$/, "");
          if (san && san.length > 0 && san !== "1-0" && san !== "0-1" && san !== "1/2-1/2") {
            moves.push(san);
          }
        }
      }
      const chess = new Chess();
      chess.reset();
      for (const san of moves) {
        try {
          const move = chess.move(san, { strict: false });
          if (!move) {
            try {
              chess.move(san);
            } catch {
              console.warn(`Failed to parse move: ${san}`);
              break;
            }
          }
        } catch (e) {
          console.warn(`Error playing move ${san}:`, e);
          break;
        }
      }
      return chess.fen();
    } catch (e) {
      console.error("Error in getFinalPosition:", e);
      return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
  }
  const headers = parseHeaders(game.pgn || "");
  const finalFen = getFinalPosition(game.pgn || "");
  const event = headers["Event"] || "Chess Game";
  const result = headers["Result"] || "";
  const date = headers["Date"] || "";
  const site = headers["Site"] || "";
  const gameTitle = `${game.White} vs ${game.Black}${result ? ` (${result})` : ""}`;
  const gameDescription = `${event}${date ? ` \u2022 ${date}` : ""}${site ? ` \u2022 ${site}` : ""}` || `Chess game between ${game.White} and ${game.Black}`;
  const boardImageUrl = new URL(`/api/chess-board-image?fen=${encodeURIComponent(finalFen)}`, Astro2.url.origin).href;
  const pageUrl = new URL(Astro2.url.pathname, Astro2.url.origin).href;
  Astro2.url.origin;
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, {}, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div style="display: flex; flex-direction: column; gap: 1rem;"> <a href="/chess/sreekgames" style="text-decoration: none; color: #0070f3">← Back to games</a> <h1>${game.White} vs ${game.Black}</h1> <div style="margin-top: 1rem;"> ${renderComponent($$result2, "PgnPlayer", PgnPlayer, { "client:load": true, "pgn": game.pgn, "gameId": game.id, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/PgnPlayer.jsx", "client:component-export": "default" })} </div> </div> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment$1, { "slot": "head" }, { "default": async ($$result3) => renderTemplate`  <title>${gameTitle} - Annotated Chess Game</title> <meta name="title"${addAttribute(gameTitle, "content")}> <meta name="description"${addAttribute(gameDescription, "content")}>  <meta property="og:type" content="website"> <meta property="og:url"${addAttribute(pageUrl, "content")}> <meta property="og:title"${addAttribute(gameTitle, "content")}> <meta property="og:description"${addAttribute(gameDescription, "content")}> <meta property="og:image"${addAttribute(boardImageUrl, "content")}> <meta property="og:image:secure_url"${addAttribute(boardImageUrl, "content")}> <meta property="og:image:type" content="image/png"> <meta property="og:image:width" content="400"> <meta property="og:image:height" content="400"> <meta property="og:site_name" content="Agora Chess">  <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:url"${addAttribute(pageUrl, "content")}> <meta name="twitter:title"${addAttribute(gameTitle, "content")}> <meta name="twitter:description"${addAttribute(gameDescription, "content")}> <meta name="twitter:image"${addAttribute(boardImageUrl, "content")}> <meta name="twitter:image:src"${addAttribute(boardImageUrl, "content")}> ` })}` })}`;
}, "C:/Users/Sreek/website/src/pages/chess/sreekgames/[id].astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/chess/sreekgames/[id].astro";
const $$url = "/chess/sreekgames/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

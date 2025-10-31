import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

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
  return pgn.replace(/^\[[^\]]*\]\s*$/gm, '').trim();
}

function stripVariationsAndNags(body) {
  // remove variations in parentheses and NAGs like $1 $3
  let s = body.replace(/\([^)]*\)/g, ' ').replace(/\$\d+/g, '');
  return s;
}

function parseMovesWithComments(pgn) {
  const body = stripVariationsAndNags(stripHeaders(pgn))
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove game termination markers like 1-0, 0-1, 1/2-1/2, *
  const cleaned = body.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '').trim();

  const moveRegex = /(\d+)\.(?:\s*\.\.)?\s*([^\s{]+)(?:\s*\{([^}]*)\})?(?:\s+([^\s{]+)(?:\s*\{([^}]*)\})?)?/g;
  const moves = [];
  let m;
  while ((m = moveRegex.exec(cleaned)) !== null) {
    const whiteSan = m[2];
    const whiteComment = (m[3] || '').trim();
    const blackSan = m[4];
    const blackComment = (m[5] || '').trim();
    if (whiteSan) moves.push({ color: 'w', san: whiteSan, comment: whiteComment });
    if (blackSan) moves.push({ color: 'b', san: blackSan, comment: blackComment });
  }
  return moves;
}

export default function PgnPlayer({ pgn, gameId }) {
  const [pgnText, setPgnText] = useState(pgn || '');
  useEffect(() => { setPgnText(pgn || ''); }, [pgn]);
  const headers = useMemo(() => parseHeaders(pgnText || ''), [pgnText]);
  const moves = useMemo(() => parseMovesWithComments(pgnText || ''), [pgnText]);
  const [ply, setPly] = useState(0);
  const [fen, setFen] = useState('start');
  const [isAuto, setIsAuto] = useState(false);
  const [orientation, setOrientation] = useState('white');
  const [speedMs, setSpeedMs] = useState(1000);
  const [guessMode, setGuessMode] = useState(false);
  const [guessFeedback, setGuessFeedback] = useState('');
  const [transientFen, setTransientFen] = useState(null);
  const wrapperRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(500);
  const effectiveBoard = Math.max(280, Math.min(520, Math.floor(containerWidth - 24)));
  const isNarrow = containerWidth < 860;

  useEffect(() => {
    const game = new Chess();
    game.reset();
    for (let i = 0; i < ply && i < moves.length; i++) {
      try {
        game.move(moves[i].san, { sloppy: true });
      } catch (e) {
        break;
      }
    }
    // Only update base fen when no transient animation is showing
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
      setPly((p) => (p < moves.length ? p + 1 : p));
    }, speedMs);
    return () => clearInterval(id);
  }, [isAuto, moves.length, speedMs]);

  useEffect(() => {
    setPly(0);
  }, [pgn]);

  const goFirst = () => setPly(0);
  const goPrev = () => setPly((p) => Math.max(0, p - 1));
  const goNext = () => setPly((p) => Math.min(moves.length, p + 1));
  const goLast = () => setPly(moves.length);

  const currentMoveIndex = Math.max(0, Math.min(ply - 1, moves.length - 1));
  const currentMove = moves[currentMoveIndex] || null;
  const currentComment = currentMove?.comment || '';

  function updatePgnWithComment(originalPgn, moveIndex, newComment) {
    // Split headers and body
    const headerLines = [];
    const lines = (originalPgn || '').split(/\r?\n/);
    let i = 0;
    while (i < lines.length && /^\[[^\]]+\]$/.test(lines[i].trim())) {
      headerLines.push(lines[i]);
      i++;
    }
    const headerPart = headerLines.join('\n');
    const bodyPart = lines.slice(i).join(' ').replace(/\s+/g, ' ').trim();

    // Tokenize body preserving braces for comments and parentheses for variations
    // Simple approach: operate on SAN occurrences ignoring variations content
    let sanitized = bodyPart.replace(/\([^)]*\)/g, '');
    // Remove existing comment for target move by reconstructing tokens
    const tokens = sanitized.split(' ');
    let count = -1;
    const rebuilt = [];
    for (let t = 0; t < tokens.length; t++) {
      const tok = tokens[t];
      if (/^\d+\.(\.\.)?$/.test(tok)) { // move number
        rebuilt.push(tok);
        continue;
      }
      if (/^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok)) {
        rebuilt.push(tok);
        continue;
      }
      if (!tok) continue;
      // treat as SAN; increment count
      count += 1;
      if (count === moveIndex) {
        // Add SAN and then {comment} (or omit if empty)
        rebuilt.push(tok);
        if (newComment && newComment.trim()) {
          rebuilt.push(`{${newComment.trim()}}`);
        }
        // Skip potential brace token next in original by not trying to parse; we already sanitized
      } else {
        rebuilt.push(tok);
      }
    }
    const newBody = rebuilt.join(' ').replace(/\s+/g, ' ').trim();
    return headerPart ? `${headerPart}\n\n${newBody}` : newBody;
  }

  async function saveAnnotation(newComment) {
    if (!gameId) return;
    const updated = updatePgnWithComment(pgnText, currentMoveIndex, newComment || '');
    try {
      const res = await fetch(`/api/sreekgames/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pgn: updated })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');
      setPgnText(updated);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAuto((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const panelStyle = { background: '#fff4ec', border: '1px solid #e6e1d7', borderRadius: 0, boxShadow: 'none' };
  const headerStyle = { background: '#f8f4f0', border: '1px solid #e6e1d7', borderRadius: 0 };
  const btnStyle = {
    background: '#f8f4f0',
    color: '#333',
    border: '1px solid #e6e1d7',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
  };

  return (
    <div ref={wrapperRef} style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : 'minmax(320px, 520px) 1fr', gap: '1.25rem' }}>
      <div>
        <div style={{ ...panelStyle, padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ color: '#456650', fontWeight: 600 }}>{headers.Result || ''} {headers.ECO ? `• ${headers.ECO}` : ''} {headers.Opening ? `• ${headers.Opening}` : ''}</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button style={btnStyle} onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}>Flip</button>
              <button
                style={{ ...btnStyle, background: guessMode ? '#e6e1d7' : btnStyle.background }}
                onClick={() => { setGuessMode((m) => { const next = !m; if (next) setIsAuto(false); return next; }); setGuessFeedback(''); }}
              >Guess</button>
              <button
                style={btnStyle}
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(pgn || '');
                  } catch {}
                }}
              >Copy PGN</button>
              <button
                style={btnStyle}
                onClick={() => {
                  const blob = new Blob([pgn || ''], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${(headers.White || 'White')}_vs_${(headers.Black || 'Black')}.pgn`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
              >Download</button>
            </div>
          </div>
          <Chessboard
            position={transientFen ?? fen}
            boardWidth={effectiveBoard}
            boardOrientation={orientation}
            animationDuration={350}
            onPieceDrop={(sourceSquare, targetSquare) => {
              if (!guessMode) return false;
              // Build game at current position
              const game = new Chess();
              try {
                for (let i = 0; i < ply && i < moves.length; i++) {
                  game.move(moves[i].san, { sloppy: true });
                }
              } catch {}
              const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
              if (!move) return false;
              const expected = moves[ply]?.san;
              if (!expected) return true;
              const correct = move.san === expected;
              if (correct) {
                setGuessFeedback('Correct!');
                // slight delay for smooth transition
                window.setTimeout(() => {
                  setPly((p) => Math.min(p + 1, moves.length));
                }, 180);
              } else {
                setGuessFeedback(`Wrong. Correct move: ${expected}`);
                // briefly show user's move, then animate to the correct move
                setTransientFen(game.fen());
                window.setTimeout(() => {
                  setTransientFen(null);
                  setPly((p) => Math.min(p + 1, moves.length));
                }, 700);
              }
              window.setTimeout(() => setGuessFeedback(''), 1500);
              return true;
            }}
          />
          {guessMode && (
            <div style={{ marginTop: '0.5rem', color: guessFeedback.startsWith('Correct') ? '#2e7d32' : '#b00020', minHeight: '1.2rem' }}>
              {guessFeedback}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button style={btnStyle} onClick={goFirst}>First</button>
            <button style={btnStyle} onClick={goPrev}>Prev</button>
            <button style={btnStyle} onClick={() => setIsAuto((v) => !v)}>{isAuto ? 'Pause' : 'Play'}</button>
            <button style={btnStyle} onClick={goNext}>Next</button>
            <button style={btnStyle} onClick={goLast}>Last</button>
            <div style={{ marginLeft: 'auto', color: '#456650', fontWeight: 600 }}>
              {Math.ceil(ply / 2)} / {Math.ceil(moves.length / 2)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ color: '#666' }}>Speed</div>
            <input
              type="range"
              min="300"
              max="2000"
              step="100"
              value={speedMs}
              onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
              style={{ flex: 1, minWidth: 160 }}
            />
            <div style={{ width: 46, textAlign: 'right', color: '#666' }}>{Math.round(speedMs / 1000)}s</div>
          </div>
        </div>
        <div style={{ ...headerStyle, padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight: 700, color: '#333' }}>Annotation</div>
            <button
              style={{ background: '#456650', color: '#fff4ec', border: '1px solid #456650', padding: '0.35rem 0.7rem', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => {
                const input = window.prompt('Edit annotation for this move:', currentComment || '');
                if (input !== null) {
                  saveAnnotation(input);
                }
              }}
            >Edit</button>
          </div>
          {currentComment ? (
            <div style={{ color: '#333', lineHeight: 1.5, marginTop: 6 }}>{currentComment}</div>
          ) : (
            <div style={{ color: '#888', fontStyle: 'italic', marginTop: 6 }}>No annotation for this move.</div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ ...headerStyle, padding: '0.75rem 1rem' }}>
          <div style={{ fontWeight: 700, color: '#333', marginBottom: 6 }}>{headers.Event || 'Game'}</div>
          <div style={{ color: '#456650', fontWeight: 600 }}>
            {headers.White || 'White'} vs {headers.Black || 'Black'}
          </div>
          <div style={{ color: '#666', marginTop: 4 }}>{headers.Site || ''} {headers.Date ? `• ${headers.Date}` : ''}</div>
        </div>
        <div style={{ ...panelStyle, padding: '0.75rem 1rem', maxHeight: isNarrow ? 300 : 420, overflowY: 'auto' }}>
          {moves.length === 0 ? (
            <div style={{ color: '#777' }}>No moves parsed.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr', gap: '0.35rem 0.5rem', alignItems: 'center' }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>#</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>White</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Black</div>
              {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, idx) => {
                const w = moves[idx * 2];
                const b = moves[idx * 2 + 1];
                const wActive = ply === idx * 2 + 1;
                const bActive = ply === idx * 2 + 2;
                const activeStyle = { background: '#e6e1d7', borderRadius: 4 };
                const wHidden = guessMode && (idx * 2) >= ply; // hide current and future white
                const bHidden = guessMode && (idx * 2 + 1) >= ply; // hide current and future black
                return (
                  <>
                    <div key={`n-${idx}`} style={{ color: '#333', fontWeight: 600 }}>{idx + 1}</div>
                    <div key={`w-${idx}`} style={{ padding: '0.15rem 0.35rem', cursor: w && !wHidden ? 'pointer' : 'default', ...(wActive ? activeStyle : {}) }} onClick={() => w && !wHidden && setPly(idx * 2 + 1)}>
                      {wHidden ? '' : (w?.san || '')}
                    </div>
                    <div key={`b-${idx}`} style={{ padding: '0.15rem 0.35rem', cursor: b && !bHidden ? 'pointer' : 'default', ...(bActive ? activeStyle : {}) }} onClick={() => b && !bHidden && setPly(idx * 2 + 2)}>
                      {bHidden ? '' : (b?.san || '')}
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



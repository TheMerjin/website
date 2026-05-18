import { useState } from 'react';
import { isEliminated, toggleEliminated } from './guessWhoUtils.js';
import './guess-who.css';

const PHASES = [
  { id: 'setup', label: 'Roster' },
  { id: 'pick', label: 'Selection' },
  { id: 'play', label: 'Inquiry' },
];

function parseNames(text) {
  const seen = new Set();
  const names = [];
  for (const line of text.split(/\n/)) {
    const name = line.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }
  return names;
}

export default function GuessWho() {
  const [phase, setPhase] = useState('setup');
  const [namesText, setNamesText] = useState('');
  const [names, setNames] = useState([]);
  const [secret, setSecret] = useState(null);
  const [eliminated, setEliminated] = useState([]);
  const [guessMode, setGuessMode] = useState(false);
  const [lastGuess, setLastGuess] = useState(null);
  const [error, setError] = useState('');

  function startGame() {
    const parsed = parseNames(namesText);
    if (parsed.length < 2) {
      setError('At least two distinct names are required.');
      return;
    }
    setError('');
    setNames(parsed);
    setEliminated([]);
    setSecret(null);
    setLastGuess(null);
    setPhase('pick');
  }

  function confirmSecret(name) {
    setSecret(name);
    setPhase('play');
    setGuessMode(false);
  }

  function resetAll() {
    setPhase('setup');
    setNames([]);
    setSecret(null);
    setEliminated([]);
    setGuessMode(false);
    setLastGuess(null);
    setError('');
  }

  function handleCardClick(name) {
    if (phase === 'pick') {
      confirmSecret(name);
      return;
    }
    if (guessMode) {
      setLastGuess(name);
      setGuessMode(false);
      return;
    }
    setEliminated((prev) => toggleEliminated(prev, name));
  }

  const activePhaseIndex = phase === 'setup' ? 0 : phase === 'pick' ? 1 : 2;
  const remaining = names.length - eliminated.length;

  return (
    <div className="gw-guess-who">
      <nav className="gw-phase-bar" aria-label="Game phase">
        {PHASES.map((p, i) => (
          <span key={p.id} className={i <= activePhaseIndex ? 'gw-active' : ''}>
            {i + 1}. {p.label}
          </span>
        ))}
        {phase === 'play' && (
          <span className="gw-count">
            {remaining} / {names.length} candidates
          </span>
        )}
      </nav>

      {phase === 'setup' && (
        <section className="gw-section">
          <p className="gw-meta">§1 — Construct the roster</p>
          <h2>Enter suspects</h2>
          <p className="gw-lead">
            Agree on a shared list with your opponent, then transcribe it identically on each device—one name per line.
          </p>
          <textarea
            className="gw-textarea"
            rows={12}
            placeholder={'Alice\nBob\nCharlie\n…'}
            value={namesText}
            onChange={(e) => setNamesText(e.target.value)}
            spellCheck={false}
          />
          {error && <p className="gw-error">{error}</p>}
          <div className="gw-actions">
            <button type="button" className="gw-btn gw-btn-primary" onClick={startGame}>
              Proceed to selection →
            </button>
          </div>
        </section>
      )}

      {phase === 'pick' && (
        <section className="gw-section">
          <p className="gw-meta">§2 — Private selection</p>
          <h2>Choose your identity</h2>
          <p className="gw-hint">
            Select the name you will defend. Shield your screen from your opponent.
          </p>
          <NameGrid
            names={names}
            eliminated={[]}
            secret={null}
            onCardClick={handleCardClick}
            interactive
          />
          <div className="gw-actions">
            <button type="button" className="gw-btn gw-btn-ghost" onClick={resetAll}>
              ← Edit roster
            </button>
          </div>
        </section>
      )}

      {phase === 'play' && (
        <section className="gw-section">
          <p className="gw-meta">§3 — Deductive inquiry</p>

          <div className="gw-secret-panel">
            <span className="gw-secret-label">Your secret</span>
            <span className="gw-secret-value">{secret}</span>
          </div>

          <div className="gw-actions">
            <button
              type="button"
              className={`gw-btn ${!guessMode ? 'gw-btn-active' : 'gw-btn-ghost'}`}
              onClick={() => {
                setGuessMode(false);
                setLastGuess(null);
              }}
            >
              eliminate
            </button>
            <button
              type="button"
              className={`gw-btn gw-btn-guess ${guessMode ? 'gw-btn-active' : 'gw-btn-ghost'}`}
              onClick={() => setGuessMode(true)}
            >
              accuse
            </button>
            <button type="button" className="gw-btn gw-btn-ghost" onClick={resetAll}>
              new game
            </button>
          </div>

          {guessMode && (
            <p className="gw-hint">Tap a name to lodge your accusation; your opponent judges aloud.</p>
          )}

          {lastGuess && (
            <p className="gw-guess-result">
              Accusation: «{lastGuess}» — await verdict.
            </p>
          )}

          <NameGrid
            names={names}
            eliminated={eliminated}
            secret={secret}
            onCardClick={handleCardClick}
            interactive
            showSecret
          />

          <p className="gw-footnote">
            Eliminations are local to this device. Ask yes/no questions in person; strike names as hypotheses fail.
          </p>
        </section>
      )}
    </div>
  );
}

function NameGrid({ names, eliminated, secret, onCardClick, interactive, showSecret }) {
  return (
    <div className="gw-grid" role="list">
      {names.map((name) => {
        const out = isEliminated(eliminated, name);
        const isSecret =
          showSecret && secret && secret.toLowerCase() === name.toLowerCase();
        const classes = ['gw-card', out && 'gw-card-out', isSecret && 'gw-card-secret']
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={name}
            type="button"
            className={classes}
            disabled={!interactive}
            onClick={() => interactive && onCardClick(name)}
            role="listitem"
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}

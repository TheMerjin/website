import React, { useState, useEffect, useMemo, useCallback } from 'react';

const STORAGE_KEY_V2 = 'act-prep-bubbling-v2';
const STORAGE_KEY_V1 = 'act-prep-bubbling-v1';

/** Totals and timing from the ACT student overview; scored counts are typical published figures. */
const ACT_SECTIONS = [
  {
    id: 'english',
    name: 'English',
    total: 50,
    scoredDefault: 40,
    minutes: 35,
    optional: false,
  },
  {
    id: 'math',
    name: 'Mathematics',
    total: 45,
    scoredDefault: 41,
    minutes: 50,
    optional: false,
  },
  {
    id: 'reading',
    name: 'Reading',
    total: 36,
    scoredDefault: 27,
    minutes: 40,
    optional: false,
  },
  {
    id: 'science',
    name: 'Science',
    total: 40,
    scoredDefault: 34,
    minutes: 40,
    optional: true,
  },
];

const LETTERS = ['A', 'B', 'C', 'D'];

const V1_LENGTHS = { english: 40, math: 41, reading: 27, science: 34 };

function defaultScoredMask(s) {
  return Array.from({ length: s.total }, (_, i) => i < s.scoredDefault);
}

function emptyGrids() {
  const responses = {};
  const answerKey = {};
  const scoredFlags = {};
  for (const s of ACT_SECTIONS) {
    responses[s.id] = Array(s.total).fill('');
    answerKey[s.id] = Array(s.total).fill('');
    scoredFlags[s.id] = defaultScoredMask(s);
  }
  return { responses, answerKey, scoredFlags };
}

function migrateFromV1(parsed) {
  const base = emptyGrids();
  let ok = true;
  for (const s of ACT_SECTIONS) {
    const oldLen = V1_LENGTHS[s.id];
    const r = parsed.responses?.[s.id];
    const k = parsed.answerKey?.[s.id];
    if (!Array.isArray(r) || r.length !== oldLen || !Array.isArray(k) || k.length !== oldLen) {
      ok = false;
      break;
    }
    const pad = s.total - oldLen;
    base.responses[s.id] = [
      ...r.map((x) => (LETTERS.includes(x) ? x : '')),
      ...Array(pad).fill(''),
    ];
    base.answerKey[s.id] = [
      ...k.map((x) => (LETTERS.includes(x) ? x : '')),
      ...Array(pad).fill(''),
    ];
    base.scoredFlags[s.id] = [
      ...Array(oldLen).fill(true),
      ...Array(pad).fill(false),
    ];
  }
  return ok ? base : null;
}

function loadState() {
  try {
    const raw2 = localStorage.getItem(STORAGE_KEY_V2);
    if (raw2) {
      const parsed = JSON.parse(raw2);
      const base = emptyGrids();
      if (typeof parsed.includeScience === 'boolean') {
        base.includeScience = parsed.includeScience;
      }
      for (const s of ACT_SECTIONS) {
        if (Array.isArray(parsed.responses?.[s.id]) && parsed.responses[s.id].length === s.total) {
          base.responses[s.id] = parsed.responses[s.id].map((x) => (LETTERS.includes(x) ? x : ''));
        }
        if (Array.isArray(parsed.answerKey?.[s.id]) && parsed.answerKey[s.id].length === s.total) {
          base.answerKey[s.id] = parsed.answerKey[s.id].map((x) => (LETTERS.includes(x) ? x : ''));
        }
        if (
          Array.isArray(parsed.scoredFlags?.[s.id]) &&
          parsed.scoredFlags[s.id].length === s.total
        ) {
          base.scoredFlags[s.id] = parsed.scoredFlags[s.id].map((x) => !!x);
        }
      }
      base.showActHeader = parsed.showActHeader !== false;
      return base;
    }

    const raw1 = localStorage.getItem(STORAGE_KEY_V1);
    if (raw1) {
      const migrated = migrateFromV1(JSON.parse(raw1));
      if (migrated) return { ...migrated, includeScience: true };
    }
  } catch {
    /* ignore */
  }
  return { ...emptyGrids(), includeScience: true, showActHeader: true };
}

function sectionsInUse(includeScience) {
  return ACT_SECTIONS.filter((s) => !s.optional || includeScience);
}

function computeGrade(responses, answerKey, scoredFlags, includeScience) {
  const wrong = [];
  let graded = 0;
  let correctCount = 0;

  for (const s of sectionsInUse(includeScience)) {
    const n = s.total;
    for (let i = 0; i < n; i++) {
      if (!scoredFlags[s.id][i]) continue;
      const keyLetter = answerKey[s.id][i];
      if (!keyLetter) continue;
      graded++;
      const mine = responses[s.id][i];
      if (mine === keyLetter) {
        correctCount++;
      } else {
        wrong.push({
          sectionId: s.id,
          sectionName: s.name,
          q: i + 1,
          yours: mine || '(blank)',
          correct: keyLetter,
        });
      }
    }
  }

  return {
    graded,
    correctCount,
    wrong,
    pct: graded > 0 ? Math.round((1000 * correctCount) / graded) / 10 : null,
  };
}

function normPos(q, n) {
  if (n <= 1) return 0.5;
  return (q - 1) / (n - 1);
}

function thirdBucket(q, n) {
  const t = Math.ceil((3 * q) / n);
  return Math.min(Math.max(t, 1), 3);
}

function statsForWrongs(wrongs, sectionId, sectionName, n) {
  const list = wrongs.filter((w) => w.sectionId === sectionId);
  if (list.length === 0) {
    return {
      sectionName,
      count: 0,
      meanPos: null,
      biasLabel: '—',
      thirds: [0, 0, 0],
      evennessLabel: '—',
    };
  }

  const positions = list.map((w) => normPos(w.q, n));
  const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
  let biasLabel = 'spread across the section';
  if (mean >= 0.58) biasLabel = 'clustered more toward the end';
  else if (mean <= 0.42) biasLabel = 'clustered more toward the beginning';

  const thirds = [0, 0, 0];
  for (const w of list) {
    thirds[thirdBucket(w.q, n) - 1]++;
  }
  const expected = list.length / 3;
  let evennessLabel = 'fairly even across thirds';
  if (expected >= 1) {
    const maxD = Math.max(...thirds) - Math.min(...thirds);
    if (maxD >= Math.max(2, list.length * 0.35)) {
      const hi = thirds.indexOf(Math.max(...thirds));
      const labels = ['first third', 'middle third', 'last third'];
      evennessLabel = `weighted toward the ${labels[hi]} (${thirds[hi]} of ${list.length} wrong)`;
    }
  } else if (list.length === 1) {
    evennessLabel = 'only one miss in this section';
  }

  return {
    sectionName,
    count: list.length,
    meanPos: mean,
    biasLabel,
    thirds,
    evennessLabel,
  };
}

function overallWrongStats(wrong) {
  if (wrong.length === 0) {
    return {
      meanPos: null,
      biasLabel: '—',
      thirds: [0, 0, 0],
      evennessLabel: '—',
    };
  }
  const positions = wrong.map((w) => {
    const sec = ACT_SECTIONS.find((s) => s.id === w.sectionId);
    return normPos(w.q, sec.total);
  });
  const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
  let biasLabel = 'spread across each section';
  if (mean >= 0.58) biasLabel = 'overall, misses skew toward later questions in sections';
  else if (mean <= 0.42) biasLabel = 'overall, misses skew toward earlier questions in sections';

  const thirds = [0, 0, 0];
  for (const w of wrong) {
    const sec = ACT_SECTIONS.find((s) => s.id === w.sectionId);
    thirds[thirdBucket(w.q, sec.total) - 1]++;
  }
  const expected = wrong.length / 3;
  let evennessLabel = 'fairly even across first / middle / last thirds (within each section)';
  if (expected >= 1) {
    const maxD = Math.max(...thirds) - Math.min(...thirds);
    if (maxD >= Math.max(2, wrong.length * 0.35)) {
      const hi = thirds.indexOf(Math.max(...thirds));
      const labels = ['first third', 'middle third', 'last third'];
      evennessLabel = `overall, misses cluster in the ${labels[hi]} (${thirds[hi]} of ${wrong.length})`;
    }
  }

  return { meanPos: mean, biasLabel, thirds, evennessLabel };
}

function BubbleRow({ qNum, value, onPick, scored, onToggleScored }) {
  return (
    <div className={`act-bubble-row${scored ? '' : ' unscored-row'}`}>
      <label className="act-scored-wrap" title="Count this question toward your score">
        <input
          type="checkbox"
          className="act-scored-cb"
          checked={scored}
          onChange={() => onToggleScored()}
        />
        <span className="act-scored-label">Score</span>
      </label>
      <span className="act-q-num">{qNum}</span>
      <div className="act-bubbles" role="group" aria-label={`Question ${qNum}`}>
        {LETTERS.map((L) => (
          <button
            key={L}
            type="button"
            className={`act-bubble ${value === L ? 'selected' : ''}`}
            onClick={() => onPick(value === L ? '' : L)}
            aria-pressed={value === L}
          >
            {L}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ActPrepBubbling() {
  const [responses, setResponses] = useState(() => emptyGrids().responses);
  const [answerKey, setAnswerKey] = useState(() => emptyGrids().answerKey);
  const [scoredFlags, setScoredFlags] = useState(() => emptyGrids().scoredFlags);
  const [includeScience, setIncludeScience] = useState(true);
  const [panel, setPanel] = useState('practice');
  const [showActHeader, setShowActHeader] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = loadState();
    setResponses(s.responses);
    setAnswerKey(s.answerKey);
    setScoredFlags(s.scoredFlags);
    setIncludeScience(s.includeScience !== false);
    setShowActHeader(s.showActHeader !== false);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload = JSON.stringify({
      responses,
      answerKey,
      scoredFlags,
      includeScience,
      showActHeader,
    });
    localStorage.setItem(STORAGE_KEY_V2, payload);
  }, [responses, answerKey, scoredFlags, includeScience, showActHeader, hydrated]);

  const setLetter = useCallback((setGrid, sectionId, index, letter) => {
    setGrid((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((v, i) => (i === index ? letter : v)),
    }));
  }, []);

  const toggleScored = useCallback((sectionId, index) => {
    setScoredFlags((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((v, i) => (i === index ? !v : v)),
    }));
  }, []);

  const setSectionScoredPreset = useCallback((sectionId, preset) => {
    const s = ACT_SECTIONS.find((x) => x.id === sectionId);
    if (!s) return;
    setScoredFlags((prev) => ({
      ...prev,
      [sectionId]:
        preset === 'act'
          ? defaultScoredMask(s)
          : preset === 'all'
            ? Array(s.total).fill(true)
            : Array(s.total).fill(false),
    }));
  }, []);

  const grade = useMemo(
    () => computeGrade(responses, answerKey, scoredFlags, includeScience),
    [responses, answerKey, scoredFlags, includeScience]
  );

  const activeSections = useMemo(() => sectionsInUse(includeScience), [includeScience]);

  const sectionStats = useMemo(() => {
    return activeSections.map((s) => statsForWrongs(grade.wrong, s.id, s.name, s.total));
  }, [grade.wrong, activeSections]);

  const overall = useMemo(() => overallWrongStats(grade.wrong), [grade.wrong]);

  const keyFilledScored = useMemo(() => {
    let c = 0;
    for (const s of activeSections) {
      for (let i = 0; i < s.total; i++) {
        if (scoredFlags[s.id][i] && answerKey[s.id][i]) c++;
      }
    }
    return c;
  }, [answerKey, scoredFlags, activeSections]);

  const resetAll = () => {
    if (!window.confirm('Clear answers, answer key, and score toggles on this device?')) return;
    const empty = emptyGrids();
    setResponses(empty.responses);
    setAnswerKey(empty.answerKey);
    setScoredFlags(empty.scoredFlags);
    setIncludeScience(true);
  };

  const headerActions = (
    <>
      <label className="act-include-science">
        <input
          type="checkbox"
          checked={includeScience}
          onChange={(e) => setIncludeScience(e.target.checked)}
        />
        <span>Include Science section</span>
      </label>
      <button type="button" className="act-btn act-btn-reset" onClick={resetAll}>
        Reset all
      </button>
    </>
  );

  return (
    <div className="act-root">
      {showActHeader ? (
        <header className="act-header" role="region" aria-label="ACT prep introduction">
          <div className="act-inner act-header-inner">
            <div className="act-header-text">
              <h1 className="act-title">ACT Prep Bubbling</h1>
              <p className="act-sub">
                Multiple-choice counts and timing follow the usual ACT overview. Which items are “scored” for your
                practice is up to you — use the Score checkbox on each row, or the section shortcuts below.
                Unscored rows are still useful for bubbling practice but are ignored when grading. Data stays in
                this browser.
              </p>
              <details className="act-overview-details">
                <summary className="act-overview-summary">Overview of the ACT (reference)</summary>
                <p className="act-overview-blurb">
                  The ACT has English, mathematics, and reading multiple-choice sections. Science and writing are
                  optional; some schools require or accept science or writing scores.
                </p>
                <table className="act-overview-table">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Questions</th>
                      <th>Minutes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ACT_SECTIONS.map((s) => (
                      <tr key={s.id}>
                        <td>
                          {s.name}
                          {s.optional ? ' (optional)' : ''}
                        </td>
                        <td>
                          {s.total} ({s.scoredDefault} scored typical)
                        </td>
                        <td>{s.minutes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="act-footnote">
                  Typical “scored” counts are public summary figures; the test does not tell you which specific items
                  are unscored. Defaults here mark the first{' '}
                  {ACT_SECTIONS.map((s) => `${s.scoredDefault}/${s.total}`).join(', ')} (by section) as counting toward
                  score — adjust per your materials.
                </p>
              </details>
            </div>
            <div className="act-header-actions">
              {headerActions}
              <button
                type="button"
                className="act-btn tiny"
                onClick={() => setShowActHeader(false)}
              >
                Hide header
              </button>
            </div>
          </div>
        </header>
      ) : (
        <header className="act-header act-header-collapsed" role="region" aria-label="ACT prep toolbar">
          <div className="act-inner act-header-collapsed-inner">
            <button
              type="button"
              className="act-btn tiny"
              onClick={() => setShowActHeader(true)}
            >
              Show header
            </button>
            <span className="act-collapsed-title">ACT Prep Bubbling</span>
            <div className="act-header-actions act-header-actions-inline">{headerActions}</div>
          </div>
        </header>
      )}

      <nav className="act-tabs" role="tablist" aria-label="ACT prep views">
        <div className="act-inner act-tabs-inner">
        <button
          type="button"
          role="tab"
          aria-selected={panel === 'practice'}
          className={panel === 'practice' ? 'active' : ''}
          onClick={() => setPanel('practice')}
        >
          My answers
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={panel === 'key'}
          className={panel === 'key' ? 'active' : ''}
          onClick={() => setPanel('key')}
        >
          Answer key
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={panel === 'results'}
          className={panel === 'results' ? 'active' : ''}
          onClick={() => setPanel('results')}
        >
          Results &amp; stats
        </button>
        </div>
      </nav>

      <main className="act-body">
        {(panel === 'practice' || panel === 'key') && (
          <div className="act-scroll">
            <div className="act-inner">
            {activeSections.map((s) => {
              const scoredCount = scoredFlags[s.id].filter(Boolean).length;
              return (
                <section key={s.id} className="act-section">
                  <div className="act-section-head">
                    <h2 className="act-section-title">
                      {s.name}{' '}
                      <span className="act-count">
                        ({s.total} items, {scoredCount} toward score)
                      </span>
                    </h2>
                    <div className="act-section-tools">
                      <span className="act-tools-hint">{s.minutes} min on the real test</span>
                      <button
                        type="button"
                        className="act-btn tiny"
                        onClick={() => setSectionScoredPreset(s.id, 'act')}
                      >
                        ACT default ({s.scoredDefault} scored)
                      </button>
                      <button
                        type="button"
                        className="act-btn tiny"
                        onClick={() => setSectionScoredPreset(s.id, 'all')}
                      >
                        All scored
                      </button>
                      <button
                        type="button"
                        className="act-btn tiny"
                        onClick={() => setSectionScoredPreset(s.id, 'none')}
                      >
                        None scored
                      </button>
                    </div>
                  </div>
                  <div className="act-grid">
                    {Array.from({ length: s.total }, (_, i) => (
                      <BubbleRow
                        key={i}
                        qNum={i + 1}
                        scored={scoredFlags[s.id][i]}
                        onToggleScored={() => toggleScored(s.id, i)}
                        value={panel === 'practice' ? responses[s.id][i] : answerKey[s.id][i]}
                        onPick={(L) =>
                          panel === 'practice'
                            ? setLetter(setResponses, s.id, i, L)
                            : setLetter(setAnswerKey, s.id, i, L)
                        }
                      />
                    ))}
                  </div>
                </section>
              );
            })}
            </div>
          </div>
        )}

        {panel === 'results' && (
          <div className="act-scroll act-results">
            <div className="act-inner">
            <div className="act-summary-card">
              <h2>Score</h2>
              {!includeScience && (
                <p className="act-muted small">Science section excluded — turn it on in the header to grade it.</p>
              )}
              {keyFilledScored === 0 ? (
                <p className="act-muted">
                  Enter key letters for at least one row that has “Score” checked to grade.
                </p>
              ) : (
                <>
                  <p className="act-score-line">
                    <strong>{grade.correctCount}</strong> / <strong>{grade.graded}</strong> correct
                    {grade.pct != null && <span className="act-pct"> ({grade.pct}%)</span>}
                  </p>
                  <p className="act-muted small">
                    Only rows with Score checked and a key letter count. Blanks with a key count as wrong.
                    Unchecked rows are practice-only.
                  </p>
                </>
              )}
            </div>

            {grade.wrong.length > 0 && (
              <>
                <div className="act-summary-card">
                  <h2>Wrong</h2>
                  <ul className="act-wrong-list">
                    {grade.wrong.map((w, idx) => (
                      <li key={`${w.sectionId}-${w.q}-${idx}`}>
                        <strong>{w.sectionName}</strong> Q{w.q}: you <code>{w.yours}</code>, answer{' '}
                        <code>{w.correct}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="act-summary-card">
                  <h2>Pattern (within each section)</h2>
                  <p className="act-muted small">
                    Uses only missed scored questions. Thirds split each section by question number (early / middle /
                    late).
                  </p>
                  <ul className="act-stat-list">
                    {sectionStats.map((st) => (
                      <li key={st.sectionName}>
                        <strong>{st.sectionName}</strong>
                        {st.count === 0 ? (
                          <span> — no misses.</span>
                        ) : (
                          <>
                            <div>
                              {st.count} miss{st.count === 1 ? '' : 'es'} — {st.biasLabel}
                            </div>
                            <div className="act-thirds">
                              First third: {st.thirds[0]} · Middle: {st.thirds[1]} · Last third:{' '}
                              {st.thirds[2]}
                            </div>
                            <div className="act-even">{st.evennessLabel}</div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="act-summary-card">
                  <h2>Overall pattern (all misses)</h2>
                  <p>{overall.biasLabel}</p>
                  <p className="act-thirds">
                    First third: {overall.thirds[0]} · Middle: {overall.thirds[1]} · Last third:{' '}
                    {overall.thirds[2]}
                  </p>
                  <p className="act-even">{overall.evennessLabel}</p>
                </div>
              </>
            )}

            {keyFilledScored > 0 && grade.wrong.length === 0 && grade.graded > 0 && (
              <div className="act-summary-card act-success">
                <p>Everything keyed matches — nice work on the graded items.</p>
              </div>
            )}
            </div>
          </div>
        )}
      </main>

      <style>{`
        /* Neutral palette: design philosophy §4 — avoid saturated accents; no strong blue */
        .act-root {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          background: #f9f9f9;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1rem;
          line-height: 1.5;
          color: #1a1a1a;
        }
        .act-inner {
          width: 100%;
          max-width: min(70rem, 100%);
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
          padding-left: clamp(0.75rem, 2vw, 1.25rem);
          padding-right: clamp(0.75rem, 2vw, 1.25rem);
        }
        .act-header {
          flex-shrink: 0;
          background: #fff;
          border-bottom: 1px solid #ddd;
        }
        .act-header-collapsed {
          border-bottom: 1px solid #ddd;
        }
        .act-header-collapsed-inner {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem 1rem;
          padding-top: 0.45rem;
          padding-bottom: 0.45rem;
        }
        .act-collapsed-title {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.4;
          color: #1a1a1a;
          flex: 1;
          min-width: 8rem;
        }
        .act-header-actions-inline {
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem 0.75rem;
          width: auto;
        }
        .act-header-inner {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }
        .act-header-text {
          flex: 1;
          min-width: min(100%, 16rem);
        }
        .act-title {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          line-height: 1.4;
          color: #1a1a1a;
        }
        .act-sub {
          margin: 0.5rem 0 0;
          font-size: 1rem;
          color: #444;
          line-height: 1.5;
          max-width: 58rem;
        }
        .act-overview-details {
          margin-top: 0.5rem;
        }
        .act-overview-summary {
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #444;
          text-decoration: underline;
          user-select: none;
        }
        .act-overview-summary:hover {
          color: #232323;
        }
        .act-overview-blurb {
          font-size: 1rem;
          color: #666;
          line-height: 1.5;
          margin: 0.5rem 0;
        }
        .act-overview-table {
          width: 100%;
          max-width: min(42rem, 100%);
          border-collapse: collapse;
          font-size: 1rem;
          margin: 0.5rem 0;
        }
        .act-overview-table th,
        .act-overview-table td {
          border: 1px solid #ddd;
          padding: 0.5rem;
          text-align: left;
        }
        .act-overview-table th {
          background: #f5f5f5;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
        }
        .act-overview-table td {
          font-family: 'Georgia', 'Merriweather', serif;
          font-size: 0.95rem;
        }
        .act-footnote {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.45;
          margin: 0.5rem 0 0;
        }
        .act-header-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-end;
        }
        .act-include-science {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: #1a1a1a;
          cursor: pointer;
          user-select: none;
        }
        .act-include-science input {
          cursor: pointer;
          width: 1rem;
          height: 1rem;
          accent-color: #555;
        }
        .act-btn {
          font-family: 'Inter', inherit;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.18rem 0.8rem;
          border: 1px solid #aaa;
          background: #eee;
          color: #1a1a1a;
          cursor: pointer;
          border-radius: 0;
        }
        .act-btn.tiny {
          font-size: 0.85rem;
          padding: 0.18rem 0.5rem;
        }
        .act-btn:hover {
          background: #ddd;
        }
        .act-btn:focus-visible {
          outline: 2px solid #555;
          outline-offset: 1px;
        }
        .act-btn-reset {
          background: #fff;
        }
        .act-tabs {
          flex-shrink: 0;
          background: #fff;
          border-bottom: 1px solid #ddd;
        }
        .act-tabs-inner {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          padding: 0;
        }
        .act-tabs button {
          font-family: 'Inter', inherit;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.35rem 0.65rem;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: #666;
          cursor: pointer;
          margin-bottom: -1px;
          border-radius: 0;
        }
        .act-tabs button:hover {
          color: #1a1a1a;
        }
        .act-tabs button:focus-visible {
          outline: 2px solid #555;
          outline-offset: -2px;
        }
        .act-tabs button.active {
          color: #1a1a1a;
          border-bottom-color: #1a1a1a;
          font-weight: 600;
        }
        .act-body {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .act-scroll {
          flex: 1;
          overflow-y: auto;
          padding-top: 0.75rem;
          padding-bottom: 1.5rem;
        }
        .act-section {
          margin-bottom: 1rem;
          background: #fff;
          border: 1px solid #ddd;
          padding: 0.75rem 0.85rem;
        }
        .act-section-head {
          margin-bottom: 0.5rem;
        }
        .act-section-title {
          margin: 0 0 0.35rem;
          font-size: 1.02rem;
          font-weight: 600;
          line-height: 1.4;
          color: #1a1a1a;
        }
        .act-count {
          font-weight: 500;
          color: #666;
        }
        .act-section-tools {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.35rem;
        }
        .act-tools-hint {
          font-size: 0.85rem;
          color: #666;
          margin-right: 0.15rem;
        }
        .act-grid {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .act-bubble-row {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.95rem;
        }
        .act-bubble-row.unscored-row .act-q-num {
          color: #666;
        }
        .act-scored-wrap {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          cursor: pointer;
          flex-shrink: 0;
          width: 5.1rem;
          user-select: none;
        }
        .act-scored-cb {
          cursor: pointer;
          margin: 0;
          width: 1.05rem;
          height: 1.05rem;
          accent-color: #555;
        }
        .act-scored-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #666;
        }
        .act-q-num {
          width: 1.9rem;
          flex-shrink: 0;
          color: #444;
          font-variant-numeric: tabular-nums;
          text-align: right;
          font-size: 0.9rem;
        }
        .act-bubbles {
          display: flex;
          gap: 0.38rem;
          align-items: center;
        }
        .act-bubble {
          box-sizing: border-box;
          width: 1.95rem;
          height: 1.95rem;
          min-width: 1.95rem;
          min-height: 1.95rem;
          padding: 0;
          border: 1px solid #ccc;
          border-radius: 50%;
          background: #fff;
          color: #1a1a1a;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', inherit;
          line-height: 1;
        }
        .act-bubble:hover {
          background: #f5f5f5;
          border-color: #aaa;
        }
        .act-bubble:focus-visible {
          outline: 2px solid #777;
          outline-offset: 1px;
        }
        .act-bubble.selected {
          background: #ddd;
          border-color: #888;
          color: #1a1a1a;
        }
        .act-bubble-row.unscored-row .act-bubble.selected {
          background: #ececec;
          border-color: #c6c6c6;
          color: #9a9a9a;
        }
        .act-bubble-row.unscored-row .act-bubble.selected:hover {
          background: #e4e4e4;
          border-color: #bdbdbd;
          color: #888;
        }
        .act-results .act-summary-card {
          background: #fff;
          border: 1px solid #ddd;
          padding: 0.75rem 0.85rem;
          margin-bottom: 0.75rem;
        }
        .act-summary-card h2 {
          margin: 0 0 0.4rem;
          font-size: 1.02rem;
          font-weight: 600;
          line-height: 1.4;
          color: #1a1a1a;
        }
        .act-muted {
          color: #666;
          margin: 0;
        }
        .act-muted.small {
          font-size: 0.9rem;
          margin-top: 0.4rem;
        }
        .act-score-line {
          margin: 0;
          font-size: 1rem;
          color: #1a1a1a;
          line-height: 1.5;
        }
        .act-pct {
          color: #666;
          font-weight: 500;
        }
        .act-wrong-list {
          margin: 0;
          padding-left: 1.1rem;
          font-size: 0.95rem;
          color: #1a1a1a;
          line-height: 1.5;
        }
        .act-wrong-list code {
          font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
          font-size: 0.85em;
          background: #f5f5f5;
          border: 1px solid #ddd;
          padding: 0.05rem 0.3rem;
          border-radius: 0;
        }
        .act-stat-list {
          margin: 0.4rem 0 0;
          padding-left: 1.1rem;
          font-size: 0.95rem;
          line-height: 1.45;
          color: #1a1a1a;
        }
        .act-stat-list > li {
          margin-bottom: 0.5rem;
        }
        .act-thirds {
          font-size: 0.9rem;
          color: #666;
          margin-top: 0.15rem;
        }
        .act-even {
          font-size: 0.9rem;
          color: #444;
          margin-top: 0.1rem;
        }
        .act-success {
          border: 1px solid #ddd;
          background: #f5f5f5;
        }
        .act-success p {
          margin: 0;
          color: #444;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        @media (max-width: 800px) {
          .act-header-collapsed-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .act-header-actions-inline {
            width: 100%;
          }
          .act-header-actions {
            align-items: flex-start;
            width: 100%;
          }
          .act-tabs-inner {
            overflow-x: auto;
            flex-wrap: nowrap;
          }
          .act-tabs button {
            white-space: nowrap;
          }
          .act-section-tools {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

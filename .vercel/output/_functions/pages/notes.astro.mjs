import { c as createComponent, e as renderScript, m as maybeRenderHead, b as renderComponent, d as renderTemplate } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$Header } from '../chunks/Header_WflSty_f.mjs';
/* empty css                                 */
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
/* empty css                                 */
import { $ as $$Index, a as $$Index$1 } from '../chunks/index_D1zd1PVJ.mjs';
export { renderers } from '../renderers.mjs';

const STORAGE_KEY_V2 = "act-prep-bubbling-v2";
const STORAGE_KEY_V1 = "act-prep-bubbling-v1";
const ACT_SECTIONS = [
  {
    id: "english",
    name: "English",
    total: 50,
    scoredDefault: 40,
    minutes: 35,
    optional: false
  },
  {
    id: "math",
    name: "Mathematics",
    total: 45,
    scoredDefault: 41,
    minutes: 50,
    optional: false
  },
  {
    id: "reading",
    name: "Reading",
    total: 36,
    scoredDefault: 27,
    minutes: 40,
    optional: false
  },
  {
    id: "science",
    name: "Science",
    total: 40,
    scoredDefault: 34,
    minutes: 40,
    optional: true
  }
];
const LETTERS = ["A", "B", "C", "D"];
const V1_LENGTHS = { english: 40, math: 41, reading: 27, science: 34 };
function defaultScoredMask(s) {
  return Array.from({ length: s.total }, (_, i) => i < s.scoredDefault);
}
function emptyGrids() {
  const responses = {};
  const answerKey = {};
  const scoredFlags = {};
  for (const s of ACT_SECTIONS) {
    responses[s.id] = Array(s.total).fill("");
    answerKey[s.id] = Array(s.total).fill("");
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
      ...r.map((x) => LETTERS.includes(x) ? x : ""),
      ...Array(pad).fill("")
    ];
    base.answerKey[s.id] = [
      ...k.map((x) => LETTERS.includes(x) ? x : ""),
      ...Array(pad).fill("")
    ];
    base.scoredFlags[s.id] = [
      ...Array(oldLen).fill(true),
      ...Array(pad).fill(false)
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
      if (typeof parsed.includeScience === "boolean") {
        base.includeScience = parsed.includeScience;
      }
      for (const s of ACT_SECTIONS) {
        if (Array.isArray(parsed.responses?.[s.id]) && parsed.responses[s.id].length === s.total) {
          base.responses[s.id] = parsed.responses[s.id].map((x) => LETTERS.includes(x) ? x : "");
        }
        if (Array.isArray(parsed.answerKey?.[s.id]) && parsed.answerKey[s.id].length === s.total) {
          base.answerKey[s.id] = parsed.answerKey[s.id].map((x) => LETTERS.includes(x) ? x : "");
        }
        if (Array.isArray(parsed.scoredFlags?.[s.id]) && parsed.scoredFlags[s.id].length === s.total) {
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
          yours: mine || "(blank)",
          correct: keyLetter
        });
      }
    }
  }
  return {
    graded,
    correctCount,
    wrong,
    pct: graded > 0 ? Math.round(1e3 * correctCount / graded) / 10 : null
  };
}
function normPos(q, n) {
  if (n <= 1) return 0.5;
  return (q - 1) / (n - 1);
}
function thirdBucket(q, n) {
  const t = Math.ceil(3 * q / n);
  return Math.min(Math.max(t, 1), 3);
}
function statsForWrongs(wrongs, sectionId, sectionName, n) {
  const list = wrongs.filter((w) => w.sectionId === sectionId);
  if (list.length === 0) {
    return {
      sectionName,
      count: 0,
      meanPos: null,
      biasLabel: "—",
      thirds: [0, 0, 0],
      evennessLabel: "—"
    };
  }
  const positions = list.map((w) => normPos(w.q, n));
  const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
  let biasLabel = "spread across the section";
  if (mean >= 0.58) biasLabel = "clustered more toward the end";
  else if (mean <= 0.42) biasLabel = "clustered more toward the beginning";
  const thirds = [0, 0, 0];
  for (const w of list) {
    thirds[thirdBucket(w.q, n) - 1]++;
  }
  const expected = list.length / 3;
  let evennessLabel = "fairly even across thirds";
  if (expected >= 1) {
    const maxD = Math.max(...thirds) - Math.min(...thirds);
    if (maxD >= Math.max(2, list.length * 0.35)) {
      const hi = thirds.indexOf(Math.max(...thirds));
      const labels = ["first third", "middle third", "last third"];
      evennessLabel = `weighted toward the ${labels[hi]} (${thirds[hi]} of ${list.length} wrong)`;
    }
  } else if (list.length === 1) {
    evennessLabel = "only one miss in this section";
  }
  return {
    sectionName,
    count: list.length,
    meanPos: mean,
    biasLabel,
    thirds,
    evennessLabel
  };
}
function overallWrongStats(wrong) {
  if (wrong.length === 0) {
    return {
      meanPos: null,
      biasLabel: "—",
      thirds: [0, 0, 0],
      evennessLabel: "—"
    };
  }
  const positions = wrong.map((w) => {
    const sec = ACT_SECTIONS.find((s) => s.id === w.sectionId);
    return normPos(w.q, sec.total);
  });
  const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
  let biasLabel = "spread across each section";
  if (mean >= 0.58) biasLabel = "overall, misses skew toward later questions in sections";
  else if (mean <= 0.42) biasLabel = "overall, misses skew toward earlier questions in sections";
  const thirds = [0, 0, 0];
  for (const w of wrong) {
    const sec = ACT_SECTIONS.find((s) => s.id === w.sectionId);
    thirds[thirdBucket(w.q, sec.total) - 1]++;
  }
  const expected = wrong.length / 3;
  let evennessLabel = "fairly even across first / middle / last thirds (within each section)";
  if (expected >= 1) {
    const maxD = Math.max(...thirds) - Math.min(...thirds);
    if (maxD >= Math.max(2, wrong.length * 0.35)) {
      const hi = thirds.indexOf(Math.max(...thirds));
      const labels = ["first third", "middle third", "last third"];
      evennessLabel = `overall, misses cluster in the ${labels[hi]} (${thirds[hi]} of ${wrong.length})`;
    }
  }
  return { meanPos: mean, biasLabel, thirds, evennessLabel };
}
function BubbleRow({ qNum, value, onPick, scored, onToggleScored }) {
  return /* @__PURE__ */ jsxs("div", { className: `act-bubble-row${scored ? "" : " unscored-row"}`, children: [
    /* @__PURE__ */ jsxs("label", { className: "act-scored-wrap", title: "Count this question toward your score", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          className: "act-scored-cb",
          checked: scored,
          onChange: () => onToggleScored()
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "act-scored-label", children: "Score" })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "act-q-num", children: qNum }),
    /* @__PURE__ */ jsx("div", { className: "act-bubbles", role: "group", "aria-label": `Question ${qNum}`, children: LETTERS.map((L) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: `act-bubble ${value === L ? "selected" : ""}`,
        onClick: () => onPick(value === L ? "" : L),
        "aria-pressed": value === L,
        children: L
      },
      L
    )) })
  ] });
}
function ActPrepBubbling() {
  const [responses, setResponses] = useState(() => emptyGrids().responses);
  const [answerKey, setAnswerKey] = useState(() => emptyGrids().answerKey);
  const [scoredFlags, setScoredFlags] = useState(() => emptyGrids().scoredFlags);
  const [includeScience, setIncludeScience] = useState(true);
  const [panel, setPanel] = useState("practice");
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
      showActHeader
    });
    localStorage.setItem(STORAGE_KEY_V2, payload);
  }, [responses, answerKey, scoredFlags, includeScience, showActHeader, hydrated]);
  const setLetter = useCallback((setGrid, sectionId, index, letter) => {
    setGrid((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((v, i) => i === index ? letter : v)
    }));
  }, []);
  const toggleScored = useCallback((sectionId, index) => {
    setScoredFlags((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((v, i) => i === index ? !v : v)
    }));
  }, []);
  const setSectionScoredPreset = useCallback((sectionId, preset) => {
    const s = ACT_SECTIONS.find((x) => x.id === sectionId);
    if (!s) return;
    setScoredFlags((prev) => ({
      ...prev,
      [sectionId]: preset === "act" ? defaultScoredMask(s) : preset === "all" ? Array(s.total).fill(true) : Array(s.total).fill(false)
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
    if (!window.confirm("Clear answers, answer key, and score toggles on this device?")) return;
    const empty = emptyGrids();
    setResponses(empty.responses);
    setAnswerKey(empty.answerKey);
    setScoredFlags(empty.scoredFlags);
    setIncludeScience(true);
  };
  const headerActions = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("label", { className: "act-include-science", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: includeScience,
          onChange: (e) => setIncludeScience(e.target.checked)
        }
      ),
      /* @__PURE__ */ jsx("span", { children: "Include Science section" })
    ] }),
    /* @__PURE__ */ jsx("button", { type: "button", className: "act-btn act-btn-reset", onClick: resetAll, children: "Reset all" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "act-root", children: [
    showActHeader ? /* @__PURE__ */ jsx("header", { className: "act-header", role: "region", "aria-label": "ACT prep introduction", children: /* @__PURE__ */ jsxs("div", { className: "act-inner act-header-inner", children: [
      /* @__PURE__ */ jsxs("div", { className: "act-header-text", children: [
        /* @__PURE__ */ jsx("h1", { className: "act-title", children: "ACT Prep Bubbling" }),
        /* @__PURE__ */ jsx("p", { className: "act-sub", children: "Multiple-choice counts and timing follow the usual ACT overview. Which items are “scored” for your practice is up to you — use the Score checkbox on each row, or the section shortcuts below. Unscored rows are still useful for bubbling practice but are ignored when grading. Data stays in this browser." }),
        /* @__PURE__ */ jsxs("details", { className: "act-overview-details", children: [
          /* @__PURE__ */ jsx("summary", { className: "act-overview-summary", children: "Overview of the ACT (reference)" }),
          /* @__PURE__ */ jsx("p", { className: "act-overview-blurb", children: "The ACT has English, mathematics, and reading multiple-choice sections. Science and writing are optional; some schools require or accept science or writing scores." }),
          /* @__PURE__ */ jsxs("table", { className: "act-overview-table", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { children: "Test" }),
              /* @__PURE__ */ jsx("th", { children: "Questions" }),
              /* @__PURE__ */ jsx("th", { children: "Minutes" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: ACT_SECTIONS.map((s) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsxs("td", { children: [
                s.name,
                s.optional ? " (optional)" : ""
              ] }),
              /* @__PURE__ */ jsxs("td", { children: [
                s.total,
                " (",
                s.scoredDefault,
                " scored typical)"
              ] }),
              /* @__PURE__ */ jsx("td", { children: s.minutes })
            ] }, s.id)) })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "act-footnote", children: [
            "Typical “scored” counts are public summary figures; the test does not tell you which specific items are unscored. Defaults here mark the first",
            " ",
            ACT_SECTIONS.map((s) => `${s.scoredDefault}/${s.total}`).join(", "),
            " (by section) as counting toward score — adjust per your materials."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "act-header-actions", children: [
        headerActions,
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "act-btn tiny",
            onClick: () => setShowActHeader(false),
            children: "Hide header"
          }
        )
      ] })
    ] }) }) : /* @__PURE__ */ jsx("header", { className: "act-header act-header-collapsed", role: "region", "aria-label": "ACT prep toolbar", children: /* @__PURE__ */ jsxs("div", { className: "act-inner act-header-collapsed-inner", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "act-btn tiny",
          onClick: () => setShowActHeader(true),
          children: "Show header"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "act-collapsed-title", children: "ACT Prep Bubbling" }),
      /* @__PURE__ */ jsx("div", { className: "act-header-actions act-header-actions-inline", children: headerActions })
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: "act-tabs", role: "tablist", "aria-label": "ACT prep views", children: /* @__PURE__ */ jsxs("div", { className: "act-inner act-tabs-inner", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": panel === "practice",
          className: panel === "practice" ? "active" : "",
          onClick: () => setPanel("practice"),
          children: "My answers"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": panel === "key",
          className: panel === "key" ? "active" : "",
          onClick: () => setPanel("key"),
          children: "Answer key"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": panel === "results",
          className: panel === "results" ? "active" : "",
          onClick: () => setPanel("results"),
          children: "Results & stats"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "act-body", children: [
      (panel === "practice" || panel === "key") && /* @__PURE__ */ jsx("div", { className: "act-scroll", children: /* @__PURE__ */ jsx("div", { className: "act-inner", children: activeSections.map((s) => {
        const scoredCount = scoredFlags[s.id].filter(Boolean).length;
        return /* @__PURE__ */ jsxs("section", { className: "act-section", children: [
          /* @__PURE__ */ jsxs("div", { className: "act-section-head", children: [
            /* @__PURE__ */ jsxs("h2", { className: "act-section-title", children: [
              s.name,
              " ",
              /* @__PURE__ */ jsxs("span", { className: "act-count", children: [
                "(",
                s.total,
                " items, ",
                scoredCount,
                " toward score)"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "act-section-tools", children: [
              /* @__PURE__ */ jsxs("span", { className: "act-tools-hint", children: [
                s.minutes,
                " min on the real test"
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "act-btn tiny",
                  onClick: () => setSectionScoredPreset(s.id, "act"),
                  children: [
                    "ACT default (",
                    s.scoredDefault,
                    " scored)"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "act-btn tiny",
                  onClick: () => setSectionScoredPreset(s.id, "all"),
                  children: "All scored"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "act-btn tiny",
                  onClick: () => setSectionScoredPreset(s.id, "none"),
                  children: "None scored"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "act-grid", children: Array.from({ length: s.total }, (_, i) => /* @__PURE__ */ jsx(
            BubbleRow,
            {
              qNum: i + 1,
              scored: scoredFlags[s.id][i],
              onToggleScored: () => toggleScored(s.id, i),
              value: panel === "practice" ? responses[s.id][i] : answerKey[s.id][i],
              onPick: (L) => panel === "practice" ? setLetter(setResponses, s.id, i, L) : setLetter(setAnswerKey, s.id, i, L)
            },
            i
          )) })
        ] }, s.id);
      }) }) }),
      panel === "results" && /* @__PURE__ */ jsx("div", { className: "act-scroll act-results", children: /* @__PURE__ */ jsxs("div", { className: "act-inner", children: [
        /* @__PURE__ */ jsxs("div", { className: "act-summary-card", children: [
          /* @__PURE__ */ jsx("h2", { children: "Score" }),
          !includeScience && /* @__PURE__ */ jsx("p", { className: "act-muted small", children: "Science section excluded — turn it on in the header to grade it." }),
          keyFilledScored === 0 ? /* @__PURE__ */ jsx("p", { className: "act-muted", children: "Enter key letters for at least one row that has “Score” checked to grade." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("p", { className: "act-score-line", children: [
              /* @__PURE__ */ jsx("strong", { children: grade.correctCount }),
              " / ",
              /* @__PURE__ */ jsx("strong", { children: grade.graded }),
              " correct",
              grade.pct != null && /* @__PURE__ */ jsxs("span", { className: "act-pct", children: [
                " (",
                grade.pct,
                "%)"
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "act-muted small", children: "Only rows with Score checked and a key letter count. Blanks with a key count as wrong. Unchecked rows are practice-only." })
          ] })
        ] }),
        grade.wrong.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "act-summary-card", children: [
            /* @__PURE__ */ jsx("h2", { children: "Wrong" }),
            /* @__PURE__ */ jsx("ul", { className: "act-wrong-list", children: grade.wrong.map((w, idx) => /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: w.sectionName }),
              " Q",
              w.q,
              ": you ",
              /* @__PURE__ */ jsx("code", { children: w.yours }),
              ", answer",
              " ",
              /* @__PURE__ */ jsx("code", { children: w.correct })
            ] }, `${w.sectionId}-${w.q}-${idx}`)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "act-summary-card", children: [
            /* @__PURE__ */ jsx("h2", { children: "Pattern (within each section)" }),
            /* @__PURE__ */ jsx("p", { className: "act-muted small", children: "Uses only missed scored questions. Thirds split each section by question number (early / middle / late)." }),
            /* @__PURE__ */ jsx("ul", { className: "act-stat-list", children: sectionStats.map((st) => /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { children: st.sectionName }),
              st.count === 0 ? /* @__PURE__ */ jsx("span", { children: " — no misses." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  st.count,
                  " miss",
                  st.count === 1 ? "" : "es",
                  " — ",
                  st.biasLabel
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "act-thirds", children: [
                  "First third: ",
                  st.thirds[0],
                  " · Middle: ",
                  st.thirds[1],
                  " · Last third:",
                  " ",
                  st.thirds[2]
                ] }),
                /* @__PURE__ */ jsx("div", { className: "act-even", children: st.evennessLabel })
              ] })
            ] }, st.sectionName)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "act-summary-card", children: [
            /* @__PURE__ */ jsx("h2", { children: "Overall pattern (all misses)" }),
            /* @__PURE__ */ jsx("p", { children: overall.biasLabel }),
            /* @__PURE__ */ jsxs("p", { className: "act-thirds", children: [
              "First third: ",
              overall.thirds[0],
              " · Middle: ",
              overall.thirds[1],
              " · Last third:",
              " ",
              overall.thirds[2]
            ] }),
            /* @__PURE__ */ jsx("p", { className: "act-even", children: overall.evennessLabel })
          ] })
        ] }),
        keyFilledScored > 0 && grade.wrong.length === 0 && grade.graded > 0 && /* @__PURE__ */ jsx("div", { className: "act-summary-card act-success", children: /* @__PURE__ */ jsx("p", { children: "Everything keyed matches — nice work on the graded items." }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
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
      ` })
  ] });
}

const DEFAULT_NOTE_HTML = "<h1>Welcome to Your Notes</h1><p>Start writing here... Try creating a note link with [{Note Name}]</p>";
function withNoteLinkSpans(html) {
  if (!html) return html;
  return html.replace(/\[{([^}]+)}\]/g, (match, noteName) => {
    return `<span class="note-link-text" data-note-name="${noteName.trim()}">${match}</span>`;
  });
}
function htmlToPlainText(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}
function countWordsFromHtml(html) {
  const t = htmlToPlainText(html);
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}
function slugFileBase(raw) {
  const s = String(raw || "note").replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
  return s || "note";
}
function downloadBlob(filename, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
function NotesEditor() {
  const processContentWithNoteLinks = useCallback((c) => {
    if (!c) return c;
    return withNoteLinkSpans(c);
  }, []);
  const [mode, setMode] = useState("INSERT");
  const [commandMode, setCommandMode] = useState(false);
  const [title, setTitle] = useState("Untitled");
  const [status, setStatus] = useState("");
  const [content, setContent] = useState(() => withNoteLinkSpans(DEFAULT_NOTE_HTML));
  const [commandInput, setCommandInput] = useState(":");
  const [lineNumbers, setLineNumbers] = useState(false);
  const inputRef = useRef(null);
  const executeCommandRef = useRef(() => {
  });
  const titleSyncRef = useRef(title);
  const contentSyncRef = useRef(content);
  useEffect(() => {
    titleSyncRef.current = title;
    contentSyncRef.current = content;
  }, [title, content]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mainView, setMainView] = useState("notes");
  const [noteSearch, setNoteSearch] = useState("");
  const [savedSignature, setSavedSignature] = useState(() => ({
    title: "Untitled",
    content: withNoteLinkSpans(DEFAULT_NOTE_HTML)
  }));
  const [saveMessage, setSaveMessage] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true
      })
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: editor2 }) => {
      const newContent = editor2.getHTML();
      setContent(newContent);
    },
    editorProps: {
      attributes: {
        class: "tiptap"
      }
    }
  });
  const handleNoteLinkClick = useCallback((noteName) => {
    const note = notes.find((n) => n.title === noteName);
    if (note) {
      selectNote(note);
    } else {
      console.log(note?.name);
      alert(`Note "${noteName}" not found. You can create it with :new {${noteName}}
        Available notes: ${notes.map((n) => n.title).join(", ")}`);
      console.log(notes.map((n) => n.title).join(", "));
    }
  }, [notes]);
  const extractNoteLinks = useCallback((content2) => {
    const noteLinkRegex = /\[{([^}]+)}\]/g;
    const links = [];
    let match;
    while ((match = noteLinkRegex.exec(content2)) !== null) {
      links.push(match[1].trim());
    }
    return links;
  }, []);
  const processNoteLinks = useCallback(() => {
    if (!editor) return;
    const editorElement = editor.view.dom;
    const handleEditorClick = (e) => {
      const clickedElement = e.target;
      if (clickedElement.classList.contains("note-link-text")) {
        const noteName = clickedElement.getAttribute("data-note-name");
        if (noteName) {
          e.preventDefault();
          e.stopPropagation();
          handleNoteLinkClick(noteName);
          return;
        }
      }
      const text = clickedElement.textContent || "";
      if (text.includes("[{") && text.includes("}]")) {
        const noteLinkRegex = /\[{([^}]+)}\]/g;
        let match;
        while ((match = noteLinkRegex.exec(text)) !== null) {
          const noteName = match[1].trim();
          e.preventDefault();
          e.stopPropagation();
          console.log(noteName);
          handleNoteLinkClick(noteName);
          return;
        }
      }
    };
    editorElement.removeEventListener("click", handleEditorClick);
    editorElement.addEventListener("click", handleEditorClick);
    editorElement._noteLinkHandler = handleEditorClick;
  }, [editor, handleNoteLinkClick]);
  useEffect(() => {
    return () => {
      if (editor && editor.view.dom._noteLinkHandler) {
        editor.view.dom.removeEventListener("click", editor.view.dom._noteLinkHandler);
      }
    };
  }, [editor]);
  useEffect(() => {
    if (editor && content) {
      setTimeout(() => {
        processNoteLinks();
      }, 100);
    }
  }, [content, editor, processNoteLinks]);
  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/user-data");
      const data = await res.json();
      const user = data.user;
      if (user) {
        const res2 = await fetch(`/api/auth/get_notes?user_id=${user.id}`);
        const notesData = await res2.json();
        const posts = notesData.posts || [];
        setNotes(posts);
        return posts;
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
    return [];
  }, []);
  const selectNote = (note) => {
    const nextTitle = note.title || "Untitled";
    const processedContent = processContentWithNoteLinks(note.content || "");
    setSelectedNoteId(note.id);
    setTitle(nextTitle);
    setContent(processedContent);
    setSavedSignature({ title: nextTitle, content: processedContent });
    setSaveMessage("");
    if (editor) {
      editor.commands.setContent(processedContent);
    }
  };
  const createNewNoteWithTitle = async (title2) => {
    try {
      const res = await fetch("/api/auth/user-data");
      const data = await res.json();
      const user = data.user;
      if (!user || !user.id) return;
      await fetch("/api/auth/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, title: title2, content: "" })
      });
      await loadNotes();
      setTimeout(() => {
        const newNote = { id: null, title: title2, content: "" };
        selectNote(newNote);
      }, 300);
    } catch (err) {
      alert("Failed to create note: " + err);
    }
  };
  const selectNoteWithTitle = (title2) => {
    const note = notes.find((n) => n.title === title2);
    if (note) selectNote(note);
    else alert("Note not found: " + title2);
  };
  const deleteNoteWithTitle = async (noteTitle) => {
    try {
      const res = await fetch("/api/auth/user-data");
      const data = await res.json();
      const user = data.user;
      if (!user || !user.id) return;
      await fetch("/api/auth/deletenotes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, title: noteTitle })
      });
      const remainingNotes = notes.filter((n) => n.title !== noteTitle);
      await loadNotes();
      if (noteTitle === title) {
        if (remainingNotes.length > 0) {
          selectNote(remainingNotes[0]);
        } else {
          setSelectedNoteId(null);
          setTitle("Untitled");
          setContent("");
          setSavedSignature({ title: "Untitled", content: "" });
          if (editor) editor.commands.setContent("");
        }
      }
    } catch (err) {
      alert("Failed to delete note: " + err);
    }
  };
  const createNewNote = () => {
    const title2 = `Note ${Date.now()}`;
    createNewNoteWithTitle(title2);
  };
  const deleteNote = async (note, event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNoteWithTitle(note.title);
    }
  };
  const isDirty = title !== savedSignature.title || content !== savedSignature.content;
  const filteredNotes = useMemo(() => {
    const q = noteSearch.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => (n.title || "").toLowerCase().includes(q));
  }, [notes, noteSearch]);
  useEffect(() => {
    if (!editor) return;
    const html = editor.getHTML();
    const lineCount = (html.match(/<p|<h[1-6]/g) || []).length || 1;
    const noteLinks = extractNoteLinks(content);
    const linksText = noteLinks.length > 0 ? ` · ${noteLinks.length} link${noteLinks.length === 1 ? "" : "s"}` : "";
    const words = countWordsFromHtml(content);
    const dirtyText = isDirty ? " · unsaved" : "";
    const saveText = saveMessage ? ` · ${saveMessage}` : "";
    setStatus(
      `${lineCount} line${lineCount > 1 ? "s" : ""} · ${words} word${words === 1 ? "" : "s"}${linksText}${dirtyText}${saveText}  — ${mode}${commandMode ? " [COMMAND]" : ""}`
    );
  }, [editor, content, title, mode, commandMode, extractNoteLinks, isDirty, saveMessage]);
  const saveNote = useCallback(async () => {
    const t = title;
    const c = content;
    try {
      const res1 = await fetch(`/api/auth/user-data`);
      if (!res1.ok) {
        setSaveMessage("Could not verify login");
        return;
      }
      const data = await res1.json();
      const user = data.user;
      if (!user || !user.id) {
        setSaveMessage("Not signed in");
        return;
      }
      const saveResponse = await fetch("/api/auth/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, title: t, content: c })
      });
      if (!saveResponse.ok) {
        setSaveMessage("Save failed");
        return;
      }
      if (titleSyncRef.current === t && contentSyncRef.current === c) {
        setSavedSignature({ title: t, content: c });
        setSaveMessage("Saved");
        window.setTimeout(() => setSaveMessage((m) => m === "Saved" ? "" : m), 2200);
      }
    } catch {
      setSaveMessage("Save error");
    }
  }, [title, content]);
  const duplicateCurrentNote = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/user-data");
      const data = await res.json();
      const user = data.user;
      if (!user?.id) {
        alert("Sign in to save notes.");
        return;
      }
      let newTitle = `${title} (copy)`;
      let n = 2;
      while (notes.some((x) => x.title === newTitle)) {
        newTitle = `${title} (copy ${n})`;
        n += 1;
      }
      const saveResponse = await fetch("/api/auth/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, title: newTitle, content })
      });
      if (!saveResponse.ok) {
        alert("Could not duplicate note.");
        return;
      }
      const posts = await loadNotes();
      const created = posts.find((p) => p.title === newTitle);
      if (created) selectNote(created);
    } catch {
      alert("Could not duplicate note.");
    }
  }, [title, content, notes, loadNotes]);
  const exportNoteAs = useCallback(
    (kind) => {
      const base = slugFileBase(title);
      if (kind === "html") {
        const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        const blob = new Blob(
          [
            `<!DOCTYPE html><meta charset="utf-8"><title>${esc(title)}</title><body>${content}</body>`
          ],
          { type: "text/html;charset=utf-8" }
        );
        downloadBlob(`${base}.html`, blob);
      } else {
        const blob = new Blob([`${htmlToPlainText(content)}
`], {
          type: "text/plain;charset=utf-8"
        });
        downloadBlob(`${base}.txt`, blob);
      }
    },
    [title, content]
  );
  executeCommandRef.current = (cmd) => {
    const command = cmd.trim().toLowerCase();
    if (command.startsWith("new ")) {
      const match = cmd.match(/^new\s+\{(.+)\}$/i);
      if (match && match[1].trim()) {
        const postTitle = match[1].trim();
        createNewNoteWithTitle(postTitle);
        return;
      } else {
        alert("Usage: :new {post}");
        return;
      }
    }
    if (command.startsWith("cd ")) {
      const match = cmd.match(/^cd\s+\{(.+)\}$/i);
      if (match && match[1].trim()) {
        const postTitle = match[1].trim();
        selectNoteWithTitle(postTitle);
        return;
      } else {
        alert("Usage: :cd {post}");
        return;
      }
    }
    if (command.startsWith("d ")) {
      const match = cmd.match(/^d\s+\{(.+)\}$/i);
      if (match && match[1].trim()) {
        const postTitle = match[1].trim();
        deleteNoteWithTitle(postTitle);
        return;
      } else {
        alert("Usage: :d {post}");
        return;
      }
    }
    if (command === "x") {
      if (editor) {
        const { from, to } = editor.state.selection;
        const $from = editor.state.doc.resolve(from);
        const lineStart = $from.start();
        const lineEnd = $from.end();
        editor.commands.deleteRange({ from: lineStart, to: lineEnd });
      }
      return;
    }
    if (command === "ln") {
      setLineNumbers((prev) => !prev);
      return;
    }
    if (command === "links") {
      const links = extractNoteLinks(content);
      if (links.length > 0) {
        alert(`Note links in "${title}":
${links.join("\n")}`);
      } else {
        alert(`No note links found in "${title}"`);
      }
      return;
    }
    if (command === "dup" || command === "duplicate") {
      duplicateCurrentNote();
      return;
    }
    if (command === "export" || command.startsWith("export ")) {
      const rest = command.replace(/^export\s*/, "").trim();
      exportNoteAs(rest === "txt" || rest === "text" ? "txt" : "html");
      return;
    }
    if (command === "q" || command === "quit") {
      alert("Quit (not implemented)");
    } else if (command === "w" || command === "write") {
      saveNote();
    } else if (command === "wq") {
      saveNote();
      alert("Quit (not implemented)");
    } else if (command === "help") {
      alert(
        "Commands: new {post}, cd {post}, d {post}, x (delete line), ln, links, dup, export [html|txt], w, wq, q, help"
      );
    } else {
      alert(`Unknown command: ${command}`);
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (commandMode) {
        if (event.key === "Escape") {
          setCommandMode(false);
          setCommandInput(":");
        } else if (event.key === "Enter") {
          executeCommandRef.current(commandInput.slice(1));
          setCommandMode(false);
          setCommandInput(":");
        } else if (event.key.length === 1 || event.key === "Backspace") {
          if (event.key === "Backspace") {
            setCommandInput((prev) => prev.length > 1 ? prev.slice(0, -1) : ":");
          } else {
            setCommandInput((prev) => prev + event.key);
          }
        }
        event.preventDefault();
        return;
      }
      if (event.key === "Escape") {
        setMode((prev) => prev === "INSERT" ? "NORMAL" : "INSERT");
        if (editor) {
          if (mode === "INSERT") editor.commands.blur();
          else editor.commands.focus();
        }
        event.preventDefault();
      }
      if (mode === "NORMAL" && event.key === ":") {
        setCommandMode(true);
        setCommandInput(":");
        event.preventDefault();
        return;
      }
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        saveNote();
      }
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        exportNoteAs("html");
      }
      if (event.ctrlKey && event.key === "b") {
        event.preventDefault();
        if (editor) editor.commands.toggleBold();
      }
      if (event.ctrlKey && event.key === "i") {
        event.preventDefault();
        if (editor) editor.commands.toggleItalic();
      }
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        if (editor) editor.commands.toggleLink({ href: "https://example.com" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, mode, commandMode, commandInput, saveNote, exportNoteAs]);
  useEffect(() => {
    if (loading) return;
    if (title === savedSignature.title && content === savedSignature.content) return;
    const id = window.setTimeout(() => {
      saveNote();
    }, 1400);
    return () => window.clearTimeout(id);
  }, [content, title, loading, savedSignature.title, savedSignature.content, saveNote]);
  useEffect(() => {
    if (!isDirty) return void 0;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);
  useEffect(() => {
    if (commandMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [commandMode]);
  useEffect(() => {
    if (!editor) return;
    const handleKeyDown = (event) => {
      if (mode === "NORMAL") {
        const allowedKeys = [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Home",
          "End",
          "PageUp",
          "PageDown",
          "Escape",
          "Tab"
        ];
        if (event.ctrlKey || event.metaKey) {
          return;
        }
        if (event.key === ":" || event.key.length === 1) {
          return;
        }
        if (!allowedKeys.includes(event.key)) {
          event.preventDefault();
        }
      }
    };
    const editorElement = editor.view.dom;
    editorElement.addEventListener("keydown", handleKeyDown);
    return () => {
      editorElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode, editor]);
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);
  useEffect(() => {
    if (notes.length > 0) {
      const welcome = notes.find((n) => n.title && n.title.toLowerCase() === "welcome");
      selectNote(welcome || notes[0]);
    }
  }, [notes]);
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 430 && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sidebarOpen]);
  return /* @__PURE__ */ jsxs("div", { className: "docs-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "mobile-header-bar", children: [
      /* @__PURE__ */ jsx("button", { className: "sidebar-toggle-btn", onClick: handleSidebarToggle, "aria-label": "Open notes sidebar", children: /* @__PURE__ */ jsx("span", { className: "hamburger-icon", children: "☰" }) }),
      /* @__PURE__ */ jsx("span", { className: "mobile-title", children: mainView === "notes" ? "Notes" : "ACT Prep Bubbling" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `mobile-sidebar-overlay${sidebarOpen ? " open" : ""}`, onClick: handleSidebarClose }),
    /* @__PURE__ */ jsxs("div", { className: `docs-sidebar${sidebarOpen ? " open" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "sidebar-header", children: [
        /* @__PURE__ */ jsx("h2", { children: "Notes" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "new-note-btn",
            onClick: createNewNote,
            title: "Create new note",
            children: "+"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "notes-search-wrap", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "notes-search", className: "visually-hidden", children: "Search notes" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "notes-search",
            type: "search",
            className: "notes-search-input",
            placeholder: "Search titles…",
            value: noteSearch,
            onChange: (e) => setNoteSearch(e.target.value),
            autoComplete: "off"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "notes-list", children: loading ? /* @__PURE__ */ jsx("div", { className: "loading", children: "Loading notes..." }) : notes.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "no-notes", children: [
        /* @__PURE__ */ jsx("p", { children: "No notes yet" }),
        /* @__PURE__ */ jsx("button", { onClick: createNewNote, children: "Create your first note" })
      ] }) : filteredNotes.length === 0 ? /* @__PURE__ */ jsx("div", { className: "loading", children: "No matches" }) : filteredNotes.map((note) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `note-item ${selectedNoteId === note.id ? "selected" : ""}`,
          onClick: () => selectNote(note),
          children: [
            /* @__PURE__ */ jsx("span", { className: "note-title", children: note.title }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "delete-note-btn",
                onClick: (e) => deleteNote(note, e),
                title: "Delete note",
                children: "×"
              }
            )
          ]
        },
        note.id || note.title
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "docs-main", children: [
      /* @__PURE__ */ jsxs("div", { className: "notes-view-tabs", role: "tablist", "aria-label": "Notes page mode", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": mainView === "notes",
            className: `notes-view-tab${mainView === "notes" ? " active" : ""}`,
            onClick: () => setMainView("notes"),
            children: "Notes"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": mainView === "act",
            className: `notes-view-tab${mainView === "act" ? " active" : ""}`,
            onClick: () => setMainView("act"),
            children: "ACT Prep Bubbling"
          }
        )
      ] }),
      mainView === "act" ? /* @__PURE__ */ jsx("div", { className: "docs-main-act-fill", children: /* @__PURE__ */ jsx(ActPrepBubbling, {}) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "docs-toolbar", children: [
          /* @__PURE__ */ jsxs("div", { className: "toolbar-group", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "toolbar-btn",
                onClick: () => editor?.commands.toggleBold(),
                title: "Bold (Ctrl+B)",
                children: /* @__PURE__ */ jsx("strong", { children: "B" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "toolbar-btn",
                onClick: () => editor?.commands.toggleItalic(),
                title: "Italic (Ctrl+I)",
                children: /* @__PURE__ */ jsx("em", { children: "I" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "toolbar-btn",
                onClick: () => editor?.commands.toggleLink({ href: "https://example.com" }),
                title: "Link (Ctrl+K)",
                children: "🔗"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "toolbar-group", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "toolbar-btn",
                onClick: () => setLineNumbers(!lineNumbers),
                title: "Toggle line numbers",
                children: "#"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "toolbar-btn",
                onClick: saveNote,
                title: "Save (Ctrl+S)",
                children: "💾"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "toolbar-btn toolbar-btn-text",
                onClick: duplicateCurrentNote,
                title: "Duplicate this note",
                children: "Dup"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "toolbar-btn toolbar-btn-text",
                onClick: () => exportNoteAs("html"),
                title: "Export as HTML (Ctrl+Shift+E)",
                children: "HTML"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "toolbar-btn toolbar-btn-text",
                onClick: () => exportNoteAs("txt"),
                title: "Export plain text",
                children: "Txt"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `toolbar-btn ${mode === "NORMAL" ? "active" : ""}`,
                onClick: () => setMode(mode === "INSERT" ? "NORMAL" : "INSERT"),
                title: `Switch to ${mode === "INSERT" ? "NORMAL" : "INSERT"} mode (ESC)`,
                children: mode === "INSERT" ? "✏️" : "⌨️"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "docs-title-container", children: /* @__PURE__ */ jsx(
          "input",
          {
            value: title,
            onChange: (e) => setTitle(e.target.value),
            className: "docs-title-input",
            placeholder: "Untitled document"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: `docs-editor-container ${lineNumbers ? "with-line-numbers" : ""}`, children: [
          lineNumbers && /* @__PURE__ */ jsx("div", { className: "line-numbers", children: (() => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;
            const lineElements = tempDiv.querySelectorAll("p, h1, h2, h3, h4, h5, h6, div, li, blockquote");
            const lineCount = Math.max(lineElements.length, 1);
            return Array.from({ length: lineCount }, (_, index) => /* @__PURE__ */ jsx("div", { className: "line-number", children: index + 1 }, index));
          })() }),
          /* @__PURE__ */ jsx("div", { className: "docs-editor", children: /* @__PURE__ */ jsx(EditorContent, { editor }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "docs-status-line", "aria-live": "polite", children: [
          /* @__PURE__ */ jsx("span", { className: "docs-status-title", children: title }),
          /* @__PURE__ */ jsx("span", { className: "docs-status-meta", children: status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "terminal-prompt", children: [
          /* @__PURE__ */ jsx("span", { className: "prompt-symbol", children: "$" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              className: "command-input",
              value: commandInput,
              onChange: (e) => setCommandInput(e.target.value),
              style: {
                color: "#00ff00",
                backgroundColor: "black",
                border: "none",
                outline: "none",
                fontFamily: "Fira Mono, Consolas, Menlo, monospace",
                fontSize: "0.85rem",
                width: "100%",
                caretColor: "#00ff00"
              }
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        /* Main Container */
        .docs-container {
          display: flex;
          height: 100vh;
          width: 100%;
          background: #f9f9f9;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Sidebar */
        .docs-sidebar {
          width: 280px;
          background: #f6f8fa;
          border-right: 1px solid #d0d7de;
          display: flex;
          flex-direction: column;
          height: calc(100vh - var(--header-height, 3em));
          position: fixed;
          left: 0;
          top: var(--header-height, 3em);
          z-index: 50;
          transform: translateX(0);
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .docs-sidebar.open {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #d0d7de;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f6f8fa;
        }

        .sidebar-header h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .new-note-btn {
          background: none;
          border: 1px solid #d0d7de;
          color: #444;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 0;
          transition: background 0.15s;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .new-note-btn:hover {
          background: #eaeef2;
          color: #1a1a1a;
        }

        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .notes-search-wrap {
          padding: 0.5rem 1rem 0.35rem;
          border-bottom: 1px solid #e6e1d7;
          background: #f6f8fa;
        }

        .notes-search-input {
          width: 100%;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          padding: 0.35rem 0.5rem;
          border: 1px solid #d0d7de;
          border-radius: 0;
          background: #fff;
          color: #1a1a1a;
        }

        .notes-search-input:focus {
          outline: 2px solid #555;
          outline-offset: 0;
        }

        .notes-list {
          flex: 1;
          overflow-y: auto;
          background: #f6f8fa;
        }

        .note-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
          color: #1a1a1a;
          background: #f6f8fa;
          border-bottom: 1px solid #e6e1d7;
          cursor: pointer;
          transition: background 0.15s;
        }

        .note-item.selected {
          background: #eaeef2;
          font-weight: 600;
          color: #1a1a1a;
        }

        .note-item:hover {
          background: #eaeef2;
        }

        .note-title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .delete-note-btn {
          background: none;
          border: none;
          color: #b91c1c;
          font-size: 1rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.15s;
          margin-left: 0.5rem;
          padding: 0.25rem;
        }

        .note-item:hover .delete-note-btn {
          opacity: 1;
        }

        .delete-note-btn:hover {
          color: #991b1b;
        }

        .loading, .no-notes {
          padding: 2rem 1.5rem;
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }

        .no-notes button {
          background: #f6f8fa;
          border: 1px solid #d0d7de;
          padding: 0.5rem 1rem;
          border-radius: 0;
          cursor: pointer;
          color: #444;
          font-weight: 500;
          transition: background 0.15s;
          margin-top: 1rem;
        }

        .no-notes button:hover {
          background: #eaeef2;
          color: #1a1a1a;
        }

        /* Main Editor Area */
        .docs-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f9f9f9;
          margin-left: 280px;
          height: calc(100vh - var(--header-height, 3em));
          margin-top: var(--header-height, 3em);
          min-height: 0;
        }

        .notes-view-tabs {
          display: flex;
          gap: 0;
          background: #fff;
          border-bottom: 1px solid #d0d7de;
          padding: 0 1rem;
          flex-shrink: 0;
        }

        .notes-view-tab {
          font-family: inherit;
          font-size: 0.85rem;
          padding: 0.65rem 1rem;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: #57606a;
          cursor: pointer;
          margin-bottom: -1px;
        }

        .notes-view-tab:hover {
          color: #24292f;
        }

        .notes-view-tab.active {
          color: #2b6cb0;
          border-bottom-color: #2b6cb0;
          font-weight: 600;
        }

        .docs-main-act-fill {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Toolbar */
        .docs-toolbar {
          background: #fff;
          border-bottom: 1px solid #d0d7de;
          padding: 0.5rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .toolbar-group {
          display: flex;
          gap: 0.25rem;
        }

        .toolbar-btn {
          background: none;
          border: 1px solid #d0d7de;
          color: #444;
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          border-radius: 0;
          transition: background 0.15s;
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toolbar-btn:hover {
          background: #eaeef2;
          color: #1a1a1a;
        }

        .toolbar-btn.active {
          background: #2b6cb0;
          color: #fff;
          border-color: #2b6cb0;
        }

        .toolbar-btn.active:hover {
          background: #2563eb;
        }

        .toolbar-btn-text {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.5rem 0.55rem;
          min-width: auto;
        }

        .docs-status-line {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.35rem 0.75rem;
          padding: 0.4rem 1.5rem;
          background: #f6f8fa;
          border-bottom: 1px solid #d0d7de;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: #444;
        }

        .docs-status-title {
          font-weight: 600;
          color: #1a1a1a;
          flex-shrink: 0;
        }

        .docs-status-meta {
          font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
          font-size: 0.78rem;
          color: #666;
        }

        /* Document Title */
        .docs-title-container {
          background: #fff;
          border-bottom: 1px solid #d0d7de;
          padding: 1rem 1.5rem;
        }

        .docs-title-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Inter', sans-serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #1a1a1a;
          padding: 0;
        }

        .docs-title-input:focus {
          outline: none;
        }

        .docs-title-input::placeholder {
          color: #666;
        }

        /* Editor Container */
        .docs-editor-container {
          flex: 1;
          display: flex;
          background: #fff;
          margin: 0 1.5rem;
          border-radius: 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .docs-editor-container.with-line-numbers {
          display: flex;
        }

        .line-numbers {
          background: #f6f8fa;
          border-right: 1px solid #d0d7de;
          margin-top : 1.4rem;
          padding: 0rem 0.75rem;
          font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
          font-size: 0.8rem;
          color: #666;
          text-align: right;
          min-width: 3rem;
          user-select: none;
        }

        .line-number {
          line-height: 1.6;
          padding: 0.1rem 0;
          height: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .docs-editor {
          flex: 1;
          padding: 1.5rem;
          background: #fff;
        }

        .docs-editor .tiptap {
          min-height: calc(100vh - 200px);
          background: transparent;
          font-size: 1rem;
          line-height: 1.6;
          outline: none;
          border: none;
          color: #1a1a1a;
          font-family: 'Georgia', serif;
          padding: 0;
          margin: 0;
        }

        .docs-editor .tiptap:focus {
          outline: none;
        }

        .docs-editor .tiptap h1 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 1rem 0;
          font-family: 'Inter', sans-serif;
        }

        .docs-editor .tiptap h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 1.5rem 0 0.75rem 0;
          font-family: 'Inter', sans-serif;
        }

        .docs-editor .tiptap h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 1.25rem 0 0.5rem 0;
          font-family: 'Inter', sans-serif;
        }

        .docs-editor .tiptap p {
          margin: 0 0 1rem 0;
          color: #1a1a1a;
        }

        .docs-editor .tiptap strong {
          font-weight: 600;
        }

        .docs-editor .tiptap em {
          font-style: italic;
        }

        .docs-editor .tiptap a {
          color: #2b6cb0;
          text-decoration: underline;
        }

        .docs-editor .tiptap a:hover {
          color: #1a1a1a;
        }

        /* Note Links */
        .note-link-text {
          color: #2b6cb0 !important;
          background: rgba(43, 108, 176, 0.1) !important;
          padding: 0.1rem 0.25rem !important;
          border-radius: 0 !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          text-decoration: underline !important;
        }

        .note-link-text:hover {
          background: rgba(43, 108, 176, 0.2) !important;
        }

        /* Status Bar / Terminal */
        .docs-status-bar {
          background: #1a1a1a;
          border-top: 1px solid #333;
          padding: 0.75rem 1.5rem;
          color: #00ff00;
          font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          min-height: 2.5rem;
          box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
        }

        .terminal-prompt {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .terminal-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        /* Mobile Styles */
        @media (max-width: 800px) {
          .docs-sidebar {
            width: 80vw;
            max-width: 320px;
            transform: translateX(-100%);
            top: var(--header-height, 3em);
            height: calc(100vh - var(--header-height, 3em));
          }

          .docs-sidebar.open {
            transform: translateX(0);
          }

          .docs-main {
            margin-left: 0;
            margin-top: var(--header-height, 3em);
          }

          .notes-view-tabs {
            padding: 0 0.75rem;
            overflow-x: auto;
          }

          .notes-view-tab {
            white-space: nowrap;
          }

          .docs-toolbar {
            padding: 0.5rem 1rem;
            gap: 0.5rem;
          }

          .docs-status-line {
            padding: 0.35rem 1rem;
          }

          .docs-title-container {
            padding: 1rem;
          }

          .docs-title-input {
            font-size: 1.25rem;
          }

          .docs-editor-container {
            margin: 0 1rem;
          }

          .docs-editor {
            padding: 1rem;
          }

          .docs-editor .tiptap {
            font-size: 1.1rem;
            line-height: 1.7;
          }

          .docs-status-bar {
            padding: 0.5rem 1rem;
            min-height: 2rem;
          }

          .terminal-hint {
            display: none;
          }
        }

        @media (max-width: 430px) {
          .docs-sidebar {
            width: 85vw;
            max-width: 300px;
            top: var(--header-height, 3em);
            height: calc(100vh - var(--header-height, 3em));
          }

          .docs-editor .tiptap {
            font-size: 1.2rem;
            line-height: 1.8;
          }

          .docs-title-input {
            font-size: 1.1rem;
          }
        }
      ` }),
    /* @__PURE__ */ jsx("style", { jsx: true, children: `
        .mobile-header-bar {
          display: none;
        }
        
        @media (max-width: 800px) {
          .mobile-header-bar {
            display: flex;
            align-items: center;
            height: 3.5rem;
            background: #fff;
            border-bottom: 1px solid #d0d7de;
            padding: 0 1rem;
            z-index: 101;
            position: sticky;
            top: 0;
          }
          
          .sidebar-toggle-btn {
            background: none;
            border: 1px solid #d0d7de;
            font-size: 1.2rem;
            color: #444;
            margin-right: 1rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .sidebar-toggle-btn:hover {
            background: #eaeef2;
          }
          
          .mobile-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1a1a1a;
            font-family: 'Inter', sans-serif;
          }
          
          .mobile-sidebar-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.3);
            z-index: 100;
            transition: opacity 0.2s;
            opacity: 0;
            pointer-events: none;
          }
          
          .mobile-sidebar-overlay.open {
            display: block;
            opacity: 1;
            pointer-events: all;
          }
        }
        
        @media (max-width: 430px) {
          .mobile-header-bar {
            height: 3.2rem;
            padding: 0 0.75rem;
          }
          
          .sidebar-toggle-btn {
            font-size: 1.1rem;
            width: 36px;
            height: 36px;
            margin-right: 0.75rem;
          }
          
          .mobile-title {
            font-size: 1rem;
          }
        }
      ` })
  ] });
}

const $$Notes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<meta charset="UTF-8">${renderScript($$result, "C:/Users/Sreek/website/src/pages/notes.astro?astro&type=script&index=0&lang.ts")}${maybeRenderHead()}<body data-astro-cid-42n6zz5n> <div class="notes-page-wrapper" data-astro-cid-42n6zz5n> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"> ${renderComponent($$result, "Header", $$Header, { "data-astro-cid-42n6zz5n": true })} <div class="notes-root" data-astro-cid-42n6zz5n> ${renderComponent($$result, "NotesEditor", NotesEditor, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/NotesEditor.jsx", "client:component-export": "default", "data-astro-cid-42n6zz5n": true })} </div> </div>  ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-42n6zz5n": true })} ${renderComponent($$result, "SpeedInsights", $$Index$1, { "data-astro-cid-42n6zz5n": true })}</body>`;
}, "C:/Users/Sreek/website/src/pages/notes.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/notes.astro";
const $$url = "/notes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Notes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

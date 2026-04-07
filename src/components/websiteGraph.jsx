import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import jsonData from '../xhtml_removed_cleaned_map.json';

function pathFromUrl(url) {
  if (!url || typeof url !== 'string') return '';
  try {
    const u = new URL(url);
    const p = u.pathname || '/';
    return p + u.search + u.hash;
  } catch {
    return '';
  }
}

const NODE_R = 6;
const HIT_PAD = 4;

export default function WebsiteGraphCanvasHover() {
  const canvasRef = useRef(null);
  const hoverRef = useRef(null);
  const selectedRef = useRef(null);
  const transformRef = useRef(d3.zoomIdentity);
  const nodesRef = useRef([]);
  const linksRef = useRef([]);

  const [activeTab, setActiveTab] = useState('graph');
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [listFilter, setListFilter] = useState('');

  const { nodeIds, linksForSim, pathToUrl } = useMemo(() => {
    const pathToUrlMap = new Map();

    const pages = Object.keys(jsonData || {}).map((page) => {
      const id = pathFromUrl(page);
      if (id) pathToUrlMap.set(id, page);
      return {
        id,
        links: (jsonData[page] || []).map((link) => pathFromUrl(link)).filter(Boolean),
      };
    });

    const linkSet = new Set();
    const rawLinks = [];

    pages.forEach((p) => {
      if (!p.id || p.id.includes('.xhtml')) return;
      p.links.forEach((target) => {
        if (!target || target.includes('.xhtml')) return;
        const key = `${p.id}→${target}`;
        if (!linkSet.has(key)) {
          linkSet.add(key);
          rawLinks.push({ source: p.id, target });
        }
      });
    });

    const allIds = new Set();
    rawLinks.forEach((l) => {
      allIds.add(l.source);
      allIds.add(l.target);
    });

    const nodeIdsSorted = Array.from(allIds).sort((a, b) => a.localeCompare(b));

    return {
      nodeIds: nodeIdsSorted,
      linksForSim: rawLinks,
      pathToUrl: pathToUrlMap,
    };
  }, []);

  const filteredList = useMemo(() => {
    const q = listFilter.trim().toLowerCase();
    if (!q) return nodeIds;
    return nodeIds.filter((id) => id.toLowerCase().includes(q));
  }, [nodeIds, listFilter]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const nodes = nodesRef.current;
    const links = linksRef.current;
    const transform = transformRef.current;
    const hover = hoverRef.current;
    const selected = selectedRef.current;

    context.save();
    context.clearRect(0, 0, width, height);
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);

    context.strokeStyle = '#d1d5db';
    context.lineWidth = 1 / transform.k;
    context.beginPath();
    links.forEach((d) => {
      const s = typeof d.source === 'object' ? d.source : null;
      const t = typeof d.target === 'object' ? d.target : null;
      if (!s || !t || s.x == null || t.x == null) return;
      context.moveTo(s.x, s.y);
      context.lineTo(t.x, t.y);
    });
    context.stroke();

    nodes.forEach((d) => {
      if (d.x == null || d.y == null) return;
      const isSel = selected && selected.id === d.id;
      const isHover = hover && hover.id === d.id;
      context.beginPath();
      context.arc(d.x, d.y, NODE_R, 0, 2 * Math.PI);
      context.fillStyle = isSel ? '#1a1a1a' : isHover ? '#4b5563' : '#6b7280';
      context.fill();
      if (isSel) {
        context.strokeStyle = '#111827';
        context.lineWidth = 2 / transform.k;
        context.stroke();
      }
    });

    const labelNode = selected || hover;
    if (labelNode && labelNode.x != null) {
      const text = labelNode.id || '';
      const short = text.length > 56 ? `${text.slice(0, 53)}…` : text;
      context.font = `${12 / transform.k}px Inter, system-ui, sans-serif`;
      const tw = context.measureText(short).width;
      const pad = 6 / transform.k;
      const bx = labelNode.x - tw / 2 - pad;
      const by = labelNode.y - NODE_R - 22 / transform.k;
      context.fillStyle = 'rgba(255,255,255,0.92)';
      context.strokeStyle = '#d1d5db';
      context.lineWidth = 1 / transform.k;
      context.fillRect(bx, by, tw + pad * 2, 18 / transform.k);
      context.strokeRect(bx, by, tw + pad * 2, 18 / transform.k);
      context.fillStyle = '#111827';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(short, labelNode.x, by + 9 / transform.k);
    }

    context.restore();
  }, []);

  useEffect(() => {
    if (activeTab !== 'graph' || !canvasRef.current || !nodeIds.length) return undefined;

    const width = 1000;
    const height = 600;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const nodes = nodeIds.map((id) => ({ id }));
    const linkObjs = linksForSim
      .map((l) => ({ ...l }))
      .filter((l) => nodes.some((n) => n.id === l.source) && nodes.some((n) => n.id === l.target));

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(linkObjs).id((d) => d.id).distance(40))
      .force('charge', d3.forceManyBody().strength(-120))
      .force('x', d3.forceX(width / 2).strength(0.08))
      .force('y', d3.forceY(height / 2).strength(0.08))
      .force('collision', d3.forceCollide(NODE_R + 2));

    simulation.on('tick', () => {
      draw();
    });

    nodesRef.current = nodes;
    linksRef.current = linkObjs;
    transformRef.current = d3.zoomIdentity;
    hoverRef.current = null;

    const zoom = d3
      .zoom()
      .scaleExtent([0.15, 6])
      .on('zoom', (event) => {
        transformRef.current = event.transform;
        draw();
      });
    const z = d3.select(canvas);
    z.call(zoom);

    function pickNode(px, py) {
      const t = transformRef.current;
      const x = (px - t.x) / t.k;
      const y = (py - t.y) / t.k;
      const hitR = NODE_R + HIT_PAD;
      let best = null;
      let bestD = Infinity;
      for (const n of nodesRef.current) {
        if (n.x == null || n.y == null) continue;
        const d = Math.hypot(n.x - x, n.y - y);
        if (d < hitR && d < bestD) {
          bestD = d;
          best = n;
        }
      }
      return best;
    }

    function onMove(event) {
      const [mx, my] = d3.pointer(event);
      const n = pickNode(mx, my);
      hoverRef.current = n;
      setHoveredId(n ? n.id : null);
      draw();
    }

    function onLeave() {
      hoverRef.current = null;
      setHoveredId(null);
      draw();
    }

    function onClick(event) {
      const [mx, my] = d3.pointer(event);
      const n = pickNode(mx, my);
      if (n) {
        selectedRef.current = n;
        setSelectedId(n.id);
      } else {
        selectedRef.current = null;
        setSelectedId(null);
      }
      draw();
    }

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    simulation.alpha(1).restart();

    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
      simulation.stop();
      z.on('zoom', null);
    };
  }, [activeTab, nodeIds, linksForSim, draw]);

  useEffect(() => {
    if (activeTab !== 'graph' || !selectedId) return;
    const n = nodesRef.current.find((x) => x.id === selectedId);
    if (n) {
      selectedRef.current = n;
      draw();
    }
  }, [activeTab, selectedId, draw]);

  return (
    <div className="wg-root">
      <div className="wg-inner">
      <div className="wg-tabs" role="tablist" aria-label="Website graph views">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'graph'}
          className={`wg-tab${activeTab === 'graph' ? ' wg-tab-active' : ''}`}
          onClick={() => setActiveTab('graph')}
        >
          Graph
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'list'}
          className={`wg-tab${activeTab === 'list' ? ' wg-tab-active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Page links
        </button>
      </div>

      {activeTab === 'graph' && (
        <div className="wg-graph-panel">
          {nodeIds.length === 0 ? (
            <p className="wg-empty-graph">No graph data to display.</p>
          ) : (
            <>
              <p className="wg-hint">
                Scroll to zoom · drag to pan · hover or click a node to see its path (route ID)
              </p>
              <div className="wg-canvas-wrap">
              <canvas
                ref={canvasRef}
                className="wg-canvas"
                width={1000}
                height={600}
                aria-label="Interactive site link graph"
              />
              </div>
              <div className="wg-meta" aria-live="polite">
                {selectedId && (
                  <div className="wg-meta-row">
                    <span className="wg-meta-label">Selected</span>
                    <code className="wg-meta-id">{selectedId}</code>
                  </div>
                )}
                {hoveredId && hoveredId !== selectedId && (
                  <div className="wg-meta-row">
                    <span className="wg-meta-label">Hover</span>
                    <code className="wg-meta-id">{hoveredId}</code>
                  </div>
                )}
                <div className="wg-meta-row wg-meta-muted">
                  {nodeIds.length} pages · {linksForSim.length} edges
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'list' && (
        <div className="wg-list-panel">
          <label className="wg-list-label" htmlFor="wg-list-filter">
            Filter paths
          </label>
          <input
            id="wg-list-filter"
            type="search"
            className="wg-list-input"
            placeholder="Type to filter…"
            value={listFilter}
            onChange={(e) => setListFilter(e.target.value)}
            autoComplete="off"
          />
          <aside className="wg-link-sidebar" aria-label="Crawled page paths">
            {filteredList.length === 0 ? (
              <p className="wg-list-empty">No paths match.</p>
            ) : (
              <ul className="wg-link-list">
                {filteredList.map((path) => {
                  const full = pathToUrl.get(path);
                  const href = full || path;
                  return (
                    <li key={path}>
                      <a
                        href={href}
                        className="wg-link-item"
                        rel="noopener noreferrer"
                        onClick={() => setSelectedId(path)}
                      >
                        <span className="wg-link-path">{path}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>
      )}

      </div>
      <style>{`
        /* Palette matches canvas: edges #d1d5db, nodes #6b7280 / hover #4b5563 / selected #111827 */
        .wg-root {
          font-family: Inter, system-ui, sans-serif;
          max-width: 100%;
          background: #f9f9f9;
          padding: 0.5rem 0 1.25rem;
          box-sizing: border-box;
        }
        .wg-inner {
          max-width: 48rem;
          margin-left: auto;
          margin-right: auto;
          padding: 0.75rem 1.25rem 0;
          box-sizing: border-box;
        }
        .wg-tabs {
          display: flex;
          justify-content: center;
          gap: 0;
          border-bottom: 1px solid #d1d5db;
          margin-bottom: 1rem;
          padding-bottom: 0;
        }
        .wg-tab {
          font-family: inherit;
          font-size: 0.9rem;
          padding: 0.5rem 1.1rem;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          margin-bottom: -1px;
        }
        .wg-tab:hover {
          color: #4b5563;
        }
        .wg-tab-active {
          color: #111827;
          font-weight: 600;
          border-bottom-color: #111827;
        }
        .wg-empty-graph {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
          text-align: center;
          padding: 0.5rem 0;
        }
        .wg-hint {
          font-size: 0.85rem;
          color: #6b7280;
          margin: 0 auto 0.65rem;
          line-height: 1.5;
          max-width: 28rem;
          text-align: center;
        }
        .wg-graph-panel {
          width: 100%;
        }
        .wg-canvas-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .wg-canvas {
          display: block;
          width: 100%;
          max-width: min(920px, 100%);
          height: auto;
          max-height: 70vh;
          border: 1px solid #d1d5db;
          background: #fafafa;
          cursor: grab;
        }
        .wg-canvas:active {
          cursor: grabbing;
        }
        .wg-meta {
          margin-top: 0.75rem;
          font-size: 0.85rem;
          color: #4b5563;
          max-width: min(920px, 100%);
          margin-left: auto;
          margin-right: auto;
          text-align: left;
          padding: 0 0.15rem;
        }
        .wg-meta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.35rem 0.6rem;
          margin-bottom: 0.25rem;
        }
        .wg-meta-label {
          font-weight: 600;
          color: #6b7280;
          min-width: 4.5rem;
        }
        .wg-meta-id {
          font-family: ui-monospace, Consolas, monospace;
          font-size: 0.8rem;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          color: #111827;
          padding: 0.15rem 0.4rem;
          word-break: break-all;
        }
        .wg-meta-muted {
          color: #9ca3af;
          font-size: 0.8rem;
        }
        .wg-list-panel {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
          width: 100%;
          max-width: 36rem;
          margin-left: auto;
          margin-right: auto;
        }
        .wg-list-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #4b5563;
          align-self: stretch;
          text-align: center;
        }
        .wg-list-input {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          font-family: inherit;
          font-size: 0.9rem;
          padding: 0.45rem 0.55rem;
          border: 1px solid #d1d5db;
          border-radius: 0;
          background: #ffffff;
          color: #111827;
        }
        .wg-list-input:focus {
          outline: 2px solid #6b7280;
          outline-offset: 0;
        }
        .wg-link-sidebar {
          width: 100%;
          border: 1px solid #d1d5db;
          background: #fafafa;
          max-height: min(420px, 55vh);
          overflow-y: auto;
        }
        .wg-link-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .wg-link-list li {
          border-bottom: 1px solid #e5e7eb;
        }
        .wg-link-list li:last-child {
          border-bottom: none;
        }
        .wg-link-item {
          display: block;
          padding: 0.45rem 0.65rem;
          color: #111827;
          text-decoration: none;
          font-size: 0.85rem;
          font-family: ui-monospace, Consolas, monospace;
          word-break: break-all;
          line-height: 1.35;
        }
        .wg-link-item:hover {
          background: rgba(107, 114, 128, 0.1);
          text-decoration: underline;
          color: #111827;
        }
        .wg-list-empty {
          margin: 0.75rem;
          font-size: 0.9rem;
          color: #6b7280;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

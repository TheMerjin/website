import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'to_read', label: 'To read' },
  { id: 'reading', label: 'Reading' },
  { id: 'finished', label: 'Finished' },
];

const STATUS_OPTIONS = [
  { id: 'to_read', label: 'To read' },
  { id: 'reading', label: 'Reading' },
  { id: 'finished', label: 'Finished' },
];

function statusLabel(status) {
  return STATUS_OPTIONS.find((s) => s.id === status)?.label || status;
}

export default function ReadingList() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('to_read');
  const [notesHtml, setNotesHtml] = useState('<p></p>');
  const [savedSig, setSavedSig] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState('');
  const savingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
    ],
    content: notesHtml,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => setNotesHtml(ed.getHTML()),
    editorProps: { attributes: { class: 'tiptap rl-tiptap' } },
  });

  const loadItems = useCallback(async (uid) => {
    const res = await fetch(`/api/auth/reading-list?user_id=${encodeURIComponent(uid)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load');
    return data.items || [];
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/auth/user-data');
        const data = await res.json();
        if (!data.user?.id) {
          if (!cancelled) setError('Sign in to use your reading list.');
          return;
        }
        if (!cancelled) setUser(data.user);
        const list = await loadItems(data.user.id);
        if (!cancelled) {
          setItems(list);
          if (list.length > 0) {
            const first = list[0];
            setSelectedId(first.id);
            setTitle(first.title || '');
            setAuthor(first.author || '');
            setUrl(first.url || '');
            setStatus(first.status || 'to_read');
            const html = first.notes || '<p></p>';
            setNotesHtml(html);
            setSavedSig({
              id: first.id,
              title: first.title || '',
              author: first.author || '',
              url: first.url || '',
              status: first.status || 'to_read',
              notes: html,
            });
          }
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load reading list.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadItems]);

  useEffect(() => {
    if (editor && selectedId) {
      editor.commands.setContent(notesHtml);
    }
  }, [editor, selectedId]);

  const selectItem = useCallback(
    (item, updateList = true) => {
      if (!item) return;
      setSelectedId(item.id);
      setTitle(item.title || '');
      setAuthor(item.author || '');
      setUrl(item.url || '');
      setStatus(item.status || 'to_read');
      const html = item.notes || '<p></p>';
      setNotesHtml(html);
      setSavedSig({
        id: item.id,
        title: item.title || '',
        author: item.author || '',
        url: item.url || '',
        status: item.status || 'to_read',
        notes: html,
      });
      setSaveStatus('');
      if (editor) editor.commands.setContent(html);
      if (updateList) {
        setItems((prev) => {
          const idx = prev.findIndex((x) => x.id === item.id);
          if (idx < 0) return [item, ...prev];
          const next = [...prev];
          next[idx] = { ...next[idx], ...item };
          return next;
        });
      }
    },
    [editor]
  );

  const isDirty = useMemo(() => {
    if (!savedSig) return false;
    return (
      title !== savedSig.title ||
      author !== savedSig.author ||
      url !== savedSig.url ||
      status !== savedSig.status ||
      notesHtml !== savedSig.notes
    );
  }, [savedSig, title, author, url, status, notesHtml]);

  const saveItem = useCallback(async () => {
    if (!user?.id || !selectedId || !title.trim() || savingRef.current) return;
    savingRef.current = true;
    setSaveStatus('Saving…');
    try {
      const res = await fetch('/api/auth/reading-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          id: selectedId,
          title: title.trim(),
          author,
          url,
          status,
          notes: notesHtml,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      const item = data.item;
      setSavedSig({
        id: item.id,
        title: item.title,
        author: item.author || '',
        url: item.url || '',
        status: item.status,
        notes: item.notes || '',
      });
      setItems((prev) => prev.map((x) => (x.id === item.id ? item : x)));
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (e) {
      setSaveStatus('');
      alert(e.message || 'Save failed');
    } finally {
      savingRef.current = false;
    }
  }, [user, selectedId, title, author, url, status, notesHtml]);

  useEffect(() => {
    if (!isDirty || !selectedId) return;
    const t = setTimeout(() => saveItem(), 1500);
    return () => clearTimeout(t);
  }, [isDirty, selectedId, saveItem, title, author, url, status, notesHtml]);

  const filteredItems = useMemo(() => {
    let list = items;
    if (filter !== 'all') list = list.filter((i) => i.status === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          (i.title || '').toLowerCase().includes(q) ||
          (i.author || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filter, search]);

  const counts = useMemo(() => {
    const c = { all: items.length, to_read: 0, reading: 0, finished: 0 };
    for (const i of items) {
      if (c[i.status] !== undefined) c[i.status]++;
    }
    return c;
  }, [items]);

  async function addItem(e) {
    e?.preventDefault();
    const t = newTitle.trim();
    if (!t || !user?.id) return;
    try {
      const res = await fetch('/api/auth/reading-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          title: t,
          status: 'to_read',
          notes: '<p></p>',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      setNewTitle('');
      setItems((prev) => [data.item, ...prev]);
      selectItem(data.item, false);
    } catch (err) {
      alert(err.message || 'Failed to add');
    }
  }

  async function deleteItem(id, e) {
    e?.stopPropagation();
    if (!user?.id || !window.confirm('Remove this from your reading list?')) return;
    try {
      const res = await fetch('/api/auth/reading-list/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      const remaining = items.filter((i) => i.id !== id);
      setItems(remaining);
      if (selectedId === id) {
        if (remaining.length > 0) selectItem(remaining[0], false);
        else {
          setSelectedId(null);
          setSavedSig(null);
        }
      }
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  }

  async function setStatusQuick(nextStatus) {
    setStatus(nextStatus);
  }

  if (loading) {
    return <div className="rl-root"><p className="rl-muted">Loading reading list…</p></div>;
  }

  if (error && !user) {
    return <div className="rl-root"><p className="rl-error">{error}</p></div>;
  }

  return (
    <div className="rl-root">
      <aside className="rl-sidebar">
        <div className="rl-sidebar-head">
          <h2>Reading list</h2>
        </div>

        <form className="rl-add-form" onSubmit={addItem}>
          <input
            type="text"
            placeholder="Title to add…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="rl-input"
          />
          <button type="submit" className="rl-btn rl-btn-primary" disabled={!newTitle.trim()}>
            +
          </button>
        </form>

        <div className="rl-filters" role="tablist">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`rl-filter${filter === f.id ? ' active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="rl-count">{counts[f.id] ?? counts.all}</span>
            </button>
          ))}
        </div>

        <div className="rl-search-wrap">
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rl-input"
          />
        </div>

        <ul className="rl-list">
          {filteredItems.length === 0 ? (
            <li className="rl-empty">No items{filter !== 'all' ? ` in “${statusLabel(filter)}”` : ''}.</li>
          ) : (
            filteredItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`rl-item${selectedId === item.id ? ' selected' : ''}`}
                  onClick={() => selectItem(item)}
                >
                  <span className={`rl-badge rl-badge-${item.status}`}>{statusLabel(item.status)}</span>
                  <span className="rl-item-title">{item.title}</span>
                  {item.author && <span className="rl-item-author">{item.author}</span>}
                </button>
                <button
                  type="button"
                  className="rl-delete"
                  onClick={(e) => deleteItem(item.id, e)}
                  aria-label="Delete"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>

      <main className="rl-main">
        {!selectedId ? (
          <div className="rl-placeholder">
            <p>Add something to your reading list or select an item.</p>
          </div>
        ) : (
          <>
            <div className="rl-meta-bar">
              <input
                type="text"
                className="rl-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <input
                type="text"
                className="rl-meta-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
              />
              <input
                type="url"
                className="rl-meta-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Link (optional)"
              />
              <select
                className="rl-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Status"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="rl-quick-status">
                {STATUS_OPTIONS.filter((o) => o.id !== status).map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="rl-btn rl-btn-ghost"
                    onClick={() => setStatusQuick(o.id)}
                  >
                    → {o.label}
                  </button>
                ))}
              </div>
              <span className="rl-save-hint">{saveStatus || (isDirty ? 'Unsaved changes' : '')}</span>
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer" className="rl-open-link">
                  Open ↗
                </a>
              )}
            </div>

            <div className="rl-toolbar">
              <button type="button" className="rl-btn" onClick={() => editor?.commands.toggleBold()}>
                <strong>B</strong>
              </button>
              <button type="button" className="rl-btn" onClick={() => editor?.commands.toggleItalic()}>
                <em>I</em>
              </button>
              <button
                type="button"
                className="rl-btn"
                onClick={() => editor?.commands.toggleHeading({ level: 2 })}
              >
                H2
              </button>
              <button type="button" className="rl-btn rl-btn-primary" onClick={saveItem}>
                Save
              </button>
            </div>

            <div className="rl-editor-wrap">
              <p className="rl-notes-label">Reading notes</p>
              <EditorContent editor={editor} />
            </div>
          </>
        )}
      </main>

      <style>{`
        .rl-root {
          display: flex;
          flex: 1;
          min-height: 0;
          height: 100%;
          background: #f9f9f9;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .rl-sidebar {
          width: 300px;
          flex-shrink: 0;
          border-right: 1px solid #d0d7de;
          background: #f6f8fa;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .rl-sidebar-head {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #d0d7de;
        }
        .rl-sidebar-head h2 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1a1a1a;
        }
        .rl-add-form {
          display: flex;
          gap: 0.35rem;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid #e6e1d7;
        }
        .rl-input {
          flex: 1;
          font-size: 0.85rem;
          padding: 0.35rem 0.5rem;
          border: 1px solid #d0d7de;
          border-radius: 0;
          background: #fff;
        }
        .rl-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid #e6e1d7;
        }
        .rl-filter {
          font-size: 0.72rem;
          padding: 0.25rem 0.45rem;
          border: 1px solid #d0d7de;
          background: #fff;
          cursor: pointer;
          color: #57606a;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .rl-filter.active {
          background: #eaeef2;
          color: #1a1a1a;
          font-weight: 600;
          border-color: #8c959f;
        }
        .rl-count {
          font-size: 0.65rem;
          opacity: 0.7;
        }
        .rl-search-wrap {
          padding: 0.35rem 0.75rem 0.5rem;
        }
        .rl-list {
          list-style: none;
          margin: 0;
          padding: 0;
          overflow-y: auto;
          flex: 1;
        }
        .rl-list li {
          display: flex;
          align-items: stretch;
          border-bottom: 1px solid #e6e1d7;
        }
        .rl-item {
          flex: 1;
          text-align: left;
          padding: 0.65rem 0.75rem;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }
        .rl-item:hover { background: #eaeef2; }
        .rl-item.selected { background: #dfe4ea; }
        .rl-item-title {
          font-size: 0.88rem;
          font-weight: 500;
          color: #1a1a1a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rl-item-author {
          font-size: 0.75rem;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rl-badge {
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          align-self: flex-start;
          padding: 0.1rem 0.35rem;
          border: 1px solid #d0d7de;
        }
        .rl-badge-to_read { background: #fff8e6; color: #92400e; border-color: #e8d4a8; }
        .rl-badge-reading { background: #e8f4fc; color: #1e4a6b; border-color: #b6d4e8; }
        .rl-badge-finished { background: #edf7ed; color: #2d5a2d; border-color: #b8d4b8; }
        .rl-delete {
          border: none;
          background: transparent;
          color: #b91c1c;
          padding: 0 0.5rem;
          cursor: pointer;
          opacity: 0;
          font-size: 1.1rem;
        }
        .rl-list li:hover .rl-delete { opacity: 1; }
        .rl-empty {
          padding: 1.5rem;
          color: #666;
          font-size: 0.85rem;
        }
        .rl-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
        }
        .rl-placeholder {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        .rl-meta-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #fff;
          border-bottom: 1px solid #d0d7de;
        }
        .rl-title-input {
          flex: 1 1 12rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-bottom: 1px solid #d0d7de;
          padding: 0.25rem 0;
          min-width: 8rem;
        }
        .rl-meta-input {
          flex: 1 1 8rem;
          font-size: 0.85rem;
          border: 1px solid #d0d7de;
          padding: 0.35rem 0.5rem;
          min-width: 6rem;
        }
        .rl-status-select {
          font-size: 0.85rem;
          border: 1px solid #d0d7de;
          padding: 0.35rem 0.5rem;
          background: #fff;
        }
        .rl-quick-status { display: flex; gap: 0.25rem; flex-wrap: wrap; }
        .rl-save-hint {
          font-size: 0.75rem;
          color: #666;
          margin-left: auto;
        }
        .rl-open-link {
          font-size: 0.8rem;
          color: #2b6cb0;
        }
        .rl-toolbar {
          display: flex;
          gap: 0.25rem;
          padding: 0.4rem 1rem;
          background: #fff;
          border-bottom: 1px solid #d0d7de;
        }
        .rl-btn {
          font-size: 0.8rem;
          padding: 0.3rem 0.55rem;
          border: 1px solid #d0d7de;
          background: #f6f8fa;
          cursor: pointer;
        }
        .rl-btn-primary {
          background: #2b6cb0;
          color: #fff;
          border-color: #2b6cb0;
        }
        .rl-btn-ghost {
          background: transparent;
          font-size: 0.72rem;
        }
        .rl-editor-wrap {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.25rem 2rem;
          background: #fff;
        }
        .rl-notes-label {
          margin: 0 0 0.5rem;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #666;
        }
        .rl-tiptap {
          min-height: 280px;
          outline: none;
          font-size: 1rem;
          line-height: 1.6;
        }
        .rl-tiptap p { margin: 0 0 0.75rem; }
        .rl-tiptap h2 { font-size: 1.15rem; margin: 1rem 0 0.5rem; }
        .rl-muted, .rl-error { padding: 2rem; }
        .rl-error { color: #b91c1c; }
        @media (max-width: 768px) {
          .rl-root { flex-direction: column; }
          .rl-sidebar { width: 100%; max-height: 40vh; border-right: none; border-bottom: 1px solid #d0d7de; }
        }
      `}</style>
    </div>
  );
}

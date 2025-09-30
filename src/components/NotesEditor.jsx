import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import '../styles/SidebarElement.css';

export default function NotesEditor() {
  // Process content to add styling to note links
  const processContentWithNoteLinks = useCallback((content) => {
    if (!content) return content;
    
    const noteLinkRegex = /\[{([^}]+)}\]/g;
    return content.replace(noteLinkRegex, (match, noteName) => {
      return `<span class="note-link-text" data-note-name="${noteName.trim()}">${match}</span>`;
    });
  }, []);

  const [mode, setMode] = useState('INSERT');
  const [commandMode, setCommandMode] = useState(false);
  const [title, setTitle] = useState('Untitled');
  const [status, setStatus] = useState('');
  const [content, setContent] = useState(processContentWithNoteLinks('<h1>Welcome to Your Notes</h1><p>Start writing here... Try creating a note link with [{Note Name}]</p>'));
  const [commandInput, setCommandInput] = useState(':');
  const [lineNumbers, setLineNumbers] = useState(false);
  const statusBarRef = useRef(null);
  const inputRef = useRef(null);
  
  // Sidebar state
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setContent(newContent);
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
  });

  // Handle note link clicks
  const handleNoteLinkClick = useCallback((noteName) => {
    const note = notes.find(n => n.title === noteName);
    if (note) {
      selectNote(note);
    } else {
      console.log(note?.name);

      alert(`Note "${noteName}" not found. You can create it with :new {${noteName}}
        Available notes: ${notes.map(n => n.title).join(', ')}`);
      console.log(notes.map(n=> n.title).join(", "));
    }
  }, [notes]);

  // Extract all note links from content for graph construction
  const extractNoteLinks = useCallback((content) => {
    const noteLinkRegex = /\[{([^}]+)}\]/g;
    const links = [];
    let match;
    
    while ((match = noteLinkRegex.exec(content)) !== null) {
      links.push(match[1].trim());
    }
    
    return links;
  }, []);

  // Process note links and make them clickable
  const processNoteLinks = useCallback(() => {
    if (!editor) return;
    
    const editorElement = editor.view.dom;
    
    // Add a single click handler to the editor
    const handleEditorClick = (e) => {
      const clickedElement = e.target;
      
      // Check if clicked on a styled note link
      if (clickedElement.classList.contains('note-link-text')) {
        const noteName = clickedElement.getAttribute('data-note-name');
        if (noteName) {
          e.preventDefault();
          e.stopPropagation();
          handleNoteLinkClick(noteName);
          return;
        }
      }
      
      // Fallback: check if the clicked text contains a note link
      const text = clickedElement.textContent || '';
      if (text.includes('[{') && text.includes('}]')) {
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
    
    // Remove existing listener and add new one
    editorElement.removeEventListener('click', handleEditorClick);
    editorElement.addEventListener('click', handleEditorClick);
    
    // Store the handler for cleanup
    editorElement._noteLinkHandler = handleEditorClick;
  }, [editor, handleNoteLinkClick]);

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      if (editor && editor.view.dom._noteLinkHandler) {
        editor.view.dom.removeEventListener('click', editor.view.dom._noteLinkHandler);
      }
    };
  }, [editor]);

  // Process note links when content changes
  useEffect(() => {
    if (editor && content) {
      // Small delay to ensure editor has updated
      setTimeout(() => {
        processNoteLinks();
      }, 100);
    }
  }, [content, editor, processNoteLinks]);

  // Load notes for the logged-in user
  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/user-data');
      const data = await res.json();
      const user = data.user;
      if (user) {
        const res2 = await fetch(`/api/auth/get_notes?user_id=${user.id}`);
        const notesData = await res2.json();
        setNotes(notesData.posts || []);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Select a note and update editor
  const selectNote = (note) => {
    console.log(`selected note ${note}`)
    let obj = note;
    console.dir(obj);

// Pretty print JSON
    console.log(JSON.stringify(obj, null, 2)); 
    setSelectedNoteId(note.id);
    setTitle(note.title || 'Untitled');
    const processedContent = processContentWithNoteLinks(note.content || '');
    setContent(processedContent);
    if (editor) {
      editor.commands.setContent(processedContent);
    }
  };

  // Create a new note with a custom title
  const createNewNoteWithTitle = async (title) => {
    try {
      const res = await fetch('/api/auth/user-data');
      const data = await res.json();
      const user = data.user;
      if (!user || !user.id) return;
      
      // Save empty note to backend
      await fetch('/api/auth/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, title, content: '' }),
      });
      
      await loadNotes();
      
      // Select the new note
      setTimeout(() => {
        const newNote = { id: null, title, content: '' };
        selectNote(newNote);
      }, 300);
    } catch (err) {
      alert('Failed to create note: ' + err);
    }
  };

  // Select a note by title
  const selectNoteWithTitle = (title) => {
    const note = notes.find(n => n.title === title);
    if (note) selectNote(note);
    else alert('Note not found: ' + title);
  };

  // Delete a note by title
  const deleteNoteWithTitle = async (title) => {
    try {
      const res = await fetch('/api/auth/user-data');
      const data = await res.json();
      const user = data.user;
      if (!user || !user.id) return;
      
      await fetch('/api/auth/deletenotes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, title }),
      });
      
      await loadNotes();
      
      // If we deleted the currently selected note, select the first available note
      if (title === title) {
        const remainingNotes = notes.filter(n => n.title !== title);
        if (remainingNotes.length > 0) {
          selectNote(remainingNotes[0]);
        } else {
          setTitle('Untitled');
          setContent('');
          if (editor) editor.commands.setContent('');
        }
      }
    } catch (err) {
      alert('Failed to delete note: ' + err);
    }
  };

  // Manual new note button
  const createNewNote = () => {
    const title = `Note ${Date.now()}`;
    createNewNoteWithTitle(title);
  };

  // Manual delete button
  const deleteNote = async (note, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNoteWithTitle(note.title);
    }
  };

  // Status bar logic
  useEffect(() => {
    if (!editor) return;
    const html = editor.getHTML();
    const lineCount = (html.match(/<p|<h[1-6]/g) || []).length || 1;
    const noteLinks = extractNoteLinks(content);
    const linksText = noteLinks.length > 0 ? ` (${noteLinks.length} links)` : '';
    setStatus(`${title}  ${lineCount} line${lineCount > 1 ? 's' : ''}${linksText}  --${mode}${commandMode ? ' [COMMAND]' : ''}--`);
  }, [editor, content, title, mode, commandMode, extractNoteLinks]);

  // Keyboard shortcuts and command mode
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (commandMode) {
        // Command mode input
        if (event.key === 'Escape') {
          setCommandMode(false);
          setCommandInput(':');
        } else if (event.key === 'Enter') {
          executeCommand(commandInput.slice(1));
          setCommandMode(false);
          setCommandInput(':');
        } else if (event.key.length === 1 || event.key === 'Backspace') {
          // Update command input
          if (event.key === 'Backspace') {
            setCommandInput((prev) => prev.length > 1 ? prev.slice(0, -1) : ':');
          } else {
            setCommandInput((prev) => prev + event.key);
          }
        }
        event.preventDefault();
        return;
      }
      // ESC: Toggle between INSERT and NORMAL mode
      if (event.key === 'Escape') {
        setMode((prev) => (prev === 'INSERT' ? 'NORMAL' : 'INSERT'));
        if (editor) {
          if (mode === 'INSERT') editor.commands.blur();
          else editor.commands.focus();
        }
        event.preventDefault();
      }
      // In NORMAL mode, check for ':' to enter command mode
      if (mode === 'NORMAL' && event.key === ':') {
        setCommandMode(true);
        setCommandInput(':');
        event.preventDefault();
        return;
      }
      // Shortcuts (Ctrl+S, Ctrl+B, etc.)
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveNote();
      }
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        if (editor) editor.commands.toggleBold();
      }
      if (event.ctrlKey && event.key === 'i') {
        event.preventDefault();
        if (editor) editor.commands.toggleItalic();
      }
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        if (editor) editor.commands.toggleLink({ href: 'https://example.com' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, mode, commandMode, commandInput]);

  // Command execution logic
  function executeCommand(cmd) {
    const command = cmd.trim().toLowerCase();
    // :new {post} command
    if (command.startsWith('new ')) {
      const match = cmd.match(/^new\s+\{(.+)\}$/i);
      if (match && match[1].trim()) {
        const postTitle = match[1].trim();
        createNewNoteWithTitle(postTitle);
        return;
      } else {
        alert('Usage: :new {post}');
        return;
      }
    }
    // :cd {post} command
    if (command.startsWith('cd ')) {
      const match = cmd.match(/^cd\s+\{(.+)\}$/i);
      if (match && match[1].trim()) {
        const postTitle = match[1].trim();
        selectNoteWithTitle(postTitle);
        return;
      } else {
        alert('Usage: :cd {post}');
        return;
      }
    }
    // :d {post} command
    if (command.startsWith('d ')) {
      const match = cmd.match(/^d\s+\{(.+)\}$/i);
      if (match && match[1].trim()) {
        const postTitle = match[1].trim();
        deleteNoteWithTitle(postTitle);
        return;
      } else {
        alert('Usage: :d {post}');
        return;
      }
    }
    // :x command - delete current line
    if (command === 'x') {
      if (editor) {
        const { from, to } = editor.state.selection;
        const $from = editor.state.doc.resolve(from);
        const lineStart = $from.start();
        const lineEnd = $from.end();
        
        // Delete the entire line
        editor.commands.deleteRange({ from: lineStart, to: lineEnd });
      }
      return;
    }
    if (command === 'ash init') {
      async function ash_init() {
        const res = await fetch('/api/auth/user-data');
        const data = await res.json();
        const user = data.user;
        if (!user || !user.id) return;
        const res2 = await fetch(`/api/auth/get_notes?user_id=${user.id}`);
        const notesData = await res2.json();
    

      }
 
    }
    // :ln command - toggle line numbers
    if (command === 'ln') {
      setLineNumbers(prev => !prev);
      return;
    }
    // :links command - show all note links in current note
    if (command === 'links') {
      const links = extractNoteLinks(content);
      if (links.length > 0) {
        alert(`Note links in "${title}":\n${links.join('\n')}`);
      } else {
        alert(`No note links found in "${title}"`);
      }
      return;
    }
    if (command === 'q' || command === 'quit') {
      // Placeholder: could close the editor or navigate away
      alert('Quit (not implemented)');
    } else if (command === 'w' || command === 'write') {
      saveNote();
    } else if (command === 'wq') {
      saveNote();
      alert('Quit (not implemented)');
    } else if (command === 'help') {
      alert('Available commands: new {post}, cd {post}, d {post}, x (delete line), ln (line numbers), links, w(rite), q(uit), wq, help');
    } else {
      alert(`Unknown command: ${command}`);
    }
  }

  // Save note logic (calls backend API)
  async function saveNote() {
    try {
      const res1 = await fetch(`/api/auth/user-data`);
      if (!res1.ok) {
        alert('Failed to get user data');
        return;
      }
      const data = await res1.json();
      const user = data.user;
      if (!user || !user.id) {
        alert('No user data available');
        return;
      }
      const saveResponse = await fetch('/api/auth/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, title, content }),
      });
      if (!saveResponse.ok) {
        alert('Save failed');
        return;
      }
      // Show save indicator in status bar
      if (statusBarRef.current) {
        const original = statusBarRef.current.textContent;
        statusBarRef.current.textContent = original?.replace(/--(INSERT|NORMAL|\[COMMAND\])--/, '--SAVED--') || '--SAVED--';
        setTimeout(() => {
          if (statusBarRef.current) statusBarRef.current.textContent = original;
        }, 1000);
      }
    } catch (error) {
      alert('Error saving note');
    }
  }

  // Debounced save effect: save note when content changes
  useEffect(() => {
    if (!title || !content) return;
    const timeout = setTimeout(() => {
      saveNote();
    }, 800); // 800ms debounce
    return () => clearTimeout(timeout);
  }, [content, title]);

  // Focus command input when entering command mode
  useEffect(() => {
    if (commandMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [commandMode]);

  // Handle input prevention in NORMAL mode
  useEffect(() => {
    if (!editor) return;
    
    const handleKeyDown = (event) => {
      if (mode === 'NORMAL') {
        // Allow navigation keys and commands
        const allowedKeys = [
          'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
          'Home', 'End', 'PageUp', 'PageDown',
          'Escape', 'Tab'
        ];
        
        // Allow Ctrl/Cmd combinations
        if (event.ctrlKey || event.metaKey) {
          return;
        }
        
        // Allow single character keys for commands (like ':', 'x', etc.)
        if (event.key === ':' || event.key.length === 1) {
          // Let the main keydown handler deal with commands
          return;
        }
        
        // Block other text input
        if (!allowedKeys.includes(event.key)) {
          event.preventDefault();
        }
      }
    };
    
    const editorElement = editor.view.dom;
    editorElement.addEventListener('keydown', handleKeyDown);
    
    return () => {
      editorElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, editor]);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Select first note (or Welcome) on load
  useEffect(() => {
    if (notes.length > 0) {
      const welcome = notes.find(n => n.title && n.title.toLowerCase() === 'welcome');
      selectNote(welcome || notes[0]);
    }
  }, [notes]);

  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 430 && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen]);

  return (
    <div className="docs-container">
      {/* Mobile Header */}
      <div className="mobile-header-bar">
        <button className="sidebar-toggle-btn" onClick={handleSidebarToggle} aria-label="Open notes sidebar">
          <span className="hamburger-icon">☰</span>
        </button>
        <span className="mobile-title">Notes</span>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={handleSidebarClose} />
      
      {/* Sidebar */}
      <div className={`docs-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <h2>Notes</h2>
          <button
            className="new-note-btn"
            onClick={createNewNote}
            title="Create new note"
          >
            +
          </button>
        </div>
        <div className="notes-list">
          {loading ? (
            <div className="loading">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="no-notes">
              <p>No notes yet</p>
              <button onClick={createNewNote}>Create your first note</button>
            </div>
          ) : (
            notes.map(note => (
              <div
                key={note.id || note.title}
                className={`note-item ${selectedNoteId === note.id ? 'selected' : ''}`}
                onClick={() => selectNote(note)}
              >
                <span className="note-title">{note.title}</span>
                <button
                  className="delete-note-btn"
                  onClick={e => deleteNote(note, e)}
                  title="Delete note"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="docs-main">
        {/* Toolbar */}
        <div className="docs-toolbar">
          <div className="toolbar-group">
            <button 
              className="toolbar-btn"
              onClick={() => editor?.commands.toggleBold()}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button 
              className="toolbar-btn"
              onClick={() => editor?.commands.toggleItalic()}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button 
              className="toolbar-btn"
              onClick={() => editor?.commands.toggleLink({ href: 'https://example.com' })}
              title="Link (Ctrl+K)"
            >
              🔗
            </button>
          </div>
          <div className="toolbar-group">
            <button 
              className="toolbar-btn"
              onClick={() => setLineNumbers(!lineNumbers)}
              title="Toggle line numbers"
            >
              #
            </button>
            <button 
              className="toolbar-btn"
              onClick={saveNote}
              title="Save (Ctrl+S)"
            >
              💾
            </button>
            <button 
              className={`toolbar-btn ${mode === 'NORMAL' ? 'active' : ''}`}
              onClick={() => setMode(mode === 'INSERT' ? 'NORMAL' : 'INSERT')}
              title={`Switch to ${mode === 'INSERT' ? 'NORMAL' : 'INSERT'} mode (ESC)`}
            >
              {mode === 'INSERT' ? '✏️' : '⌨️'}
            </button>
          </div>
        </div>

        {/* Document Title */}
        <div className="docs-title-container">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="docs-title-input"
            placeholder="Untitled document"
          />
        </div>

        {/* Editor Container */}
        <div className={`docs-editor-container ${lineNumbers ? 'with-line-numbers' : ''}`}>
          {lineNumbers && (
            <div className="line-numbers">
              {(() => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const lineElements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, li, blockquote');
                const lineCount = Math.max(lineElements.length, 1);
                return Array.from({ length: lineCount }, (_, index) => (
                  <div key={index} className="line-number">{index + 1}</div>
                ));
              })()}
            </div>
          )}
          <div className="docs-editor">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Status Bar / Terminal */}
        <div className="terminal-prompt">
  <span className="prompt-symbol">$</span>
  <input
    ref={inputRef}
    className="command-input"
    value={commandInput}
    onChange={e => setCommandInput(e.target.value)}
    style={{
      color: '#00ff00',
      backgroundColor: 'black',
      border: 'none',
      outline: 'none',
      fontFamily: 'Fira Mono, Consolas, Menlo, monospace',
      fontSize: '0.85rem',
      width: '100%',
      caretColor: '#00ff00'
    }}
  />
</div>

      </div>

      <style>{`
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
          font-weight: 500;
          color: #2b6cb0;
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
          padding: 1.5rem 0.75rem;
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
          height: 1.6rem;
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

          .docs-toolbar {
            padding: 0.5rem 1rem;
            gap: 0.5rem;
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
      `}</style>
      <style jsx>{`
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
      `}</style>
    </div>
  );
} 
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
      alert(`Note "${noteName}" not found. You can create it with :new {${noteName}}`);
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

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* Sidebar */}
      <div className="obsidian-sidebar">
        <div className="obsidian-sidebar-header">
          NOTES
          <button
            className="new-note-btn"
            onClick={createNewNote}
            title="Create new note (Ctrl+N)"
          >
            +
          </button>
        </div>
        <div className="obsidian-notes-list">
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
                className={`obsidian-note-item ${selectedNoteId === note.id ? 'selected' : ''}`}
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

      {/* Editor Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="obsidian-topbar">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="note-title-input"
            style={{ fontWeight: 'bold', fontSize: '1.1rem', border: 'none', background: 'transparent' }}
          />
        </div>
        <div className={`editor-container ${lineNumbers ? 'with-line-numbers' : ''}`}>
          {lineNumbers && (
            <div className="line-numbers">
              {(() => {
                // Count actual HTML elements for proper line numbering
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
          <EditorContent editor={editor} />
        </div>
        <div id="status-bar" className="status-bar" ref={statusBarRef}>
          {commandMode ? (
            <input
              ref={inputRef}
              className="command-input"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#444', fontFamily: 'Fira Mono, Consolas, Menlo, monospace', fontSize: '1rem' }}
            />
          ) : status}
        </div>
      </div>

      <style>{`
        .obsidian-topbar {
          margin-bottom: 0.5rem;
          padding: 1.2rem 1.5rem 0.5rem 1.5rem;
        }
        .note-title-input {
          margin-left: 2rem;
          width: 100%;
          background: #f8f2e4;
          border: none;
          outline: none;
          font-family: 'Inter', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #3a2e1a;
          padding: 0.2rem 0.5rem;
          border-radius: 0;
        }
        .note-title-input:focus {
          outline: none;
          border: none;
          box-shadow: none;
        }
        .tiptap {
          min-height: 340px;
          max-height: calc(100vh - 200px);
          background: #f8f2e4;
          font-size: 1.08rem;
          outline: none;
          border: none;
          box-shadow: none;
          border-radius: 10px;
          padding: 1.2rem 1.5rem;
          margin: 0 1.5rem;
          transition: background 0.2s;
          color: #2d261a;
          font-family: 'Inter', sans-serif;
          position: relative;
          flex: 1;
          overflow-y: auto;
        }
        .tiptap:focus {
          outline: none;
          border: none;
          box-shadow: none;
        }
        /* Line numbering styles */
        .editor-container {
          display: flex;
          position: relative;
          min-height: 0;
        }
        .editor-container.with-line-numbers {
          display: flex;
        }
        .line-numbers {
          background: #e6e1d7;
          margin-top: 0.65rem;
          margin-bottom: 1.2rem;
          border-right: 1px solid #d4cfc5;
          padding: 1.2rem 0.5rem;
          font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
          font-size: 0.9rem;
          color: #666;
          text-align: right;
          min-width: 3rem;
          user-select: none;
        }
        .line-number {
          line-height: 2.5;
          padding: 0.4rem 0.3rem;
          height: 1.6rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .editor-container.with-line-numbers .tiptap {
          margin-left: 0;
          border-radius: 0 10px 10px 0;
          flex: 1;
        }
        /* Style for note links */
        .tiptap {
          color: #2d261a;
        }
        /* Simple green styling for note links */
        .note-link-text {
          color: #456650 !important;
          background: rgba(69, 102, 80, 0.1) !important;
          padding: 0.1rem 0.2rem !important;
          border-radius: 2px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
        }
        .note-link-text:hover {
          background: rgba(69, 102, 80, 0.2) !important;
        }
        .status-bar {
          width: 100%;
          background: #f8f2e4;
          color: #666;
          font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
          font-size: 1rem;
          padding: 0.2rem 1rem 0.2rem 1rem;
          border-radius: 0;
          border-top: 1px solid #e6e1d7;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          letter-spacing: 0.03em;
          box-sizing: border-box;
          margin-top: 0;
        }
        .command-input {
          background: transparent;
          border: none;
          outline: none;
          color: #444;
          font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
          font-size: 1rem;
          width: 100%;
          letter-spacing: 0.03em;
          padding: 0;
          margin: 0;
        }
        .command-input::placeholder {
          color: #666;
        }
        @media (max-width: 800px) {
          .tiptap {
            margin-left: 0.5rem;
            margin-right: 0.5rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
} 
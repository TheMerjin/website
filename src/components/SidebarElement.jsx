import React, { useState, useEffect, useCallback } from 'react';
import '../styles/SidebarElement.css';

const SidebarElement = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Fetch notes for the logged-in user
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

  // Select a note and dispatch event
  const selectNote = (note) => {
    setSelectedNoteId(note.id);
    window.dispatchEvent(new CustomEvent('noteSelected', { detail: note }));
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
        const note = { id: null, title, content: '' };
        selectNote(note);
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

  // Listen for custom events
  useEffect(() => {
    loadNotes();
    const handleCreate = (e) => createNewNoteWithTitle(e.detail.title);
    const handleSelect = (e) => selectNoteWithTitle(e.detail.title);
    const handleDelete = (e) => deleteNoteWithTitle(e.detail.title);
    window.addEventListener('createNoteWithTitle', handleCreate);
    window.addEventListener('selectNoteWithTitle', handleSelect);
    window.addEventListener('deleteNoteWithTitle', handleDelete);
    return () => {
      window.removeEventListener('createNoteWithTitle', handleCreate);
      window.removeEventListener('selectNoteWithTitle', handleSelect);
      window.removeEventListener('deleteNoteWithTitle', handleDelete);
    };
  }, [loadNotes]);

  // Select first note (or Welcome) on load
  useEffect(() => {
    if (notes.length > 0) {
      const welcome = notes.find(n => n.title && n.title.toLowerCase() === 'welcome');
      selectNote(welcome || notes[0]);
    }
  }, [notes]);

  if (loading) {
    return (
      <div className="container">
        <aside className="obsidian-sidebar">
          <div className="obsidian-sidebar-header">NOTES</div>
          <div className="obsidian-notes-list">
            <div className="loading">Loading notes...</div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="container">
      <aside className="obsidian-sidebar">
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
          {notes.length === 0 ? (
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
      </aside>
    </div>
  );
};

export default SidebarElement; 
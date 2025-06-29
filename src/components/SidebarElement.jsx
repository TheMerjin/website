import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/client-supabase.js';
import '../styles/SidebarElement.css';

const SidebarElement = ({ onNoteSelect, selectedNoteId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
    
    // Listen for custom note creation events
    const handleCreateNoteWithTitle = (event) => {
      const { title } = event.detail;
      createNewNoteWithCustomTitle(title);
    };
    
    window.addEventListener('createNoteWithTitle', handleCreateNoteWithTitle);
    
    return () => {
      window.removeEventListener('createNoteWithTitle', handleCreateNoteWithTitle);
    };
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      // Try to find the Welcome note
      const welcomeNote = notes.find(note => note.title && note.title.toLowerCase() === 'welcome');
      if (welcomeNote) {
        if (onNoteSelect) {
          onNoteSelect(welcomeNote);
        } else {
          window.dispatchEvent(new CustomEvent('noteSelected', { detail: welcomeNote }));
        }
      } else {
        // Fallback: select the first note
        if (onNoteSelect) {
          onNoteSelect(notes[0]);
        } else {
          window.dispatchEvent(new CustomEvent('noteSelected', { detail: notes[0] }));
        }
      }
    }
    // Only run this effect when notes are loaded
    // eslint-disable-next-line
  }, [notes]);

  const loadNotes = async () => {
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
  };

  const createNewNote = async () => {
    const newNote = {
      id: Date.now().toString(),
      title: `Note ${Date.now()}`,
      content: '',
      created_at: new Date().toISOString()
    };

    setNotes(prev => [...prev, newNote]);
    if (onNoteSelect) {
      onNoteSelect(newNote);
    } else {
      // Fallback: dispatch custom event
      window.dispatchEvent(new CustomEvent('noteSelected', { detail: newNote }));
    }
  };

  const createNewNoteWithCustomTitle = async (title) => {
    const newNote = {
      id: Date.now().toString(),
      title: title,
      content: '',
      created_at: new Date().toISOString()
    };

    setNotes(prev => [...prev, newNote]);
    if (onNoteSelect) {
      onNoteSelect(newNote);
    } else {
      // Fallback: dispatch custom event
      window.dispatchEvent(new CustomEvent('noteSelected', { detail: newNote }));
    }
  };

  const handleNoteClick = (note) => {
    if (onNoteSelect) {
      onNoteSelect(note);
    } else {
      // Fallback: dispatch custom event
      window.dispatchEvent(new CustomEvent('noteSelected', { detail: note }));
    }
  };

  const deleteNote = async (note, event) => {
    event.stopPropagation();
    const title = note.title;
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        // Get user info
        const res = await fetch('/api/auth/user-data');
        const data = await res.json();
        const user = data.user;
        if (!user || !user.id) {
          alert('User not found.');
          return;
        }
        // Call DELETE API
        const delRes = await fetch('/api/auth/deletenotes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, title}),
        });
        const delData = await delRes.json();
        if (delData.success) {
          setNotes(prev => prev.filter(note => note.title !== title));
          alert('Note deleted successfully.');
        } else {
          alert('Delete failed: ' + (delData.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Delete failed: ' + err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
      <aside className="obsidian-sidebar" >
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
    <aside className="obsidian-sidebar" >
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
              key={note.id}
              className={`obsidian-note-item ${selectedNoteId === note.id ? 'selected' : ''}`}
              onClick={() => handleNoteClick(note)}
            >
              <span className="note-title">{note.title}</span>
              <button
                className="delete-note-btn"
                onClick={(e) => deleteNote(note, e)}
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
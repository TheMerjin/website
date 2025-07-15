import React, { useEffect, useState } from 'react';
import {supabase} from '../lib/client-supabase.js';

function DigitalArchive() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/archive')
      .then(res => res.json())
      .then(data => setEntries(data.entries || []));
  }, [success]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!file || !subject || !title) {
      setError('Please fill all required fields and select a file.');
      return;
    }
    setUploading(true);
    try {
      console.log(supabase);
      // Get user id (assumes user is logged in)
      const res2 = await fetch("/api/auth/user-data")
      const data = await res2.json();
      const user = data.user;
      if (!user) throw new Error('Not authenticated');
      const filePath = `${user.id}/${subject}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('archive').upload(filePath, file);
      console.log(error);
      if (uploadError) throw uploadError;
      // Save metadata via API
      const res = await fetch('/api/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          title,
          description,
          file_path: filePath
        })
      });
      if (!res.ok) throw new Error('Failed to save metadata');
      setSuccess(true);
      setFile(null);
      setSubject('');
      setTitle('');
      setDescription('');
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: 'Georgia, serif', background: '#fff', padding: 24 }}>
      <h1 style={{ fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 22, color: '#1a1a1a', marginBottom: 18 }}>Digital Archive</h1>
      <div className="epistemic-status" style={{ background: '#f3f3f3', border: '1px solid #eee', fontSize: '0.98rem', fontStyle: 'italic', color: '#444', margin: '0 0 1rem 0', padding: '0.5rem 0.8rem', borderRadius: 0 }}>
        <p><em>Epistemic status: This is your organized digital archive for all class materials and scans.</em></p>
      </div>
      <button
        className="lw-btn"
        style={{ border: '1px solid #aaa', background: '#eee', color: '#111', fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 16, borderRadius: 0, padding: '0.2rem 1rem', marginBottom: 18 }}
        onClick={() => setShowForm(f => !f)}
      >
        {showForm ? 'Cancel' : 'Add Item'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: '#f7f7f7',
          border: '1px solid #ddd',
          borderRadius: 0,
          padding: 20,
          maxWidth: 500,
          margin: '0 auto 18px auto',
          fontFamily: 'Georgia, serif',
          color: '#222',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <label style={{ fontWeight: 600, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 15 }}>Subject *</label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} style={{ border: '1px solid #ccc', borderRadius: 0, padding: 6, fontFamily: 'Georgia, serif', fontSize: 15 }} required />
          <label style={{ fontWeight: 600, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 15 }}>Title *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ border: '1px solid #ccc', borderRadius: 0, padding: 6, fontFamily: 'Georgia, serif', fontSize: 15 }} required />
          <label style={{ fontWeight: 600, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 15 }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ border: '1px solid #ccc', borderRadius: 0, padding: 6, fontFamily: 'Georgia, serif', fontSize: 15, minHeight: 40 }} />
          <label style={{ fontWeight: 600, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 15 }}>File *</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ border: 'none', fontFamily: 'Georgia, serif', fontSize: 15 }} required />
          <button type="submit" disabled={uploading} style={{
            borderRadius: 0,
            border: '1px solid #aaa',
            backgroundColor: '#eee',
            color: '#111',
            padding: '7px 18px',
            fontFamily: 'Inter, Helvetica, Arial, sans-serif',
            fontWeight: 500,
            fontSize: '15px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            boxShadow: 'none',
            outline: 'none',
            marginTop: 8
          }}>{uploading ? 'Uploading...' : 'Upload'}</button>
          {error && <div style={{ color: '#b91c1c', fontSize: 15 }}>{error}</div>}
        </form>
      )}
      <table className="lw-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.98rem', marginBottom: '1.2rem' }}>
        <thead>
          <tr>
            <th>Name</th><th>Class</th><th>Description</th><th>Date</th><th>Download</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>No files found.</td></tr>
          )}
          {entries.map(entry => (
            <tr key={entry.id}>
              <td>{entry.title}</td>
              <td>{entry.subject}</td>
              <td>{entry.description}</td>
              <td>{entry.created_at ? entry.created_at.slice(0, 10) : ''}</td>
              <td>
                <a
                  href={entry.file_path ? `/api/archive/download?file_path=${encodeURIComponent(entry.file_path)}` : '#'}
                  className="lw-btn"
                  style={{ border: '1px solid #aaa', background: '#eee', color: '#111', fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 15, borderRadius: 0, padding: '0.1rem 0.7rem' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DigitalArchive; 
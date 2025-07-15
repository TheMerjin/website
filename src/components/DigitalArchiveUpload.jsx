import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

function DigitalArchiveUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
      // Get user id (assumes user is logged in)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const filePath = `${user.id}/${subject}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('archive').upload(filePath, file);
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
      if (onUpload) onUpload();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#f7f7f7',
      border: '1px solid #ddd',
      borderRadius: 0,
      padding: 20,
      maxWidth: 500,
      margin: '0 auto',
      fontFamily: 'Georgia, serif',
      color: '#222',
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>
      <h2 style={{ fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#1a1a1a', marginBottom: 8 }}>Upload to Digital Archive</h2>
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
      {success && <div style={{ color: '#166534', fontSize: 15 }}>Upload successful!</div>}
    </form>
  );
}

export default DigitalArchiveUpload; 
import React, { useRef, useState } from 'react';
import { supabase } from '../lib/client-supabase.js';
import '../styles/commentEditorStyle.css';

export default function CommentEditor({ slug, parentId = null, onPosted }) {
  const textareaRef = useRef(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const lines = e.target.value.split('\n').length;
    e.target.rows = Math.max(lines + 2, 6);
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Check if user is logged in
    const loginRes = await fetch('/api/auth/logged-in');
    if (!loginRes.ok) {
      alert('Please log in first.');
      setLoading(false);
      return;
    } else {
      // Optionally: alert('login completed');
    }
    const userRes = await fetch('/api/auth/user-data');
    if (!userRes.ok) {
      alert('Failed to fetch user data.');
      setLoading(false);
      return;
    }
    const { user } = await userRes.json();
    console.log(user.user_metadata.username);
    if (!content.trim()) {
      alert("Comment can't be empty.");
      setLoading(false);
      return;
    }

    const comment = {
      content,
      post_id: slug,
      author_id: user.id,
      parent_id: parentId,
      username : user.user_metadata?.username
    };
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    const saveRes = await fetch('/api/auth/post_comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(comment),
    });
    if (saveRes.ok) {
      setContent('');
      if (textareaRef.current) textareaRef.current.rows = 6;
      if (onPosted) onPosted();
    } else {
      const err = await saveRes.json();
      alert('Failed to post comment.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="comment-box-container" style={{
      maxWidth: 800,
      width: '100%',
      marginLeft: "0rem",
      padding: 0,
      marginBottom : 0,
    }}>
      <form id="commentForm" className={slug} onSubmit={handleSubmit}>
        <textarea
          id="commentBox"
          name="content"
          rows={6}
          placeholder="Type your comment here..."
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          style={{ width: '100%', resize: 'none', overflow: 'hidden', padding: '0.75rem', fontSize: '1rem', boxSizing: 'border-box', border: '1px solid #ffe0c0', borderRadius: "0" , backgroundColor: "#fcfcfc" }}
        />
        <div className="button-wrapper" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-2.25rem', marginRight: '0.5rem', marginBottom: '0.5rem' }}>
          <button id="submit" type="submit" className="custom-button" disabled={loading}>{loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
} 
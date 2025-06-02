import React, { useRef, useState } from 'react';
import { supabase } from '../lib/client-supabase.js';
import '../styles/commentEditorStyle.css';
import PlusMenu from './PlusButton.jsx';

export default function ParentCommentEditor({ slug, parentId = null, onPosted }) {
  const textareaRef = useRef(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

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
    const saveData = await saveRes.json();
    const comment_id = saveData.comment?.[0]?.id;
    console.log(comment_id); // or whatever key your API returns
    const tagRes = await fetch('/api/auth/post_tags', {
      method: 'POST', // or 'PUT', etc.
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        comment_id: comment_id,
        tag: selectedTag
      })
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
      marginTop : "12px",
      padding: 0,
        marginBottom: 0,
          border: '1px solid #ffe0c0',
        backgroundColor: "#fcfcfc"
      }}>
          <div style = {{maxWidth: 1000,      width: '100%', display: "flex"}}>
              <h2 style={{ marginLeft: "1rem" }}>Comments</h2>
              <PlusMenu onTagSelect={setSelectedTag} />

              </div>
      <form id="commentForm" className={slug} onSubmit={handleSubmit}>
        <textarea
          id="commentBox"
          name="content"
          rows={6}
          placeholder="Type your comment here..."
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          
        />
        <div className="button-wrapper" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-2.25rem', marginRight: '0.5rem', marginBottom: '0.5rem' }}>
          <button id="submit" type="submit" className="custom-button" disabled={loading}>{loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
} 
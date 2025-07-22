import React, { useEffect, useState } from 'react';
import CommentEditor from './CommentEditor.jsx';
import '../styles/CommentTreeStyle.css';
import ParentCommentEditor from './ParentCommentEditor.jsx';

// Helper to build a tree from flat comments
function buildTree(comments) {
  const map = {};
  const roots = [];
  comments.forEach(comment => {
    map[comment.id] = { ...comment, children: [] };
  });
  comments.forEach(comment => {
    if (comment.parent_id) {
      map[comment.parent_id]?.children.push(map[comment.id]);
    } else {
      roots.push(map[comment.id]);
    }
  });
  return roots;
}

function darken(color, percent) {
  const percent_used = percent / 3
  // Simple color darken for #fcfcfc
  // percent: 0 = original, 1 = much darker
  let amt = Math.round(255 * percent_used * 0.12);
  let c = 252 - amt;
  return `rgb(${c},${c},${c})`;
}

// Fetch tags for a comment
async function fetchTags(commentId) {
  const res = await fetch(`/api/auth/get_tags?comment_id=${commentId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.tags || [];
}

const starBtnStyle = {
  background: 'none',
  border: 'none',
  borderRadius: 0,
  color: '#bdbdbd',
  fontSize: '1.1rem',
  padding: '0.05rem 0.18rem',
  cursor: 'pointer',
  transition: 'color 0.15s, border-color 0.15s, background 0.15s',
  outline: 'none',
  fontFamily: 'Inter, Helvetica, Arial, sans-serif',
  margin: 0,
  lineHeight: 1.1,
};

const plusBtnStyle = {
  background: 'none',
  border: 'none',
  borderRadius: 0,
  color: '#888',
  fontSize: '1.1rem',
  padding: '0.05rem 0.3rem 0.18rem 0rem',
  cursor: 'pointer',
  transition: 'color 0.15s, border-color 0.15s, background 0.15s',
  outline: 'none',
  fontFamily: 'Inter, Helvetica, Arial, sans-serif',
  margin: '1rem 1 1 1rem',
  lineHeight: 1.1,
  fontWeight: 600,
};

export default function CommentsTree({ slug }) {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [collapsed, setCollapsed] = useState({}); // commentId: true/false
  const [tagsMap, setTagsMap] = useState({}); // commentId: [tags]
  const [gratitudeMap, setGratitudeMap] = useState({}); // commentId: { hasGiven: boolean, count: number }

  useEffect(() => {
    fetch(`/api/auth/get_comments?post_id=${slug}`)
      .then(res => res.json())
      .then(data => { 
        setComments(data.comments || []);
        // Initialize gratitude state for each comment
        const gratitudeState = {};
        (data.comments || []).forEach(comment => {
          gratitudeState[comment.id] = {
            hasGiven: comment.user_has_given_gratitude || false,
            count: comment.gratitude || 0
          };
        });
        setGratitudeMap(gratitudeState);
      });
  }, [slug, refresh]);

  // Fetch tags for all comments when comments change
  useEffect(() => {
    async function loadTags() {
      const map = {};
      await Promise.all(
        comments.map(async (c) => {
          map[c.id] = await fetchTags(c.id);
        })
      );
      setTagsMap(map);
    }
    if (comments.length > 0) loadTags();
  }, [comments]);

  const tree = buildTree(comments);

  const handleReply = (id) => setReplyTo(id);
  const handleCancel = () => setReplyTo(null);
  const handlePosted = () => {
    setReplyTo(null);
    setRefresh(r => r + 1);
  };

  const toggleCollapse = (id) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(r => r + 1); // triggers re-fetch every 5s
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // clean up
  }, []);

  const handleGratitudeIncrease = async (commentId) => {
    const currentState = gratitudeMap[commentId] || { count: comments.find(c => c.id === commentId)?.gratitude || 0 };
    const newCount =  1;

    // Optimistic update
    setGratitudeMap(prev => ({
      ...prev,
      [commentId]: {
        count: newCount
      }
    }));

    // API call to update gratitude in comments table
    try {
      const response = await fetch('/api/auth/update_comment_gratitude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_id: commentId,
          gratitude_count: newCount
        })
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setGratitudeMap(prev => ({
          ...prev,
          [commentId]: currentState
        }));
        console.error('Failed to update gratitude');
      } else {
        setRefresh(r => r + 1); // Re-fetch comments from backend after successful update
      }
    } catch (error) {
      // Revert optimistic update on error
      setGratitudeMap(prev => ({
        ...prev,
        [commentId]: currentState
      }));
      console.error('Error updating gratitude:', error);
    }
  };

  function renderTree(nodes, level = 0) {
    return nodes.map(node => (
      <div key={node.id}
      style={{
        marginLeft: 1,
        width: '100%',
        maxWidth: 775 -14*level,
        background: darken('#fcfcfc', level),
        border: '1px solid #ffe0c0',
        borderRadius: 0,
        marginTop: 12 ,
        marginBottom: 12 ,
        padding: '0.75rem',
        boxShadow: '0 1px 2px #0001',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              <a href={`/${node.username}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {node.username}
              </a>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
              {new Date(node.created_at).toLocaleString().split(",")[0]}
              <div className="lw-comment-star-rating" aria-label="Rate comment" style={{ display: 'inline-flex', alignItems: 'center', margin: '0 0 0 0.7rem', gap: '0', fontSize: '1.1rem', verticalAlign: 'middle' }}>
                <button className="comment-star-btn" aria-label="1 star" style={starBtnStyle}>&#9734;</button>
                <button className="comment-star-btn" aria-label="2 stars" style={starBtnStyle}>&#9734;</button>
                <button className="comment-star-btn" aria-label="3 stars" style={starBtnStyle}>&#9734;</button>
                <button className="comment-star-btn" aria-label="4 stars" style={starBtnStyle}>&#9734;</button>
                <button className="comment-star-btn" aria-label="5 stars" style={starBtnStyle}>&#9734;</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.3rem' }}>
                <button 
                  className="lw-comment-plus-btn" 
                  aria-label="Toggle gratitude" 
                  style={{
                    ...plusBtnStyle,
                    color: gratitudeMap[node.id]?.hasGiven ? '#2b6cb0' : '#888',
                    fontWeight: gratitudeMap[node.id]?.hasGiven ? 700 : 600
                  }}
                  onClick={() => handleGratitudeIncrease(node.id)}
                >
                  +
                </button>
                <div>
                  {node.gratitude}
                </div>
              </div>
            </div>
            {tagsMap[node.id] && tagsMap[node.id].length > 0 && (
              <div style={{ display: 'flex', gap: 4 }}>
                {tagsMap[node.id].map((tag, i) => (
                  <span key={i} style={{ color: '#888', fontSize: '0.9rem', fontWeight: 500 }}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
          <button
            style={{ fontSize: '1rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={() => toggleCollapse(node.id)}
            aria-label={collapsed[node.id] ? 'Expand' : 'Collapse'}
          >
            {collapsed[node.id] ? '[+]' : '[-]'}
          </button>
        </div>
        {!collapsed[node.id] && <>
          <div style={{ whiteSpace : "pre-wrap",fontSize: '13px', marginBottom: 8 }}>{node.content}</div>
          <button
              style={{ '--bg-color': darken('#fcfcfc', level), fontSize: '0.9rem', padding: '0.5rem 1rem', marginLeft: '0' }}
              className="Replyto"
              onClick={() => handleReply(node.id)}
            >
              Reply
            </button>
          {replyTo === node.id && (
            <div style={{ marginTop: 8 }}>
              <CommentEditor slug={slug} parentId={node.id} onPosted={handlePosted} />
              <button onClick={handleCancel} style={{ marginTop: 4, fontSize: '1rem', background: 'none', border: 'none', color: '#c00', cursor: 'pointer' }}>Cancel</button>
            </div>
          )}
          {node.children && node.children.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </>}
      </div>
    ));
  }
  

  return (
    <div>
    <ParentCommentEditor slug={slug} parentId={null} onPosted={handlePosted} />
      <div>{renderTree(tree)}</div>
    </div>
  );
} 
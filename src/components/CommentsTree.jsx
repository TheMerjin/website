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

export default function CommentsTree({ slug }) {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [collapsed, setCollapsed] = useState({}); // commentId: true/false
  const [tagsMap, setTagsMap] = useState({}); // commentId: [tags]

  useEffect(() => {
    fetch(`/api/auth/get_comments?post_id=${slug}`)
      .then(res => res.json())
      .then(data => { setComments(data.comments || []) });
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
            <div style={{ fontSize: '0.8rem', color: '#888' }}>
              {new Date(node.created_at).toLocaleString()}
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
import React, { useEffect, useState } from 'react';
import CommentEditor from './CommentEditor.jsx';
import '../styles/CommentTreeStyle.css';

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

export default function CommentsTree({ slug }) {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch(`/api/auth/get_comments?post_id=${slug}`)
      .then(res => res.json())
      .then(data => { console.log(data);  setComments(data.comments || [])});
  }, [slug, refresh]);

  const tree = buildTree(comments);

  const handleReply = (id) => setReplyTo(id);
  const handleCancel = () => setReplyTo(null);
  const handlePosted = () => {
    setReplyTo(null);
    setRefresh(r => r + 1);
  };

  function renderTree(nodes, level = 0) {
    return nodes.map(node => (
      <div key={node.id}
      style={{
        marginLeft: 1,
        width: '100%', // or set a maxWidth instead
        maxWidth: 775 -14*level, // keeps it tidy on large screens
        background: darken('#fcfcfc', level),
        border: '1px solid #ffe0c0',
        borderRadius: 0,
        marginTop: 12 ,
        marginBottom: 12 ,
        padding: '0.75rem',
        boxShadow: '0 1px 2px #0001',
      }}>
        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>{node.username}</div>
        <div style={{ fontSize: '0.98rem', marginBottom: 8 }}>{node.content}</div>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>{new Date(node.created_at).toLocaleString()}</div>
        <button
            style={{ '--bg-color': darken('#fcfcfc', level) }}
            className="Replyto"
            onClick={() => handleReply(node.id)}
          >
            Reply
          </button>
        {replyTo === node.id && (
          <div style={{ marginTop: 8 }}>
            <CommentEditor slug={slug} parentId={node.id} onPosted={handlePosted} />
            <button onClick={handleCancel} style={{ marginTop: 4, fontSize: '0.8rem', background: 'none', border: 'none', color: '#c00', cursor: 'pointer' }}>Cancel</button>
          </div>
        )}
        {node.children && node.children.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {renderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  }
  

  return (
    <div>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Comments</h2>
      <CommentEditor slug={slug} parentId={null} onPosted={handlePosted} />
      <div>{renderTree(tree)}</div>
    </div>
  );
} 
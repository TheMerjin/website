import React, { useState, useEffect } from 'react';
import PostCard from './PostCard.jsx';

export default function SearchResults({ initialResults, initialQuery }) {
  const [results, setResults] = useState(initialResults);
  const [query, setQuery] = useState(initialQuery || '');
  const [pendingQuery, setPendingQuery] = useState(initialQuery || '');

  useEffect(() => {
    // Debounce: only search 400ms after user stops typing
    const handler = setTimeout(() => {
      if (pendingQuery.trim() === '') {
        setResults(initialResults);
        setQuery('');
        return;
      }
      fetch(`${import.meta.env.PUBLIC_API_URL}api/auth/search_similar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: pendingQuery, limit: 100 }),
      })
        .then(res => res.json())
        .then(data => {
          setResults(data.postData || []);
          setQuery(pendingQuery);
        });
    }, 400);

    return () => clearTimeout(handler);
    // eslint-disable-next-line
  }, [pendingQuery]);

  return (
    <div>
      <form onSubmit={e => e.preventDefault()} style={{ position: 'relative', display: 'flex', marginBottom: 24 }}>
        <span
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#aaa',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
          aria-hidden="true"
        >
          {/* Simple magnifying glass SVG */}
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/>
            <line x1="14.2" y1="14.2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          type="text"
          value={pendingQuery}
          onChange={e => setPendingQuery(e.target.value)}
          placeholder="Search..."
          style={{
            flexGrow: 1,
            padding: '10px 10px 10px 38px', // left padding for icon
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none',
          }}
        />
      </form>
      <div>
        {results.length === 0 ? (
          <p className="empty-state">No similar posts found.</p>
        ) : (
          results.map(post => (
            <PostCard
              key={post.id}
              post_title={post.title}
              username={post.username}
              karma="0"
              content={post.content}
              date={new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              post_id={post.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
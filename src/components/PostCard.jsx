import React from 'react';

export default function PostCard({ post_title, username, karma, content, date, post_id}) {
  // Truncate content to 150 characters and add "..." if longer
  const truncatedContent = content.length > 150 ? content.substring(0, 150) + "..." : content;

  return (
    <div style={{
      margin: '0 auto',
      maxWidth: '900px',
      padding: '15px 0',
      marginBottom: '15px',
      borderBottom: '1px solid #eee',
      transition: 'background-color 0.2s ease',
      cursor: 'pointer',
    }} onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#f8f4f0';
    }} onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    }}>
      <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '5px' }}><a href={`posts/${post_id}`} style={{ textDecoration: 'none', color: '#333' }} onMouseEnter={(e) => {
        e.currentTarget.style.color = '#666';
      }} onMouseLeave={(e) => {
        e.currentTarget.style.color = '#333';
      }}>
      {post_title}
    </a></div>
      <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '10px' }}>
        <a href={`/${username}`} style={{ textDecoration: 'none', color: '#555' }} onMouseEnter={(e) => {
          e.currentTarget.style.color = '#456650';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.color = '#555';
        }}>
          {username}
        </a> &bull; {karma} karma &bull; {date}
      </div>
      <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{truncatedContent}</div>
    </div>
  );
} 
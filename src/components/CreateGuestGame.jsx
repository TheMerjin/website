import { useState } from 'react';

export default function CreateGuestGame() {
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gameUrl, setGameUrl] = useState('');

  async function createGuestGame() {
    if (!guestName.trim()) {
      setError('Please enter a name for your guest opponent');
      return;
    }

    setLoading(true);
    setError('');
    setGameUrl('');

    try {
      const res = await fetch('/api/auth/user-data');
      const data = await res.json();
      const user = data.user;

      if (!user || !user.id) {
        setError('Please log in to create a game');
        setLoading(false);
        return;
      }

      const gameRequestRes = await fetch('/api/game_request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          white: user,
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          status: 'waiting',
          guest_opponent_name: guestName.trim(),
          is_guest_game: true,
        }),
      });

      const body = await gameRequestRes.json();

      if (!gameRequestRes.ok || !body.success) {
        setError(body.error || 'Failed to create game');
        setLoading(false);
        return;
      }

      const game = body.game[0];
      const url = `/chess/games/${game.id}`;
      setGameUrl(url);
      
      // Copy to clipboard
      const fullUrl = `${window.location.origin}${url}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
      } catch (e) {
        console.error('Failed to copy to clipboard:', e);
      }
    } catch (err) {
      setError('Something went wrong');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: '#fff4ec',
      border: '1px solid #e6e1d7',
      borderRadius: 0,
      padding: '1.5rem',
      margin: '1.5rem 0',
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: 600, color: '#333' }}>
        Challenge a Guest Player
      </h3>
      <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.95rem' }}>
        Create a correspondence chess game and share the link with anyone - no account needed!
      </p>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <input
          type="text"
          placeholder="Guest player name (e.g., Friend, Colleague)"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && createGuestGame()}
          style={{
            flex: 1,
            padding: '0.6rem',
            border: '1px solid #e6e1d7',
            fontSize: '0.95rem',
          }}
          disabled={loading}
        />
        <button
          onClick={createGuestGame}
          disabled={loading}
          style={{
            padding: '0.6rem 1.2rem',
            background: '#456650',
            color: '#fff4ec',
            border: '1px solid #456650',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Creating...' : 'Create Game'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#b00020', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {gameUrl && (
        <div style={{
          background: '#f8f4f0',
          border: '1px solid #e6e1d7',
          padding: '0.75rem',
          borderRadius: 0,
        }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
            Game created! Link copied to clipboard.
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a
              href={gameUrl}
              style={{
                color: '#456650',
                textDecoration: 'underline',
                fontSize: '0.9rem',
                wordBreak: 'break-all',
              }}
            >
              {window.location.origin}{gameUrl}
            </a>
            <button
              onClick={() => {
                const fullUrl = `${window.location.origin}${gameUrl}`;
                navigator.clipboard.writeText(fullUrl);
              }}
              style={{
                padding: '0.35rem 0.7rem',
                background: '#f8f4f0',
                border: '1px solid #e6e1d7',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


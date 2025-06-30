import { useEffect, useState } from 'react';
import {supabase} from "../lib/client-supabase.js"



export default function ChallengesRealtime() {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadGameRequests() {
    setLoading(true);
    try {
      const response = await fetch('/api/get_game_requests');
      const data = await response.json();
      if (data.error) {
        setError('Error loading challenges');
        setChallenges([]);
      } else {
        setChallenges(data.games || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load challenges');
      setChallenges([]);
    }
    setLoading(false);
  }

  async function joinGame(gameId) {
    try {
      const res = await fetch('/api/auth/user-data');
      const data = await res.json();
      const user = data.user;
      if (!user || !user.id) {
        alert('Please log in to join a game');
        return;
      }
      const response = await fetch('/api/join_game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, blackPlayer: user }),
      });
      if (response.ok) {
        loadGameRequests();
        alert('Game joined successfully!');
      } else {
        alert('Failed to join game');
      }
    } catch (error) {
      alert('Error joining game');
    }
  }

  useEffect(() => {
    console.log("NEW GAME LOADING!!!")
    loadGameRequests();
    const channel = supabase
      .channel('public:games')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'games' },
        payload => {
          console.log('Supabase Realtime event received:', payload);
          loadGameRequests();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="challenges-list" id="game-requests-list">
      {loading && <div className="loading">Loading challenges...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && challenges.length === 0 && (
        <div className="no-games">No challenges available</div>
      )}
      {!loading && !error && challenges.map((game) => (
        <div
          className="challenge-row"
          tabIndex={0}
          data-game-id={game.id}
          key={game.id}
          onClick={() => joinGame(game.id)}
        >
          <span className="challenge-player">{game.white?.username || 'Anonymous'}</span>
        </div>
      ))}
    </div>
  );
} 
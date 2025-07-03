import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/get_leaderboard', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setPlayers(data.players || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 2000) return '#28a745'; // Excellent - Green
    if (rating >= 1600) return '#17a2b8'; // Good - Blue
    if (rating >= 1200) return '#ffc107'; // Average - Yellow
    return '#6c757d'; // Beginner - Gray
  };

  const getRankBadge = (rank) => `#${rank}`;

  const LeaderboardHeader = () => (
    <div className="leaderboard-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.2rem 1.5rem 0.5rem 1.5rem'}}>
      <h3 style={{margin:0,fontWeight:700,fontSize:'1.3rem',color:'#222',fontFamily:'Inter, sans-serif',letterSpacing:'-0.5px'}}>Leaderboard</h3>
              <button className="refresh-btn" onClick={fetchLeaderboard} style={{background:'none',border:'none',fontSize:'1.2rem',cursor:'pointer',color:'#888',borderRadius:'0',padding:'0.2rem 0.5rem',transition:'background 0.2s'}} title="Refresh">
        ↻
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="leaderboard-container lesswrong-leaderboard">
        <LeaderboardHeader />
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading rankings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container lesswrong-leaderboard">
        <LeaderboardHeader />
        <div className="error-state">
          <span>{error}</span>
          <button className="retry-btn" onClick={fetchLeaderboard}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container lesswrong-leaderboard">
      <LeaderboardHeader />
      <div className="leaderboard-table-wrapper">
        <div className="leaderboard-table">
          <div className="leaderboard-row leaderboard-header-row">
            <div className="leaderboard-col rank-col">Rank</div>
            <div className="leaderboard-col user-col">Username</div>
            <div className="leaderboard-col games-col">Games</div>
            <div className="leaderboard-col elo-col">ELO</div>
          </div>
          {players.length === 0 ? (
            <div className="empty-state">
              <span>No players found</span>
            </div>
          ) : (
            players.map((player, index) => (
              <div key={player.id} className="leaderboard-row">
                <div className="leaderboard-col rank-col">{index + 1}</div>
                <div className="leaderboard-col user-col">{player.username || 'Anonymous'}</div>
                <div className="leaderboard-col games-col">{player.games_played || 0}</div>
                <div 
                  className="leaderboard-col elo-col"
                  style={{ color: getRatingColor(player.skill_mean), fontWeight: 700, textAlign: 'right' }}
                >
                  {Math.round(player.skill_mean || 1500)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <style jsx>{`
        .lesswrong-leaderboard {
          background: #f8f4f0;
          border: 1px solid #e6e1d7;
          border-radius: 0;
          box-shadow: 0 4px 24px 0 rgba(60,60,60,0.10);
          width: 100%;
          max-width: none;
          margin: 0;
          padding-bottom: 1.5rem;
        }
        .leaderboard-table-wrapper {
          overflow-x: auto;
        }
        .leaderboard-table {
          width: 100%;
          min-width: 350px;
          margin-top: 0.5rem;
        }
        .leaderboard-row {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #ececec;
          transition: background 0.18s;
          background: none;
        }
        .leaderboard-row:last-child {
          border-bottom: none;
        }
        .leaderboard-row:hover:not(.leaderboard-header-row) {
          background: #f3ede6;
        }
        .leaderboard-header-row {
          background: #f5f3ef;
          font-weight: 600;
          color: #555;
          font-size: 1.01rem;
          border-bottom: 2px solid #e6e1d7;
        }
        .leaderboard-col {
          padding: 0.7rem 0.7rem;
          font-size: 1.05rem;
          font-family: 'Inter', sans-serif;
          color: #222;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rank-col {
          flex: 0.5;
          text-align: right;
          color: #888;
        }
        .user-col {
          flex: 2.2;
          text-align: left;
        }
        .games-col {
          flex: 1.1;
          text-align: right;
          color: #888;
        }
        .elo-col {
          flex: 1.1;
          text-align: right;
        }
        .loading-state, .error-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          color: #6c757d;
          font-size: 0.98rem;
        }
        .loading-spinner {
          width: 22px;
          height: 22px;
          border: 2px solid #e9ecef;
          border-top: 2px solid #6c757d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 0.7rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .retry-btn {
          background: #456650;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0;
          font-size: 0.9rem;
          cursor: pointer;
          margin-top: 0.7rem;
          transition: background-color 0.2s;
        }
        .retry-btn:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
} 
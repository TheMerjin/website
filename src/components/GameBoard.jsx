import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/client-supabase.js';

export default function GameBoard({ initialFen, onMove, gameId, currentUserId, whiteUsername, blackUsername }) {
  const [moves, setMoves] = useState([]);
  const [whiteProfile, setWhiteProfile] = useState(null);
  const [blackProfile, setBlackProfile] = useState(null);
  // Validate and sanitize the FEN string
  const sanitizeFen = (fen) => {
    if (!fen || fen === 'startpos') {
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
    return fen;
  };

  // Helper function to calculate skill display
  const getSkillDisplay = (profile) => {
    if (!profile) return { skill: 'N/A', confidence: 'N/A', color: '#666' };
    
    const skill = profile.skill_mean || 25.0;
    const variance = profile.skill_variance || 8.3333;
    const confidence = Math.sqrt(variance);
    
    // Color coding based on skill level
    let color = '#666'; // default gray
    if (skill >= 30) color = '#28a745'; // green for high skill
    else if (skill >= 25) color = '#17a2b8'; // blue for medium-high
    else if (skill >= 20) color = '#ffc107'; // yellow for medium
    else color = '#dc3545'; // red for low skill
    
    return {
      skill: skill.toFixed(1),
      confidence: confidence.toFixed(1),
      color
    };
  };

  const [game, setGame] = useState(() => {
    try {
      return new Chess(sanitizeFen(initialFen));
    } catch (error) {
      console.error('Invalid FEN string:', initialFen, error);
      return new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }
  });
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [userData, setUserData] = useState(null);
  const [winner, setWinner] = useState(null);

  // Fetch initial game state and user info
  useEffect(() => {
    if (!gameId) {
      console.log('Missing gameId:', { gameId });
      return;
    }

    // If currentUserId is not provided, fetch user data from client side
    const fetchUserData = async () => {
      try {
        // For guest games, check localStorage first
        if (isGuestGame) {
          const guestInfo = localStorage.getItem(`chess_guest_${gameId}`);
          if (guestInfo) {
            try {
              const { name, color } = JSON.parse(guestInfo);
              setCurrentPlayer(color);
              setIsMyTurn((color === 'white' && game.turn() === 'w') || (color === 'black' && game.turn() === 'b'));
              // For guests, we'll allow moves based on turn only
              return;
            } catch (e) {
              console.error('Error parsing guest info:', e);
            }
          }
        }

        const res = await fetch('/api/auth/user-data');
        const data = await res.json();
        const user = data.user;
        
        if (!user) {
          console.log('No user data available - user not logged in');
          // For guest games, still allow viewing
          if (isGuestGame) {
            setCurrentPlayer(null); // Viewer mode
          }
          return;
        }

        console.log('User data received:', user);
        console.log('White username:', whiteUsername);
        console.log('Black username:', blackUsername);
        
        setUserData(user);

        // Determine if user is white or black
        const isWhite = user.user_metadata?.username === whiteUsername;
        const isBlack = user.user_metadata?.username === blackUsername;
        
        console.log('Is white:', isWhite);
        console.log('Is black:', isBlack);
        console.log('User username:', user.user_metadata?.username);
        
        if (!isWhite && !isBlack) {
          console.log('User is not a player in this game');
          setCurrentPlayer(null);
          return;
        }

        // Set the current player
        const playerColor = isWhite ? 'white' : 'black';
        setCurrentPlayer(playerColor);
        console.log('Set current player to:', playerColor);

        // Check whose turn it is based on FEN
        const currentTurn = game.turn(); // 'w' for white, 'b' for black
        const myTurn = (isWhite && currentTurn === 'w') || (isBlack && currentTurn === 'b');
        
        setIsMyTurn(myTurn);
        console.log('Set isMyTurn to:', myTurn);
        
        // Fetch initial game state
        const fetchGameState = async () => {
          try {
            const response = await fetch(`/api/get_game_state?gameId=${gameId}`);
            const data = await response.json();
            if (data.success && data.game) {
              setMoves(data.game.moves || []);
              if (data.game.fen && data.game.fen !== game.fen()) {
                setGame(new Chess(sanitizeFen(data.game.fen)));
              }
            }
          } catch (error) {
            console.error('Error fetching game state:', error);
          }
        };
        
        fetchGameState();
        
        // Fetch player profiles for skill display
        const fetchPlayerProfiles = async () => {
          try {
            const [whiteRes, blackRes] = await Promise.all([
              fetch(`/api/get_profile?username=${whiteUsername}`),
              fetch(`/api/get_profile?username=${blackUsername}`)
            ]);
            
            const whiteData = await whiteRes.json();
            const blackData = await blackRes.json();
            
            if (whiteData.success) setWhiteProfile(whiteData.profile);
            if (blackData.success) setBlackProfile(blackData.profile);
          } catch (error) {
            console.error('Error fetching player profiles:', error);
          }
        };
        
        fetchPlayerProfiles();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [gameId, whiteUsername, blackUsername]);

  // Subscribe to game updates
  useEffect(() => {
    if (!gameId || !userData) return;

    const channel = supabase
      .channel(`game:${gameId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'games', 
          filter: `id=eq.${gameId}` 
        }, 
        (payload) => {
          console.log('Game updated:', payload);
          const newFen = payload.new.fen;
          const newMoves = payload.new.moves || [];
          
          if (newFen) {
            try {
              setGame(new Chess(sanitizeFen(newFen)));
            } catch (error) {
              console.error('Invalid FEN in update:', newFen, error);
            }
            
            // Update moves
            setMoves(newMoves);
            
            // Update turn status
            const updatedGame = new Chess(newFen);
            const currentTurn = updatedGame.turn();
            const isWhite = userData.user_metadata?.username === whiteUsername;
            const isBlack = userData.user_metadata?.username === blackUsername;
            const myTurn = (isWhite && currentTurn === 'w') || (isBlack && currentTurn === 'b');
            setIsMyTurn(myTurn);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, userData?.id]); // Only depend on gameId and userData.id

  // Winner detection effect
  useEffect(() => {
    const checkGameEnd = async () => {
    if (game.isCheckmate()) {
      // The winner is the OPPOSITE of the current turn
      const winnerColor = game.turn() === 'w' ? 'Black' : 'White';
      const response = await fetch('/api/game_over', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          fen: game.fen(), // Standard Algebraic Notation
          currentUserId: userData?.id,
          result : `Win: ${winnerColor}`,
          winnerColor : winnerColor

        }),
      });
      
      console.log(response);

      setWinner(winnerColor);
          } else if (game.isDraw()) {
        const response = await fetch('/api/game_over', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          fen: game.fen(), // Standard Algebraic Notation
          currentUserId: userData?.id,
          result : `Draw`,
          winnerColor : null

        }),
              });
        const body2 = await response.json();
      console.log(body2);
      setWinner('Draw');

          } else {
        setWinner(null);
      }
    };
    
    checkGameEnd();
  }, [game.fen(), gameId, userData?.id]);

  function makeMove(sourceSquare, targetSquare) {
    // For guest games, check if it's the guest's turn
    if (isGuestGame && !userData) {
      const guestInfo = localStorage.getItem(`chess_guest_${gameId}`);
      if (guestInfo) {
        const { color } = JSON.parse(guestInfo);
        const currentTurn = game.turn();
        const guestTurn = (color === 'white' && currentTurn === 'w') || (color === 'black' && currentTurn === 'b');
        if (!guestTurn) {
          console.log("It's not your turn!");
          return false;
        }
      } else {
        console.log("Guest info not found");
        return false;
      }
    } else {
      // For regular games, check if it's the user's turn
      if (!isMyTurn) {
        console.log("It's not your turn!");
        return false;
      }
      
      // Also check if user is actually a player
      if (!currentPlayer) {
        console.log("You are not a player in this game");
        return false;
      }
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move) {
      const newFen = game.fen();
      
      // Update turn status immediately for better UX
      setIsMyTurn(false);
      
      // Send move to backend - let the real-time subscription handle the board update
      updateGameInBackend(game, newFen, move);
      
      if (onMove) {
        onMove(move, newFen);
      }
    }

    return move != null;
  }

  async function updateGameInBackend(game,newFen, move) {
    
    try {
      // For guest games, we might not have userData
      const userId = userData?.id || null;
      
      const response = await fetch('/api/update_game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          fen: newFen,
          move: move.san, // Standard Algebraic Notation
          currentUserId: userId
        }),
      });
      const body = await response.json();
      setMoves(body.moves || []);
      console.log(body.moves);
      if (!response.ok) {
        console.error('Failed to update game');
      }
    } catch (error) {
      console.error('Error updating game:', error);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div>
        {/* Winner message */}
        {winner && (
          <div style={{
            margin: '1rem 0',
            padding: '1rem',
            background: winner === 'Draw' ? '#ffeeba' : '#d4edda',
            color: '#155724',
            borderRadius: '6px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {winner === 'Draw' ? 'Game drawn!' : `Checkmate! ${winner} wins!`}
          </div>
        )}
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.75rem 1rem', 
          backgroundColor: isMyTurn ? '#e8f5e8' : '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '0.9rem',
          color: '#333'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Current Turn:</strong> {game.turn() === 'w' ? 'White' : 'Black'}
            </div>
            <div>
              <strong>Your Color:</strong> {currentPlayer ? currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1) : 'Unknown'}
            </div>
            <div style={{ 
              padding: '0.25rem 0.5rem', 
              backgroundColor: isMyTurn ? '#28a745' : '#dc3545', 
              color: 'white', 
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {isMyTurn ? 'Your Turn' : 'Opponent\'s Turn'}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Chessboard 
            position={game.fen()} 
            onPieceDrop={makeMove}
            boardOrientation={currentPlayer === 'black' ? 'black' : 'white'}
            boardWidth={400}
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ 
          background: '#f8f9fa', 
          border: '1px solid #e9ecef', 
          borderRadius: '6px', 
          padding: '1rem' 
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#333' }}>
            Move History
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem', 
            maxHeight: '200px', 
            overflowY: 'auto' 
          }}>
            {moves.length > 0 ? (
              moves.map((move, index) => (
                <span key={index} style={{ 
                  fontFamily: 'Courier New, monospace', 
                  fontSize: '0.9rem', 
                  color: '#333', 
                  padding: '0.25rem 0' 
                }}>
                  {Math.floor(index / 2) + 1}. {move}
                </span>
              ))
            ) : (
              <div style={{ color: '#666', fontStyle: 'italic' }}>No moves yet</div>
            )}
          </div>
        </div>
        
        {/* Player Skills Section */}
        <div style={{ 
          background: '#f8f9fa', 
          border: '1px solid #e9ecef', 
          borderRadius: '6px', 
          padding: '1rem' 
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#333' }}>
            Player Skills
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* White Player */}
            <div style={{ 
              background: 'white', 
              border: '2px solid #ddd', 
              borderRadius: '6px', 
              padding: '0.75rem',
              borderLeft: '4px solid #fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: '#333' }}>⚪ {whiteUsername}</span>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: getSkillDisplay(whiteProfile).color, 
                  color: 'white', 
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {getSkillDisplay(whiteProfile).skill}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                <span>Skill: {getSkillDisplay(whiteProfile).skill}</span>
                <span>±{getSkillDisplay(whiteProfile).confidence}</span>
              </div>
            </div>
            
            {/* Black Player */}
            <div style={{ 
              background: 'white', 
              border: '2px solid #ddd', 
              borderRadius: '6px', 
              padding: '0.75rem',
              borderLeft: '4px solid #000'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: '#333' }}>⚫ {blackUsername}</span>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  backgroundColor: getSkillDisplay(blackProfile).color, 
                  color: 'white', 
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {getSkillDisplay(blackProfile).skill}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
                <span>Skill: {getSkillDisplay(blackProfile).skill}</span>
                <span>±{getSkillDisplay(blackProfile).confidence}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ 
          background: '#f8f9fa', 
          border: '1px solid #e9ecef', 
          borderRadius: '6px', 
          padding: '1rem' 
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#333' }}>
            Game Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '600', color: '#333' }}>FEN:</span>
              <span style={{ 
                color: '#666', 
                fontFamily: 'Courier New, monospace', 
                fontSize: '0.8rem', 
                wordBreak: 'break-all' 
              }}>
                {game.fen()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '600', color: '#333' }}>Moves:</span>
              <span style={{ color: '#666' }}>{game.history().length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '600', color: '#333' }}>Status:</span>
              <span style={{ color: '#666' }}>
                {game.isCheckmate() ? 'Checkmate' : 
                 game.isDraw() ? 'Draw' : 
                 game.isCheck() ? 'Check' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
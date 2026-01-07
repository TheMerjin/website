import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function PuzzleSolver() {
  const [puzzle, setPuzzle] = useState(null);
  const [game, setGame] = useState(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [rating, setRating] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Fetch a random puzzle from Lichess API via our proxy
  const fetchPuzzle = async () => {
    setIsLoading(true);
    setFeedback('');
    setIsSolved(false);
    setCurrentMoveIndex(0);
    setAttempts(0);
    setShowHint(false);
    
    try {
      // Fetch puzzle through our API endpoint to avoid CORS issues
      const response = await fetch('/api/chess/puzzle');
      if (!response.ok) {
        throw new Error('Failed to fetch puzzle');
      }
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      console.log('Puzzle API response:', data);
      
      // Handle Lichess API response structure
      // Daily puzzle: { game: {...}, puzzle: { id, rating, plays, initialPly, solution, themes } }
      // Random puzzle: { puzzle: { id, rating, plays, initialPly, solution, themes }, game: {...} }
      const puzzleData = data.puzzle;
      const gameData = data.game;
      
      if (!puzzleData) {
        console.error('Unexpected API response structure:', JSON.stringify(data, null, 2));
        throw new Error('Puzzle data not found in response');
      }
      
      // Lichess puzzle structure: solution is an array of UCI moves
      if (!puzzleData.solution || !Array.isArray(puzzleData.solution) || puzzleData.solution.length === 0) {
        console.error('Invalid puzzle solution:', puzzleData);
        throw new Error('Puzzle solution not found or invalid');
      }
      
      console.log('Puzzle data:', {
        rating: puzzleData.rating,
        solutionLength: puzzleData.solution.length,
        themes: puzzleData.themes,
        initialPly: puzzleData.initialPly,
        gameData: gameData
      });
      
      // Get initial FEN - Lichess puzzle API structure:
      // The puzzle position is AFTER the opponent's move (before the player's first move in solution)
      // We need to reconstruct the position from the game PGN
      let initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      
      // Try to get FEN from game data (some endpoints provide this)
      if (gameData?.fen) {
        initialFen = gameData.fen;
      } else if (puzzleData.fen) {
        // Some puzzle endpoints provide FEN directly
        initialFen = puzzleData.fen;
      } else if (gameData?.pgn) {
        // Reconstruct from PGN - play moves up to initialPly
        try {
          const tempGame = new Chess();
          const initialPly = puzzleData.initialPly || 0;
          
          // Parse PGN - extract moves from the moves section
          const pgnText = typeof gameData.pgn === 'string' ? gameData.pgn : JSON.stringify(gameData.pgn);
          const movesSection = pgnText.split('\n\n')[1] || pgnText; // Get moves section after headers
          
          // Extract moves using regex: "1. e4 e5 2. Nf3 Nc6" etc.
          const moveMatches = Array.from(movesSection.matchAll(/\d+\.\s+(\S+)(?:\s+(\S+))?/g));
          const allMoves = [];
          
          for (const match of moveMatches) {
            if (match[1]) allMoves.push(match[1]);
            if (match[2]) allMoves.push(match[2]);
          }
          
          // Play moves up to initialPly (which is the position before the puzzle starts)
          for (let i = 0; i < Math.min(initialPly, allMoves.length); i++) {
            try {
              tempGame.move(allMoves[i], { sloppy: true });
            } catch (e) {
              console.warn(`Failed to play move ${i} (${allMoves[i]}):`, e);
            }
          }
          
          initialFen = tempGame.fen();
          console.log(`Reconstructed FEN from PGN: played ${Math.min(initialPly, allMoves.length)} moves`);
        } catch (e) {
          console.warn('Failed to reconstruct FEN from PGN:', e);
        }
      }
      
      // Construct puzzle object with moves array
      // Lichess solution is alternating: [playerMove1, opponentMove1, playerMove2, opponentMove2, ...]
      const puzzleObj = {
        fen: initialFen,
        moves: puzzleData.solution, // Array of UCI moves
        rating: puzzleData.rating,
        themes: puzzleData.themes || [],
        initialPly: puzzleData.initialPly || 0
      };
      
      console.log('Initial FEN:', initialFen);
      
      setPuzzle(puzzleObj);
      setRating(puzzleData.rating || null);
      
      // Initialize game at the puzzle position
      const newGame = new Chess(initialFen);
      setGame(newGame);
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      setFeedback('Failed to load puzzle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, []);

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    if (!game || !puzzle || !puzzle.moves || !Array.isArray(puzzle.moves) || isSolved) return false;

    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });

    if (!move) return false;

    // Check if this is the correct move
    // Lichess puzzles have moves in UCI format (e.g., "e2e4"), so we need to compare UCI
    const expectedMoveUCI = puzzle.moves[currentMoveIndex * 2]; // Even indices are player moves
    if (!expectedMoveUCI) return false;
    const moveUCI = move.from + move.to + (move.promotion || '');
    const isCorrect = moveUCI === expectedMoveUCI || move.san === expectedMoveUCI;

    if (isCorrect) {
      // Make the opponent's response move automatically
      if (currentMoveIndex * 2 + 1 < puzzle.moves.length) {
        const opponentMoveUCI = puzzle.moves[currentMoveIndex * 2 + 1];
        const opponentMove = gameCopy.move({
          from: opponentMoveUCI.substring(0, 2),
          to: opponentMoveUCI.substring(2, 4),
          promotion: opponentMoveUCI.length > 4 ? opponentMoveUCI[4] : undefined
        });
        if (opponentMove) {
          setGame(gameCopy);
        }
      } else {
        setGame(gameCopy);
      }
      
      setCurrentMoveIndex(prev => prev + 1);
      setAttempts(0);
      setShowHint(false);
      
      // Check if puzzle is complete (all player moves found)
      const totalPlayerMoves = Math.ceil(puzzle.moves.length / 2);
      if (currentMoveIndex + 1 >= totalPlayerMoves) {
        setIsSolved(true);
        setFeedback('🎉 Puzzle solved! Great job!');
      } else {
        setFeedback('✓ Correct! Now find the next move...');
        setTimeout(() => setFeedback(''), 1500);
      }
    } else {
      setAttempts(prev => prev + 1);
      setFeedback(`✗ Not quite. Try again! (Attempt ${attempts + 1})`);
      setTimeout(() => setFeedback(''), 2000);
    }

    return true;
  };

  const resetPuzzle = () => {
    if (puzzle) {
      const newGame = new Chess(puzzle.fen);
      setGame(newGame);
      setCurrentMoveIndex(0);
      setFeedback('');
      setIsSolved(false);
      setAttempts(0);
      setShowHint(false);
    }
  };

  const getHint = () => {
    if (!puzzle || !puzzle.moves || !Array.isArray(puzzle.moves) || isSolved) return;
    const expectedMoveUCI = puzzle.moves[currentMoveIndex * 2];
    if (!expectedMoveUCI) return;
    // Convert UCI to readable format for hint
    const fromSquare = expectedMoveUCI.substring(0, 2);
    const toSquare = expectedMoveUCI.substring(2, 4);
    setShowHint(true);
    setFeedback(`Hint: Move from ${fromSquare} to ${toSquare}`);
  };

  if (isLoading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        color: '#666',
        fontSize: '1.1rem'
      }}>
        Loading puzzle...
      </div>
    );
  }

  if (!puzzle || !game || !puzzle.moves || !Array.isArray(puzzle.moves) || puzzle.moves.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        color: '#666'
      }}>
        <p>Failed to load puzzle.</p>
        <button 
          onClick={fetchPuzzle}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: '#456650',
            color: '#fff4ec',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      background: '#f8f4f0',
      border: '1px solid #e6e1d7',
      borderRadius: '8px',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ 
            margin: '0 0 0.5rem 0',
            color: '#333',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>
            {isSolved ? 'Puzzle Solved!' : 'Solve the Puzzle'}
          </h2>
          {rating && puzzle?.moves && Array.isArray(puzzle.moves) && puzzle.moves.length > 0 && (
            <p style={{ 
              margin: 0,
              color: '#666',
              fontSize: '0.9rem'
            }}>
              Rating: {rating} • Move {currentMoveIndex + 1} of {Math.ceil(puzzle.moves.length / 2)}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={getHint}
            disabled={isSolved || showHint}
            style={{
              padding: '0.5rem 1rem',
              background: showHint ? '#e6e1d7' : '#fff4ec',
              color: '#456650',
              border: '1px solid #e6e1d7',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: showHint || isSolved ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              opacity: showHint || isSolved ? 0.6 : 1
            }}
          >
            {showHint ? 'Hint Used' : 'Hint'}
          </button>
          <button
            onClick={resetPuzzle}
            style={{
              padding: '0.5rem 1rem',
              background: '#fff4ec',
              color: '#456650',
              border: '1px solid #e6e1d7',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600
            }}
          >
            Reset
          </button>
          <button
            onClick={fetchPuzzle}
            style={{
              padding: '0.5rem 1rem',
              background: '#456650',
              color: '#fff4ec',
              border: '1px solid #456650',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600
            }}
          >
            New Puzzle
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <Chessboard
          position={game.fen()}
          boardWidth={typeof window !== 'undefined' ? Math.min(500, window.innerWidth - 100) : 500}
          onPieceDrop={handlePieceDrop}
          arePiecesDraggable={!isSolved}
        />
      </div>

      {feedback && (
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          marginBottom: '1rem',
          background: feedback.includes('✓') || feedback.includes('🎉') 
            ? '#e8f5e9' 
            : feedback.includes('✗') 
            ? '#ffebee' 
            : '#fff3e0',
          color: feedback.includes('✓') || feedback.includes('🎉')
            ? '#2e7d32'
            : feedback.includes('✗')
            ? '#c62828'
            : '#e65100',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 600,
          border: `1px solid ${feedback.includes('✓') || feedback.includes('🎉') 
            ? '#a5d6a7' 
            : feedback.includes('✗') 
            ? '#ef9a9a' 
            : '#ffcc80'}`
        }}>
          {feedback}
        </div>
      )}

      {isSolved && (
        <div style={{
          textAlign: 'center',
          padding: '1.5rem',
          background: '#e8f5e9',
          borderRadius: '4px',
          border: '1px solid #a5d6a7',
          marginTop: '1rem'
        }}>
          <p style={{ 
            margin: '0 0 1rem 0',
            color: '#2e7d32',
            fontSize: '1.1rem',
            fontWeight: 600
          }}>
            Congratulations! You solved the puzzle!
          </p>
          <button
            onClick={fetchPuzzle}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#456650',
              color: '#fff4ec',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600
            }}
          >
            Try Another Puzzle
          </button>
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#f5f3ef',
        borderRadius: '4px',
        border: '1px solid #e6e1d7',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#333' }}>
          How to play:
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Find the best move in the position</li>
          <li>Drag and drop pieces to make your move</li>
          <li>You'll need to find all moves in the sequence to solve the puzzle</li>
          <li>Use the hint button if you're stuck</li>
        </ul>
      </div>
    </div>
  );
}

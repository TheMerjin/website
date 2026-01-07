import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Try to fetch daily puzzle first
    let response = await fetch('https://lichess.org/api/puzzle/daily');
    
    // If daily puzzle fails, try random puzzle endpoint
    if (!response.ok) {
      // Fetch a random puzzle instead (rated around 1500-2000)
      const rating = Math.floor(Math.random() * 500) + 1500;
      response = await fetch(`https://lichess.org/api/puzzle?rating=${rating}`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch puzzle from Lichess: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If we have game data with an ID, try to get the game PGN to reconstruct position
    if (data.game?.id && data.puzzle?.initialPly !== undefined) {
      try {
        const gameResponse = await fetch(`https://lichess.org/game/export/${data.game.id}?pgnInJson=true`);
        if (gameResponse.ok) {
          const gameExport = await gameResponse.json();
          data.game.pgn = gameExport.pgn;
        }
      } catch (e) {
        console.warn('Failed to fetch game PGN:', e);
      }
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Error fetching puzzle:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

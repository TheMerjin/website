import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const fen = url.searchParams.get('fen');
  
  if (!fen) {
    return new Response('Missing fen parameter', { status: 400 });
  }

  // Proxy chess.com's board image API - this ensures the image is served from our domain
  // which helps with Discord embeds and CORS issues
  const chessComUrl = `https://www.chess.com/dynboard?fen=${encodeURIComponent(fen)}&size=2&coordinates=1`;
  
  try {
    const response = await fetch(chessComUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch board image');
    }
    
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response('Failed to generate board image', { status: 500 });
  }
};


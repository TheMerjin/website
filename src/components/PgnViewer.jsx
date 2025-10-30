import { useEffect, useRef } from 'react';

export default function PgnViewer({ pgn, boardSize = 'large', pieceStyle = 'merida' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      if (!containerRef.current || !pgn) return;
      try {
        // Load library and CSS only on client
        const mod = await import('@mliebelt/pgn-viewer');
        await import('@mliebelt/pgn-viewer/dist/pgnvjs.css');
        if (isCancelled) return;
        const { pgnView } = mod;
        pgnView(containerRef.current, {
          pgn,
          boardSize,
          pieceStyle,
          locale: 'en',
          showResult: true,
          notation: 'short',
          headers: true,
          showAnnotations: true,
          movable: true,
          autoplayTimer: 1000,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load PGN viewer:', e);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [pgn, boardSize, pieceStyle]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div ref={containerRef} />
    </div>
  );
}



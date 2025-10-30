import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const pgn = body?.pgn?.toString() || '';
    const White = body?.White?.toString() || '';
    const Black = body?.Black?.toString() || '';

    if (!pgn || !White || !Black) {
      return new Response(JSON.stringify({ success: false, error: 'Missing pgn, White, or Black' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate a random 8-9 digit numeric id and retry on rare collision
    function makeId() {
      return Math.floor(10000000 + Math.random() * 90000000); // 8-digit
    }

    let createdId: number | null = null;
    let lastErr: any = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const id = makeId();
      const { error } = await supabase
        .from('sreekgames')
        .insert([{ id, pgn, White, Black }]);
      if (!error) {
        createdId = id;
        break;
      }
      lastErr = error;
      // 23505 = unique_violation
      if (error?.code !== '23505') break;
    }

    if (!createdId) {
      return new Response(JSON.stringify({ success: false, error: lastErr?.message || 'Insert failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, id: createdId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};



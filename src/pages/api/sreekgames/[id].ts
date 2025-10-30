import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Missing id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const pgn = body?.pgn?.toString();
    const White = body?.White?.toString();
    const Black = body?.Black?.toString();

    const update: Record<string, any> = {};
    if (typeof pgn === 'string') update.pgn = pgn;
    if (typeof White === 'string') update.White = White;
    if (typeof Black === 'string') update.Black = Black;

    if (Object.keys(update).length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabase
      .from('sreekgames')
      .update(update)
      .eq('id', id);

    if (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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



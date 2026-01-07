import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase.js';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const { data, error } = await supabase
      .from('errors')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching errors:', error);
      return new Response(JSON.stringify({ error: error.message, errors: [] }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ errors: data || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', errors: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { date, what_went_wrong, why, fix } = body;

    if (!date || !what_went_wrong) {
      return new Response(JSON.stringify({ error: 'Missing required fields: date, what_went_wrong' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase
      .from('errors')
      .insert({
        date,
        what_went_wrong,
        why: why || null,
        fix: fix || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating error log entry:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

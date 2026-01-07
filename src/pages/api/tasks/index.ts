import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase.js';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      return new Response(JSON.stringify({ error: error.message, tasks: [] }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ tasks: data || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', tasks: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { class: class_name, item, type, due_date, status, link, notes, est_time, time_left } = body;

    if (!item || !due_date) {
      return new Response(JSON.stringify({ error: 'Missing required fields: item, due_date' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const userId = user.id;
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        class: class_name,
        item,
        type: type || null,
        due_date,
        status: status || 'To Do',
        link: link || null,
        notes: notes || null,
        est_time: est_time || null,
        time_left: time_left !== undefined ? time_left : (est_time || null),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ task: data }), {
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

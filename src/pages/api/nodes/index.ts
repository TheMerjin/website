import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const topicId = searchParams.get('topic_id');
    const type = searchParams.get('type');
    
    if (!topicId) {
      return new Response(JSON.stringify({ error: 'Topic ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let query = supabase
      .from('nodes')
      .select(`
        *,
        evidence(id, description, credibility, created_at)
      `)
      .eq('topic_id', topicId)
      .eq('public', true);

    if (type) {
      query = query.eq('type', type);
    }

    const { data: nodes, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching nodes:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch nodes' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(nodes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in nodes API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { topic_id, type, content, weight = 0 } = body;

    if (!topic_id || !type || !content) {
      return new Response(JSON.stringify({ 
        error: 'Topic ID, type, and content are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!['claim', 'connection'].includes(type)) {
      return new Response(JSON.stringify({ 
        error: 'Type must be either "claim" or "connection"' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For now, don't set created_by to avoid foreign key constraint
    // In a real app, you'd get this from the authenticated user
    const { data: node, error } = await supabase
      .from('nodes')
      .insert({
        topic_id,
        type,
        content,
        weight
        // created_by will be null for now
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating node:', error);
      return new Response(JSON.stringify({ error: 'Failed to create node' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(node), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating node:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const topicId = searchParams.get('topic_id');
    
    if (!topicId) {
      return new Response(JSON.stringify({ error: 'Topic ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // First get all nodes for this topic
    const { data: nodes, error: nodesError } = await supabase
      .from('nodes')
      .select('id')
      .eq('topic_id', topicId);

    if (nodesError) {
      throw nodesError;
    }

    const nodeIds = nodes.map(n => n.id);

    if (nodeIds.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: edges, error } = await supabase
      .from('edges')
      .select(`
        *,
        parent_node:nodes!edges_parent_node_fkey(id, content, type, weight),
        child_node:nodes!edges_child_node_fkey(id, content, type, weight)
      `)
      .in('parent_node', nodeIds)
      .in('child_node', nodeIds);

    if (error) {
      console.error('Error fetching edges:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch edges' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(edges || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in edges API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { parent_node, child_node, type, weight = 1 } = body;

    if (!parent_node || !child_node || !type) {
      return new Response(JSON.stringify({ 
        error: 'Parent node, child node, and type are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!['support', 'oppose', 'follows', 'challenges'].includes(type)) {
      return new Response(JSON.stringify({ 
        error: 'Type must be one of: support, oppose, follows, challenges' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (parent_node === child_node) {
      return new Response(JSON.stringify({ 
        error: 'Cannot create edge from node to itself' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if edge already exists
    const { data: existingEdge } = await supabase
      .from('edges')
      .select('id')
      .eq('parent_node', parent_node)
      .eq('child_node', child_node)
      .eq('type', type)
      .single();

    if (existingEdge) {
      return new Response(JSON.stringify({ 
        error: 'Edge already exists' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: edge, error } = await supabase
      .from('edges')
      .insert({
        parent_node,
        child_node,
        type,
        weight
      })
      .select(`
        *,
        parent_node:nodes!edges_parent_node_fkey(id, content, type, weight),
        child_node:nodes!edges_child_node_fkey(id, content, type, weight)
      `)
      .single();

    if (error) {
      console.error('Error creating edge:', error);
      return new Response(JSON.stringify({ error: 'Failed to create edge' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(edge), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating edge:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

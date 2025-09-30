import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Topic ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: topic, error } = await supabase
      .from('topics')
      .select(`
        *,
        nodes(
          id,
          type,
          content,
          weight,
          created_at,
          created_by,
          evidence(
            id,
            description,
            credibility,
            created_at
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching topic:', error);
      return new Response(JSON.stringify({ error: 'Topic not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch edges for this topic
    let edges = [];
    if (topic.nodes && topic.nodes.length > 0) {
      const nodeIds = topic.nodes.map(n => n.id);
      const { data: edgesData, error: edgesError } = await supabase
        .from('edges')
        .select(`
          *,
          parent_node:nodes!edges_parent_node_fkey(id, content, type),
          child_node:nodes!edges_child_node_fkey(id, content, type)
        `)
        .in('parent_node', nodeIds)
        .in('child_node', nodeIds);
      
      if (edgesError) {
        console.error('Error fetching edges:', edgesError);
      } else {
        edges = edgesData || [];
      }
    }

    return new Response(JSON.stringify({
      ...topic,
      edges: edges || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in topic API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

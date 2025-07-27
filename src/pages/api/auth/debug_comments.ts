import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase.js';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const post_id = url.searchParams.get('post_id');
    if (!post_id) {
      return new Response(JSON.stringify({ error: 'Missing post_id' }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at')
      .eq('post_id', post_id)
      .limit(5);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ 
      comments: data,
      sample_comment: data[0] ? {
        id: data[0].id,
        id_type: typeof data[0].id,
        id_length: data[0].id ? data[0].id.toString().length : 0
      } : null
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}; 
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    console.log("called");
    const body = await request.json();
    console.log(body);
  const { comment_id, tag } = body;

  if (!comment_id || !tag) {
    return new Response(JSON.stringify({ error: 'Missing comment_id or tag' }), {
      status: 400,
    });
  }

  // 1. Find or create the tag
  let { data: tagData, error: tagError } = await supabase
    .from('tags')
    .select('id')
    .eq('name', tag)
    .single();

  if (tagError && tagError.code !== 'PGRST116') {
    return new Response(JSON.stringify({ error: tagError.message }), {
      status: 500,
    });
  }

  if (!tagData) {
    const { data: newTag, error: createError } = await supabase
      .from('tags')
      .insert({ name: tag })
      .select()
      .single();

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 500,
      });
    }

    tagData = newTag;
  }

  // 2. Insert into comment_tags
  const { error: insertError } = await supabase.from('comment_tags').insert({
    comment_id,
    tag_id: tagData.id,
  });

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

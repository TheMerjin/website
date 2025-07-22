import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { comment_id, gratitude_count } = body;
    console.log(body);
    console.log('Updating comment:', comment_id, 'with gratitude count:', gratitude_count);

    if (!comment_id || gratitude_count === undefined) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cookie = request.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .find((c) => c.trim().startsWith("sb-access-token="))
      ?.split("=")[1];
  
    if (!token) {
      return new Response(JSON.stringify({ error: "No access token found" }), {
        status: 401,
      });
    }
  
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if(error){
        return new Response(JSON.stringify({ error: "No access token found" }), {
            status: 401,
          });
    }
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
      });
    }
    console.log('User authenticated:', user.id);
    const { data : pulledData, error: pullError } = await supabase
      .from('comments')
      .select()
      .eq('id', comment_id);
    console.log(pulledData[0])
    const old_gratitude = pulledData[0].gratitude
    console.log(old_gratitude);
    console.log(old_gratitude + gratitude_count);
    // Update the gratitude count in the comments table
    console.log('Attempting to update comment', comment_id, 'with gratitude:', gratitude_count);
    const { data : data, error: updateError } = await supabase
      .from('comments')
      .update({ gratitude : pulledData[0].gratitude + gratitude_count})
      .eq('id', comment_id)
      .select();
    console.log("Update data:");
    console.log(data);
      

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Successfully updated comment gratitude');
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in update_comment_gratitude:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 
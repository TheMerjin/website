import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase.js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { comment_id, rating } = body;

    if (!comment_id || rating === undefined || rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: 'Invalid input. Rating must be between 1 and 5.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user from cookie token
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

    // Check if user has already rated this comment
    const { data: existingRating, error: checkError } = await supabase
      .from('post_ratings')
      .select('id, rating')
      .eq('comment_id', comment_id)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking existing rating:', checkError);
      return new Response(JSON.stringify({ error: 'Failed to check existing rating' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let result;
    if (existingRating) {
      // Update existing rating
      const { data, error: updateError } = await supabase
        .from('post_ratings')
        .update({ rating: rating })
        .eq('id', existingRating.id)
        .select();

      if (updateError) {
        console.error('Update error:', updateError);
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      result = data;
    } else {
      // Insert new rating
      const { data, error: insertError } = await supabase
        .from('post_ratings')
        .insert({
          comment_id: comment_id,
          user_id: user.id,
          rating: rating
        })
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      result = data;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      rating: result[0] 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in update_comment_rating:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 
import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { comment_id, rating } = body;
    if (!comment_id || rating === void 0 || rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: "Invalid input. Rating must be between 1 and 5." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const cookie = request.headers.get("cookie") || "";
    const token = cookie.split(";").find((c) => c.trim().startsWith("sb-access-token="))?.split("=")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "No access token found" }), {
        status: 401
      });
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      return new Response(JSON.stringify({ error: "No access token found" }), {
        status: 401
      });
    }
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401
      });
    }
    const { data: existingRating, error: checkError } = await supabase.from("post_ratings").select("id, rating").eq("comment_id", comment_id).eq("user_id", user.id).single();
    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing rating:", checkError);
      return new Response(JSON.stringify({ error: "Failed to check existing rating" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    let result;
    if (existingRating) {
      const { data, error: updateError } = await supabase.from("post_ratings").update({ rating }).eq("id", existingRating.id).select();
      if (updateError) {
        console.error("Update error:", updateError);
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      result = data;
    } else {
      const { data, error: insertError } = await supabase.from("post_ratings").insert({
        comment_id,
        user_id: user.id,
        rating
      }).select();
      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      result = data;
    }
    return new Response(JSON.stringify({
      success: true,
      rating: result[0]
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in update_comment_rating:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

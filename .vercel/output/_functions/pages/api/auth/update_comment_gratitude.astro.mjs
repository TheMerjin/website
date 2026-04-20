import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { comment_id, gratitude_count } = body;
    console.log(body);
    console.log("Updating comment:", comment_id, "with gratitude count:", gratitude_count);
    if (!comment_id || gratitude_count === void 0) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
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
    console.log("User authenticated:", user.id);
    const { data: pulledData, error: pullError } = await supabase.from("comments").select().eq("id", comment_id);
    console.log(pulledData[0]);
    const old_gratitude = pulledData[0].gratitude;
    console.log(old_gratitude);
    console.log(old_gratitude + gratitude_count);
    console.log("Attempting to update comment", comment_id, "with gratitude:", gratitude_count);
    const { data, error: updateError } = await supabase.from("comments").update({ gratitude: pulledData[0].gratitude + gratitude_count }).eq("id", comment_id).select();
    console.log("Update data:");
    console.log(data);
    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Successfully updated comment gratitude");
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in update_comment_gratitude:", error);
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

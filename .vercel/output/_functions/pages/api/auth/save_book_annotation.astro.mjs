import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const { bookId, selectedText, commentText, position } = await request.json();
    if (!bookId || !selectedText || !commentText || !position) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const cookie = request.headers.get("cookie") || "";
    const token = cookie.split(";").find((c) => c.trim().startsWith("sb-access-token="))?.split("=")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "No access token found" }), { status: 401 });
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
    }
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("username").eq("id", user.id).single();
    if (profileError || !profileData) {
      return new Response(JSON.stringify({ error: "User profile not found" }), { status: 404 });
    }
    const { data, error } = await supabase.from("book_annotations").insert({
      book_id: bookId,
      user_id: user.id,
      username: profileData.username,
      selected_text: selectedText,
      comment_text: commentText,
      start_position: position.start,
      end_position: position.end,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) {
      console.error("Error saving annotation:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify({
      success: true,
      annotation: data
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in save_book_annotation:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

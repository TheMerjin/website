import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { user, title, content } = body;
    if (!user || !user.id || !title) {
      console.error("Validation failed:", { user: !!user, userId: user?.id, title: !!title, content: !!content });
      return new Response(JSON.stringify({ error: "Missing user, title, or content" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { error: insertError } = await supabase.from("notes").upsert(
      {
        user_id: user.id,
        title,
        content
      },
      {
        onConflict: "user_id,title"
      }
    );
    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
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

import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const DELETE = async ({ request }) => {
  try {
    const body = await request.json();
    const { user, title } = body;
    if (!user || !user.id || !title) {
      return new Response(JSON.stringify({ error: "Missing user or noteId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { error: deleteError } = await supabase.from("notes").delete().eq("user_id", user.id).eq("title", title);
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

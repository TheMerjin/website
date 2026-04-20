import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  try {
    const post_id = url.searchParams.get("post_id");
    if (!post_id) {
      return new Response(JSON.stringify({ error: "Missing post_id" }), { status: 400 });
    }
    const { data, error } = await supabase.from("comments").select("id, content, created_at").eq("post_id", post_id).limit(5);
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
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

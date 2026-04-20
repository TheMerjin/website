import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const post_id = url.searchParams.get("post_id");
  if (!post_id) {
    return new Response(JSON.stringify({ error: "Missing post_id" }), { status: 400 });
  }
  const { data, error } = await supabase.from("comments").select("*").eq("post_id", post_id).order("created_at", { ascending: true });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ comments: data }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

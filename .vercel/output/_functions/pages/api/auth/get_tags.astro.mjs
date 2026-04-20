import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  const url = new URL(request.url);
  const comment_id = url.searchParams.get("comment_id");
  if (!comment_id) {
    return new Response(JSON.stringify({ error: "Missing comment_id" }), { status: 400 });
  }
  const { data, error } = await supabase.from("comment_tags").select("tag_id, tags(name)").eq("comment_id", comment_id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  const tags = data.map((row) => row.tags.name);
  return new Response(JSON.stringify({ tags }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

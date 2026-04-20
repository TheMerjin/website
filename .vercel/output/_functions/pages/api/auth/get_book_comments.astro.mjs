import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const book_id = url.searchParams.get("book_id");
  if (!book_id) {
    return new Response(JSON.stringify({ error: "Missing book_id" }), { status: 400 });
  }
  const { data, error } = await supabase.from("book_comments").select("*, profiles(username)").eq("book_id", book_id).order("created_at", { ascending: true });
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

import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const body = await request.json();
  const { title, content, userId, username } = body;
  if (!userId) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }
  const { error } = await supabase.from("posts").insert({ author_id: userId, title, content, username });
  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ message: "Post saved" }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

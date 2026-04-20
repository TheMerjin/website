import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("user_id");
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { data: postData, error: profileError } = await supabase.from("notes").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({ posts: postData }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

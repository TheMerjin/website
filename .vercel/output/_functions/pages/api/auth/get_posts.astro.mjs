import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  const { data: postData, error } = await supabase.from("posts").select(`*, comments_count:comments(count)`).order("created_at", { ascending: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  const posts = (postData || []).map((post) => ({
    ...post,
    comments_count: Array.isArray(post.comments_count) && post.comments_count[0]?.count != null ? post.comments_count[0].count : 0
  }));
  return new Response(JSON.stringify({ posts }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

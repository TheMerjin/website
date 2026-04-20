import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.split(";").find((c) => c.trim().startsWith("sb-access-token="))?.split("=")[1];
  if (!token) {
    return new Response(JSON.stringify({ error: "No access token found" }), {
      status: 401
    });
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return new Response(JSON.stringify({ error: error?.message || "User not found" }), {
      status: 500
    });
  }
  return new Response(JSON.stringify({ user }), {
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

import { s as supabase } from '../../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
async function getSessionFromRequest(request) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.split(";").find((c) => c.trim().startsWith("sb-access-token="))?.split("=")[1];
  if (!token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}
const GET = async ({ request }) => {
  const user = await getSessionFromRequest(request);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const user_id = user.id;
  const { data, error } = await supabase.from("calendar_events").select("*").eq("user_id", user_id).order("start", { ascending: true });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({ events: data }), {
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

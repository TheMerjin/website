import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies, redirect }) => {
  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) {
    return new Response("Not authenticated", { status: 401 });
  }
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return new Response("Invalid token", { status: 401 });
  }
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  return new Response("Signed out", { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

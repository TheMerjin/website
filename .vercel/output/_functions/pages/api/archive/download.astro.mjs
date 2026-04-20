import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

async function getUserFromRequest(cookies) {
  const access_token = cookies.get("sb-access-token")?.value;
  if (!access_token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(access_token);
  if (error || !user) return null;
  return user;
}
const GET = async ({ cookies, url }) => {
  const user = await getUserFromRequest(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const file_path = url.searchParams.get("file_path");
  if (!file_path) {
    return new Response(JSON.stringify({ error: "Missing file_path" }), { status: 400 });
  }
  const { data, error } = await supabase.storage.from("archive").createSignedUrl(file_path, 60 * 60);
  if (error || !data?.signedUrl) {
    return new Response(JSON.stringify({ error: error?.message || "Could not generate signed URL" }), { status: 500 });
  }
  return Response.redirect(data.signedUrl, 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

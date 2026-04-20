import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../renderers.mjs';

async function getUserFromRequest(cookies) {
  const access_token = cookies.get("sb-access-token")?.value;
  if (!access_token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(access_token);
  if (error || !user) return null;
  return user;
}
const GET = async ({ cookies }) => {
  const user = await getUserFromRequest(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const { data, error } = await supabase.from("digital_archive").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ entries: data }), { status: 200 });
};
const POST = async ({ cookies, request }) => {
  const user = await getUserFromRequest(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const body = await request.json();
  const { subject, title, description, file_path } = body;
  if (!subject || !title || !file_path) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }
  const { data, error } = await supabase.from("digital_archive").insert([{ user_id: user.id, subject, title, description, file_path }]).select().single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ entry: data }), { status: 201 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

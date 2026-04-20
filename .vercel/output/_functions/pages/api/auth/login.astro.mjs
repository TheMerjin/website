import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    console.log("User signed out successfully");
  }
  if (error) {
    return new Response(error.message, { status: 401 });
  }
  const access_token = data.session.access_token;
  const refresh_token = data.session.refresh_token;
  cookies.set("sb-access-token", access_token, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    // Set to false if not using HTTPS in development
    maxAge: 60 * 60 * 24 * 1
    // 7 days
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 30
    // 30 days
  });
  return redirect(`${"http://localhost:4321/"}?msg=LoggedInThankyou`);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

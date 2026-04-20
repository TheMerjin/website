import { s as supabase } from '../../../chunks/client-supabase_D77BrgKq.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const { password, accessToken, refreshToken } = await request.json();
  supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  const { error } = await supabase.auth.updateUser(
    { password },
    { accessToken }
  );
  console.log(error);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

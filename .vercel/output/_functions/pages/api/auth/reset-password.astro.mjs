import { s as supabase } from '../../../chunks/client-supabase_D77BrgKq.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${"http://localhost:4321/"}/update-password`
  });
  console.log("Redirect URL:", "http://localhost:4321/");
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400
    });
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/reset-password-confirmed"
      // Optional: show a success message
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

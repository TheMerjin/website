import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  try {
    const username = url.searchParams.get("username");
    if (!username) {
      return new Response(JSON.stringify({ error: "Username parameter is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
    if (error) {
      console.error("Error fetching profile:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch profile" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      profile: {
        username: profile.username,
        skill_mean: profile.skill_mean || 25,
        skill_variance: profile.skill_variance || 8.3333,
        bio: profile.bio,
        created_at: profile.created_at
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in get_profile:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

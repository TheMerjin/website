import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  try {
    const { data, error } = await supabase.from("errors").select("*").order("date", { ascending: false });
    if (error) {
      console.error("Error fetching errors:", error);
      return new Response(JSON.stringify({ error: error.message, errors: [] }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ errors: data || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", errors: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { date, what_went_wrong, why, fix } = body;
    if (!date || !what_went_wrong) {
      return new Response(JSON.stringify({ error: "Missing required fields: date, what_went_wrong" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data, error } = await supabase.from("errors").insert({
      date,
      what_went_wrong,
      why: why || null,
      fix: fix || null
    }).select().single();
    if (error) {
      console.error("Error creating error log entry:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ error: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

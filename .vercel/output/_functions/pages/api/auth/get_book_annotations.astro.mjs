import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  try {
    const bookId = url.searchParams.get("book_id");
    if (!bookId) {
      return new Response(JSON.stringify({ error: "Missing book_id parameter" }), { status: 400 });
    }
    const { data, error } = await supabase.from("book_annotations").select("*").eq("book_id", bookId).order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching annotations:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify({
      success: true,
      annotations: data || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in get_book_annotations:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

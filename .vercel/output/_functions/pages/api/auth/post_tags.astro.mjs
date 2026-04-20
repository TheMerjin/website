import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  console.log("called");
  const body = await request.json();
  console.log(body);
  const { comment_id, tag } = body;
  if (!comment_id || !tag) {
    return new Response(JSON.stringify({ error: "Missing comment_id or tag" }), {
      status: 400
    });
  }
  let { data: tagData, error: tagError } = await supabase.from("tags").select("id").eq("name", tag).single();
  if (tagError && tagError.code !== "PGRST116") {
    return new Response(JSON.stringify({ error: tagError.message }), {
      status: 500
    });
  }
  if (!tagData) {
    const { data: newTag, error: createError } = await supabase.from("tags").insert({ name: tag }).select().single();
    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 500
      });
    }
    tagData = newTag;
  }
  const { error: insertError } = await supabase.from("comment_tags").insert({
    comment_id,
    tag_id: tagData.id
  });
  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500
    });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

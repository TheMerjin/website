import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    let makeId = function() {
      return Math.floor(1e7 + Math.random() * 9e7);
    };
    const body = await request.json();
    const pgn = body?.pgn?.toString() || "";
    const White = body?.White?.toString() || "";
    const Black = body?.Black?.toString() || "";
    if (!pgn || !White || !Black) {
      return new Response(JSON.stringify({ success: false, error: "Missing pgn, White, or Black" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let createdId = null;
    let lastErr = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const id = makeId();
      const { error } = await supabase.from("sreekgames").insert([{ id, pgn, White, Black }]);
      if (!error) {
        createdId = id;
        break;
      }
      lastErr = error;
      if (error?.code !== "23505") break;
    }
    if (!createdId) {
      return new Response(JSON.stringify({ success: false, error: lastErr?.message || "Insert failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true, id: createdId }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e?.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

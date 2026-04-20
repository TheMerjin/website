import { s as supabase } from '../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*").order("due_date", { ascending: true });
    if (error) {
      console.error("Error fetching tasks:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        error
      });
      return new Response(JSON.stringify({ error: error.message, tasks: [] }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ tasks: data || [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : void 0;
    console.error("Server error fetching tasks:", {
      message: errorMessage,
      stack: errorStack,
      error
    });
    return new Response(JSON.stringify({ error: "Internal Server Error", tasks: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { class: class_name, item, type, due_date, status, link, notes, est_time, time_left } = body;
    if (!item || !due_date) {
      return new Response(JSON.stringify({ error: "Missing required fields: item, due_date" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Authentication error:", {
        message: authError?.message,
        details: authError?.details,
        hint: authError?.hint,
        code: authError?.code,
        error: authError
      });
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const userId = user.id;
    const { data, error } = await supabase.from("tasks").insert({
      user_id: userId,
      class: class_name,
      item,
      type: type || null,
      due_date,
      status: status || "To Do",
      link: link || null,
      notes: notes || null,
      est_time: est_time || null,
      time_left: time_left !== void 0 ? time_left : est_time || null
    }).select().single();
    if (error) {
      console.error("Error creating task:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        error
      });
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ task: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : void 0;
    console.error("Server error creating task:", {
      message: errorMessage,
      stack: errorStack,
      error
    });
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

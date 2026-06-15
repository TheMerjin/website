import type { APIRoute } from "astro";
import { supabase } from "../../../../lib/supabase";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  // 1. Grab the post ID from the URL parameters
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ message: "Missing post ID" }), {
      status: 400,
    });
  }

  // 2. Parse the updated incoming data and userId for auth verification
  const body = await request.json();
  const { title, content, userId } = body;

  if (!userId) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  // 3. Update the post in Supabase
  // We match by the post 'id' AND ensure the 'author_id' matches the requesting user
  const { data, error } = await supabase
    .from("posts")
    .update({ title, content })
    .eq("id", id)
    .eq("author_id", userId)
    .select();

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }

  // 4. Handle cases where the row wasn't found or user didn't own the post
  if (!data || data.length === 0) {
    return new Response(
      JSON.stringify({ message: "Post not found or unauthorized to edit" }),
      { status: 404 },
    );
  }

  return new Response(
    JSON.stringify({ message: "Post updated successfully", data: data[0] }),
    { status: 200 },
  );
};

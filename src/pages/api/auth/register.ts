export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const username = formData.get("username")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  // Attempt user signup
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    if (signUpError.message === "User already registered") {
      // Redirect to login with a message
      return Response.redirect(
        "http://localhost:4321/login?msg=User%20already%20registered",
        303
      );
    }
    return new Response(signUpError.message, { status: 500 });
  }

  // Fetch the authenticated user info
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError) {
    console.error("Error fetching user:", getUserError);
    return new Response("Failed to fetch user info", { status: 500 });
  }

  const userId = user.id;

  // Insert profile for the new user
  const { data, error: insertError } = await supabase
    .from("profiles")
    .insert([{ id: userId, username: username, bio: "Hello, I am new here!", email: email }]).select();

  if (insertError) {
    console.error("Error inserting profile:", insertError);
    return new Response("Failed to create profile", { status: 500 });
  }

  console.log("Profile created:", data);

  // Redirect to login page with success message
  return Response.redirect("http://localhost:4321/login?msg=Registration%20successful", 303);
};


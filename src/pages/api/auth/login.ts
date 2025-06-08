export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";



export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();


  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { data, error : error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  

if (error) {
  console.error('Error signing out:', error.message);
} else {
  console.log('User signed out successfully');
}

  if (error) {
    return new Response(error.message, { status: 401 }); // Use 401 for unauthorized
  }
  const access_token = data.session.access_token;
  const refresh_token = data.session.refresh_token;
  
  

  // Set cookies to persist session tokens
  cookies.set("sb-access-token", access_token, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true, // Set to false if not using HTTPS in development
    maxAge: 60 * 60 * 24 * 1, // 7 days
  });

  cookies.set("sb-refresh-token", refresh_token, {
    
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return new Response(null, {
    status: 303,
    headers: {
      Location: `${import.meta.env.PUBLIC_API_URL}?msg=LoggedInThankyou`
    }
  });
}

};
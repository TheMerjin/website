
import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';
export const prerender = false;
export const GET: APIRoute = async ({ request }) => {
    const cookie = request.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .find((c) => c.trim().startsWith("sb-access-token="))
      ?.split("=")[1];
  
    if (!token) {
      return new Response(JSON.stringify({ error: "No access token found" }), {
        status: 401,
      });
    }
  
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return new Response(JSON.stringify({ error: error?.message || "User not found" }), {
          status: 401,
        });
      }
    const userId = user.id
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();
          
    
    return new Response(JSON.stringify({ user, profile: profileData }), {
    status: 200,
    headers: {
        'Content-Type': 'application/json',
    },
    });
};

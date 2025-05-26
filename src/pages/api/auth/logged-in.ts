export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ cookies }) => {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return new Response("Not authenticated", { status: 401 });
    }
    // Validate accessToken with Supabase or your auth system
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      return new Response("Invalid token", { status: 401 });
    }
    return new Response(JSON.stringify({ user: data.user }), { status: 200 });
  };
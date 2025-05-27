export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";


export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return new Response("Not authenticated", { status: 401 });
    }
    // Validate accessToken with Supabase or your auth system
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      return new Response("Invalid token", { status: 401 });
    }
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
    return new Response("Signed out", { status: 200 });
}

    
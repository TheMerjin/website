import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
        return new Response(JSON.stringify({ error: "Missing user_id" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { data: postData, error: profileError } = await supabase
        .from('notes')
        .eq("user_id", userId)
        .select("*")
        .order('created_at', { ascending: false });

    if (profileError) {
        return new Response(JSON.stringify({ error: profileError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ posts: postData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};

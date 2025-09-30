import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const { data: postData, error: profileError } = await supabase
        .from('notes').select("*")
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

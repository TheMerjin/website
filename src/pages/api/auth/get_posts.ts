
import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';
export const prerender = false;
export const GET: APIRoute = async ({ request }) => {
    const { data: postData, error: profileError } = await supabase
        .from('posts')
        .select("*").order('created_at', { ascending: false });
          
    
    return new Response(JSON.stringify({ posts: postData }), {
    status: 200,
    headers: {
        'Content-Type': 'application/json',
    },
    });
};

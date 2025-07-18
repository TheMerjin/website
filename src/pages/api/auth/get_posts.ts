import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';
export const prerender = false;
export const GET: APIRoute = async ({ request }) => {
    // Fetch posts with comment count using a subquery
    const { data: postData, error } = await supabase
        .from('posts')
        .select(`*, comments_count:comments(count)`) // Supabase syntax for related table count
        .order('created_at', { ascending: false });

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // comments_count will be an array with one object: { count: N }
    // Flatten it for each post
    const posts = (postData || []).map(post => ({
        ...post,
        comments_count: Array.isArray(post.comments_count) && post.comments_count[0]?.count != null ? post.comments_count[0].count : 0
    }));

    return new Response(JSON.stringify({ posts }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase.js';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    if (!username) {
        return new Response(JSON.stringify({ error: "Missing username" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // First get the user profile to get the user_id
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single();

        if (profileError || !profileData) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Now get the notes for this user
        const { data: notesData, error: notesError } = await supabase
            .from('notes')
            .select("*")
            .eq("user_id", profileData.id)
            .order('created_at', { ascending: false });

        if (notesError) {
            return new Response(JSON.stringify({ error: notesError.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ notes: notesData }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}; 
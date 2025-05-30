import type { APIRoute } from 'astro';
import { supabase } from "../../../lib/supabase"
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const {}
}
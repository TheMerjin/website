

import { supabase } from '../../../lib/client-supabase';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.PUBLIC_API_URL}/update-passwordaw`, 
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/reset-password-confirmed', // Optional: show a success message
    },
  });
};
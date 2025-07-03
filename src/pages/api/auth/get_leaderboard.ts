import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Fetch all profiles with skill ratings, ordered by skill_mean descending
    const { data: players, error } = await supabase
      .from('profiles')
      .select('id, username, skill_mean, skill_variance')
      .order('skill_mean', { ascending: false })
      .limit(50); // Limit to top 50 players

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch leaderboard' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get games played count for each player
    const playersWithGames = await Promise.all(
      players.map(async (player) => {
        const { count: gamesPlayed } = await supabase
          .from('games')
          .select('*', { count: 'exact', head: true })
          .or(`white.eq.${player.id},black.eq.${player.id}`)
          .eq('status', 'completed');

        return {
          ...player,
          games_played: gamesPlayed || 0
        };
      })
    );

    return new Response(JSON.stringify({ 
      success: true, 
      players: playersWithGames 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in leaderboard API:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 
import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const commentIds = url.searchParams.get("comment_ids");
    if (!commentIds) {
      return new Response(JSON.stringify({ error: "Comment IDs required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const commentIdArray = commentIds.split(",").map((id) => id.trim());
    const authHeader = request.headers.get("Authorization");
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }
    const { data: ratings, error } = await supabase.from("post_ratings").select("comment_id, rating, user_id").in("comment_id", commentIdArray);
    if (error) {
      console.error("Error fetching ratings:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch ratings" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const ratingsMap = {};
    const userRatingsMap = {};
    const distributionMap = {};
    commentIdArray.forEach((commentId) => {
      const commentRatings = ratings.filter((r) => r.comment_id === commentId);
      const avgRating = commentRatings.length > 0 ? commentRatings.reduce((sum, r) => sum + r.rating, 0) / commentRatings.length : 0;
      ratingsMap[commentId] = {
        average: Math.round(avgRating * 10) / 10,
        // Round to 1 decimal place
        count: commentRatings.length
      };
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      commentRatings.forEach((r) => {
        distribution[r.rating]++;
      });
      distributionMap[commentId] = distribution;
      if (userId) {
        const userRating = commentRatings.find((r) => r.user_id === userId);
        userRatingsMap[commentId] = userRating ? userRating.rating : 0;
      }
    });
    return new Response(JSON.stringify({
      ratings: ratingsMap,
      userRatings: userRatingsMap,
      distribution: distributionMap
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in get_comment_ratings:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

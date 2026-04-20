import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const data = await request.json();
  const { query, limit } = data;
  const decoded = decodeURIComponent(query).toLowerCase();
  const queryWords = decoded.split(" ");
  const embeddings = [];
  console.log(queryWords);
  for (let word of queryWords) {
    const { data: postData, error: profileError } = await supabase.from("embeddings").select(
      "*"
    ).eq("content", word).maybeSingle();
    if (postData) {
      embeddings.push(JSON.parse(postData.embedding));
    } else {
      const { data: postData2, error: profileError2 } = await supabase.from("embeddings").select(
        "*"
      ).eq("content", "<MEAN_EMBEDDING>").single();
      console.log("postData:", postData2);
      console.log("error:", profileError2);
      const meanEmbedding = postData2.embedding;
      embeddings.push(JSON.parse(meanEmbedding));
    }
  }
  const sumVector = new Array(200).fill(0);
  for (let i = 0; i < embeddings.length; i++) {
    for (let j = 0; j < embeddings[i].length; j++) {
      const number2 = embeddings[i][j];
      sumVector[j] = sumVector[j] + number2;
    }
  }
  const meanQueryVector = sumVector.map((p) => p / queryWords.length);
  "[" + meanQueryVector.join(",") + "]";
  const { data: cosine_data, error: cosine_error } = await supabase.rpc("search_similar", {
    query: meanQueryVector,
    // array of 200 floats
    limit_count: 5
  });
  console.log(cosine_data);
  console.log("cosine_error:", cosine_error);
  return new Response(JSON.stringify({ success: true, postData: cosine_data }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

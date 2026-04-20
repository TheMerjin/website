import { c as createComponent, f as createAstro, b as renderComponent, d as renderTemplate } from '../../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../../../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  let topic = null;
  let error = null;
  try {
    console.log("Fetching topic with ID:", id);
    const { data: topicData, error: topicError } = await supabase.from("topics").select(`
      *,
      nodes(
        id,
        type,
        content,
        weight,
        created_at,
        created_by,
        evidence(
          id,
          description,
          credibility,
          created_at
        )
      )
    `).eq("id", id).single();
    if (topicError) {
      console.error("Error fetching topic:", topicError);
      error = "Topic not found";
    } else {
      topic = topicData;
      let edges = [];
      if (topic.nodes && topic.nodes.length > 0) {
        const nodeIds = topic.nodes.map((n) => n.id);
        const { data: edgesData, error: edgesError } = await supabase.from("edges").select(`
          *,
          parent_node:nodes!edges_parent_node_fkey(id, content, type),
          child_node:nodes!edges_child_node_fkey(id, content, type)
        `).in("parent_node", nodeIds).in("child_node", nodeIds);
        if (edgesError) {
          console.error("Error fetching edges:", edgesError);
        } else {
          edges = edgesData || [];
        }
      }
      topic.edges = edges;
      console.log("Topic data loaded:", topic);
    }
  } catch (err) {
    console.error("Database error:", err);
    error = "Failed to load topic";
  }
  if (error || !topic) {
    console.log("Redirecting to 404, error:", error, "topic:", topic);
    return Astro2.redirect("/404");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$WebsiteLayout, { "title": `${topic.title} - Agora Debate` })}`;
}, "C:/Users/Sreek/website/src/pages/debate/topic/[id].astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/debate/topic/[id].astro";
const $$url = "/debate/topic/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$PostCard } from '../chunks/PostCard_Bx0oMM6i.mjs';
import { s as supabase } from '../chunks/supabase_DW_cx3tm.mjs';
/* empty css                                */
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  let sreekPosts = [];
  let error = null;
  try {
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("id").eq("username", "Sreek").single();
    if (profileError || !profileData) {
      error = "User Sreek not found";
    } else {
      const { data: postsData, error: postsError } = await supabase.from("posts").select("*").eq("author_id", profileData.id).order("created_at", { ascending: false });
      if (!postsError) {
        sreekPosts = postsData || [];
      } else {
        error = "Failed to load posts";
      }
    }
  } catch (err) {
    error = "Failed to load blog";
  }
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-ijnerlr2": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="blog-container" data-astro-cid-ijnerlr2> <div class="blog-header" data-astro-cid-ijnerlr2> <h1 data-astro-cid-ijnerlr2>Sreek's Blog</h1> <p class="blog-description" data-astro-cid-ijnerlr2>Thoughts, ideas, and writings from Sreek</p> </div> ${error ? renderTemplate`<div class="error-message" data-astro-cid-ijnerlr2> <h2 data-astro-cid-ijnerlr2>Error Loading Blog</h2> <p data-astro-cid-ijnerlr2>${error}</p> </div>` : sreekPosts.length === 0 ? renderTemplate`<div class="no-posts" data-astro-cid-ijnerlr2> <h2 data-astro-cid-ijnerlr2>No Posts Yet</h2> <p data-astro-cid-ijnerlr2>Sreek hasn't published any posts yet.</p> </div>` : renderTemplate`<div class="posts-list" data-astro-cid-ijnerlr2> ${sreekPosts.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "post": post, "key": post.id, "data-astro-cid-ijnerlr2": true })}`)} </div>`} </div> ` })} `;
}, "C:/Users/Sreek/website/src/pages/blog.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

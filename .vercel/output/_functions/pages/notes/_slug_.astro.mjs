import { c as createComponent, f as createAstro, b as renderComponent, d as renderTemplate, m as maybeRenderHead, g as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { C as CommentsTree } from '../../chunks/CommentsTree_BLQj3AXW.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const res = await fetch(`${"http://localhost:4321/"}api/auth/get_all_notes`);
  const { posts } = await res.json();
  const correctPost = posts.find((post) => post.id == slug);
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);
  marked.use(markedKatex({
    throwOnError: false,
    displayMode: true
    // optional, applies to $$...$$
  }));
  const rawHtml = marked.parse(correctPost.content);
  const safeHtml = DOMPurify.sanitize(rawHtml, { ADD_TAGS: ["math", "mi", "mo", "mn", "mrow", "annotation"], ADD_ATTR: ["display"] });
  const date = new Date(correctPost.created_at).toLocaleDateString(void 0, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-fezs4xpw": true }, { "default": async ($$result2) => renderTemplate` <meta name="viewport" content="width=device-width, initial-scale=1.0"> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"> ${maybeRenderHead()}<article class="post" data-astro-cid-fezs4xpw> <h1 class="title" data-astro-cid-fezs4xpw>${correctPost.title}</h1> <div class="byline" data-astro-cid-fezs4xpw>By <a${addAttribute(`/${correctPost.username}`, "href")} class="author-link" data-astro-cid-fezs4xpw>${correctPost.username}</a> on ${date}</div> <div class="content" data-astro-cid-fezs4xpw>${unescapeHTML(safeHtml)}</div> </article> <div data-astro-cid-fezs4xpw> ${renderComponent($$result2, "CommentsTree", CommentsTree, { "slug": slug, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/CommentsTree.jsx", "client:component-export": "default", "data-astro-cid-fezs4xpw": true })} </div> ` })} `;
}, "C:/Users/Sreek/website/src/pages/notes/[slug].astro", void 0);
const $$file = "C:/Users/Sreek/website/src/pages/notes/[slug].astro";
const $$url = "/notes/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

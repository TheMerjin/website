import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WhiteWebsiteLayout } from '../../chunks/WhiteWebsiteLayout_CHHoeKI6.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pages = /* #__PURE__ */ Object.assign({"./yusupov_revisions/part_1/basic_opening_principles.astro": () => import('../../chunks/basic_opening_principles_vALsOk8a.mjs').then(n => n._),"./yusupov_revisions/part_1/mating_motifs_1.astro": () => import('../../chunks/mating_motifs_1_DpDne__v.mjs').then(n => n._),"./yusupov_revisions/part_1/mating_motifs_two.astro": () => import('../../chunks/mating_motifs_two_FFROz5Rr.mjs').then(n => n._),"./yusupov_revisions/part_1/the_value_of_the_pieces.astro": () => import('../../chunks/the_value_of_the_pieces_BsP6pbnO.mjs').then(n => n._)});
  function format(str) {
    return str.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  const items = Object.keys(pages).filter((path) => !path.endsWith("index.astro")).map((path) => {
    const clean = path.replace("./", "").replace(".astro", "");
    const parts = clean.split("/");
    return {
      book: parts[0] ?? "other",
      part: parts[1] ?? "misc",
      chapter: parts[2] ?? parts[1],
      url: "/chess/solutions/" + clean
    };
  });
  const grouped = {};
  for (const item of items) {
    if (!grouped[item.book]) grouped[item.book] = {};
    if (!grouped[item.book][item.part]) grouped[item.book][item.part] = [];
    grouped[item.book][item.part].push(item);
  }
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WhiteWebsiteLayout, { "data-astro-cid-2ba6hhcr": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-2ba6hhcr> <h1 data-astro-cid-2ba6hhcr>Chess Solutions</h1> ${Object.entries(grouped).map(([book, parts]) => renderTemplate`<section class="book" data-astro-cid-2ba6hhcr> <h2 data-astro-cid-2ba6hhcr>${format(book)}</h2> ${Object.entries(parts).map(([part, chapters]) => renderTemplate`<div class="part" data-astro-cid-2ba6hhcr> <h3 data-astro-cid-2ba6hhcr>${format(part)}</h3> <div class="grid" data-astro-cid-2ba6hhcr> ${chapters.map((c) => renderTemplate`<a${addAttribute(c.url, "href")} class="card" data-astro-cid-2ba6hhcr> <span data-astro-cid-2ba6hhcr>${format(c.chapter)}</span> </a>`)} </div> </div>`)} </section>`)} </main>  ` })}`;
}, "C:/Users/Sreek/website/src/pages/chess/solutions/index.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/chess/solutions/index.astro";
const $$url = "/chess/solutions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { _ as __vite_glob_0_0 } from '../chunks/index_DUzEfYry.mjs';
import { _ as __vite_glob_0_1 } from '../chunks/taylor_series_method_BthKnXIQ.mjs';
import { _ as __vite_glob_0_2 } from '../chunks/toricelli\'s_law_of_fluid_C-O-NMM8.mjs';
import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  function titleCase(s) {
    return s.split(/[\s_-]+/g).filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  function cleanSegment(seg) {
    try {
      return decodeURIComponent(seg);
    } catch {
      return seg;
    }
  }
  function titleFromRoute(route) {
    const parts = route.split("/").filter(Boolean).map(cleanSegment);
    if (parts.length === 0) return "Math";
    const last = parts[parts.length - 1];
    return titleCase(last);
  }
  const modules = /* #__PURE__ */ Object.assign({"./differential equations/index.astro": __vite_glob_0_0,"./differential equations/taylor_series_method.astro": __vite_glob_0_1,"./differential equations/toricelli's_law_of_fluid.astro": __vite_glob_0_2});
  const routes = Object.keys(modules).map((p) => p.replace(/^\.\/+/, "")).filter((p) => p.toLowerCase() !== "index.astro").map((p) => p.replace(/\.astro$/i, ""));
  const entries = routes.map((r) => ({
    route: `/math/${r.split("/").map(encodeURIComponent).join("/")}`,
    title: titleFromRoute(r),
    section: r.includes("/") ? titleCase(cleanSegment(r.split("/")[0])) : "Notes"
  })).sort((a, b) => a.route.localeCompare(b.route));
  const sections = Array.from(new Set(entries.map((e) => e.section)));
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-bujbixai": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="math-index" data-astro-cid-bujbixai> <header class="math-head" data-astro-cid-bujbixai> <h1 data-astro-cid-bujbixai>Math</h1> <p class="lead" data-astro-cid-bujbixai>
Notes, sketches, and worked examples.
</p> </header> ${entries.length === 0 ? renderTemplate`<p class="empty" data-astro-cid-bujbixai>No math pages yet.</p>` : sections.map((section) => renderTemplate`<section class="block" data-astro-cid-bujbixai> <h3 data-astro-cid-bujbixai>${section}</h3> <ul class="list" role="list" data-astro-cid-bujbixai> ${entries.filter((e) => e.section === section).map((e) => renderTemplate`<li class="item" data-astro-cid-bujbixai> <a class="item-link"${addAttribute(e.route, "href")} data-astro-cid-bujbixai> <h4 class="item-title" data-astro-cid-bujbixai>${e.title}</h4> </a> <small class="item-meta" data-astro-cid-bujbixai> <code class="path" data-astro-cid-bujbixai>${e.route}</code> </small> </li>`)} </ul> </section>`)} </main> ` })} `;
}, "C:/Users/Sreek/website/src/pages/math/index.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/math/index.astro";
const $$url = "/math";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

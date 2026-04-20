import { c as createComponent, f as createAstro, m as maybeRenderHead, g as addAttribute, d as renderTemplate, b as renderComponent, r as renderSlot } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from './WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$Footer } from './Footer_BHYEXL3W.mjs';
import 'clsx';
import { $ as $$Index, a as $$Index$1 } from './index_D1zd1PVJ.mjs';
/* empty css                                                           */

const $$Astro$1 = createAstro();
const $$FormattedDate = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FormattedDate;
  const { date } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<time${addAttribute(date.toISOString(), "datetime")}> ${date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })} </time>`;
}, "C:/Users/Sreek/website/src/components/FormattedDate.astro", void 0);

const $$Astro = createAstro();
const $$BlogPost = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogPost;
  const { title, description, pubDate, updatedDate, heroImage } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-bvzihdzo": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-bvzihdzo> <article data-astro-cid-bvzihdzo> <div class="hero-image" data-astro-cid-bvzihdzo> ${heroImage && renderTemplate`<img${addAttribute(1020, "width")}${addAttribute(510, "height")}${addAttribute(heroImage, "src")} alt="" data-astro-cid-bvzihdzo>`} </div> <div class="prose" data-astro-cid-bvzihdzo> <div class="title" data-astro-cid-bvzihdzo> <div class="date" data-astro-cid-bvzihdzo> ${renderComponent($$result2, "FormattedDate", $$FormattedDate, { "date": pubDate, "data-astro-cid-bvzihdzo": true })} ${updatedDate && renderTemplate`<div class="last-updated-on" data-astro-cid-bvzihdzo>
Last updated on ${renderComponent($$result2, "FormattedDate", $$FormattedDate, { "date": updatedDate, "data-astro-cid-bvzihdzo": true })} </div>`} </div> <h1 data-astro-cid-bvzihdzo>${title}</h1> <hr data-astro-cid-bvzihdzo> </div> ${renderSlot($$result2, $$slots["default"])} </div> </article> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-bvzihdzo": true })} ${renderComponent($$result2, "Analytics", $$Index, { "data-astro-cid-bvzihdzo": true })} ${renderComponent($$result2, "SpeedInsights", $$Index$1, { "data-astro-cid-bvzihdzo": true })}  ` })}`;
}, "C:/Users/Sreek/website/src/layouts/BlogPost.astro", void 0);

export { $$BlogPost as $ };

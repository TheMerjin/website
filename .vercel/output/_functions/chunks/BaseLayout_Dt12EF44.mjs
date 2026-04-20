import { c as createComponent, f as createAstro, b as renderComponent, d as renderTemplate, m as maybeRenderHead, r as renderSlot } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from './WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$Index, a as $$Index$1 } from './index_D1zd1PVJ.mjs';
/* empty css                         */
/* empty css                         */

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-37fxchfa": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container" data-astro-cid-37fxchfa> ${renderSlot($$result2, $$slots["default"])} </div> ` })} ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-37fxchfa": true })} ${renderComponent($$result, "SpeedInsights", $$Index$1, { "data-astro-cid-37fxchfa": true })} `;
}, "C:/Users/Sreek/website/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };

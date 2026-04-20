import { c as createComponent, b as renderComponent, d as renderTemplate } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$WebsiteLayout, { "title": "Debate Topics - Agora" })}`;
}, "C:/Users/Sreek/website/src/pages/debate/index.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/debate/index.astro";
const $$url = "/debate";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

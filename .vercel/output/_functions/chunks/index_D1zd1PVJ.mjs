import { c as createComponent, f as createAstro, b as renderComponent, e as renderScript, d as renderTemplate } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';

const $$Astro$1 = createAstro();
const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index$1;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "C:/Users/Sreek/website/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Sreek/website/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-speed-insights", "vercel-speed-insights", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "C:/Users/Sreek/website/node_modules/@vercel/speed-insights/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Sreek/website/node_modules/@vercel/speed-insights/dist/astro/index.astro", void 0);

export { $$Index$1 as $, $$Index as a };

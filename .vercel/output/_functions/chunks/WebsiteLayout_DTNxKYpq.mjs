import { c as createComponent, r as renderSlot, a as renderHead, b as renderComponent, d as renderTemplate } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$Header } from './Header_WflSty_f.mjs';
import { $ as $$Index, a as $$Index$1 } from './index_D1zd1PVJ.mjs';
/* empty css                         */
/* empty css                         */

const $$WebsiteLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-ctjyes3q> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Agora</title><!-- You can add global CSS files here --><link rel="stylesheet" href="/styles/global.css"><link rel="icon" type="image/jpeg" href="/assets_task_01jyj60hf6fk59efxgcf6aerx2_1750809597_img_0.jpg">${renderSlot($$result, $$slots["head"])}${renderHead()}</head> <body style="background-color: #f8f2e4; margin: 0; margin-left: 0rem;" data-astro-cid-ctjyes3q> ${renderComponent($$result, "Header", $$Header, { "data-astro-cid-ctjyes3q": true })} <main style="max-width: 800px; margin: 5rem auto; margin-left : 20rem; padding: 0 1rem;" data-astro-cid-ctjyes3q> ${renderSlot($$result, $$slots["default"])} <!-- Page content will be injected here --> </main> ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-ctjyes3q": true })} ${renderComponent($$result, "SpeedInsights", $$Index$1, { "data-astro-cid-ctjyes3q": true })}  </body> </html>`;
}, "C:/Users/Sreek/website/src/layouts/WebsiteLayout.astro", void 0);

export { $$WebsiteLayout as $ };

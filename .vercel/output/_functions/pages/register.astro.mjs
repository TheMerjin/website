import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$Footer } from '../chunks/Footer_BHYEXL3W.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-qraosrxq": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h3 class="register-title" data-astro-cid-qraosrxq>Greetings traveler. Register here</h3> <div class="page-content" data-astro-cid-qraosrxq> <form action="/api/auth/register" method="post" data-astro-cid-qraosrxq> <input type="text" class="email-input" id="email" name="email" placeholder="Wizard@gmail.com" required data-astro-cid-qraosrxq> <input type="text" class="register-input" id="username" name="username" placeholder="Username" required data-astro-cid-qraosrxq> <input type="password" id="password" class="register-input" name="password" placeholder="Password" required data-astro-cid-qraosrxq> <button id="button" type="submit" data-astro-cid-qraosrxq>Register</button> </form> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-qraosrxq": true })} ` })} `;
}, "C:/Users/Sreek/website/src/pages/register.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

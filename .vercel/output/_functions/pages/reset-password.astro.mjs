import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$Footer } from '../chunks/Footer_BHYEXL3W.mjs';
/* empty css                                          */
export { renderers } from '../renderers.mjs';

const $$ResetPassword = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-oiuorpsm": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-oiuorpsm> <h3 class="reset-title" data-astro-cid-oiuorpsm>Reset your password</h3> <div class="form-wrapper" data-astro-cid-oiuorpsm> <form action="/api/auth/reset-password" method="post" class="reset-form" data-astro-cid-oiuorpsm> <input type="email" name="email" class="reset-input" placeholder="Enter your email" required data-astro-cid-oiuorpsm> <button type="submit" data-astro-cid-oiuorpsm>Send Reset Link</button> </form> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-oiuorpsm": true })} ` })} `;
}, "C:/Users/Sreek/website/src/pages/reset-password.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/reset-password.astro";
const $$url = "/reset-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ResetPassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

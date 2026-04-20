import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$Footer } from '../chunks/Footer_BHYEXL3W.mjs';
/* empty css                                                    */
export { renderers } from '../renderers.mjs';

const $$ResetPasswordConfirmed = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-rvigweog": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="confirmation-container" data-astro-cid-rvigweog> <h1 data-astro-cid-rvigweog>🧠 A Reset Email Is En Route</h1> <p data-astro-cid-rvigweog>
If the email you entered corresponds to an account, a password reset link is now
      traveling through the vast ether of the internet toward your inbox.
</p> <p data-astro-cid-rvigweog>
Please check your inbox (and perhaps your spam folder --- Not all those (emails) who wander are lost.
</p> <blockquote data-astro-cid-rvigweog>
"Rationality is not in avoiding failure, but in building systems that recover from it."
</blockquote> <div class="confirmation-links" data-astro-cid-rvigweog> <a href="/" class="link" data-astro-cid-rvigweog>← Return Home</a> <a href="/login" class="link" data-astro-cid-rvigweog>Login</a> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-rvigweog": true })} ` })} `;
}, "C:/Users/Sreek/website/src/pages/reset-password-confirmed.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/reset-password-confirmed.astro";
const $$url = "/reset-password-confirmed";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ResetPasswordConfirmed,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

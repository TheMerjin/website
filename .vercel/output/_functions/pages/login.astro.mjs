import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead, e as renderScript } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$Footer } from '../chunks/Footer_BHYEXL3W.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-sgpqyurt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h3 class="login-title" data-astro-cid-sgpqyurt>Welcome to Agora! Login or Register here traveler</h3> <div class="page-content" data-astro-cid-sgpqyurt> <form action="/api/auth/login" method="post" id="login-form" class="login-form" data-astro-cid-sgpqyurt> <input type="text" class="login-input" name="email" placeholder="Sauron@DolGoldur.com" required data-astro-cid-sgpqyurt> <input type="password" class="login-input" name="password" placeholder="Password" required data-astro-cid-sgpqyurt> <button type="submit" data-astro-cid-sgpqyurt>Login</button> <div class="auth-links" data-astro-cid-sgpqyurt> <a href="/register" class="register-link" data-astro-cid-sgpqyurt>Register</a> <a href="/reset-password" class="reset-link" data-astro-cid-sgpqyurt>Reset Password</a> </div> </form> </div> ${renderScript($$result2, "C:/Users/Sreek/website/src/pages/login.astro?astro&type=script&index=0&lang.ts")} ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-sgpqyurt": true })} ` })} `;
}, "C:/Users/Sreek/website/src/pages/login.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

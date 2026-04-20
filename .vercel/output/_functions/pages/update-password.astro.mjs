import { c as createComponent, d as renderTemplate, b as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$Footer } from '../chunks/Footer_BHYEXL3W.mjs';
/* empty css                                           */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$UpdatePassword = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", ` <script type="module">
  const form = document.getElementById('update-password-form');
  const message = document.getElementById('message');

  const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
  const refreshToken = new URLSearchParams(window.location.hash.substring(1)).get('refresh_token');

  if (!accessToken) {
    message.textContent = "Invalid or missing token.";
    form.style.display = "none";
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;

    const res = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password, accessToken, refreshToken })
    });

    if (res.ok) {
      message.textContent = "Password successfully updated!";
      form.reset();
    } else {
      const { error } = await res.json();
      message.textContent = \`Error: \${error}\`;
    }
  });
<\/script> `], ["", ` <script type="module">
  const form = document.getElementById('update-password-form');
  const message = document.getElementById('message');

  const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
  const refreshToken = new URLSearchParams(window.location.hash.substring(1)).get('refresh_token');

  if (!accessToken) {
    message.textContent = "Invalid or missing token.";
    form.style.display = "none";
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;

    const res = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password, accessToken, refreshToken })
    });

    if (res.ok) {
      message.textContent = "Password successfully updated!";
      form.reset();
    } else {
      const { error } = await res.json();
      message.textContent = \\\`Error: \\\${error}\\\`;
    }
  });
<\/script> `])), renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-favw2tqn": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-favw2tqn> <h3 class="title" data-astro-cid-favw2tqn>Set a new password</h3> <div class="form-wrapper" data-astro-cid-favw2tqn> <form id="update-password-form" data-astro-cid-favw2tqn> <input type="password" name="password" id="password" class="input" placeholder="New Password" required data-astro-cid-favw2tqn> <button type="submit" data-astro-cid-favw2tqn>Update Password</button> </form> <p id="message" data-astro-cid-favw2tqn></p> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-favw2tqn": true })} ` }));
}, "C:/Users/Sreek/website/src/pages/update-password.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/update-password.astro";
const $$url = "/update-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$UpdatePassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

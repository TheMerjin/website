import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead, e as renderScript } from '../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../../chunks/WebsiteLayout_DTNxKYpq.mjs';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

const $$HaveRead = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html data-astro-cid-x34xwz7a> ${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-x34xwz7a": true }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<body data-astro-cid-x34xwz7a><main data-astro-cid-x34xwz7a><ul id="book-list" data-astro-cid-x34xwz7a></ul><ul id="book-list" data-astro-cid-x34xwz7a></ul>${renderScript($$result2, "C:/Users/Sreek/website/src/pages/books/have-read.astro?astro&type=script&index=0&lang.ts")}</main></body>` })} </html>`;
}, "C:/Users/Sreek/website/src/pages/books/have-read.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/books/have-read.astro";
const $$url = "/books/have-read";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$HaveRead,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

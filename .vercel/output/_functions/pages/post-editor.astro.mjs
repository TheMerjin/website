import { c as createComponent, b as renderComponent, e as renderScript, d as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$PostEditor = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-r5aev5tg": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="editor-container" data-astro-cid-r5aev5tg> <div class="editor-header" data-astro-cid-r5aev5tg> <div class="editor-tabs" data-astro-cid-r5aev5tg> <button class="tab active" data-astro-cid-r5aev5tg>Write</button> <button class="tab" data-astro-cid-r5aev5tg>Preview</button> </div> <div class="editor-actions" data-astro-cid-r5aev5tg> <button class="action-button draft" data-astro-cid-r5aev5tg>Save Draft</button> <button id="submit" type="submit" class="action-button draft" form="postForm" data-astro-cid-r5aev5tg>Publish</button> <div id="status" class="status-message" data-astro-cid-r5aev5tg>.</div> </div> </div> <form id="postForm" class="editor-form" data-astro-cid-r5aev5tg> <div class="form-group" data-astro-cid-r5aev5tg> <input type="text" name="title" placeholder="Title" required class="title-input" data-astro-cid-r5aev5tg> <div class="form-group" data-astro-cid-r5aev5tg> <div class="editor-toolbar" data-astro-cid-r5aev5tg> <button type="button" class="toolbar-button" title="Bold" data-astro-cid-r5aev5tg>B</button> <button type="button" class="toolbar-button" title="Italic" data-astro-cid-r5aev5tg>I</button> <button type="button" class="toolbar-button" title="Link" data-astro-cid-r5aev5tg>🔗</button> <button type="button" class="toolbar-button" title="Quote" data-astro-cid-r5aev5tg>❝</button> <button type="button" class="toolbar-button" title="Code" data-astro-cid-r5aev5tg>${ void 0}</button> </div> </div> <textarea name="content" placeholder="Write your post here... Use markdown for formatting." required class="content-input" data-astro-cid-r5aev5tg></textarea> </div> <div class="form-group" data-astro-cid-r5aev5tg> <div class="tags-section" data-astro-cid-r5aev5tg> <label data-astro-cid-r5aev5tg>Tags</label> <div class="tags-input" data-astro-cid-r5aev5tg> <input type="text" placeholder="Add tags..." data-astro-cid-r5aev5tg> <div class="tags-list" data-astro-cid-r5aev5tg></div> </div> </div> </div> </form> </main> ` })}  ${renderScript($$result, "C:/Users/Sreek/website/src/pages/post-editor.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Sreek/website/src/pages/post-editor.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/post-editor.astro";
const $$url = "/post-editor";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PostEditor,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

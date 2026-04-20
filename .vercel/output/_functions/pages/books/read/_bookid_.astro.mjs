import { c as createComponent, f as createAstro, a as renderHead, b as renderComponent, d as renderTemplate, u as unescapeHTML, e as renderScript, g as addAttribute } from '../../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../../chunks/BaseLayout_Dt12EF44.mjs';
import { s as supabase } from '../../../chunks/client-supabase_D77BrgKq.mjs';
/* empty css                                          */
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$bookid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$bookid;
  let booksCatalog = {};
  let books = [];
  let book = null;
  let bookContent = "";
  let toc = [];
  let error = null;
  const { bookid } = Astro2.params;
  try {
    const { data: catalogData, error: catalogError } = await supabase.storage.from("books").download("books.json");
    if (catalogData) {
      const text = await catalogData.text();
      booksCatalog = JSON.parse(text);
      books = booksCatalog.books;
      book = books.find((b) => b.id === bookid);
      if (book) {
        const { data: fileData, error: fileError } = await supabase.storage.from("books").download(`books-output/${book.filename}`);
        if (fileData) {
          bookContent = await fileData.text();
        } else {
          bookContent = `<div class="book-content"><h1>${book?.title || "Book Not Found"}</h1><p>This book is not available in the current collection.</p></div>`;
        }
      } else {
        bookContent = `<div class="book-content"><h1>Book Not Found</h1><p>This book is not available in the current collection.</p></div>`;
      }
    } else {
      error = catalogError?.message || "Failed to fetch books catalog";
    }
  } catch (e) {
    error = e.message;
  }
  if (bookContent) {
    const h2s = [...bookContent.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];
    const h3s = [...bookContent.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi)];
    toc = [
      ...h2s.map((m) => ({ level: 2, text: m[1] })),
      ...h3s.map((m) => ({ level: 3, text: m[1] }))
    ];
  }
  return renderTemplate`<head><meta charset="utf-8"><!-- Removed KaTeX CSS due to CDN issues -->${renderHead()}</head> ${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": book?.title || "Book Reader", "data-astro-cid-lutu3hlt": true }, { "default": async ($$result2) => renderTemplate` <div class="rts-bg min-h-screen flex justify-center" data-astro-cid-lutu3hlt> <!-- Sidebar TOC --> <aside class="rts-sidebar hidden lg:block sticky top-0 h-screen overflow-y-auto px-6 py-10" data-astro-cid-lutu3hlt> <div class="mb-8" data-astro-cid-lutu3hlt> <a href="/books" class="rts-link text-xs" data-astro-cid-lutu3hlt>← All Books</a> </div> <div class="mb-6" data-astro-cid-lutu3hlt> <h2 class="text-lg font-bold mb-2" data-astro-cid-lutu3hlt>${book?.title}</h2> <div class="text-sm text-gray-600 mb-1" data-astro-cid-lutu3hlt>${book?.author}</div> <div class="text-xs text-gray-400" data-astro-cid-lutu3hlt>${book?.year}</div> </div> <nav data-astro-cid-lutu3hlt> <div class="text-xs text-gray-500 mb-2" data-astro-cid-lutu3hlt>Contents</div> <ul class="space-y-2" data-astro-cid-lutu3hlt> ${toc.length === 0 && renderTemplate`<li class="text-gray-400 italic" data-astro-cid-lutu3hlt>No TOC</li>`} ${toc.map((item, i) => renderTemplate`<li${addAttribute(item.level === 2 ? "font-semibold" : "pl-4 text-gray-600", "class")} data-astro-cid-lutu3hlt> <a${addAttribute(`#toc-${i}`, "href")} class="rts-link" data-astro-cid-lutu3hlt>${item.text}</a> </li>`)} </ul> </nav> </aside> <!-- Main Content --> <main class="rts-main" data-astro-cid-lutu3hlt> <header class="book-header" data-astro-cid-lutu3hlt> <h1 class="book-title" data-astro-cid-lutu3hlt>${book?.title}</h1> <div class="book-author" data-astro-cid-lutu3hlt>${book?.author}</div> <div class="book-year" data-astro-cid-lutu3hlt>${book?.year}</div> <div class="book-description" data-astro-cid-lutu3hlt>${book?.description}</div> </header> <!-- Reading Controls --> <div class="reading-controls" data-astro-cid-lutu3hlt> <button class="control-btn" id="font-decrease" title="Decrease font size" data-astro-cid-lutu3hlt>A-</button> <span class="font-size-display" id="font-size-display" data-astro-cid-lutu3hlt>100%</span> <button class="control-btn" id="font-increase" title="Increase font size" data-astro-cid-lutu3hlt>A+</button> <button class="control-btn" id="reading-mode" title="Toggle reading mode" data-astro-cid-lutu3hlt>📖</button> </div> <article id="book-content" class="rts-reader-content" data-astro-cid-lutu3hlt> <div data-astro-cid-lutu3hlt>${unescapeHTML(bookContent)}</div> </article> </main> <!-- Annotation Popup --> <div id="annotation-popup" class="annotation-popup hidden" data-astro-cid-lutu3hlt> <div class="annotation-header" data-astro-cid-lutu3hlt> <h3 class="annotation-title" data-astro-cid-lutu3hlt>Add Annotation</h3> <button id="close-popup" class="close-btn" data-astro-cid-lutu3hlt>×</button> </div> <div class="annotation-content" data-astro-cid-lutu3hlt> <div class="selected-text-container" data-astro-cid-lutu3hlt> <label class="text-label" data-astro-cid-lutu3hlt>Selected Text:</label> <div id="selected-text-display" class="selected-text" data-astro-cid-lutu3hlt></div> </div> <div class="comment-container" data-astro-cid-lutu3hlt> <label for="comment-text" class="text-label" data-astro-cid-lutu3hlt>Your Analysis:</label> <textarea id="comment-text" class="comment-textarea" placeholder="Add your insights, analysis, or questions about this passage..." data-astro-cid-lutu3hlt></textarea> </div> <div class="annotation-actions" data-astro-cid-lutu3hlt> <button id="save-annotation" class="save-btn" data-astro-cid-lutu3hlt>Save Annotation</button> <button id="cancel-annotation" class="cancel-btn" data-astro-cid-lutu3hlt>Cancel</button> </div> </div> </div> <!-- Annotation Tooltip --> <div id="annotation-tooltip" class="annotation-tooltip hidden" data-astro-cid-lutu3hlt> <div class="tooltip-header" data-astro-cid-lutu3hlt> <div class="tooltip-author" data-astro-cid-lutu3hlt></div> <div class="tooltip-date" data-astro-cid-lutu3hlt></div> <button id="close-tooltip" class="tooltip-close-btn" data-astro-cid-lutu3hlt>×</button> </div> <div class="tooltip-content" data-astro-cid-lutu3hlt> <div class="tooltip-selected-text" data-astro-cid-lutu3hlt></div> <div class="tooltip-comment" data-astro-cid-lutu3hlt></div> </div> </div> </div>  ${renderScript($$result2, "C:/Users/Sreek/website/src/pages/books/read/[bookid].astro?astro&type=script&index=0&lang.ts")} ` })}  `;
}, "C:/Users/Sreek/website/src/pages/books/read/[bookid].astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/books/read/[bookid].astro";
const $$url = "/books/read/[bookid]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$bookid,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead, e as renderScript, g as addAttribute } from '../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$BlogPost } from '../../chunks/BlogPost_CovU2vXF.mjs';
/* empty css                                         */
export { renderers } from '../../renderers.mjs';

const $$ToBeRead = createComponent(($$result, $$props, $$slots) => {
  const books = [
    {
      title: "The Structure of Scientific Revolutions",
      author: "Thomas S. Kuhn",
      year: 1962,
      rating: null,
      slug: "the-structure-of-scientific-revolutions",
      summary: "A groundbreaking work in the history and philosophy of science, introducing concepts like paradigms and paradigm shifts. Kuhn challenges the traditional view of scientific progress as a linear accumulation of knowledge, instead proposing that science advances through revolutionary paradigm shifts."
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$BlogPost, { "title": "Books To Be Read", "description": "A curated list of books I'm planning to read, with summaries and notes", "pubDate": /* @__PURE__ */ new Date("January 15 2025"), "data-astro-cid-6xssk7fy": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="books-page" data-astro-cid-6xssk7fy> <div class="page-intro" data-astro-cid-6xssk7fy> <p data-astro-cid-6xssk7fy>
A curated list of books I'm planning to read. Each entry includes a summary to help me remember 
			why I wanted to read it. Click on any book to expand its summary.
</p> </div> <div class="books-list" data-astro-cid-6xssk7fy> ${books.map((book) => renderTemplate`<div class="book-card" data-astro-cid-6xssk7fy> <div class="book-header" data-astro-cid-6xssk7fy> <div class="book-title-author" data-astro-cid-6xssk7fy> <h3 class="book-title" data-astro-cid-6xssk7fy>${book.title}</h3> <div class="book-author" data-astro-cid-6xssk7fy>${book.author}</div> <div class="book-year" data-astro-cid-6xssk7fy>${book.year}</div> </div> ${book.rating && renderTemplate`<div class="book-rating" data-astro-cid-6xssk7fy> ${Array.from({ length: 5 }).map((_, i) => renderTemplate`<span${addAttribute(`star ${i < book.rating ? "filled" : ""}`, "class")} data-astro-cid-6xssk7fy>★</span>`)} <span class="rating-text" data-astro-cid-6xssk7fy>${book.rating}/5</span> </div>`} </div> <div class="book-summary-container" data-astro-cid-6xssk7fy> <button class="summary-toggle"${addAttribute(book.title.toLowerCase().replace(/\s+/g, "-"), "data-book-id")} data-astro-cid-6xssk7fy> <span class="toggle-text" data-astro-cid-6xssk7fy>Show Summary</span> <span class="toggle-icon" data-astro-cid-6xssk7fy>▼</span> </button> <div class="book-summary"${addAttribute(`summary-${book.title.toLowerCase().replace(/\s+/g, "-")}`, "id")} data-astro-cid-6xssk7fy> <p data-astro-cid-6xssk7fy>${book.summary}</p> </div> </div> </div>`)} </div> </div>  ${renderScript($$result2, "C:/Users/Sreek/website/src/pages/books/to-be-read.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/Sreek/website/src/pages/books/to-be-read.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/books/to-be-read.astro";
const $$url = "/books/to-be-read";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$ToBeRead,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

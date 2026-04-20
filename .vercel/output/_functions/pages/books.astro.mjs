import { c as createComponent, b as renderComponent, d as renderTemplate, F as Fragment, g as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Dt12EF44.mjs';
import { s as supabase } from '../chunks/client-supabase_D77BrgKq.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Books = createComponent(async ($$result, $$props, $$slots) => {
  let booksCatalog = {};
  let books = [];
  let categories = [];
  let booksByCategory = {};
  let booksJson = "";
  let booksByCategoryJson = "";
  let error = null;
  try {
    const { data, error: fetchError } = await supabase.storage.from("books").download("books.json");
    if (data) {
      const text = await data.text();
      booksCatalog = JSON.parse(text);
      books = booksCatalog.books;
      booksJson = JSON.stringify(books);
      categories = Array.from(new Set(books.map((b) => b.category)));
      booksByCategory = {};
      categories.forEach((cat) => {
        booksByCategory[cat] = books.filter((b) => b.category === cat);
      });
      booksByCategoryJson = JSON.stringify(booksByCategory);
    } else {
      error = fetchError?.message || "Failed to fetch books catalog";
    }
  } catch (e) {
    error = e.message;
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Book Recommendations", "data-astro-cid-xglhyxzr": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<main class="rts-bg min-h-screen flex flex-col items-center px-4 py-12" data-astro-cid-xglhyxzr> <header class="mb-10 max-w-2xl w-full" data-astro-cid-xglhyxzr> <h1 class="text-4xl font-bold text-gray-900 mb-2 font-serif" data-astro-cid-xglhyxzr>Book Recommendations</h1> <p class="text-lg text-gray-600 leading-relaxed mb-4" data-astro-cid-xglhyxzr>\nA curated collection of timeless literature and thought-provoking works. Browse and read directly in your browser.\n        You can check by section or by all books. Feel free to provide any feedback or suggestions.\n</p> </header> ', ` </main> <script type="module">
    // Remove all books load more logic
    const booksByCategory = {booksByCategoryJson};
    const categories = Object.keys(booksByCategory);
    categories.forEach(cat => {
      let loadedCat = 5;
      const block = document.querySelector(\`.category-block[data-category="\${cat}"]\`);
      if (!block) return;
      const list = block.querySelector('.category-books-list');
      const btn = block.querySelector('.load-more-category');
      if (btn) {
        btn.addEventListener('click', () => {
          const next = booksByCategory[cat].slice(loadedCat, loadedCat + 5);
          next.forEach(book => {
            const li = document.createElement('li');
            li.className = 'bg-white rounded-lg px-6 py-4 border border-gray-100 hover:shadow transition-shadow';
            li.innerHTML = \`
              <a href="/books/read/\${book.id}" class="block group no-underline">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h4 class="text-lg font-semibold text-black font-serif mb-1 book-title">
                      <a href="/books/read/\${book.id}" class="book-title-link">\${book.title}</a>
                    </h4>
                    <div class="text-sm text-gray-700 mb-1">\${book.author}</div>
                    <div class="text-xs text-gray-400 mb-1">\${book.year}</div>
                    <div class="text-sm text-gray-500 italic">\${book.description}</div>
                  </div>
                </div>
              </a>
            \`;
            list.appendChild(li);
          });
          loadedCat += 5;
          if (loadedCat >= booksByCategory[cat].length) {
            btn.style.display = 'none';
          }
        });
      }
    });
  <\/script>  `], [" ", '<main class="rts-bg min-h-screen flex flex-col items-center px-4 py-12" data-astro-cid-xglhyxzr> <header class="mb-10 max-w-2xl w-full" data-astro-cid-xglhyxzr> <h1 class="text-4xl font-bold text-gray-900 mb-2 font-serif" data-astro-cid-xglhyxzr>Book Recommendations</h1> <p class="text-lg text-gray-600 leading-relaxed mb-4" data-astro-cid-xglhyxzr>\nA curated collection of timeless literature and thought-provoking works. Browse and read directly in your browser.\n        You can check by section or by all books. Feel free to provide any feedback or suggestions.\n</p> </header> ', ` </main> <script type="module">
    // Remove all books load more logic
    const booksByCategory = {booksByCategoryJson};
    const categories = Object.keys(booksByCategory);
    categories.forEach(cat => {
      let loadedCat = 5;
      const block = document.querySelector(\\\`.category-block[data-category="\\\${cat}"]\\\`);
      if (!block) return;
      const list = block.querySelector('.category-books-list');
      const btn = block.querySelector('.load-more-category');
      if (btn) {
        btn.addEventListener('click', () => {
          const next = booksByCategory[cat].slice(loadedCat, loadedCat + 5);
          next.forEach(book => {
            const li = document.createElement('li');
            li.className = 'bg-white rounded-lg px-6 py-4 border border-gray-100 hover:shadow transition-shadow';
            li.innerHTML = \\\`
              <a href="/books/read/\\\${book.id}" class="block group no-underline">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h4 class="text-lg font-semibold text-black font-serif mb-1 book-title">
                      <a href="/books/read/\\\${book.id}" class="book-title-link">\\\${book.title}</a>
                    </h4>
                    <div class="text-sm text-gray-700 mb-1">\\\${book.author}</div>
                    <div class="text-xs text-gray-400 mb-1">\\\${book.year}</div>
                    <div class="text-sm text-gray-500 italic">\\\${book.description}</div>
                  </div>
                </div>
              </a>
            \\\`;
            list.appendChild(li);
          });
          loadedCat += 5;
          if (loadedCat >= booksByCategory[cat].length) {
            btn.style.display = 'none';
          }
        });
      }
    });
  <\/script>  `])), maybeRenderHead(), error ? renderTemplate`<div class="text-red-600 font-bold" data-astro-cid-xglhyxzr>${error}</div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xglhyxzr": true }, { "default": async ($$result3) => renderTemplate`  <section class="w-full max-w-2xl mb-12" data-astro-cid-xglhyxzr> <h2 class="text-2xl font-bold mb-6 font-serif" data-astro-cid-xglhyxzr>Categories</h2> <div id="categories-list" class="space-y-10" data-astro-cid-xglhyxzr> ${categories.map((cat) => renderTemplate`<div class="category-block"${addAttribute(cat, "data-category")} data-astro-cid-xglhyxzr> <a${addAttribute(`/books/${cat}`, "href")} class="category-link no-underline" data-astro-cid-xglhyxzr> <h3 class="text-xl font-semibold text-black font-serif mb-3 capitalize category-title" data-astro-cid-xglhyxzr>${cat}</h3> </a> <ul class="space-y-4 category-books-list" data-astro-cid-xglhyxzr> ${booksByCategory[cat].slice(0, 5).map((book) => renderTemplate`<li class="bg-white rounded-lg px-6 py-4 border border-gray-100 hover:shadow transition-shadow" data-astro-cid-xglhyxzr> <a${addAttribute(`/books/read/${book.id}`, "href")} class="block group no-underline" data-astro-cid-xglhyxzr></a><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2" data-astro-cid-xglhyxzr><a${addAttribute(`/books/read/${book.id}`, "href")} class="block group no-underline" data-astro-cid-xglhyxzr></a><div data-astro-cid-xglhyxzr><a${addAttribute(`/books/read/${book.id}`, "href")} class="block group no-underline" data-astro-cid-xglhyxzr></a><h4 class="text-lg font-semibold text-black font-serif mb-1 book-title" data-astro-cid-xglhyxzr><a${addAttribute(`/books/read/${book.id}`, "href")} class="block group no-underline" data-astro-cid-xglhyxzr></a><a${addAttribute(`/books/read/${book.id}`, "href")} class="book-title-link" data-astro-cid-xglhyxzr>${book.title}</a> </h4> <div class="text-sm text-black mb-1" data-astro-cid-xglhyxzr>${book.author}</div> <div class="text-xs text-gray-400 mb-1" data-astro-cid-xglhyxzr>${book.year}</div> <div class="text-sm text-black italic" data-astro-cid-xglhyxzr>${book.description}</div> </div> </div> </li>`)} </ul> ${booksByCategory[cat].length > 5 && renderTemplate`<div class="flex justify-center mt-4" data-astro-cid-xglhyxzr> <button class="rts-btn load-more-category"${addAttribute(cat, "data-category")} data-astro-cid-xglhyxzr>Load More</button> </div>`} </div>`)} </div> </section>  <section class="w-full max-w-2xl" data-astro-cid-xglhyxzr> <h2 class="text-2xl font-bold mb-6 font-serif" data-astro-cid-xglhyxzr>All Books</h2> <ul id="book-list" class="space-y-6" data-astro-cid-xglhyxzr> ${books.map((book) => renderTemplate`<li class="bg-white rounded-lg px-6 py-5 border border-gray-100 hover:shadow transition-shadow" data-astro-cid-xglhyxzr> <a${addAttribute(`/books/read/${book.id}`, "href")} class="block group no-underline" data-astro-cid-xglhyxzr></a><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2" data-astro-cid-xglhyxzr><a${addAttribute(`/books/read/${book.id}`, "href")} class="block group no-underline" data-astro-cid-xglhyxzr></a><div data-astro-cid-xglhyxzr><a${addAttribute(`/books/read/${book.id}`, "href")} class="block group no-underline" data-astro-cid-xglhyxzr></a><h2 class="text-xl font-semibold text-black font-serif mb-1 book-title" data-astro-cid-xglhyxzr><a${addAttribute(`/books/read/${book.id}`, "href")} class="block group no-underline" data-astro-cid-xglhyxzr></a><a${addAttribute(`/books/read/${book.id}`, "href")} class="book-title-link" data-astro-cid-xglhyxzr>${book.title}</a> </h2> <div class="text-sm text-gray-700 mb-1" data-astro-cid-xglhyxzr>${book.author}</div> <div class="text-xs text-gray-400 mb-1" data-astro-cid-xglhyxzr>${book.year}</div> <div class="text-sm text-gray-500 italic" data-astro-cid-xglhyxzr>${book.description}</div> </div> <div class="flex-shrink-0 mt-2 md:mt-0" data-astro-cid-xglhyxzr> <span class="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full" data-astro-cid-xglhyxzr>${book.category}</span> </div> </div> </li>`)} </ul> </section> ` })}`) })}`;
}, "C:/Users/Sreek/website/src/pages/books.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/books.astro";
const $$url = "/books";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Books,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

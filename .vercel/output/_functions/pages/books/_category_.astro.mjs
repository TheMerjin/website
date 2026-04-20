import { c as createComponent, f as createAstro, b as renderComponent, d as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_Dt12EF44.mjs';
import { s as supabase } from '../../chunks/client-supabase_D77BrgKq.mjs';
/* empty css                                         */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
async function getStaticPaths() {
  return [
    { params: { category: "philosophy" } },
    { params: { category: "science" } },
    { params: { category: "literature" } },
    { params: { category: "history" } },
    { params: { category: "fiction" } },
    { params: { category: "nonfiction" } }
  ];
}
const $$category = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$category;
  const { category } = Astro2.params;
  let booksCatalog = {};
  let books = [];
  let error = null;
  try {
    const { data, error: fetchError } = await supabase.storage.from("books").download("books.json");
    if (data) {
      const text = await data.text();
      booksCatalog = JSON.parse(text);
      books = booksCatalog.books.filter((b) => b.category === category);
    } else {
      error = fetchError?.message || "Failed to fetch books catalog";
    }
  } catch (e) {
    error = e.message;
  }
  const categoryData = {
    philosophy: { name: "Philosophy", emoji: "\u{1F9E0}", color: "blue", description: "Ancient wisdom to modern thought" },
    science: { name: "Science", emoji: "\u{1F52C}", color: "green", description: "Discoveries that shaped our world" },
    literature: { name: "Literature", emoji: "\u{1F4DA}", color: "purple", description: "Timeless stories and poetry" },
    history: { name: "History", emoji: "\u{1F4DC}", color: "orange", description: "Lessons from the past" },
    fiction: { name: "Fiction", emoji: "\u{1F4D6}", color: "indigo", description: "Imaginative storytelling" },
    nonfiction: { name: "Non-Fiction", emoji: "\u{1F4DD}", color: "teal", description: "Real-world knowledge and insights" }
  };
  const currentCategory = categoryData[category];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${currentCategory.name} Books`, "data-astro-cid-fze3vbjw": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8 max-w-2xl" data-astro-cid-fze3vbjw> <header class="mb-12" data-astro-cid-fze3vbjw> <nav class="mb-6" data-astro-cid-fze3vbjw> <a href="/books" class="text-blue-600 hover:text-blue-800 text-sm" data-astro-cid-fze3vbjw>← Back to Books</a> </nav> <div class="flex items-center gap-4 mb-6" data-astro-cid-fze3vbjw> <div class="text-4xl" data-astro-cid-fze3vbjw>${currentCategory.emoji}</div> <div data-astro-cid-fze3vbjw> <h1 class="text-4xl font-bold text-gray-900 font-serif" data-astro-cid-fze3vbjw>${currentCategory.name}</h1> <p class="text-lg text-gray-600 mt-2" data-astro-cid-fze3vbjw>${currentCategory.description}</p> </div> </div> <div class="flex items-center gap-4 text-sm text-gray-500" data-astro-cid-fze3vbjw> <span data-astro-cid-fze3vbjw>${books.length} books</span> <span data-astro-cid-fze3vbjw>•</span> <span data-astro-cid-fze3vbjw>Filter by: Author, Year, Title</span> </div> </header> ${error ? renderTemplate`<div class="text-red-600 font-bold" data-astro-cid-fze3vbjw>${error}</div>` : renderTemplate`<div class="grid gap-6" data-astro-cid-fze3vbjw> ${books.map((book) => renderTemplate`<div class="bg-white rounded-lg p-6 border border-gray-100 hover:shadow transition-shadow" data-astro-cid-fze3vbjw> <div class="flex items-start justify-between" data-astro-cid-fze3vbjw> <div class="flex-1" data-astro-cid-fze3vbjw> <div class="flex items-center gap-3 mb-3" data-astro-cid-fze3vbjw> <span${addAttribute(`text-xs bg-${currentCategory.color}-100 text-${currentCategory.color}-800 px-2 py-1 rounded`, "class")} data-astro-cid-fze3vbjw> ${currentCategory.name} </span> <span class="text-xs text-gray-500" data-astro-cid-fze3vbjw>${book.year}</span> </div> <h3 class="text-xl font-semibold font-serif mb-2 book-title" data-astro-cid-fze3vbjw> <a${addAttribute(`/books/read/${book.id}`, "href")} class="book-title-link" data-astro-cid-fze3vbjw>${book.title}</a> </h3> <div class="text-sm text-black mb-2" data-astro-cid-fze3vbjw>${book.author}</div> <p class="text-black italic mb-4" data-astro-cid-fze3vbjw>${book.description}</p> </div> </div> </div>`)} </div>`} </main>  ` })}`;
}, "C:/Users/Sreek/website/src/pages/books/[category].astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/books/[category].astro";
const $$url = "/books/[category]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$category,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

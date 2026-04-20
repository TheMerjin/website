import { c as createComponent, f as createAstro, b as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
/* empty css                                  */
export { renderers } from '../renderers.mjs';

function PostCard({ post_title, username, karma, content, date, post_id }) {
  const truncatedContent = content.length > 150 ? content.substring(0, 150) + "..." : content;
  return /* @__PURE__ */ jsxs("div", { style: {
    margin: "0 auto",
    maxWidth: "900px",
    padding: "15px 0",
    marginBottom: "15px",
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s ease",
    cursor: "pointer"
  }, onMouseEnter: (e) => {
    e.currentTarget.style.backgroundColor = "#f8f4f0";
  }, onMouseLeave: (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { fontSize: "1.2rem", fontWeight: "600", marginBottom: "5px" }, children: /* @__PURE__ */ jsx("a", { href: `posts/${post_id}`, style: { textDecoration: "none", color: "#333" }, onMouseEnter: (e) => {
      e.currentTarget.style.color = "#666";
    }, onMouseLeave: (e) => {
      e.currentTarget.style.color = "#333";
    }, children: post_title }) }),
    /* @__PURE__ */ jsxs("div", { style: { fontSize: "0.85rem", color: "#555", marginBottom: "10px" }, children: [
      /* @__PURE__ */ jsx("a", { href: `/${username}`, style: { textDecoration: "none", color: "#555" }, onMouseEnter: (e) => {
        e.currentTarget.style.color = "#456650";
      }, onMouseLeave: (e) => {
        e.currentTarget.style.color = "#555";
      }, children: username }),
      " • ",
      karma,
      " karma • ",
      date
    ] }),
    /* @__PURE__ */ jsx("div", { style: { fontSize: "0.95rem", lineHeight: "1.5" }, children: truncatedContent })
  ] });
}

function SearchResults({ initialResults, initialQuery }) {
  const [results, setResults] = useState(initialResults);
  const [query, setQuery] = useState(initialQuery || "");
  const [pendingQuery, setPendingQuery] = useState(initialQuery || "");
  useEffect(() => {
    const handler = setTimeout(() => {
      if (pendingQuery.trim() === "") {
        setResults(initialResults);
        setQuery("");
        return;
      }
      fetch(`${"http://localhost:4321/"}api/auth/search_similar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: pendingQuery, limit: 100 })
      }).then((res) => res.json()).then((data) => {
        setResults(data.postData || []);
        setQuery(pendingQuery);
      });
    }, 400);
    return () => clearTimeout(handler);
  }, [pendingQuery]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: (e) => e.preventDefault(), style: { position: "relative", display: "flex", marginBottom: 24 }, children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          style: {
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#aaa",
            display: "flex",
            alignItems: "center",
            height: "100%"
          },
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 20 20", fill: "none", children: [
            /* @__PURE__ */ jsx("circle", { cx: "9", cy: "9", r: "7", stroke: "currentColor", strokeWidth: "2" }),
            /* @__PURE__ */ jsx("line", { x1: "14.2", y1: "14.2", x2: "18", y2: "18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: pendingQuery,
          onChange: (e) => setPendingQuery(e.target.value),
          placeholder: "Search...",
          style: {
            flexGrow: 1,
            padding: "10px 10px 10px 38px",
            // left padding for icon
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            outline: "none"
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { children: results.length === 0 ? /* @__PURE__ */ jsx("p", { className: "empty-state", children: "No similar posts found." }) : results.map((post) => /* @__PURE__ */ jsx(
      PostCard,
      {
        post_title: post.title,
        username: post.username,
        karma: "0",
        content: post.content,
        date: new Date(post.created_at).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" }),
        post_id: post.id
      },
      post.id
    )) })
  ] });
}

const $$Astro = createAstro();
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Search;
  const url = new URL(Astro2.request.url);
  const query = url.searchParams.get("q") || "";
  const limit = url.searchParams.get("limit") || "100";
  let searchResults = [];
  if (query) {
    try {
      const res2 = await fetch(`${"http://localhost:4321/"}api/auth/search_similar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: parseInt(limit) })
      });
      const data = await res2.json();
      searchResults = data.postData || [];
    } catch (error) {
      console.error("Search error:", error);
    }
  }
  const res = await fetch(`${"http://localhost:4321/"}api/auth/get_posts`);
  const { posts } = await res.json();
  let initialResults = [];
  if (query) {
    const res2 = await fetch(`${"http://localhost:4321/"}api/auth/search_similar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit: 100 })
    });
    const data = await res2.json();
    initialResults = data.postData || [];
  }
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-ipsxrsrh": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="search-container" data-astro-cid-ipsxrsrh>  <div class="filters-section" data-astro-cid-ipsxrsrh> <h2 class="filters-title" data-astro-cid-ipsxrsrh>Filters</h2>  <div class="filter-group" data-astro-cid-ipsxrsrh> <div class="filter-label" data-astro-cid-ipsxrsrh>Filter by posted date</div> <div class="radio-group" data-astro-cid-ipsxrsrh> <label class="radio-label" data-astro-cid-ipsxrsrh> <input type="radio" name="post_date" value="all" checked data-astro-cid-ipsxrsrh> All
</label> <label class="radio-label" data-astro-cid-ipsxrsrh> <input type="radio" name="post_date" value="24h" data-astro-cid-ipsxrsrh> Past 24 hours
</label> <label class="radio-label" data-astro-cid-ipsxrsrh> <input type="radio" name="post_date" value="week" data-astro-cid-ipsxrsrh> Past week
</label> <label class="radio-label" data-astro-cid-ipsxrsrh> <input type="radio" name="post_date" value="month" data-astro-cid-ipsxrsrh> Past month
</label> <label class="radio-label" data-astro-cid-ipsxrsrh> <input type="radio" name="post_date" value="year" data-astro-cid-ipsxrsrh> Past year
</label> </div> </div>  <div class="filter-group" data-astro-cid-ipsxrsrh> <input type="text" placeholder="Filter by wikilags" class="filter-input" data-astro-cid-ipsxrsrh> </div>  <div class="filter-group" data-astro-cid-ipsxrsrh> <label class="checkbox-label" data-astro-cid-ipsxrsrh> <input type="checkbox" data-astro-cid-ipsxrsrh> Curated
</label> <label class="checkbox-label" data-astro-cid-ipsxrsrh> <input type="checkbox" checked data-astro-cid-ipsxrsrh> Exclude events
</label> </div> <button class="clear-filters-btn" data-astro-cid-ipsxrsrh>
Clear all filters
</button> </div>  <div class="results-section" data-astro-cid-ipsxrsrh> ${renderComponent($$result2, "SearchResults", SearchResults, { "initialResults": initialResults, "initialQuery": query, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/SearchResults.jsx", "client:component-export": "default", "data-astro-cid-ipsxrsrh": true })} </div> </div>  ` })}`;
}, "C:/Users/Sreek/website/src/pages/search.astro", void 0);
const $$file = "C:/Users/Sreek/website/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

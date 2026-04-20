import { c as createComponent, d as renderTemplate, m as maybeRenderHead, f as createAstro, g as addAttribute, s as spreadAttributes, r as renderSlot, b as renderComponent } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Search = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", `<form class="search-form" id="searchForm" data-astro-cid-otpdt6jm> <input type="text" placeholder="Search..." class="search-input" data-astro-cid-otpdt6jm> <button type="button" class="search-icon" id="searchIcon" data-astro-cid-otpdt6jm> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search" data-astro-cid-otpdt6jm><circle cx="11" cy="11" r="8" data-astro-cid-otpdt6jm></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-otpdt6jm></line></svg> </button> </form>  <script>
  // Handle search icon click
  document.getElementById('searchIcon').addEventListener('click', function() {
    const searchInput = this.parentElement.querySelector('.search-input');
    searchInput.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
      searchInput.focus();
      
      // Add keyup listener when input becomes active
      searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
          const searchQuery = this.value.trim();
          if (searchQuery) {
            let origin = location.origin;
            window.location.href = origin + \`/search?q=\${encodeURIComponent(searchQuery)}\`;
          }
        }
      });
    } else {
      const searchQuery = searchInput.value.trim();
      if (searchQuery) {
        let origin = location.origin;
        window.location.href = origin + \`/search?q=\${encodeURIComponent(searchQuery)}\`;
      }
    }
  });
</script>`], ["", `<form class="search-form" id="searchForm" data-astro-cid-otpdt6jm> <input type="text" placeholder="Search..." class="search-input" data-astro-cid-otpdt6jm> <button type="button" class="search-icon" id="searchIcon" data-astro-cid-otpdt6jm> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search" data-astro-cid-otpdt6jm><circle cx="11" cy="11" r="8" data-astro-cid-otpdt6jm></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-otpdt6jm></line></svg> </button> </form>  <script>
  // Handle search icon click
  document.getElementById('searchIcon').addEventListener('click', function() {
    const searchInput = this.parentElement.querySelector('.search-input');
    searchInput.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
      searchInput.focus();
      
      // Add keyup listener when input becomes active
      searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
          const searchQuery = this.value.trim();
          if (searchQuery) {
            let origin = location.origin;
            window.location.href = origin + \\\`/search?q=\\\${encodeURIComponent(searchQuery)}\\\`;
          }
        }
      });
    } else {
      const searchQuery = searchInput.value.trim();
      if (searchQuery) {
        let origin = location.origin;
        window.location.href = origin + \\\`/search?q=\\\${encodeURIComponent(searchQuery)}\\\`;
      }
    }
  });
</script>`])), maybeRenderHead());
}, "C:/Users/Sreek/website/src/components/Search.astro", void 0);

const $$Astro = createAstro();
const $$HeaderLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HeaderLink;
  const { href, class: className, ...props } = Astro2.props;
  const pathname = Astro2.url.pathname.replace("/", "");
  const subpath = pathname.match(/[^\/]+/g);
  const isActive = href === pathname || href === "/" + (subpath?.[0] || "");
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute([className, { active: isActive }], "class:list")}${spreadAttributes(props)} data-astro-cid-eimmu3lg> ${renderSlot($$result, $$slots["default"])} </a> `;
}, "C:/Users/Sreek/website/src/components/HeaderLink.astro", void 0);

const $$Sidebar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<aside class="sidebar" id="sidebar" data-astro-cid-ssfzsv2f> <nav class="sidebar-nav" data-astro-cid-ssfzsv2f> ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/", "data-astro-cid-ssfzsv2f": true }, { "default": ($$result2) => renderTemplate`Home` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/blog", "data-astro-cid-ssfzsv2f": true }, { "default": ($$result2) => renderTemplate`Blog` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/books", "data-astro-cid-ssfzsv2f": true }, { "default": ($$result2) => renderTemplate`Books` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/notes", "data-astro-cid-ssfzsv2f": true }, { "default": ($$result2) => renderTemplate`Notes` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/dashboard", "data-astro-cid-ssfzsv2f": true }, { "default": ($$result2) => renderTemplate`Dashboard` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/about", "data-astro-cid-ssfzsv2f": true }, { "default": ($$result2) => renderTemplate`About` })} ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/chess", "data-astro-cid-ssfzsv2f": true }, { "default": ($$result2) => renderTemplate`Chess` })}  </nav> </aside> `;
}, "C:/Users/Sreek/website/src/components/Sidebar.astro", void 0);

export { $$Sidebar as $, $$Search as a };

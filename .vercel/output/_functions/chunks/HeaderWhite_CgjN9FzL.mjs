import { c as createComponent, d as renderTemplate, e as renderScript, b as renderComponent, m as maybeRenderHead } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { S as SITE_TITLE } from './consts_C65Ylqha.mjs';
import { $ as $$Sidebar, a as $$Search } from './Sidebar_DyXe4Gk3.mjs';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$HeaderWhite = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", '<header style="background-color: #fff;" data-astro-cid-byzmuleb> <nav data-astro-cid-byzmuleb> <div class="nav-left" data-astro-cid-byzmuleb> <button class="menu-icon" id="menuIcon" aria-label="Toggle menu" data-astro-cid-byzmuleb> <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 2rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu" data-astro-cid-byzmuleb><line x1="3" y1="12" x2="21" y2="12" data-astro-cid-byzmuleb></line><line x1="3" y1="6" x2="21" y2="6" data-astro-cid-byzmuleb></line><line x1="3" y1="18" x2="21" y2="18" data-astro-cid-byzmuleb></line></svg> </button> <a href="/" class="site-title" data-astro-cid-byzmuleb>', '</a> </div> <div class="nav-right-group" data-astro-cid-byzmuleb> <div class="nav-right" data-astro-cid-byzmuleb> ', ' </div> <div id="login" data-astro-cid-byzmuleb> <a href="/login" class="login-button" data-astro-cid-byzmuleb>Login</a> </div> </div> </nav> </header> <div class="overlay" id="sidebarOverlay" data-astro-cid-byzmuleb></div> ', "  <script>\nconst menuIcon = document.getElementById('menuIcon');\nconst sidebar = document.getElementById('sidebar');\nconst overlay = document.getElementById('sidebarOverlay');\nconst body = document.body;\nfunction toggleSidebar() {\n	sidebar.classList.toggle('open');\n	overlay.classList.toggle('visible');\n	body.classList.toggle('sidebar-open');\n}\nmenuIcon.addEventListener('click', toggleSidebar);\noverlay.addEventListener('click', toggleSidebar);\nwindow.addEventListener('resize', () => {\n	if (window.innerWidth > 768 && sidebar.classList.contains('open')) {\n		toggleSidebar();\n	}\n});\n<\/script> ", ""])), maybeRenderHead(), SITE_TITLE, renderComponent($$result, "Search", $$Search, { "data-astro-cid-byzmuleb": true }), renderComponent($$result, "Sidebar", $$Sidebar, { "data-astro-cid-byzmuleb": true }), renderScript($$result, "C:/Users/Sreek/website/src/components/HeaderWhite.astro?astro&type=script&index=0&lang.ts"));
}, "C:/Users/Sreek/website/src/components/HeaderWhite.astro", void 0);

export { $$HeaderWhite as $ };

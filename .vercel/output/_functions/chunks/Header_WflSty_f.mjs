import { c as createComponent, d as renderTemplate, e as renderScript, b as renderComponent, m as maybeRenderHead } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { S as SITE_TITLE } from './consts_C65Ylqha.mjs';
import { $ as $$Sidebar, a as $$Search } from './Sidebar_DyXe4Gk3.mjs';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", '<header style="background-color :  #fef8f4;" data-astro-cid-3ef6ksr2> <nav data-astro-cid-3ef6ksr2> <div class="nav-left" data-astro-cid-3ef6ksr2> <button class="menu-icon" id="menuIcon" aria-label="Toggle menu" data-astro-cid-3ef6ksr2> <svg xmlns="http://www.w3.org/2000/svg" style="margin-left : 2rem;" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu" data-astro-cid-3ef6ksr2><line x1="3" y1="12" x2="21" y2="12" data-astro-cid-3ef6ksr2></line><line x1="3" y1="6" x2="21" y2="6" data-astro-cid-3ef6ksr2></line><line x1="3" y1="18" x2="21" y2="18" data-astro-cid-3ef6ksr2></line></svg> </button> <a href="/" class="site-title" data-astro-cid-3ef6ksr2>', '</a> </div> <div class="nav-right-group" data-astro-cid-3ef6ksr2> <div class="nav-right" data-astro-cid-3ef6ksr2> ', ' </div> <div id="login" data-astro-cid-3ef6ksr2> <a href="/login" class="login-button lesswrong-login" data-astro-cid-3ef6ksr2>Login</a> </div> </div> </nav> </header> <div class="overlay" id="sidebarOverlay" data-astro-cid-3ef6ksr2></div> ', "  <script>\n	const menuIcon = document.getElementById('menuIcon');\n	const sidebar = document.getElementById('sidebar');\n	const overlay = document.getElementById('sidebarOverlay');\n	const body = document.body;\n\n	function toggleSidebar() {\n		sidebar.classList.toggle('open');\n		overlay.classList.toggle('visible');\n		body.classList.toggle('sidebar-open');\n	}\n\n	menuIcon.addEventListener('click', toggleSidebar);\n	overlay.addEventListener('click', toggleSidebar);\n\n	window.addEventListener('resize', () => {\n		if (window.innerWidth > 768 && sidebar.classList.contains('open')) {\n			toggleSidebar();\n		}\n	});\n<\/script> ", " "])), maybeRenderHead(), SITE_TITLE, renderComponent($$result, "Search", $$Search, { "data-astro-cid-3ef6ksr2": true }), renderComponent($$result, "Sidebar", $$Sidebar, { "data-astro-cid-3ef6ksr2": true }), renderScript($$result, "C:/Users/Sreek/website/src/components/Header.astro?astro&type=script&index=0&lang.ts"));
}, "C:/Users/Sreek/website/src/components/Header.astro", void 0);

export { $$Header as $ };

import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$PostCard } from '../chunks/PostCard_Bx0oMM6i.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const res = await fetch(`${"http://localhost:4321/"}api/auth/get_posts`);
  const { posts } = await res.json();
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="welcome-section" data-astro-cid-j7pv25f6> <div class="header-content" data-astro-cid-j7pv25f6> <img src="/Agora_final_cropped.jpg" alt="Agora Logo" class="agora-logo" data-astro-cid-j7pv25f6> <div class="subtitle" data-astro-cid-j7pv25f6>Personal space for ideas and discourse</div> </div> <div class="description" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>Welcome to my corner of the internet. This is where I share my thoughts and engage in meaningful discussions. I've built this space to explore ideas, share knowledge, and connect with others who are curious about the world. No moderation say whatever you want just no spamming please</p> <p data-astro-cid-j7pv25f6>Feel free to join the conversation through posting your own things, commenting on posts, or learning more about me in the sidebar. Posts are organized by topic and can be filtered by tags to help you find what interests you most.</p> </div> <div class="navigation-hints" data-astro-cid-j7pv25f6> <div class="hint" data-astro-cid-j7pv25f6> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6> <line x1="3" y1="12" x2="21" y2="12" data-astro-cid-j7pv25f6></line> <line x1="3" y1="6" x2="21" y2="6" data-astro-cid-j7pv25f6></line> <line x1="3" y1="18" x2="21" y2="18" data-astro-cid-j7pv25f6></line> </svg> <span data-astro-cid-j7pv25f6>Find my background and interests in the sidebar</span> </div> <div class="hint" data-astro-cid-j7pv25f6> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6> <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" data-astro-cid-j7pv25f6></path> </svg> <span data-astro-cid-j7pv25f6>Join the discussion in the comments below</span> </div> </div> </div> <main id="posts-container" data-astro-cid-j7pv25f6> <div class="section-header" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>Recent Posts</h2> <div class="section-description" data-astro-cid-j7pv25f6>Latest thoughts and discussions</div> </div> ${posts.length === 0 ? renderTemplate`<p class="empty-state" data-astro-cid-j7pv25f6>No posts yet!</p>` : posts.map((post) => renderTemplate`${renderComponent($$result2, "Postcard", $$PostCard, { "post": post, "key": post.id, "data-astro-cid-j7pv25f6": true })}`)} </main> ` })} `;
}, "C:/Users/Sreek/website/src/pages/index.astro", void 0);
const $$file = "C:/Users/Sreek/website/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { c as createComponent, f as createAstro, a as renderHead, b as renderComponent, d as renderTemplate, e as renderScript } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$ProfilePostCard } from '../chunks/ProfilePostCard_7PJih-xe.mjs';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profile;
  const res = await fetch(`${"http://localhost:4321/"}api/auth/get_posts`);
  const { posts } = await res.json();
  const userRes = await fetch(`${"http://localhost:4321/"}api/auth/user-data`, { headers: { cookie: Astro2.request.headers.get("cookie") || "" } });
  const { user } = await userRes.json();
  const profile_posts = posts.filter((post) => post.author_id === user.id).slice(0, 3);
  return renderTemplate`<html lang="en" data-astro-cid-wwes6yjo> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Profile</title>${renderHead()}</head> <body style="background: #f8f2e4; color: #1a1a1a; margin: 0; padding: 0; font-family: Georgia, serif;" data-astro-cid-wwes6yjo> ${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-wwes6yjo": true }, { "default": async ($$result2) => renderTemplate` <main class="profile-main-lw" data-astro-cid-wwes6yjo> <section class="profile-header-lw" data-astro-cid-wwes6yjo> <div class="profile-user-info-lw" data-astro-cid-wwes6yjo> <h1 id="username" class="profile-username-lw" data-astro-cid-wwes6yjo>Loading...</h1> <div class="user-stats-lw" id="user-stats" data-astro-cid-wwes6yjo></div> <div class="elo-display-lw" id="elo-display" data-astro-cid-wwes6yjo> <span class="elo-label-lw" data-astro-cid-wwes6yjo>Chess Rating</span> <span class="elo-value-lw" id="elo-value" data-astro-cid-wwes6yjo>Loading...</span> </div> </div> <nav class="profile-nav-lw" data-astro-cid-wwes6yjo> <a href="#posts" class="profile-link-lw" data-astro-cid-wwes6yjo>My Posts</a> <span class="profile-nav-sep" data-astro-cid-wwes6yjo>&bull;</span> <a href="#" class="profile-link-lw" data-astro-cid-wwes6yjo>Favorites</a> <span class="profile-nav-sep" data-astro-cid-wwes6yjo>&bull;</span> <a href="#" class="profile-link-lw" data-astro-cid-wwes6yjo>Settings</a> <button class="logout-btn-lw" type="button" data-astro-cid-wwes6yjo>Logout</button> </nav> </section> <section class="profile-bio-lw-card" data-astro-cid-wwes6yjo> <h2 class="profile-section-title-lw" data-astro-cid-wwes6yjo>Bio</h2> <div id="Bio" class="profile-bio-text-lw" data-astro-cid-wwes6yjo>I am a traveler of many lands</div> </section> <section class="profile-posts-lw" id="posts" data-astro-cid-wwes6yjo> <div class="profile-posts-header-lw" data-astro-cid-wwes6yjo> <h2 class="profile-section-title-lw" data-astro-cid-wwes6yjo>Posts</h2> <div style="display: flex; align-items: center; gap: 0.3rem;" data-astro-cid-wwes6yjo> <button id="new-post-button-and-text" type="button" class="lw-new-post-btn" data-astro-cid-wwes6yjo>+ New Post</button> <button class="lw-plus-btn" aria-label="Quick Add Post" data-astro-cid-wwes6yjo>+</button> </div> </div> ${posts.length === 0 ? renderTemplate`<p class="profile-empty-lw" data-astro-cid-wwes6yjo>No posts yet!</p>` : profile_posts.map((post) => renderTemplate`${renderComponent($$result2, "ProfilePostCard", $$ProfilePostCard, { "post": post, "key": post.id, "data-astro-cid-wwes6yjo": true })}`)} </section> </main>  ${renderScript($$result2, "C:/Users/Sreek/website/src/pages/profile.astro?astro&type=script&index=0&lang.ts")} ` })} </body> </html>`;
}, "C:/Users/Sreek/website/src/pages/profile.astro", void 0);
const $$file = "C:/Users/Sreek/website/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

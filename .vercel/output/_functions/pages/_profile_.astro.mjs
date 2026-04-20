import { c as createComponent, f as createAstro, b as renderComponent, d as renderTemplate, m as maybeRenderHead, F as Fragment } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WebsiteLayout } from '../chunks/WebsiteLayout_DTNxKYpq.mjs';
import { $ as $$ProfilePostCard } from '../chunks/ProfilePostCard_7PJih-xe.mjs';
import { s as supabase } from '../chunks/supabase_DW_cx3tm.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$profile;
  const { profile } = Astro2.params;
  let userProfile = null;
  let userPosts = [];
  let error = null;
  try {
    const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("username", profile).single();
    if (profileError) {
      error = "User not found";
    } else {
      userProfile = profileData;
      const { data: postsData, error: postsError } = await supabase.from("posts").select("*").eq("author_id", userProfile.id).order("created_at", { ascending: false }).limit(10);
      if (!postsError) {
        userPosts = postsData || [];
      }
    }
  } catch (err) {
    error = "Failed to load profile";
  }
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WebsiteLayout, { "data-astro-cid-kzazsabd": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="profile-header" data-astro-cid-kzazsabd> ${error ? renderTemplate`<div class="error-message" data-astro-cid-kzazsabd> <h1 data-astro-cid-kzazsabd>User Not Found</h1> <p data-astro-cid-kzazsabd>The user "${profile}" could not be found.</p> <a href="/" class="back-link" data-astro-cid-kzazsabd>← Back to Home</a> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-kzazsabd": true }, { "default": async ($$result3) => renderTemplate` <div class="user-info" data-astro-cid-kzazsabd> <h1 class="username" data-astro-cid-kzazsabd>${userProfile.username}</h1> <div class="user-stats" data-astro-cid-kzazsabd> <span data-astro-cid-kzazsabd>Joined: ${new Date(userProfile.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })}</span> </div> <div class="header-nav" data-astro-cid-kzazsabd> <a href="#posts" data-astro-cid-kzazsabd>Posts</a><span data-astro-cid-kzazsabd>&bull;</span> <a href="#" data-astro-cid-kzazsabd>Comments</a><span data-astro-cid-kzazsabd>&bull;</span> <a href="#" data-astro-cid-kzazsabd>Activity</a> </div> </div> <div data-astro-cid-kzazsabd> <h2 data-astro-cid-kzazsabd>Bio</h2> <h5 class="bio" data-astro-cid-kzazsabd>${userProfile.bio || "No bio available."}</h5> </div> <section class="post-section" id="posts" data-astro-cid-kzazsabd> <h2 data-astro-cid-kzazsabd>Posts</h2> <section id="posts" data-astro-cid-kzazsabd> ${userPosts.length === 0 ? renderTemplate`<p data-astro-cid-kzazsabd>No posts yet!</p>` : userPosts.map((post) => renderTemplate`${renderComponent($$result3, "ProfilePostCard", $$ProfilePostCard, { "post": post, "key": post.id, "data-astro-cid-kzazsabd": true })}`)} </section> </section> ` })}`} </div> ` })} `;
}, "C:/Users/Sreek/website/src/pages/[profile].astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/[profile].astro";
const $$url = "/[profile]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$profile,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

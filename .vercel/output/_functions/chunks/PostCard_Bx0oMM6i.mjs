import { c as createComponent, f as createAstro, m as maybeRenderHead, g as addAttribute, d as renderTemplate } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                        */

const $$Astro = createAstro();
const $$PostCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PostCard;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="lw-post-card" data-astro-cid-iyiqi2so> <!-- Vote column --> <div class="lw-vote-column" data-astro-cid-iyiqi2so> <div class="lw-vote-count" data-astro-cid-iyiqi2so>${post.gratitude ?? 0}</div> </div> <!-- Main content --> <div class="lw-post-content" data-astro-cid-iyiqi2so> <a${addAttribute(`posts/${post.id}`, "href")} class="lw-post-title" data-astro-cid-iyiqi2so> ${post.title} </a> <div class="lw-post-meta" data-astro-cid-iyiqi2so> <a${addAttribute(`/${post.username}`, "href")} class="lw-post-author" data-astro-cid-iyiqi2so> ${post.username} </a> <span class="lw-dot" data-astro-cid-iyiqi2so>•</span> <time${addAttribute(post.created_at, "datetime")} class="lw-post-date" data-astro-cid-iyiqi2so> ${new Date(post.created_at).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" })} </time> </div> </div> <!-- Comment count --> <div class="lw-comments" data-astro-cid-iyiqi2so> <svg xmlns="http://www.w3.org/2000/svg" class="lw-comment-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-iyiqi2so> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-astro-cid-iyiqi2so></path> </svg> <span data-astro-cid-iyiqi2so>${post.comments_count ?? 0}</span> </div> <div class="lw-post-preview" data-astro-cid-iyiqi2so> <div class="lw-post-title" data-astro-cid-iyiqi2so> ${post.title} </div> <div class="post-length" data-astro-cid-iyiqi2so>
(${post.content.length} words)
</div> ${post.preview || post.content.slice(0, 300) + "..."} </div> </article> `;
}, "C:/Users/Sreek/website/src/components/PostCard.astro", void 0);

export { $$PostCard as $ };

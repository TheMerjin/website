import { c as createComponent, f as createAstro, m as maybeRenderHead, g as addAttribute, d as renderTemplate } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                             */

const $$Astro = createAstro();
const $$ProfilePostCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProfilePostCard;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="lw-post-card" data-astro-cid-4e6luzlg> <header class="lw-post-header" data-astro-cid-4e6luzlg> <a${addAttribute(`posts/${post.id}`, "href")} class="lw-post-title" data-astro-cid-4e6luzlg> ${post.title} </a> <div class="lw-post-meta" data-astro-cid-4e6luzlg> <span class="lw-post-author" data-astro-cid-4e6luzlg> <a${addAttribute(`/${post.username}`, "href")} style="color: inherit; text-decoration: none;" data-astro-cid-4e6luzlg> ${post.username} </a> </span> <time${addAttribute(post.created_at, "datetime")} class="lw-post-date" data-astro-cid-4e6luzlg> ${new Date(post.created_at).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" })} </time> </div> </header> <section class="lw-post-excerpt" data-astro-cid-4e6luzlg> ${post.content.length > 100 ? post.content.slice(0, 100) + "\u2026" : post.content} </section> </article> `;
}, "C:/Users/Sreek/website/src/components/ProfilePostCard.astro", void 0);

export { $$ProfilePostCard as $ };

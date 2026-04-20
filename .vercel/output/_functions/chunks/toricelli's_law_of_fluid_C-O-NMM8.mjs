import { c as createComponent, b as renderComponent, d as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$WhiteWebsiteLayout } from './WhiteWebsiteLayout_CHHoeKI6.mjs';
import katex from 'katex';
/* empty css                                            */
import './toricelli\'s_law_of_fluid.74ded793_D8SpQYQE.mjs';

const $$ToricellisLawOfFluid = createComponent(($$result, $$props, $$slots) => {
  const equation = "y = mx + b";
  katex.renderToString(equation, { throwOnError: false });
  const taylor_equation = "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n";
  katex.renderToString(taylor_equation, { throwOnError: false });
  const first_dy_dx = "\\frac{dy}{dx} = x - y";
  katex.renderToString(first_dy_dx, { throwOnError: false });
  const K = (latex) => katex.renderToString(latex, { throwOnError: false });
  return renderTemplate`${renderComponent($$result, "WebsiteLayout", $$WhiteWebsiteLayout, { "data-astro-cid-ovmaancs": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="post" data-astro-cid-ovmaancs> <h1 class="post-title" data-astro-cid-ovmaancs>
Toricelli's Law of Fluid Flow
</h1> <ul class="main-list" data-astro-cid-ovmaancs> <li class="main-item" data-astro-cid-ovmaancs> <p data-astro-cid-ovmaancs>
(a) Show that the standard gravity differential equation
<span data-astro-cid-ovmaancs>${unescapeHTML(K("\\frac{d^2h}{dt^2} = -g"))}</span>
implies that an object dropped from height
<span data-astro-cid-ovmaancs>${unescapeHTML(K("h(0)"))}</span>
lands with velocity
<span data-astro-cid-ovmaancs>${unescapeHTML(K("-\\sqrt{2gh(0)}"))}</span>.
</p> <ul class="sub-list" data-astro-cid-ovmaancs> <li class="sub-item" data-astro-cid-ovmaancs> <p data-astro-cid-ovmaancs>
We solve this by integrating:
</p> <div class="math-block" data-astro-cid-ovmaancs> <span data-astro-cid-ovmaancs>${unescapeHTML(K("\\frac{dh}{dt} = -gt + C_1"))}</span> </div> <div class="math-block" data-astro-cid-ovmaancs> <span data-astro-cid-ovmaancs>${unescapeHTML(K("h(t) = -\\frac{1}{2}gt^2 + C_1 t + C_2"))}</span> </div> <p data-astro-cid-ovmaancs>
Apply the initial condition that the object is dropped:
</p> <div class="math-block" data-astro-cid-ovmaancs> <span data-astro-cid-ovmaancs>${unescapeHTML(K("v(0)=0 \\Rightarrow C_1 = 0"))}</span> </div> <p data-astro-cid-ovmaancs>
So:
</p> <div class="math-block" data-astro-cid-ovmaancs> <span data-astro-cid-ovmaancs>${unescapeHTML(K("\\frac{dh}{dt} = -gt"))}</span> </div> <div class="math-block" data-astro-cid-ovmaancs> <span data-astro-cid-ovmaancs>${unescapeHTML(K("h(t) = h_0 - \\frac{1}{2}gt^2"))}</span> </div> <p data-astro-cid-ovmaancs>
Solve for <span data-astro-cid-ovmaancs>${unescapeHTML(K("t"))}</span> and substitute back:
</p> <div class="math-block" data-astro-cid-ovmaancs> <span data-astro-cid-ovmaancs>${unescapeHTML(K("v = -\\sqrt{2g(h_0 - h)}"))}</span> </div> </li> </ul> </li> <li data-astro-cid-ovmaancs>
(b)
</li> <li data-astro-cid-ovmaancs>
(c) The conical tank has a radius of 20 cm when it's filled to an initial depth of 50cm. A small round hole at the bottom has a diameter of 1cm. Determine A(h) and a then solve the differential equation <span data-astro-cid-ovmaancs>${unescapeHTML(K("A(h)\\frac{dh}{dt} = -a * \\sqrt{2*g*h}"))}</span>
and relate time and the height if the water.
<ul data-astro-cid-ovmaancs> <div data-astro-cid-ovmaancs> <li data-astro-cid-ovmaancs>
Let's do integration <span data-astro-cid-ovmaancs>${unescapeHTML(K("\\int{A(h)*dh/dt = \\int{-a*\\sqrt{2*g*h}}}"))}</span> and then
</li> </div></ul> </li> </ul> </main>  ` })}`;
}, "C:/Users/Sreek/website/src/pages/math/differential equations/toricelli's_law_of_fluid.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/math/differential equations/toricelli's_law_of_fluid.astro";
const $$url = "/math/differential equations/toricelli's_law_of_fluid";

const __vite_glob_0_2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ToricellisLawOfFluid,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { __vite_glob_0_2 as _ };

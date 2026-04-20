import { c as createComponent, b as renderComponent, m as maybeRenderHead, e as renderScript, d as renderTemplate, g as addAttribute } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$HeaderWhite } from '../chunks/HeaderWhite_CgjN9FzL.mjs';
import { $ as $$Index, a as $$Index$1 } from '../chunks/index_D1zd1PVJ.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$ErrorLog = createComponent(async ($$result, $$props, $$slots) => {
  let errors = [];
  try {
    const apiUrl = "http://localhost:4321/";
    const res = await fetch(`${apiUrl}/api/errors`);
    const data = await res.json();
    errors = data.errors || [];
  } catch (e) {
    console.error("Error fetching errors:", e);
    errors = [];
  }
  return renderTemplate`${renderComponent($$result, "HeaderWhite", $$HeaderWhite, { "data-astro-cid-7ri4q5ac": true })} ${maybeRenderHead()}<main class="lw-main" data-astro-cid-7ri4q5ac> <div class="epistemic-status" data-astro-cid-7ri4q5ac><p data-astro-cid-7ri4q5ac><em data-astro-cid-7ri4q5ac>Epistemic status: This log helps you improve by tracking mistakes and fixes.</em></p></div> <h1 class="lw-title" data-astro-cid-7ri4q5ac>Error Log</h1> <button id="add-error-btn" class="lw-btn lw-btn-add" data-astro-cid-7ri4q5ac>Add Error Entry</button> <form id="error-form" class="lw-error-form" style="display: none;" data-astro-cid-7ri4q5ac> <div class="lw-form-group" data-astro-cid-7ri4q5ac> <label data-astro-cid-7ri4q5ac>Date</label> <input type="date" name="date" id="error-date" required data-astro-cid-7ri4q5ac> </div> <div class="lw-form-group" data-astro-cid-7ri4q5ac> <label data-astro-cid-7ri4q5ac>What went wrong?</label> <input type="text" name="what_went_wrong" id="error-what" required data-astro-cid-7ri4q5ac> </div> <div class="lw-form-group" data-astro-cid-7ri4q5ac> <label data-astro-cid-7ri4q5ac>Why?</label> <textarea name="why" id="error-why" rows="2" data-astro-cid-7ri4q5ac></textarea> </div> <div class="lw-form-group" data-astro-cid-7ri4q5ac> <label data-astro-cid-7ri4q5ac>Fix?</label> <textarea name="fix" id="error-fix" rows="2" data-astro-cid-7ri4q5ac></textarea> </div> <div class="lw-form-actions" data-astro-cid-7ri4q5ac> <button type="submit" class="lw-btn" data-astro-cid-7ri4q5ac>Add Entry</button> <button type="button" id="cancel-form-btn" class="lw-btn" data-astro-cid-7ri4q5ac>Cancel</button> </div> </form> <div class="lw-table-scroll" data-astro-cid-7ri4q5ac> <table class="lw-table" data-astro-cid-7ri4q5ac> <thead data-astro-cid-7ri4q5ac> <tr data-astro-cid-7ri4q5ac> <th data-astro-cid-7ri4q5ac>Date</th><th data-astro-cid-7ri4q5ac>What went wrong?</th><th data-astro-cid-7ri4q5ac>Why?</th><th data-astro-cid-7ri4q5ac>Fix?</th><th data-astro-cid-7ri4q5ac></th> </tr> </thead> <tbody id="errors-tbody" data-astro-cid-7ri4q5ac> ${errors.length === 0 ? renderTemplate`<tr data-astro-cid-7ri4q5ac><td colspan="5" style="text-align:center;color:#888;font-style:italic;" data-astro-cid-7ri4q5ac>No errors logged yet.</td></tr>` : errors.map((error) => renderTemplate`<tr${addAttribute(error.id, "data-error-id")} data-astro-cid-7ri4q5ac> <td data-astro-cid-7ri4q5ac>${new Date(error.date).toLocaleDateString()}</td> <td data-astro-cid-7ri4q5ac>${error.what_went_wrong}</td> <td data-astro-cid-7ri4q5ac>${error.why || "-"}</td> <td data-astro-cid-7ri4q5ac>${error.fix || "-"}</td> <td data-astro-cid-7ri4q5ac> <button class="lw-btn-delete"${addAttribute(error.id, "data-error-id")} style="padding: 0.1rem 0.5rem; font-size: 0.85rem;" data-astro-cid-7ri4q5ac>Delete</button> </td> </tr>`)} </tbody> </table> </div> <a href="/dashboard" class="lw-btn" data-astro-cid-7ri4q5ac>Back to Dashboard</a> </main>  ${renderScript($$result, "C:/Users/Sreek/website/src/pages/error-log.astro?astro&type=script&index=0&lang.ts")} ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-7ri4q5ac": true })} ${renderComponent($$result, "SpeedInsights", $$Index$1, { "data-astro-cid-7ri4q5ac": true })}`;
}, "C:/Users/Sreek/website/src/pages/error-log.astro", void 0);
const $$file = "C:/Users/Sreek/website/src/pages/error-log.astro";
const $$url = "/error-log";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ErrorLog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

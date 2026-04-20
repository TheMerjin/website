import { c as createComponent, f as createAstro, b as renderComponent, m as maybeRenderHead, F as Fragment, d as renderTemplate, g as addAttribute } from '../../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$HeaderWhite } from '../../chunks/HeaderWhite_CgjN9FzL.mjs';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$taskid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$taskid;
  const { taskid } = Astro2.params;
  console.log(taskid);
  let data = null;
  let task = null;
  let tasks = null;
  const cookie = Astro2.request.headers.get("cookie") || "";
  try {
    const res = await fetch(`${"http://localhost:4321/"}api/tasks`, {
      headers: { cookie }
    });
    if (res.ok) {
      data = await res.json();
      tasks = data.tasks;
    }
  } catch (e) {
    console.log(e);
    task = null;
  }
  for (const t of tasks) {
    if (t.id === taskid) {
      task = t;
    }
  }
  return renderTemplate`${renderComponent($$result, "HeaderWhite", $$HeaderWhite, { "data-astro-cid-lewyfymj": true })} ${maybeRenderHead()}<main class="lw-main" data-astro-cid-lewyfymj> <div class="lw-header-row" data-astro-cid-lewyfymj> <h1 class="lw-title" data-astro-cid-lewyfymj>Task Details</h1> <a href="/master-tracker" class="lw-btn lw-btn-back" aria-label="Go back to Master Tracker" data-astro-cid-lewyfymj>Go Back to Master Tracker</a> </div> ${task ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-lewyfymj": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <section class="lw-section" data-astro-cid-lewyfymj> <table class="lw-table" style="max-width: 600px; margin: 0 auto;" data-astro-cid-lewyfymj> <tbody data-astro-cid-lewyfymj> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>Class</th><td data-astro-cid-lewyfymj>', "</td></tr> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>Item</th><td data-astro-cid-lewyfymj>", "</td></tr> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>Type</th><td data-astro-cid-lewyfymj>", "</td></tr> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>Due Date</th><td data-astro-cid-lewyfymj>", "</td></tr> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>Est. Time</th><td data-astro-cid-lewyfymj>", "</td></tr> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>Status</th><td data-astro-cid-lewyfymj>", "</td></tr> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>Link</th><td data-astro-cid-lewyfymj>", "</td></tr> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>Notes</th><td data-astro-cid-lewyfymj>", '</td></tr> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>Time Left</th><td class="lw-taskid-cell" data-astro-cid-lewyfymj>', '</td></tr> <tr data-astro-cid-lewyfymj><th data-astro-cid-lewyfymj>ID</th><td class="lw-taskid-cell" data-astro-cid-lewyfymj>', `</td></tr> </tbody> </table> </section> <section class="lw-section" style="max-width:600px;margin:2rem auto 0 auto;" data-astro-cid-lewyfymj> <form id="edit-task-form" method="post" style="display:flex;flex-direction:column;gap:1rem;" data-astro-cid-lewyfymj> <div style="display:flex;gap:1.5rem;align-items:center;" data-astro-cid-lewyfymj> <label for="status" style="font-family:'Inter',Helvetica,Arial,sans-serif;font-weight:600;font-size:1rem;color:#232323;" data-astro-cid-lewyfymj>Status</label> <select name="status" id="status" style="border:1px solid #ccc;border-radius:0;padding:0.3rem 0.5rem;font-family:inherit;font-size:1rem;background:#fff;color:#1a1a1a;outline:none;" data-astro-cid-lewyfymj> <option value="To Do"`, ' data-astro-cid-lewyfymj>To Do</option> <option value="In Progress"', ' data-astro-cid-lewyfymj>In Progress</option> <option value="Done"', ` data-astro-cid-lewyfymj>Done</option> </select> </div> <div style="display:flex;gap:1.5rem;align-items:center;" data-astro-cid-lewyfymj> <label for="time_left" style="font-family:'Inter',Helvetica,Arial,sans-serif;font-weight:600;font-size:1rem;color:#232323;" data-astro-cid-lewyfymj>Time Left</label> <input type="number" step="any" name="time_left" id="time_left"`, ` style="border:1px solid #ccc;border-radius:0;padding:0.3rem 0.5rem;font-family:inherit;font-size:1rem;background:#fff;color:#1a1a1a;outline:none;width:120px;" data-astro-cid-lewyfymj> </div> <button type="submit" class="lw-btn lw-btn-back" style="width:max-content;" data-astro-cid-lewyfymj>Update Task</button> </form> <script type="module">
          const form = document.getElementById('edit-task-form');
          form.onsubmit = async (e) => {
            e.preventDefault();
            const status = form.status.value;
            const time_left = form.time_left.value;
            let ok = true;
            let msg = '';
            const urlParts = window.location.pathname.split('/');
            console.log(urlParts);
            const taskid = urlParts[urlParts.length - 1];
            console.log(taskid);

            // Update status
            const res1 = await fetch('/api/tasks/status_change', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: taskid , status : status, _update: true })
            });
            if (!res1.ok) { ok = false; msg += 'Failed to update status. '; console.log(res1); }
            // Update time_left
            const res2 = await fetch('/api/tasks/time_left_change', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: taskid , time_left: time_left })
            });
            if (!res2.ok) { ok = false; msg += 'Failed to update time left.'; }
            if (ok) {
              window.location.reload();
            } else {
              alert(msg);
            }
          };
        </script> </section> `])), task.class, task.item, task.type, task.due_date, task.est_time, task.status, task.link ? renderTemplate`<a${addAttribute(task.link, "href")} class="lw-link" data-astro-cid-lewyfymj>${task.link}</a>` : renderTemplate`<span style="color:#888;" data-astro-cid-lewyfymj>None</span>`, task.notes || renderTemplate`<span style="color:#888;" data-astro-cid-lewyfymj>None</span>`, task.time_left ?? renderTemplate`<span style="color:#888;" data-astro-cid-lewyfymj>Unknown</span>`, task.id, addAttribute(task.status === "To Do", "selected"), addAttribute(task.status === "In Progress", "selected"), addAttribute(task.status === "Done", "selected"), addAttribute(task.time_left ?? "", "value")) })}` : renderTemplate`<section class="lw-section" data-astro-cid-lewyfymj> <div style="color:#888; font-style:italic; text-align:center; padding:2rem;" data-astro-cid-lewyfymj>Task not found.</div> </section>`} </main> `;
}, "C:/Users/Sreek/website/src/pages/tasks/[taskid].astro", void 0);
const $$file = "C:/Users/Sreek/website/src/pages/tasks/[taskid].astro";
const $$url = "/tasks/[taskid]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$taskid,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

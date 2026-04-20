import { c as createComponent, f as createAstro, b as renderComponent, m as maybeRenderHead, d as renderTemplate, g as addAttribute } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$HeaderWhite } from '../chunks/HeaderWhite_CgjN9FzL.mjs';
import { $ as $$Index, a as $$Index$1 } from '../chunks/index_D1zd1PVJ.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  let tasks = [];
  const cookie = Astro2.request.headers.get("cookie") || "";
  try {
    const res = await fetch(`${"http://localhost:4321/"}api/tasks`, {
      headers: { cookie }
    });
    const data = await res.json();
    tasks = (data.tasks || []).sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    );
  } catch (e) {
    tasks = [];
  }
  function computePriority(task) {
    const dbDate = new Date(task.due_date);
    const now = /* @__PURE__ */ new Date();
    const diffMs = dbDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1e3 * 60 * 60 * 24));
    const estTime = Number(task.est_time) || 1;
    const timeLeft = Number(task.time_left) || estTime;
    const completionRatio = Math.max(0, Math.min(1, (estTime - timeLeft) / estTime));
    const timeUrgency = diffDays <= 0 ? 20 + Math.abs(diffDays) * 2 : 10 / Math.max(1, diffDays);
    const timeInvestment = Math.min(estTime / 2, 5);
    const completionBonus = completionRatio * 3;
    const overduePenalty = diffDays < 0 ? Math.abs(diffDays) * 5 : 0;
    const priority = timeUrgency + timeInvestment + completionBonus - overduePenalty;
    return Math.max(0, priority);
  }
  let task_priority = {};
  for (const task of tasks) {
    task_priority[task.id] = computePriority(task);
  }
  Object.entries(task_priority).sort(([, a], [, b]) => b - a);
  const incompleteTasks = tasks.filter((task) => task.status !== "Done");
  const sortedIncompleteTasks = incompleteTasks.sort((a, b) => {
    const priorityA = task_priority[a.id] || 0;
    const priorityB = task_priority[b.id] || 0;
    return priorityB - priorityA;
  });
  const topTwoTasks = sortedIncompleteTasks.slice(0, 2);
  console.log("top tasks");
  console.log(topTwoTasks);
  const nextTwoTasks = sortedIncompleteTasks.slice(2, 4);
  function getDaysFromNow(dueDate) {
    const [year, month, day] = dueDate.split("-").map(Number);
    const dueStart = new Date(year, month - 1, day);
    const now = /* @__PURE__ */ new Date();
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = dueStart.getTime() - nowStart.getTime();
    const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24));
    console.log("getDaysFromNow - dueDate:", dueDate, "dueStart:", dueStart, "nowStart:", nowStart, "diffDays:", diffDays);
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${diffDays} days`;
    }
  }
  return renderTemplate`${renderComponent($$result, "HeaderWhite", $$HeaderWhite, { "data-astro-cid-3nssi2tu": true })} ${maybeRenderHead()}<main class="lw-main" data-astro-cid-3nssi2tu> <div class="epistemic-status" data-astro-cid-3nssi2tu><p data-astro-cid-3nssi2tu><em data-astro-cid-3nssi2tu>Epistemic status: This dashboard summarizes your current tasks and links to all core tools. Minimal, neutral, and information-dense.</em></p></div> <h1 class="lw-title" data-astro-cid-3nssi2tu>Dashboard</h1> <section class="lw-section" data-astro-cid-3nssi2tu> <h2 class="lw-h2" data-astro-cid-3nssi2tu>Today's Tasks</h2> <ul class="lw-list" data-astro-cid-3nssi2tu> ${topTwoTasks.length === 0 ? renderTemplate`<li style="color:#888;font-style:italic;" data-astro-cid-3nssi2tu>No tasks for today.</li>` : topTwoTasks.map((task) => {
    const dueDate = new Date(task.due_date);
    const daysFromNow = getDaysFromNow(task.due_date);
    console.log(task.due_date);
    console.log(dueDate);
    const isOverdue = dueDate < /* @__PURE__ */ new Date();
    let percentCompleted = null;
    if (task.est_time && task.time_left !== null && task.time_left !== void 0 && Number(task.est_time) > 0) {
      percentCompleted = Math.max(0, Math.min(1, 1 - Number(task.time_left) / Number(task.est_time)));
    }
    const [year, month, day] = task.due_date.split("-").map(Number);
    const dueStart = new Date(year, month - 1, day);
    console.log("Original date string:", task.due_date);
    console.log("Parsed components:", { year, month, day });
    console.log("dueStart:", dueStart);
    const formattedDate = dueStart.toLocaleDateString(void 0, { month: "short", day: "numeric" });
    console.log("formattedDate:", formattedDate);
    return renderTemplate`<li class="lw-task-item" data-astro-cid-3nssi2tu> <div class="lw-task-content" data-astro-cid-3nssi2tu> <span class="lw-task-title" data-astro-cid-3nssi2tu> <a${addAttribute(`/tasks/${task.id}`, "href")} class="lw-task-link" data-astro-cid-3nssi2tu>${task.item}</a> </span> <span class="lw-task-class" data-astro-cid-3nssi2tu>${task.class}</span> </div> <div class="lw-task-meta" data-astro-cid-3nssi2tu> <span class="lw-task-date" data-astro-cid-3nssi2tu>${formattedDate}</span> <span${addAttribute(`lw-task-status ${isOverdue ? "overdue" : ""}`, "class")} data-astro-cid-3nssi2tu> ${daysFromNow} </span> <span class="lw-task-priority" data-astro-cid-3nssi2tu>
Priority: ${Math.round(task_priority[task.id] || 0)} </span> <span class="lw-task-percent{percentCompleted === 0 ? ' lw-task-percent-zero' : ''}" data-astro-cid-3nssi2tu> ${percentCompleted !== null ? `${Math.round(percentCompleted * 100)}% completed` : "N/A"} </span> </div> </li>`;
  })} </ul> <h2 class="lw-h2" data-astro-cid-3nssi2tu>Next 7 Days</h2> <ul class="lw-list" data-astro-cid-3nssi2tu> ${nextTwoTasks.length === 0 ? renderTemplate`<li style="color:#888;font-style:italic;" data-astro-cid-3nssi2tu>No tasks for the next 7 days.</li>` : nextTwoTasks.map((task) => {
    const dueDate = new Date(task.due_date);
    const daysFromNow = getDaysFromNow(task.due_date);
    const isOverdue = dueDate < /* @__PURE__ */ new Date();
    const [year, month, day] = task.due_date.split("-").map(Number);
    const dueStart = new Date(year, month - 1, day);
    const formattedDate = dueStart.toLocaleDateString(void 0, { month: "short", day: "numeric" });
    return renderTemplate`<li class="lw-task-item" data-astro-cid-3nssi2tu> <div class="lw-task-content" data-astro-cid-3nssi2tu> <span class="lw-task-title" data-astro-cid-3nssi2tu> <a${addAttribute(`/tasks/${task.id}`, "href")} class="lw-task-link" data-astro-cid-3nssi2tu>${task.item}</a> </span> <span class="lw-task-class" data-astro-cid-3nssi2tu>${task.class}</span> </div> <div class="lw-task-meta" data-astro-cid-3nssi2tu> <span class="lw-task-date" data-astro-cid-3nssi2tu>${formattedDate}</span> <span${addAttribute(`lw-task-status ${isOverdue ? "overdue" : ""}`, "class")} data-astro-cid-3nssi2tu> ${daysFromNow} </span> <span class="lw-task-priority" data-astro-cid-3nssi2tu>
Priority: ${Math.round(task_priority[task.id] || 0)} </span> </div> </li>`;
  })} </ul> <button class="lw-btn lw-btn-add" data-astro-cid-3nssi2tu>Quick Add Task/Note</button> <a href="/notes" class="lw-link" data-astro-cid-3nssi2tu>Go to Daily Notes</a> <div class="lw-quicklinks" data-astro-cid-3nssi2tu> <span class="lw-h3" data-astro-cid-3nssi2tu>Quick Links:</span> <a href="#" class="lw-link" data-astro-cid-3nssi2tu>Google Classroom</a> <a href="#" class="lw-link" data-astro-cid-3nssi2tu>OneNote</a> <a href="#" class="lw-link" data-astro-cid-3nssi2tu>Albert</a> <a href="#" class="lw-link" data-astro-cid-3nssi2tu>Drive</a> </div> </section> <hr class="lw-hr" data-astro-cid-3nssi2tu> <section class="lw-section" data-astro-cid-3nssi2tu> <h2 class="lw-h2" data-astro-cid-3nssi2tu>Master Tracker (Preview)</h2> <div class="lw-table-scroll" data-astro-cid-3nssi2tu> <table class="lw-table" data-astro-cid-3nssi2tu> <thead data-astro-cid-3nssi2tu> <tr data-astro-cid-3nssi2tu> <th data-astro-cid-3nssi2tu>Class</th><th data-astro-cid-3nssi2tu>Item</th><th data-astro-cid-3nssi2tu>Type</th><th data-astro-cid-3nssi2tu>Due</th><th data-astro-cid-3nssi2tu>Status</th> </tr> </thead> <tbody data-astro-cid-3nssi2tu> ${tasks.length === 0 && renderTemplate`<tr data-astro-cid-3nssi2tu><td colspan="5" style="text-align:center;color:#888;font-style:italic;" data-astro-cid-3nssi2tu>No tasks found.</td></tr>`} ${tasks.map((task) => renderTemplate`<tr data-astro-cid-3nssi2tu> <td data-astro-cid-3nssi2tu>${task.class}</td> <td data-astro-cid-3nssi2tu><a${addAttribute(`/tasks/${task.id}`, "href")} class="lw-task-link" data-astro-cid-3nssi2tu>${task.item}</a></td> <td data-astro-cid-3nssi2tu>${task.type}</td> <td data-astro-cid-3nssi2tu>${task.due_date}</td> <td data-astro-cid-3nssi2tu>${task.status}</td> </tr>`)} </tbody> </table> </div> </section> <hr class="lw-hr" data-astro-cid-3nssi2tu> <section class="lw-section lw-nav-row" data-astro-cid-3nssi2tu> <a href="/tasks-kanban" class="lw-btn" data-astro-cid-3nssi2tu>Task Board (Kanban)</a> <a href="/master-tracker" class="lw-btn" data-astro-cid-3nssi2tu>Master Tracker</a> <a href="/calendar" class="lw-btn" data-astro-cid-3nssi2tu>Calendar</a> <a href="/error-log" class="lw-btn" data-astro-cid-3nssi2tu>Error Log</a> <a href="/digital-archive" class="lw-btn" data-astro-cid-3nssi2tu>Digital Archive</a> </section> </main>  ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-3nssi2tu": true })} ${renderComponent($$result, "SpeedInsights", $$Index$1, { "data-astro-cid-3nssi2tu": true })}`;
}, "C:/Users/Sreek/website/src/pages/dashboard.astro", void 0);
const $$file = "C:/Users/Sreek/website/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

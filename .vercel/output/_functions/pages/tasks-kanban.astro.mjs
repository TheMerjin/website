import { c as createComponent, f as createAstro, b as renderComponent, m as maybeRenderHead, e as renderScript, g as addAttribute, d as renderTemplate } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$HeaderWhite } from '../chunks/HeaderWhite_CgjN9FzL.mjs';
import { $ as $$Index, a as $$Index$1 } from '../chunks/index_D1zd1PVJ.mjs';
/* empty css                                        */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$TasksKanban = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TasksKanban;
  let tasks = [];
  const cookie = Astro2.request.headers.get("cookie") || "";
  try {
    const res = await fetch(`${"http://localhost:4321/"}api/tasks`, {
      headers: { cookie }
    });
    const data = await res.json();
    tasks = data.tasks || [];
  } catch (e) {
    tasks = [];
  }
  const tasksByStatus = {
    "To Do": tasks.filter((t) => t.status === "To Do"),
    "In Progress": tasks.filter((t) => t.status === "In Progress"),
    "Done": tasks.filter((t) => t.status === "Done")
  };
  return renderTemplate`${renderComponent($$result, "HeaderWhite", $$HeaderWhite, { "data-astro-cid-r7nav2be": true })} ${maybeRenderHead()}<main class="kanban-main" data-astro-cid-r7nav2be> <div class="kanban-header" data-astro-cid-r7nav2be> <h1 class="kanban-title" data-astro-cid-r7nav2be>Task Board</h1> <div class="kanban-actions" data-astro-cid-r7nav2be> <a href="/dashboard" class="kanban-link" data-astro-cid-r7nav2be>Dashboard</a> <a href="/master-tracker" class="kanban-link" data-astro-cid-r7nav2be>Table View</a> </div> </div> <div class="kanban-container" data-astro-cid-r7nav2be> <div class="kanban-column" data-status="To Do" data-astro-cid-r7nav2be> <div class="kanban-column-header" data-astro-cid-r7nav2be> <h2 data-astro-cid-r7nav2be>To Do</h2> <span class="kanban-count" data-astro-cid-r7nav2be>${tasksByStatus["To Do"].length}</span> </div> <div class="kanban-cards" id="todo-cards" data-astro-cid-r7nav2be> ${tasksByStatus["To Do"].map((task) => renderTemplate`<div class="kanban-card"${addAttribute(task.id, "data-task-id")} data-status="To Do" data-astro-cid-r7nav2be> <div class="kanban-card-header" data-astro-cid-r7nav2be> <h3 class="kanban-card-title" data-astro-cid-r7nav2be>${task.item}</h3> <span class="kanban-card-class" data-astro-cid-r7nav2be>${task.class}</span> </div> <div class="kanban-card-body" data-astro-cid-r7nav2be> ${task.type && renderTemplate`<div class="kanban-card-meta" data-astro-cid-r7nav2be><strong data-astro-cid-r7nav2be>Type:</strong> ${task.type}</div>`} <div class="kanban-card-meta" data-astro-cid-r7nav2be> <strong data-astro-cid-r7nav2be>Due:</strong> ${new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} </div> ${task.est_time && renderTemplate`<div class="kanban-card-meta" data-astro-cid-r7nav2be> <strong data-astro-cid-r7nav2be>Est. Time:</strong> ${task.est_time}h
${task.time_left !== null && task.time_left !== void 0 && renderTemplate`<span class="kanban-time-left" data-astro-cid-r7nav2be> (${task.time_left}h left)</span>`} </div>`} </div> <div class="kanban-card-footer" data-astro-cid-r7nav2be> <a${addAttribute(`/tasks/${task.id}`, "href")} class="kanban-card-link" data-astro-cid-r7nav2be>View Details</a> <div class="kanban-card-actions" data-astro-cid-r7nav2be> <button class="kanban-move-btn"${addAttribute(task.id, "data-task-id")} data-target="In Progress" data-astro-cid-r7nav2be>→</button> <button class="kanban-move-btn"${addAttribute(task.id, "data-task-id")} data-target="Done" data-astro-cid-r7nav2be>✓</button> </div> </div> </div>`)} ${tasksByStatus["To Do"].length === 0 && renderTemplate`<div class="kanban-empty" data-astro-cid-r7nav2be>No tasks</div>`} </div> </div> <div class="kanban-column" data-status="In Progress" data-astro-cid-r7nav2be> <div class="kanban-column-header" data-astro-cid-r7nav2be> <h2 data-astro-cid-r7nav2be>In Progress</h2> <span class="kanban-count" data-astro-cid-r7nav2be>${tasksByStatus["In Progress"].length}</span> </div> <div class="kanban-cards" id="progress-cards" data-astro-cid-r7nav2be> ${tasksByStatus["In Progress"].map((task) => renderTemplate`<div class="kanban-card"${addAttribute(task.id, "data-task-id")} data-status="In Progress" data-astro-cid-r7nav2be> <div class="kanban-card-header" data-astro-cid-r7nav2be> <h3 class="kanban-card-title" data-astro-cid-r7nav2be>${task.item}</h3> <span class="kanban-card-class" data-astro-cid-r7nav2be>${task.class}</span> </div> <div class="kanban-card-body" data-astro-cid-r7nav2be> ${task.type && renderTemplate`<div class="kanban-card-meta" data-astro-cid-r7nav2be><strong data-astro-cid-r7nav2be>Type:</strong> ${task.type}</div>`} <div class="kanban-card-meta" data-astro-cid-r7nav2be> <strong data-astro-cid-r7nav2be>Due:</strong> ${new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} </div> ${task.est_time && renderTemplate`<div class="kanban-card-meta" data-astro-cid-r7nav2be> <strong data-astro-cid-r7nav2be>Est. Time:</strong> ${task.est_time}h
${task.time_left !== null && task.time_left !== void 0 && renderTemplate`<span class="kanban-time-left" data-astro-cid-r7nav2be> (${task.time_left}h left)</span>`} </div>`} </div> <div class="kanban-card-footer" data-astro-cid-r7nav2be> <a${addAttribute(`/tasks/${task.id}`, "href")} class="kanban-card-link" data-astro-cid-r7nav2be>View Details</a> <div class="kanban-card-actions" data-astro-cid-r7nav2be> <button class="kanban-move-btn"${addAttribute(task.id, "data-task-id")} data-target="To Do" data-astro-cid-r7nav2be>←</button> <button class="kanban-move-btn"${addAttribute(task.id, "data-task-id")} data-target="Done" data-astro-cid-r7nav2be>✓</button> </div> </div> </div>`)} ${tasksByStatus["In Progress"].length === 0 && renderTemplate`<div class="kanban-empty" data-astro-cid-r7nav2be>No tasks</div>`} </div> </div> <div class="kanban-column" data-status="Done" data-astro-cid-r7nav2be> <div class="kanban-column-header" data-astro-cid-r7nav2be> <h2 data-astro-cid-r7nav2be>Done</h2> <span class="kanban-count" data-astro-cid-r7nav2be>${tasksByStatus["Done"].length}</span> </div> <div class="kanban-cards" id="done-cards" data-astro-cid-r7nav2be> ${tasksByStatus["Done"].map((task) => renderTemplate`<div class="kanban-card kanban-card-done"${addAttribute(task.id, "data-task-id")} data-status="Done" data-astro-cid-r7nav2be> <div class="kanban-card-header" data-astro-cid-r7nav2be> <h3 class="kanban-card-title" data-astro-cid-r7nav2be>${task.item}</h3> <span class="kanban-card-class" data-astro-cid-r7nav2be>${task.class}</span> </div> <div class="kanban-card-body" data-astro-cid-r7nav2be> ${task.type && renderTemplate`<div class="kanban-card-meta" data-astro-cid-r7nav2be><strong data-astro-cid-r7nav2be>Type:</strong> ${task.type}</div>`} <div class="kanban-card-meta" data-astro-cid-r7nav2be> <strong data-astro-cid-r7nav2be>Due:</strong> ${new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} </div> </div> <div class="kanban-card-footer" data-astro-cid-r7nav2be> <a${addAttribute(`/tasks/${task.id}`, "href")} class="kanban-card-link" data-astro-cid-r7nav2be>View Details</a> <div class="kanban-card-actions" data-astro-cid-r7nav2be> <button class="kanban-move-btn"${addAttribute(task.id, "data-task-id")} data-target="To Do" data-astro-cid-r7nav2be>←</button> </div> </div> </div>`)} ${tasksByStatus["Done"].length === 0 && renderTemplate`<div class="kanban-empty" data-astro-cid-r7nav2be>No tasks</div>`} </div> </div> </div> </main>  ${renderScript($$result, "C:/Users/Sreek/website/src/pages/tasks-kanban.astro?astro&type=script&index=0&lang.ts")} ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-r7nav2be": true })} ${renderComponent($$result, "SpeedInsights", $$Index$1, { "data-astro-cid-r7nav2be": true })}`;
}, "C:/Users/Sreek/website/src/pages/tasks-kanban.astro", void 0);
const $$file = "C:/Users/Sreek/website/src/pages/tasks-kanban.astro";
const $$url = "/tasks-kanban";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TasksKanban,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

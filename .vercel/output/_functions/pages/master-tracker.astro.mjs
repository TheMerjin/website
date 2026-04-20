import { c as createComponent, b as renderComponent, m as maybeRenderHead, d as renderTemplate } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$HeaderWhite } from '../chunks/HeaderWhite_CgjN9FzL.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { $ as $$Index, a as $$Index$1 } from '../chunks/index_D1zd1PVJ.mjs';
/* empty css                                          */
export { renderers } from '../renderers.mjs';

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];
function MasterTracker() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);
  const taskItemLinkStyle = {
    color: "#1a1a1a",
    textDecoration: "none",
    borderRadius: 0,
    outline: "none",
    transition: "background 0.15s, color 0.15s",
    padding: "0.02rem 0.2rem",
    margin: "-0.02rem -0.2rem",
    display: "inline-block",
    fontSize: "0.98rem",
    fontFamily: "Inter, Helvetica, Arial, sans-serif"
  };
  useEffect(() => {
    fetch("/api/tasks").then((res2) => res2.json()).then((data) => setTasks(data.tasks || []));
  }, []);
  const filteredTasks = showOnlyIncomplete ? tasks.filter((task) => task.status !== "Done") : tasks;
  function handleAddTask(e) {
    e.preventDefault();
    const form = e.target;
    const task = {
      class: form.class.value,
      item: form.item.value,
      type: form.type.value,
      due_date: form.due_date.value,
      status: form.status.value || "To Do",
      link: form.link.value,
      notes: form.notes.value,
      est_time: form.est_time.value,
      time_left: parseFloat(form.est_time.value) || 0
    };
    console.log(task);
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    }).then((res2) => res2.json()).then((data) => {
      setTasks((tasks2) => [...tasks2, data.task]);
      form.reset();
      setShowForm(false);
    });
    console.log(res);
    fetch("/api/auth/calendar_events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.class.value + " " + form.item.value,
        start: form.due_date.value,
        end_time: form.due_date.value,
        description: form.class.value + " " + form.item.value + form.type.value + form.status.value + form.link.value + form.notes.value,
        color: "grey"
      })
    }).then(console.log(res));
  }
  function handleDeleteTask(id) {
    fetch(`/api/tasks/${id}`, { method: "DELETE" }).then((res2) => res2.json()).then(() => setTasks((tasks2) => tasks2.filter((t) => t.id !== id)));
  }
  function handleStatusChange(id, newStatus) {
    fetch(`/api/tasks/status_change`, {
      method: "POST",
      // Use PATCH if you have it, otherwise POST with id
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus, _update: true })
    }).then((res2) => res2.json()).then(() => {
      setTasks((tasks2) => tasks2.map((t) => t.id === id ? { ...t, status: newStatus } : t));
    });
  }
  return /* @__PURE__ */ jsx("div", { style: { background: "#f9f9f9", minHeight: "100vh", padding: "0", fontFamily: "Georgia, serif" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 820, margin: "0 auto", padding: "32px 0 0 0" }, children: [
    /* @__PURE__ */ jsx("h1", { style: { fontFamily: "Inter, Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 28, margin: "0 0 24px 0", color: "#1a1a1a", letterSpacing: "-0.5px", borderBottom: "1px solid #e0e0e0", paddingBottom: 8 }, children: "Master Tracker" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 24 }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          style: {
            borderRadius: 0,
            border: "1px solid #aaa",
            backgroundColor: "#f3f3f3",
            color: "#111",
            padding: "7px 18px",
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            fontWeight: 500,
            fontSize: "15px",
            marginBottom: "0",
            cursor: "pointer",
            boxShadow: "none",
            outline: "none",
            transition: "background 0.1s",
            marginRight: 0
          },
          onClick: () => setShowForm((f) => !f),
          children: showForm ? "Cancel" : "Add Task"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          style: {
            borderRadius: 0,
            border: "1px solid #aaa",
            backgroundColor: showOnlyIncomplete ? "#e2e2e2" : "#f3f3f3",
            color: "#111",
            padding: "7px 18px",
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
            fontWeight: 500,
            fontSize: "15px",
            marginTop: "8px",
            cursor: "pointer",
            boxShadow: "none",
            outline: "none",
            transition: "background 0.1s",
            borderColor: showOnlyIncomplete ? "#888" : "#aaa"
          },
          onClick: () => setShowOnlyIncomplete((f) => !f),
          children: showOnlyIncomplete ? "Show All Tasks" : "Show Incomplete Only"
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxs(
      "form",
      {
        style: {
          background: "#f7f7f7",
          border: "1px solid #ddd",
          padding: "18px 18px 8px 18px",
          marginBottom: "28px",
          maxWidth: 600,
          borderRadius: 0,
          fontFamily: "Georgia, serif",
          fontSize: 15,
          color: "#222",
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
          gap: 10
        },
        onSubmit: handleAddTask,
        children: [
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: 600, marginBottom: 2, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 14, color: "#222" }, children: "Class" }),
            /* @__PURE__ */ jsx("input", { name: "class", style: { width: "100%", border: "1px solid #ccc", borderRadius: 0, padding: 5, fontFamily: "Georgia, serif", fontSize: 15, background: "#fff", color: "#222" } })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: 600, marginBottom: 2, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 14, color: "#222" }, children: "Item" }),
            /* @__PURE__ */ jsx("input", { name: "item", style: { width: "100%", border: "1px solid #ccc", borderRadius: 0, padding: 5, fontFamily: "Georgia, serif", fontSize: 15, background: "#fff", color: "#222" } })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: 600, marginBottom: 2, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 14, color: "#222" }, children: "Type" }),
            /* @__PURE__ */ jsx("input", { name: "type", style: { width: "100%", border: "1px solid #ccc", borderRadius: 0, padding: 5, fontFamily: "Georgia, serif", fontSize: 15, background: "#fff", color: "#222" } })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: 600, marginBottom: 2, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 14, color: "#222" }, children: "Due Date" }),
            /* @__PURE__ */ jsx("input", { name: "due_date", type: "date", style: { width: "100%", border: "1px solid #ccc", borderRadius: 0, padding: 5, fontFamily: "Georgia, serif", fontSize: 15, background: "#fff", color: "#222" } })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: 600, marginBottom: 2, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 14, color: "#222" }, children: "Est.Time (in hours)" }),
            /* @__PURE__ */ jsx("input", { name: "est_time", style: { width: "100%", border: "1px solid #ccc", borderRadius: 0, padding: 5, fontFamily: "Georgia, serif", fontSize: 15, background: "#fff", color: "#222" } })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: 600, marginBottom: 2, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 14, color: "#222" }, children: "Status" }),
            /* @__PURE__ */ jsx("select", { name: "status", defaultValue: "To Do", style: { width: "100%", border: "1px solid #ccc", borderRadius: 0, padding: 5, fontFamily: "Georgia, serif", fontSize: 15, background: "#fff", color: "#222" }, children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", { value: opt, children: opt }, opt)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: 600, marginBottom: 2, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 14, color: "#222" }, children: "Link" }),
            /* @__PURE__ */ jsx("input", { name: "link", style: { width: "100%", border: "1px solid #ccc", borderRadius: 0, padding: 5, fontFamily: "Georgia, serif", fontSize: 15, background: "#fff", color: "#222" } })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { marginBottom: 8 }, children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontWeight: 600, marginBottom: 2, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 14, color: "#222" }, children: "Notes" }),
            /* @__PURE__ */ jsx("textarea", { name: "notes", style: { width: "100%", border: "1px solid #ccc", borderRadius: 0, padding: 5, fontFamily: "Georgia, serif", fontSize: 15, background: "#fff", color: "#222", minHeight: 40 } })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              style: {
                borderRadius: 0,
                border: "1px solid #aaa",
                backgroundColor: "#f3f3f3",
                color: "#111",
                padding: "7px 18px",
                fontFamily: "Inter, Helvetica, Arial, sans-serif",
                fontWeight: 500,
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "none",
                outline: "none",
                marginTop: 8
              },
              children: "Add Task"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", background: "#fff", border: "1px solid #ddd", borderRadius: 0, boxShadow: "none" }, children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", background: "#fff", border: "none", borderRadius: 0, fontSize: 15, fontFamily: "Georgia, serif" }, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { style: { background: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }, children: [
        /* @__PURE__ */ jsx("th", { style: { border: "none", borderRight: "1px solid #eee", padding: "8px 6px", fontFamily: "Inter, Helvetica, Arial, sans-serif", fontWeight: 600, color: "#222", textAlign: "left" }, children: "Class" }),
        /* @__PURE__ */ jsx("th", { style: { border: "none", borderRight: "1px solid #eee", padding: "8px 6px", color: "#222", textAlign: "left" }, children: "Item" }),
        /* @__PURE__ */ jsx("th", { style: { border: "none", borderRight: "1px solid #eee", padding: "8px 6px", color: "#222", textAlign: "left" }, children: "Type" }),
        /* @__PURE__ */ jsx("th", { style: { border: "none", borderRight: "1px solid #eee", padding: "8px 6px", color: "#222", textAlign: "left" }, children: "Due Date" }),
        /* @__PURE__ */ jsx("th", { style: { border: "none", borderRight: "1px solid #eee", padding: "8px 6px", color: "#222", textAlign: "left" }, children: "Est. Time" }),
        /* @__PURE__ */ jsx("th", { style: { border: "none", borderRight: "1px solid #eee", padding: "8px 6px", color: "#222", textAlign: "left" }, children: "Status" }),
        /* @__PURE__ */ jsx("th", { style: { border: "none", borderRight: "1px solid #eee", padding: "8px 6px", color: "#222", textAlign: "left" }, children: "Link" }),
        /* @__PURE__ */ jsx("th", { style: { border: "none", borderRight: "1px solid #eee", padding: "8px 6px", color: "#222", textAlign: "left" }, children: "Notes" }),
        /* @__PURE__ */ jsx("th", { style: { border: "none", padding: "8px 6px" } })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: Array.isArray(filteredTasks) && filteredTasks.length > 0 ? filteredTasks.filter(Boolean).map((task) => /* @__PURE__ */ jsxs("tr", { style: { borderBottom: "1px solid #eee" }, children: [
        /* @__PURE__ */ jsx("td", { style: { border: "none", borderRight: "1px solid #f3f3f3", padding: "7px 6px", color: "#222" }, children: task.class }),
        /* @__PURE__ */ jsx("td", { style: { border: "none", borderRight: "1px solid #f3f3f3", padding: "7px 6px", color: "#222" }, children: /* @__PURE__ */ jsx(
          "a",
          {
            href: `/tasks/${task.id}`,
            style: taskItemLinkStyle,
            onMouseEnter: (e) => {
              e.target.style.background = "#f5f5f5";
              e.target.style.color = "#888";
            },
            onMouseLeave: (e) => {
              e.target.style.background = "none";
              e.target.style.color = "#1a1a1a";
            },
            onFocus: (e) => {
              e.target.style.background = "#f5f5f5";
              e.target.style.color = "#888";
              e.target.style.outline = "2px solid #2b6cb0";
            },
            onBlur: (e) => {
              e.target.style.background = "none";
              e.target.style.color = "#1a1a1a";
              e.target.style.outline = "none";
            },
            tabIndex: 0,
            children: task.item
          }
        ) }),
        /* @__PURE__ */ jsx("td", { style: { border: "none", borderRight: "1px solid #f3f3f3", padding: "7px 6px", color: "#222" }, children: task.type }),
        /* @__PURE__ */ jsx("td", { style: { border: "none", borderRight: "1px solid #f3f3f3", padding: "7px 6px", color: "#222" }, children: task.due_date }),
        /* @__PURE__ */ jsx("td", { style: { border: "none", borderRight: "1px solid #f3f3f3", padding: "7px 6px", color: "#222" }, children: task.est_time }),
        /* @__PURE__ */ jsx("td", { style: { border: "none", borderRight: "1px solid #f3f3f3", padding: "7px 6px", color: "#222" }, children: /* @__PURE__ */ jsx(
          "select",
          {
            value: task.status,
            onChange: (e) => handleStatusChange(task.id, e.target.value),
            style: {
              border: "1px solid #bbb",
              borderRadius: 0,
              background: "#fff",
              color: "#222",
              fontFamily: "Georgia, serif",
              fontSize: 15,
              padding: "3px 8px",
              outline: "none",
              minWidth: 110
            },
            children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", { value: opt, children: opt }, opt))
          }
        ) }),
        /* @__PURE__ */ jsx("td", { style: { border: "none", borderRight: "1px solid #f3f3f3", padding: "7px 6px", color: "#222" }, children: task.link ? /* @__PURE__ */ jsx(
          "a",
          {
            href: task.link,
            style: {
              color: "#2b6cb0",
              textDecoration: "none",
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontSize: "0.95rem",
              transition: "color 0.15s, text-decoration 0.15s"
            },
            onMouseEnter: (e) => e.target.style.textDecoration = "underline",
            onMouseLeave: (e) => e.target.style.textDecoration = "none",
            onFocus: (e) => e.target.style.textDecoration = "underline",
            onBlur: (e) => e.target.style.textDecoration = "none",
            children: "here"
          }
        ) : /* @__PURE__ */ jsx("span", { style: { color: "#888", fontStyle: "italic" }, children: "None" }) }),
        /* @__PURE__ */ jsx("td", { style: { border: "none", borderRight: "1px solid #f3f3f3", padding: "7px 6px", color: "#222" }, children: task.notes }),
        /* @__PURE__ */ jsx("td", { style: { border: "none", padding: "7px 6px" }, children: /* @__PURE__ */ jsx(
          "button",
          {
            style: {
              borderRadius: 0,
              border: "1px solid #aaa",
              backgroundColor: "#f3f3f3",
              color: "#111",
              padding: "4px 12px",
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "none",
              outline: "none"
            },
            onClick: () => handleDeleteTask(task.id),
            children: "Delete"
          }
        ) })
      ] }, task.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 9, style: { textAlign: "center", color: "#888", padding: 24, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 15 }, children: showOnlyIncomplete ? "No incomplete tasks found." : "No tasks found." }) }) })
    ] }) })
  ] }) });
}

const $$MasterTracker = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "HeaderWhite", $$HeaderWhite, { "data-astro-cid-yz757azv": true })} ${maybeRenderHead()}<main class="lw-main" data-astro-cid-yz757azv> <div class="lw-header-row" data-astro-cid-yz757azv> <h1 class="lw-title" data-astro-cid-yz757azv>Master Tracker</h1> <a href="/dashboard" class="lw-btn lw-btn-back" aria-label="Return to Dashboard" data-astro-cid-yz757azv>Return to Dashboard</a> </div> <div class="epistemic-status" data-astro-cid-yz757azv><p data-astro-cid-yz757azv><em data-astro-cid-yz757azv>Epistemic status: This is your single source of truth for all tasks and assignments.</em></p></div> ${renderComponent($$result, "MasterTrackerComponent", MasterTracker, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/MasterTracker.jsx", "client:component-export": "default", "data-astro-cid-yz757azv": true })} </main>  ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-yz757azv": true })} ${renderComponent($$result, "SpeedInsights", $$Index$1, { "data-astro-cid-yz757azv": true })}`;
}, "C:/Users/Sreek/website/src/pages/master-tracker.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/master-tracker.astro";
const $$url = "/master-tracker";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MasterTracker,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

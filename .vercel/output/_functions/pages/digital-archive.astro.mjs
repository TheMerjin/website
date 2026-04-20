import { c as createComponent, b as renderComponent, m as maybeRenderHead, d as renderTemplate } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$HeaderWhite } from '../chunks/HeaderWhite_CgjN9FzL.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from '../chunks/client-supabase_D77BrgKq.mjs';
import { $ as $$Index, a as $$Index$1 } from '../chunks/index_D1zd1PVJ.mjs';
/* empty css                                           */
export { renderers } from '../renderers.mjs';

function DigitalArchive() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    fetch("/api/archive").then((res) => res.json()).then((data) => setEntries(data.entries || []));
  }, [success]);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!file || !subject || !title) {
      setError("Please fill all required fields and select a file.");
      return;
    }
    setUploading(true);
    try {
      console.log(supabase);
      const res2 = await fetch("/api/auth/user-data");
      const data = await res2.json();
      const user = data.user;
      if (!user) throw new Error("Not authenticated");
      const filePath = `${user.id}/${subject}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("archive").upload(filePath, file);
      console.log(error);
      if (uploadError) throw uploadError;
      const res = await fetch("/api/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          title,
          description,
          file_path: filePath
        })
      });
      if (!res.ok) throw new Error("Failed to save metadata");
      setSuccess(true);
      setFile(null);
      setSubject("");
      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { style: { maxWidth: 800, margin: "0 auto", fontFamily: "Georgia, serif", background: "#fff", padding: 24 }, children: [
    /* @__PURE__ */ jsx("h1", { style: { fontFamily: "Inter, Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: 22, color: "#1a1a1a", marginBottom: 18 }, children: "Digital Archive" }),
    /* @__PURE__ */ jsx("div", { className: "epistemic-status", style: { background: "#f3f3f3", border: "1px solid #eee", fontSize: "0.98rem", fontStyle: "italic", color: "#444", margin: "0 0 1rem 0", padding: "0.5rem 0.8rem", borderRadius: 0 }, children: /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("em", { children: "Epistemic status: This is your organized digital archive for all class materials and scans." }) }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "lw-btn",
        style: { border: "1px solid #aaa", background: "#eee", color: "#111", fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 16, borderRadius: 0, padding: "0.2rem 1rem", marginBottom: 18 },
        onClick: () => setShowForm((f) => !f),
        children: showForm ? "Cancel" : "Add Item"
      }
    ),
    showForm && /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: {
      background: "#f7f7f7",
      border: "1px solid #ddd",
      borderRadius: 0,
      padding: 20,
      maxWidth: 500,
      margin: "0 auto 18px auto",
      fontFamily: "Georgia, serif",
      color: "#222",
      boxShadow: "none",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }, children: [
      /* @__PURE__ */ jsx("label", { style: { fontWeight: 600, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 15 }, children: "Subject *" }),
      /* @__PURE__ */ jsx("input", { type: "text", value: subject, onChange: (e) => setSubject(e.target.value), style: { border: "1px solid #ccc", borderRadius: 0, padding: 6, fontFamily: "Georgia, serif", fontSize: 15 }, required: true }),
      /* @__PURE__ */ jsx("label", { style: { fontWeight: 600, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 15 }, children: "Title *" }),
      /* @__PURE__ */ jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), style: { border: "1px solid #ccc", borderRadius: 0, padding: 6, fontFamily: "Georgia, serif", fontSize: 15 }, required: true }),
      /* @__PURE__ */ jsx("label", { style: { fontWeight: 600, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 15 }, children: "Description" }),
      /* @__PURE__ */ jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), style: { border: "1px solid #ccc", borderRadius: 0, padding: 6, fontFamily: "Georgia, serif", fontSize: 15, minHeight: 40 } }),
      /* @__PURE__ */ jsx("label", { style: { fontWeight: 600, fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 15 }, children: "File *" }),
      /* @__PURE__ */ jsx("input", { type: "file", onChange: (e) => setFile(e.target.files[0]), style: { border: "none", fontFamily: "Georgia, serif", fontSize: 15 }, required: true }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: uploading, style: {
        borderRadius: 0,
        border: "1px solid #aaa",
        backgroundColor: "#eee",
        color: "#111",
        padding: "7px 18px",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
        fontWeight: 500,
        fontSize: "15px",
        cursor: uploading ? "not-allowed" : "pointer",
        boxShadow: "none",
        outline: "none",
        marginTop: 8
      }, children: uploading ? "Uploading..." : "Upload" }),
      error && /* @__PURE__ */ jsx("div", { style: { color: "#b91c1c", fontSize: 15 }, children: error })
    ] }),
    /* @__PURE__ */ jsxs("table", { className: "lw-table", style: { width: "100%", borderCollapse: "collapse", fontSize: "0.98rem", marginBottom: "1.2rem" }, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "Name" }),
        /* @__PURE__ */ jsx("th", { children: "Class" }),
        /* @__PURE__ */ jsx("th", { children: "Description" }),
        /* @__PURE__ */ jsx("th", { children: "Date" }),
        /* @__PURE__ */ jsx("th", { children: "Download" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        entries.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, style: { textAlign: "center", color: "#888", fontStyle: "italic" }, children: "No files found." }) }),
        entries.map((entry) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { children: entry.title }),
          /* @__PURE__ */ jsx("td", { children: entry.subject }),
          /* @__PURE__ */ jsx("td", { children: entry.description }),
          /* @__PURE__ */ jsx("td", { children: entry.created_at ? entry.created_at.slice(0, 10) : "" }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: entry.file_path ? `/api/archive/download?file_path=${encodeURIComponent(entry.file_path)}` : "#",
              className: "lw-btn",
              style: { border: "1px solid #aaa", background: "#eee", color: "#111", fontFamily: "Inter, Helvetica, Arial, sans-serif", fontSize: 15, borderRadius: 0, padding: "0.1rem 0.7rem" },
              target: "_blank",
              rel: "noopener noreferrer",
              children: "Download"
            }
          ) })
        ] }, entry.id))
      ] })
    ] })
  ] });
}

const $$DigitalArchive = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "HeaderWhite", $$HeaderWhite, { "data-astro-cid-mbcq4pb6": true })} ${maybeRenderHead()}<main class="lw-main" data-astro-cid-mbcq4pb6> <div class="epistemic-status" data-astro-cid-mbcq4pb6><p data-astro-cid-mbcq4pb6><em data-astro-cid-mbcq4pb6>Epistemic status: This is your organized digital archive for all class materials and scans.</em></p></div> <h1 class="lw-title" data-astro-cid-mbcq4pb6>Digital Archive</h1> ${renderComponent($$result, "DigitalArchiveComponent", DigitalArchive, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/DigitalArchive.jsx", "client:component-export": "default", "data-astro-cid-mbcq4pb6": true })} <a href="/dashboard" class="lw-btn" data-astro-cid-mbcq4pb6>Back to Dashboard</a> </main>  ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-mbcq4pb6": true })} ${renderComponent($$result, "SpeedInsights", $$Index$1, { "data-astro-cid-mbcq4pb6": true })}`;
}, "C:/Users/Sreek/website/src/pages/digital-archive.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/digital-archive.astro";
const $$url = "/digital-archive";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DigitalArchive,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

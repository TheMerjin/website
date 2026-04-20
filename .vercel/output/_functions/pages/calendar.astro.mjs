import { c as createComponent, b as renderComponent, d as renderTemplate } from '../chunks/astro/server_CR2P5pEN.mjs';
import 'kleur/colors';
import { $ as $$Header } from '../chunks/Header_WflSty_f.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { $ as $$Index, a as $$Index$1 } from '../chunks/index_D1zd1PVJ.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const EVENT_COLORS = [
  "#6b7280",
  // gray
  "#3b82f6",
  // blue (muted)
  "#10b981",
  // green (muted)
  "#f59e0b",
  // yellow (muted)
  "#8b5cf6",
  // purple (muted)
  "#f97316",
  // orange (muted)
  "#ef4444"
  // red (muted)
];
const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    color: EVENT_COLORS[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const calendarRef = useRef(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/calendar_events/get");
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(
        (data.events || []).map((ev) => ({
          ...ev,
          id: ev.id.toString(),
          title: ev.title,
          start: ev.start,
          end: ev.end_time,
          description: ev.description,
          backgroundColor: ev.color,
          borderColor: ev.color
        }))
      );
    } catch (e) {
      setError("Could not load events. Please log in.");
    } finally {
      setLoading(false);
    }
  };
  const handleDateSelect = (selectInfo) => {
    let start = selectInfo.startStr;
    let end = selectInfo.endStr;
    if (!end || end === start) {
      end = start;
    }
    function toLocalInput(dtStr) {
      if (!dtStr) return "";
      const d = new Date(dtStr);
      const pad = (n) => n.toString().padStart(2, "0");
      return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
    }
    setSelectedDateRange({ start, end });
    setFormData({
      title: "",
      start: toLocalInput(start),
      end: toLocalInput(end),
      description: "",
      color: EVENT_COLORS[0]
    });
    setSelectedEvent(null);
  };
  const handleAddEventClick = () => {
    if (!selectedDateRange) {
      setError("Please select a date on the calendar first.");
      return;
    }
    setShowModal(true);
    setError("");
  };
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setFormData({
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      description: clickInfo.event.extendedProps.description || "",
      color: clickInfo.event.backgroundColor || EVENT_COLORS[0]
    });
    setShowModal(true);
  };
  const handleEventDrop = async (dropInfo) => {
    await handleEventUpdate(dropInfo.event);
  };
  const handleEventResize = async (resizeInfo) => {
    await handleEventUpdate(resizeInfo.event);
  };
  const handleEventUpdate = async (eventObj) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/calendar_events/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: eventObj.id,
          title: eventObj.title,
          start: eventObj.startStr,
          end_time: eventObj.endStr,
          description: eventObj.extendedProps.description,
          color: eventObj.backgroundColor
        })
      });
      if (!res.ok) throw new Error("Failed to update event");
      await fetchEvents();
    } catch (e) {
      setError("Could not update event.");
    } finally {
      setLoading(false);
    }
  };
  const handleSaveEvent = async () => {
    if (!formData.title.trim()) {
      setError("Please enter an event title");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (selectedEvent) {
        const res = await fetch("/api/auth/calendar_events/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedEvent.id,
            title: formData.title,
            start: formData.start,
            end_time: formData.end,
            description: formData.description,
            color: formData.color
          })
        });
        if (!res.ok) throw new Error("Failed to update event");
      } else {
        const res = await fetch("/api/auth/calendar_events/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            start: formData.start,
            end_time: formData.end,
            description: formData.description,
            color: formData.color
          })
        });
        if (!res.ok) throw new Error("Failed to create event");
      }
      setShowModal(false);
      setSelectedEvent(null);
      setFormData({
        title: "",
        start: "",
        end: "",
        description: "",
        color: EVENT_COLORS[0]
      });
      await fetchEvents();
    } catch (e) {
      setError("Could not save event.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteEvent = async () => {
    if (selectedEvent && window.confirm("Delete this event?")) {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/calendar_events/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedEvent.id })
        });
        if (!res.ok) throw new Error("Failed to delete event");
        setShowModal(false);
        setSelectedEvent(null);
        setFormData({
          title: "",
          start: "",
          end: "",
          description: "",
          color: EVENT_COLORS[0]
        });
        await fetchEvents();
      } catch (e) {
        setError("Could not delete event.");
      } finally {
        setLoading(false);
      }
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({
      title: "",
      start: "",
      end: "",
      description: "",
      color: EVENT_COLORS[0]
    });
    setSelectedDateRange(null);
    setError("");
  };
  const getInitialView = () => {
    if (typeof window !== "undefined" && window.innerWidth < 600) {
      return "listWeek";
    }
    return "dayGridMonth";
  };
  return /* @__PURE__ */ jsxs("div", { className: "calendar-epistemic-root", children: [
    /* @__PURE__ */ jsxs("div", { className: "calendar-epistemic-header", children: [
      /* @__PURE__ */ jsx("h1", { className: "calendar-epistemic-title", children: "Calendar" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleAddEventClick,
          className: "calendar-epistemic-add-btn",
          children: "Add Event"
        }
      ),
      loading && /* @__PURE__ */ jsx("span", { className: "calendar-epistemic-loading", children: "Loading…" }),
      error && /* @__PURE__ */ jsx("span", { className: "calendar-epistemic-error", children: error })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "calendar-epistemic-container", children: /* @__PURE__ */ jsx(
      FullCalendar,
      {
        ref: calendarRef,
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
        },
        initialView: getInitialView(),
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        events,
        select: handleDateSelect,
        eventClick: handleEventClick,
        eventDrop: handleEventDrop,
        eventResize: handleEventResize,
        height: "auto",
        eventTimeFormat: {
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short"
        },
        eventContent: renderEventContent
      }
    ) }),
    showModal && /* @__PURE__ */ jsx("div", { className: "calendar-epistemic-modal-overlay", onClick: handleCloseModal, children: /* @__PURE__ */ jsxs("div", { className: "calendar-epistemic-modal", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "calendar-epistemic-modal-header", children: [
        /* @__PURE__ */ jsx("span", { className: "calendar-epistemic-modal-title", children: selectedEvent ? "Edit Event" : "Add Event" }),
        /* @__PURE__ */ jsx("button", { onClick: handleCloseModal, className: "calendar-epistemic-modal-close", children: "×" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "calendar-epistemic-modal-body", children: [
        /* @__PURE__ */ jsx("label", { className: "calendar-epistemic-label", children: "Title *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: formData.title,
            onChange: (e) => setFormData({ ...formData, title: e.target.value }),
            className: "calendar-epistemic-input",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "calendar-epistemic-row", children: [
          /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsx("label", { className: "calendar-epistemic-label", children: "Start" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "datetime-local",
                value: formData.start,
                onChange: (e) => setFormData({ ...formData, start: e.target.value }),
                className: "calendar-epistemic-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { flex: 1, marginLeft: 8 }, children: [
            /* @__PURE__ */ jsx("label", { className: "calendar-epistemic-label", children: "End" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "datetime-local",
                value: formData.end,
                onChange: (e) => setFormData({ ...formData, end: e.target.value }),
                className: "calendar-epistemic-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("label", { className: "calendar-epistemic-label", children: "Description" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: formData.description,
            onChange: (e) => setFormData({ ...formData, description: e.target.value }),
            className: "calendar-epistemic-input",
            rows: 2
          }
        ),
        /* @__PURE__ */ jsx("label", { className: "calendar-epistemic-label", children: "Color" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: formData.color,
            onChange: (e) => setFormData({ ...formData, color: e.target.value }),
            className: "calendar-epistemic-input",
            children: EVENT_COLORS.map((c, i) => /* @__PURE__ */ jsx("option", { value: c, children: ["Gray", "Blue", "Green", "Yellow", "Purple", "Orange", "Red"][i] }, c))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "calendar-epistemic-modal-actions", children: [
        selectedEvent && /* @__PURE__ */ jsx("button", { onClick: handleDeleteEvent, className: "calendar-epistemic-btn calendar-epistemic-btn-delete", children: "Delete" }),
        /* @__PURE__ */ jsx("button", { onClick: handleCloseModal, className: "calendar-epistemic-btn", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: handleSaveEvent, className: "calendar-epistemic-btn calendar-epistemic-btn-save", children: selectedEvent ? "Update" : "Save" })
      ] })
    ] }) })
  ] });
};
function renderEventContent(eventInfo) {
  return /* @__PURE__ */ jsx("div", { style: { fontFamily: "Merriweather, Georgia, serif", fontSize: 14, color: "#232323", background: "none", border: "none", padding: 0, margin: 0 }, children: /* @__PURE__ */ jsx("span", { children: eventInfo.event.title }) });
}

const $$Calendar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Header", $$Header, { "data-astro-cid-sl2ubhge": true })} ${renderComponent($$result, "CalendarComponent", CalendarComponent, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Sreek/website/src/components/CalendarComponent.jsx", "client:component-export": "default", "data-astro-cid-sl2ubhge": true })}  ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-sl2ubhge": true })} ${renderComponent($$result, "SpeedInsights", $$Index$1, { "data-astro-cid-sl2ubhge": true })}`;
}, "C:/Users/Sreek/website/src/pages/calendar.astro", void 0);

const $$file = "C:/Users/Sreek/website/src/pages/calendar.astro";
const $$url = "/calendar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Calendar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

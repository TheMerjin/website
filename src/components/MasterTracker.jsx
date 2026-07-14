import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];

function MasterTracker() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

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
    fontFamily: "Inter, Helvetica, Arial, sans-serif",
  };

  useEffect(() => {
    // Retrieve authenticated user metadata dynamically
    setLoadingUser(true);
    fetch("/api/auth/logged-in")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        console.error("Session retrieval failed:", err);
        setUser(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });

    // Retrieve initial list of tasks
    fetch("/api/tasks")
      .then((res) => (res.ok ? res.json() : { tasks: [] }))
      .then((data) => {
        setTasks(data.tasks || []);
      })
      .catch((err) => {
        console.error("Error fetching tasks list:", err);
      });
  }, []);

  const filteredTasks = showOnlyIncomplete
    ? tasks.filter((task) => task && task.status !== "Done")
    : tasks;

  function handleAddTask(e) {
    e.preventDefault();
    const form = e.target;

    // Pass user_id (mapping to active logged in session or default fallback)
    const activeUserId = user?.id || "default-user-id";

    const task = {
      userId: activeUserId,
      class: form.class.value,
      item: form.item.value,
      type: form.type.value,
      due_date: form.due_date.value,
      status: form.status.value || "To Do",
      link: form.link.value,
      notes: form.notes.value,
      est_time: form.est_time.value,
      time_left: parseFloat(form.est_time.value) || 0,
    };

    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server returned an error when saving task");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.task) {
          setTasks((prevTasks) => [...prevTasks, data.task]);
        }
        form.reset();
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Failed to create task:", err);
      });

    // Synchronize to google calendar in background
    fetch("/api/auth/calendar_events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${form.class.value} ${form.item.value}`.trim(),
        start: form.due_date.value,
        end_time: form.due_date.value,
        description: `Class: ${form.class.value}\nItem: ${form.item.value}\nType: ${form.type.value}\nStatus: ${form.status.value}\nLink: ${form.link.value}\nNotes: ${form.notes.value}`,
        color: "grey",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Calendar event created successfully:", data);
      })
      .catch((err) => {
        console.error("Calendar integration sync error:", err);
      });
  }

  function handleDeleteTask(id) {
    fetch(`/api/tasks/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          setTasks((prevTasks) => prevTasks.filter((t) => t && t.id !== id));
        }
      })
      .catch((err) => {
        console.error("Failed to delete task:", err);
      });
  }

  function handleStatusChange(id, newStatus) {
    fetch(`/api/tasks/status_change`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus, _update: true }),
    })
      .then((res) => {
        if (res.ok) {
          setTasks((prevTasks) =>
            prevTasks.map((t) =>
              t && t.id === id ? { ...t, status: newStatus } : t,
            ),
          );
        }
      })
      .catch((err) => {
        console.error("Status sync error:", err);
      });
  }

  return (
    <div
      style={{
        background: "#fafafa",
        minHeight: "100vh",
        padding: "0 16px",
        fontFamily: "Georgia, serif",
        color: "#222",
      }}
    >
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 0" }}>
        {/* Header Block with Optional Authentication Info Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: "1px solid #e0e0e0",
            paddingBottom: 10,
            marginBottom: 24,
          }}
        >
          <h1
            style={{
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 800,
              fontSize: 32,
              margin: 0,
              color: "#111",
              letterSpacing: "-0.75px",
            }}
          >
            Master Tracker
          </h1>

          {/* Subtle Auth status indicator for better UX */}
          <div
            style={{
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontSize: "11px",
              color: "#666",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {loadingUser ? (
              <span>Verifying session...</span>
            ) : user ? (
              <span style={{ color: "#2f855a" }}>
                ✓ Synced ({user.email || "Active User"})
              </span>
            ) : (
              <span style={{ color: "#c53030" }}>
                ⚠ Local Mode (Login required for live sync)
              </span>
            )}
          </div>
        </div>

        {/* Command Controls bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: 24,
          }}
        >
          <button
            style={{
              borderRadius: "4px",
              border: "1px solid #999",
              backgroundColor: "#fff",
              color: "#111",
              padding: "8px 20px",
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              outline: "none",
              transition: "all 0.15s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#fff";
            }}
            onClick={() => setShowForm((f) => !f)}
          >
            {showForm ? "Cancel Form" : "Add Task"}
          </button>

          <button
            style={{
              borderRadius: "4px",
              border: "1px solid #999",
              backgroundColor: showOnlyIncomplete ? "#e6fffa" : "#fff",
              color: showOnlyIncomplete ? "#0f766e" : "#111",
              padding: "8px 20px",
              fontFamily: "Inter, Helvetica, Arial, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              outline: "none",
              transition: "all 0.15s ease",
              borderColor: showOnlyIncomplete ? "#0f766e" : "#999",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = showOnlyIncomplete
                ? "#ccfbf1"
                : "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = showOnlyIncomplete
                ? "#e6fffa"
                : "#fff";
            }}
            onClick={() => setShowOnlyIncomplete((f) => !f)}
          >
            {showOnlyIncomplete ? "Show All Tasks" : "Show Incomplete Only"}
          </button>
        </div>

        {/* Create Task Collapsible Panel */}
        {showForm && (
          <form
            style={{
              background: "#fcfcfc",
              border: "1px solid #ddd",
              padding: "24px",
              marginBottom: "28px",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
            onSubmit={handleAddTask}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  Class Name
                </label>
                <input
                  required
                  placeholder="e.g. CS 101"
                  name="class"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    background: "#fff",
                    color: "#111",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  Task Item *
                </label>
                <input
                  required
                  placeholder="e.g. Reading Assignment"
                  name="item"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    background: "#fff",
                    color: "#111",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  Type
                </label>
                <input
                  placeholder="e.g. Homework, Exam"
                  name="type"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    background: "#fff",
                    color: "#111",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  Due Date *
                </label>
                <input
                  required
                  type="date"
                  name="due_date"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "7px 10px",
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    background: "#fff",
                    color: "#111",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  Est. Time (hours)
                </label>
                <input
                  placeholder="e.g. 2.5"
                  name="est_time"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    background: "#fff",
                    color: "#111",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  Initial Status
                </label>
                <select
                  name="status"
                  defaultValue="To Do"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    background: "#fff",
                    color: "#111",
                    cursor: "pointer",
                  }}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  Resource URL Link
                </label>
                <input
                  type="url"
                  placeholder="https://"
                  name="link"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    background: "#fff",
                    color: "#111",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 4,
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  Additional Notes
                </label>
                <textarea
                  placeholder="Write specifications, criteria, milestones..."
                  name="notes"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "8px 10px",
                    fontFamily: "Georgia, serif",
                    fontSize: 15,
                    background: "#fff",
                    color: "#111",
                    minHeight: 60,
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                type="submit"
                style={{
                  borderRadius: "4px",
                  border: "1px solid #1a202c",
                  backgroundColor: "#1a202c",
                  color: "#fff",
                  padding: "10px 24px",
                  fontFamily: "Inter, Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#2d3748";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#1a202c";
                }}
              >
                Create Assignment Task
              </button>
            </div>
          </form>
        )}

        {/* Task Entries Grid & List Block */}
        <div
          style={{
            overflowX: "auto",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              fontSize: 15,
              fontFamily: "Georgia, serif",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    border: "none",
                    borderRight: "1px solid #f1f5f9",
                    padding: "12px 14px",
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "left",
                  }}
                >
                  Class
                </th>
                <th
                  style={{
                    border: "none",
                    borderRight: "1px solid #f1f5f9",
                    padding: "12px 14px",
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "left",
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    border: "none",
                    borderRight: "1px solid #f1f5f9",
                    padding: "12px 14px",
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "left",
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    border: "none",
                    borderRight: "1px solid #f1f5f9",
                    padding: "12px 14px",
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "left",
                  }}
                >
                  Due Date
                </th>
                <th
                  style={{
                    border: "none",
                    borderRight: "1px solid #f1f5f9",
                    padding: "12px 14px",
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "left",
                  }}
                >
                  Est. Time
                </th>
                <th
                  style={{
                    border: "none",
                    borderRight: "1px solid #f1f5f9",
                    padding: "12px 14px",
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "left",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    border: "none",
                    borderRight: "1px solid #f1f5f9",
                    padding: "12px 14px",
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "left",
                  }}
                >
                  Link
                </th>
                <th
                  style={{
                    border: "none",
                    borderRight: "1px solid #f1f5f9",
                    padding: "12px 14px",
                    fontFamily: "Inter, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "left",
                  }}
                >
                  Notes
                </th>
                <th style={{ border: "none", padding: "12px 14px" }}></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredTasks) &&
              filteredTasks.filter(Boolean).length > 0 ? (
                filteredTasks.filter(Boolean).map((task) => (
                  <tr
                    key={task.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background-color 0.1s ease",
                    }}
                  >
                    {/* Class */}
                    <td
                      style={{
                        border: "none",
                        borderRight: "1px solid #f8fafc",
                        padding: "14px 14px",
                        color: "#1e293b",
                        fontWeight: 700,
                        fontFamily: "Inter, Helvetica, Arial, sans-serif",
                      }}
                    >
                      {task.class || (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    {/* Item */}
                    <td
                      style={{
                        border: "none",
                        borderRight: "1px solid #f8fafc",
                        padding: "14px 14px",
                        color: "#0f172a",
                      }}
                    >
                      <a
                        href={`/tasks/${task.id}`}
                        style={taskItemLinkStyle}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#f1f5f9";
                          e.target.style.color = "#4f46e5";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "none";
                          e.target.style.color = "#1a1a1a";
                        }}
                        onFocus={(e) => {
                          e.target.style.background = "#f1f5f9";
                          e.target.style.color = "#4f46e5";
                          e.target.style.outline = "2px solid #6366f1";
                        }}
                        onBlur={(e) => {
                          e.target.style.background = "none";
                          e.target.style.color = "#1a1a1a";
                          e.target.style.outline = "none";
                        }}
                        tabIndex={0}
                      >
                        {task.item}
                      </a>
                    </td>

                    {/* Type */}
                    <td
                      style={{
                        border: "none",
                        borderRight: "1px solid #f8fafc",
                        padding: "14px 14px",
                        color: "#475569",
                        fontSize: "14px",
                      }}
                    >
                      {task.type ? (
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "11px",
                            background: "#f1f5f9",
                            color: "#475569",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontWeight: 600,
                          }}
                        >
                          {task.type}
                        </span>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    {/* Due Date */}
                    <td
                      style={{
                        border: "none",
                        borderRight: "1px solid #f8fafc",
                        padding: "14px 14px",
                        color: "#334155",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.due_date}
                    </td>

                    {/* Est. Time */}
                    <td
                      style={{
                        border: "none",
                        borderRight: "1px solid #f8fafc",
                        padding: "14px 14px",
                        color: "#475569",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {task.est_time ? (
                        `${task.est_time} hrs`
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    {/* Status selection */}
                    <td
                      style={{
                        border: "none",
                        borderRight: "1px solid #f8fafc",
                        padding: "12px 14px",
                      }}
                    >
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
                        style={{
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          background:
                            task.status === "Done"
                              ? "#f0fdf4"
                              : task.status === "In Progress"
                                ? "#fffbeb"
                                : "#fff",
                          color:
                            task.status === "Done"
                              ? "#166534"
                              : task.status === "In Progress"
                                ? "#92400e"
                                : "#1e293b",
                          fontFamily: "Inter, Helvetica, Arial, sans-serif",
                          fontWeight: 600,
                          fontSize: "13px",
                          padding: "6px 10px",
                          outline: "none",
                          cursor: "pointer",
                          minWidth: 120,
                        }}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Link */}
                    <td
                      style={{
                        border: "none",
                        borderRight: "1px solid #f8fafc",
                        padding: "14px 14px",
                      }}
                    >
                      {task.link ? (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#4f46e5",
                            textDecoration: "none",
                            fontFamily: "Inter, Helvetica, Arial, sans-serif",
                            fontWeight: 600,
                            fontSize: "13px",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.textDecoration = "none")
                          }
                          onFocus={(e) =>
                            (e.target.style.textDecoration = "underline")
                          }
                          onBlur={(e) =>
                            (e.target.style.textDecoration = "none")
                          }
                        >
                          Resource ↗
                        </a>
                      ) : (
                        <span
                          style={{
                            color: "#94a3b8",
                            fontStyle: "italic",
                            fontSize: "13px",
                          }}
                        >
                          None
                        </span>
                      )}
                    </td>

                    {/* Notes */}
                    <td
                      style={{
                        border: "none",
                        borderRight: "1px solid #f8fafc",
                        padding: "14px 14px",
                        color: "#64748b",
                        fontSize: "13px",
                        maxWidth: 160,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={task.notes}
                    >
                      {task.notes || (
                        <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>
                          None
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td
                      style={{
                        border: "none",
                        padding: "14px 14px",
                        textAlign: "right",
                      }}
                    >
                      <button
                        style={{
                          borderRadius: "4px",
                          border: "1px solid #ef4444",
                          backgroundColor: "#fff",
                          color: "#ef4444",
                          padding: "5px 12px",
                          fontFamily: "Inter, Helvetica, Arial, sans-serif",
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer",
                          outline: "none",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#fef2f2";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#fff";
                        }}
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      color: "#64748b",
                      padding: "40px 24px",
                      fontFamily: "Inter, Helvetica, Arial, sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    {showOnlyIncomplete
                      ? "No incomplete tasks found."
                      : "All clear! No tasks added yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MasterTracker;

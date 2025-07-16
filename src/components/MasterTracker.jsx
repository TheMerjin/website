import React, { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done'];

function MasterTracker() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data.tasks || []));
  }, []);

  const filteredTasks = showOnlyIncomplete 
    ? tasks.filter(task => task.status !== "Done")
    : tasks;

  function handleAddTask(e) {
    e.preventDefault();
    const form = e.target;
    const task = {
      class: form.class.value,
      item: form.item.value,
      type: form.type.value,
      due_date: form.due_date.value,
      status: form.status.value || 'To Do',
      link: form.link.value,
      notes: form.notes.value,
      est_time: form.est_time.value,
      time_left: parseFloat(form.est_time.value) || 0
    };
    console.log(task);
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
      .then(res => res.json())
      .then(data => {
        setTasks(tasks => [...tasks, data.task]);
        form.reset();
        setShowForm(false);
      });
      console.log(res);
      fetch('/api/auth/calendar_events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.class.value + " " + form.item.value,
          start: form.due_date.value,
          end_time: form.due_date.value,
          description: form.class.value + " " + form.item.value+ form.type.value + form.status.value + form.link.value + form.notes.value,
          color: "grey",
        }),
      });
  }

  function handleDeleteTask(id) {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => setTasks(tasks => tasks.filter(t => t.id !== id)));
  }

  function handleStatusChange(id, newStatus) {
    // Update backend
    fetch(`/api/tasks/status_change`, {
      method: 'POST', // Use PATCH if you have it, otherwise POST with id
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus, _update: true })
    })
      .then(res => res.json())
      .then(() => {
        setTasks(tasks => tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      });
  }

  return (
    <div style={{ background: '#f9f9f9', minHeight: '100vh', padding: '0', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 0 0 0' }}>
        <h1 style={{ fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 28, margin: '0 0 24px 0', color: '#1a1a1a', letterSpacing: '-0.5px', borderBottom: '1px solid #e0e0e0', paddingBottom: 8 }}>Master Tracker</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 24 }}>
          <button
            style={{
              borderRadius: 0,
              border: '1px solid #aaa',
              backgroundColor: '#f3f3f3',
              color: '#111',
              padding: '7px 18px',
              fontFamily: 'Inter, Helvetica, Arial, sans-serif',
              fontWeight: 500,
              fontSize: '15px',
              marginBottom: '0',
              cursor: 'pointer',
              boxShadow: 'none',
              outline: 'none',
              transition: 'background 0.1s',
              marginRight: 0
            }}
            onClick={() => setShowForm(f => !f)}
          >
            {showForm ? 'Cancel' : 'Add Task'}
          </button>
          <button
            style={{
              borderRadius: 0,
              border: '1px solid #aaa',
              backgroundColor: showOnlyIncomplete ? '#e2e2e2' : '#f3f3f3',
              color: '#111',
              padding: '7px 18px',
              fontFamily: 'Inter, Helvetica, Arial, sans-serif',
              fontWeight: 500,
              fontSize: '15px',
              marginTop: '8px',
              cursor: 'pointer',
              boxShadow: 'none',
              outline: 'none',
              transition: 'background 0.1s',
              borderColor: showOnlyIncomplete ? '#888' : '#aaa'
            }}
            onClick={() => setShowOnlyIncomplete(f => !f)}
          >
            {showOnlyIncomplete ? 'Show All Tasks' : 'Show Incomplete Only'}
          </button>
        </div>
        {showForm && (
          <form
            style={{
              background: '#f7f7f7',
              border: '1px solid #ddd',
              padding: '18px 18px 8px 18px',
              marginBottom: '28px',
              maxWidth: 600,
              borderRadius: 0,
              fontFamily: 'Georgia, serif',
              fontSize: 15,
              color: '#222',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
            onSubmit={handleAddTask}
          >
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 14, color: '#222' }}>Class</label>
              <input name="class" style={{ width: '100%', border: '1px solid #ccc', borderRadius: 0, padding: 5, fontFamily: 'Georgia, serif', fontSize: 15, background: '#fff', color: '#222' }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 14, color: '#222' }}>Item</label>
              <input name="item" style={{ width: '100%', border: '1px solid #ccc', borderRadius: 0, padding: 5, fontFamily: 'Georgia, serif', fontSize: 15, background: '#fff', color: '#222' }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 14, color: '#222' }}>Type</label>
              <input name="type" style={{ width: '100%', border: '1px solid #ccc', borderRadius: 0, padding: 5, fontFamily: 'Georgia, serif', fontSize: 15, background: '#fff', color: '#222' }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 14, color: '#222' }}>Due Date</label>
              <input name="due_date" type="date" style={{ width: '100%', border: '1px solid #ccc', borderRadius: 0, padding: 5, fontFamily: 'Georgia, serif', fontSize: 15, background: '#fff', color: '#222' }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 14, color: '#222' }}>Est.Time (in hours)</label>
              <input name="est_time" style={{ width: '100%', border: '1px solid #ccc', borderRadius: 0, padding: 5, fontFamily: 'Georgia, serif', fontSize: 15, background: '#fff', color: '#222' }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 14, color: '#222' }}>Status</label>
              <select name="status" defaultValue="To Do" style={{ width: '100%', border: '1px solid #ccc', borderRadius: 0, padding: 5, fontFamily: 'Georgia, serif', fontSize: 15, background: '#fff', color: '#222' }}>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 14, color: '#222' }}>Link</label>
              <input name="link" style={{ width: '100%', border: '1px solid #ccc', borderRadius: 0, padding: 5, fontFamily: 'Georgia, serif', fontSize: 15, background: '#fff', color: '#222' }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 2, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 14, color: '#222' }}>Notes</label>
              <textarea name="notes" style={{ width: '100%', border: '1px solid #ccc', borderRadius: 0, padding: 5, fontFamily: 'Georgia, serif', fontSize: 15, background: '#fff', color: '#222', minHeight: 40 }} />
            </div>
            <button
              type="submit"
              style={{
                borderRadius: 0,
                border: '1px solid #aaa',
                backgroundColor: '#f3f3f3',
                color: '#111',
                padding: '7px 18px',
                fontFamily: 'Inter, Helvetica, Arial, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: 'none',
                outline: 'none',
                marginTop: 8
              }}
            >
              Add Task
            </button>
          </form>
        )}
        <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #ddd', borderRadius: 0, boxShadow: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: 'none', borderRadius: 0, fontSize: 15, fontFamily: 'Georgia, serif' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                <th style={{ border: 'none', borderRight: '1px solid #eee', padding: '8px 6px', fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontWeight: 600, color: '#222', textAlign: 'left' }}>Class</th>
                <th style={{ border: 'none', borderRight: '1px solid #eee', padding: '8px 6px', color: '#222', textAlign: 'left' }}>Item</th>
                <th style={{ border: 'none', borderRight: '1px solid #eee', padding: '8px 6px', color: '#222', textAlign: 'left' }}>Type</th>
                <th style={{ border: 'none', borderRight: '1px solid #eee', padding: '8px 6px', color: '#222', textAlign: 'left' }}>Due Date</th>
                <th style={{ border: 'none', borderRight: '1px solid #eee', padding: '8px 6px', color: '#222', textAlign: 'left' }}>Est. Time</th>
                <th style={{ border: 'none', borderRight: '1px solid #eee', padding: '8px 6px', color: '#222', textAlign: 'left' }}>Status</th>
                <th style={{ border: 'none', borderRight: '1px solid #eee', padding: '8px 6px', color: '#222', textAlign: 'left' }}>Link</th>
                <th style={{ border: 'none', borderRight: '1px solid #eee', padding: '8px 6px', color: '#222', textAlign: 'left' }}>Notes</th>
                <th style={{ border: 'none', padding: '8px 6px' }}></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredTasks) && filteredTasks.length > 0 ? (
                filteredTasks.filter(Boolean).map(task => (
                  <tr key={task.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ border: 'none', borderRight: '1px solid #f3f3f3', padding: '7px 6px', color: '#222' }}>{task.class}</td>
                    <td style={{ border: 'none', borderRight: '1px solid #f3f3f3', padding: '7px 6px', color: '#222' }}>{task.item}</td>
                    <td style={{ border: 'none', borderRight: '1px solid #f3f3f3', padding: '7px 6px', color: '#222' }}>{task.type}</td>
                    <td style={{ border: 'none', borderRight: '1px solid #f3f3f3', padding: '7px 6px', color: '#222' }}>{task.due_date}</td>
                    <td style={{ border: 'none', borderRight: '1px solid #f3f3f3', padding: '7px 6px', color: '#222' }}>{task.est_time}</td>
                    <td style={{ border: 'none', borderRight: '1px solid #f3f3f3', padding: '7px 6px', color: '#222' }}>
                      <select
                        value={task.status}
                        onChange={e => handleStatusChange(task.id, e.target.value)}
                        style={{
                          border: '1px solid #bbb',
                          borderRadius: 0,
                          background: '#fff',
                          color: '#222',
                          fontFamily: 'Georgia, serif',
                          fontSize: 15,
                          padding: '3px 8px',
                          outline: 'none',
                          minWidth: 110
                        }}
                      >
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td style={{ border: 'none', borderRight: '1px solid #f3f3f3', padding: '7px 6px', color: '#222' }}>
                      {task.link ? (
                        <a href={task.link} style={{ 
                          color: '#2b6cb0', 
                          textDecoration: 'none', 
                          fontFamily: 'Inter, Helvetica, Arial, sans-serif',
                          fontSize: '0.95rem',
                          transition: 'color 0.15s, text-decoration 0.15s'
                        }} 
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        onFocus={(e) => e.target.style.textDecoration = 'underline'}
                        onBlur={(e) => e.target.style.textDecoration = 'none'}
                        >
                          here
                        </a>
                      ) : (
                        <span style={{ color: '#888', fontStyle: 'italic' }}>None</span>
                      )}
                    </td>
                    <td style={{ border: 'none', borderRight: '1px solid #f3f3f3', padding: '7px 6px', color: '#222' }}>{task.notes}</td>
                    <td style={{ border: 'none', padding: '7px 6px' }}>
                      <button
                        style={{
                          borderRadius: 0,
                          border: '1px solid #aaa',
                          backgroundColor: '#f3f3f3',
                          color: '#111',
                          padding: '4px 12px',
                          fontFamily: 'Inter, Helvetica, Arial, sans-serif',
                          fontWeight: 500,
                          fontSize: '14px',
                          cursor: 'pointer',
                          boxShadow: 'none',
                          outline: 'none'
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
                  <td colSpan={9} style={{ textAlign: 'center', color: '#888', padding: 24, fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: 15 }}>
                    {showOnlyIncomplete ? 'No incomplete tasks found.' : 'No tasks found.'}
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
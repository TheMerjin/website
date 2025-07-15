import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const EVENT_COLORS = [
  '#6b7280', // gray
  '#3b82f6', // blue (muted)
  '#10b981', // green (muted)
  '#f59e0b', // yellow (muted)
  '#8b5cf6', // purple (muted)
  '#f97316', // orange (muted)
  '#ef4444', // red (muted)
];

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    color: EVENT_COLORS[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const calendarRef = useRef(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  // Fetch events from Supabase API on mount
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/calendar_events/get');
      if (!res.ok) throw new Error('Failed to load events');
      const data = await res.json();
      setEvents(
        (data.events || []).map(ev => ({
          ...ev,
          id: ev.id.toString(),
          title: ev.title,
          start: ev.start,
          end: ev.end_time,
          description: ev.description,
          backgroundColor: ev.color,
          borderColor: ev.color,
        }))
      );
    } catch (e) {
      setError('Could not load events. Please log in.');
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
      if (!dtStr) return '';
      const d = new Date(dtStr);
      const pad = (n) => n.toString().padStart(2, '0');
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
    setSelectedDateRange({ start, end });
    setFormData({
      title: '',
      start: toLocalInput(start),
      end: toLocalInput(end),
      description: '',
      color: EVENT_COLORS[0],
    });
    setSelectedEvent(null);
    // Do NOT open modal here
  };

  const handleAddEventClick = () => {
    if (!selectedDateRange) {
      setError('Please select a date on the calendar first.');
      return;
    }
    setShowModal(true);
    setError('');
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setFormData({
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      description: clickInfo.event.extendedProps.description || '',
      color: clickInfo.event.backgroundColor || EVENT_COLORS[0],
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
    setError('');
    try {
      const res = await fetch('/api/auth/calendar_events/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: eventObj.id,
          title: eventObj.title,
          start: eventObj.startStr,
          end_time: eventObj.endStr,
          description: eventObj.extendedProps.description,
          color: eventObj.backgroundColor,
        }),
      });
      if (!res.ok) throw new Error('Failed to update event');
      await fetchEvents();
    } catch (e) {
      setError('Could not update event.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async () => {
    if (!formData.title.trim()) {
      setError('Please enter an event title');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (selectedEvent) {
        // Update
        const res = await fetch('/api/auth/calendar_events/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedEvent.id,
            title: formData.title,
            start: formData.start,
            end_time: formData.end,
            description: formData.description,
            color: formData.color,
          }),
        });
        if (!res.ok) throw new Error('Failed to update event');
      } else {
        // Create
        const res = await fetch('/api/auth/calendar_events/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            start: formData.start,
            end_time: formData.end,
            description: formData.description,
            color: formData.color,
          }),
        });
        if (!res.ok) throw new Error('Failed to create event');
      }
      setShowModal(false);
      setSelectedEvent(null);
      setFormData({
        title: '',
        start: '',
        end: '',
        description: '',
        color: EVENT_COLORS[0],
      });
      await fetchEvents();
    } catch (e) {
      setError('Could not save event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && window.confirm('Delete this event?')) {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/auth/calendar_events/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedEvent.id }),
        });
        if (!res.ok) throw new Error('Failed to delete event');
        setShowModal(false);
        setSelectedEvent(null);
        setFormData({
          title: '',
          start: '',
          end: '',
          description: '',
          color: EVENT_COLORS[0],
        });
        await fetchEvents();
      } catch (e) {
        setError('Could not delete event.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      start: '',
      end: '',
      description: '',
      color: EVENT_COLORS[0],
    });
    setSelectedDateRange(null);
    setError('');
  };

  // Responsive: use listWeek on mobile
  const getInitialView = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 600) {
      return 'listWeek';
    }
    return 'dayGridMonth';
  };

  return (
    <div className="calendar-epistemic-root">
      <div className="calendar-epistemic-header">
        <h1 className="calendar-epistemic-title">Calendar</h1>
        <button 
          onClick={handleAddEventClick}
          className="calendar-epistemic-add-btn"
        >
          Add Event
        </button>
        {loading && <span className="calendar-epistemic-loading">Loading…</span>}
        {error && <span className="calendar-epistemic-error">{error}</span>}
      </div>
      <div className="calendar-epistemic-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          initialView={getInitialView()}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          height="auto"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
          eventContent={renderEventContent}
        />
      </div>
      {showModal && (
        <div className="calendar-epistemic-modal-overlay" onClick={handleCloseModal}>
          <div className="calendar-epistemic-modal" onClick={e => e.stopPropagation()}>
            <div className="calendar-epistemic-modal-header">
              <span className="calendar-epistemic-modal-title">{selectedEvent ? 'Edit Event' : 'Add Event'}</span>
              <button onClick={handleCloseModal} className="calendar-epistemic-modal-close">×</button>
            </div>
            <div className="calendar-epistemic-modal-body">
              <label className="calendar-epistemic-label">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="calendar-epistemic-input"
                autoFocus
              />
              <div className="calendar-epistemic-row">
                <div style={{ flex: 1 }}>
                  <label className="calendar-epistemic-label">Start</label>
                  <input
                    type="datetime-local"
                    value={formData.start}
                    onChange={e => setFormData({ ...formData, start: e.target.value })}
                    className="calendar-epistemic-input"
                  />
                </div>
                <div style={{ flex: 1, marginLeft: 8 }}>
                  <label className="calendar-epistemic-label">End</label>
                  <input
                    type="datetime-local"
                    value={formData.end}
                    onChange={e => setFormData({ ...formData, end: e.target.value })}
                    className="calendar-epistemic-input"
                  />
                </div>
              </div>
              <label className="calendar-epistemic-label">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="calendar-epistemic-input"
                rows={2}
              />
              <label className="calendar-epistemic-label">Color</label>
              <select
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="calendar-epistemic-input"
              >
                {EVENT_COLORS.map((c, i) => (
                  <option value={c} key={c}>{['Gray','Blue','Green','Yellow','Purple','Orange','Red'][i]}</option>
                ))}
              </select>
            </div>
            <div className="calendar-epistemic-modal-actions">
              {selectedEvent && (
                <button onClick={handleDeleteEvent} className="calendar-epistemic-btn calendar-epistemic-btn-delete">Delete</button>
              )}
              <button onClick={handleCloseModal} className="calendar-epistemic-btn">Cancel</button>
              <button onClick={handleSaveEvent} className="calendar-epistemic-btn calendar-epistemic-btn-save">{selectedEvent ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <div style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: 14, color: '#232323', background: 'none', border: 'none', padding: 0, margin: 0 }}>
      <span>{eventInfo.event.title}</span>
    </div>
  );
}

export default CalendarComponent; 
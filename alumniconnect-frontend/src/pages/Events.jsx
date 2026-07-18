import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Events.css';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: 'networking',
    date: '',
    location: '',
    meetingLink: '',
  });

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generateMeetLink = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const randPart = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const link = `https://meet.google.com/${randPart(3)}-${randPart(4)}-${randPart(3)}`;
    setForm({ ...form, meetingLink: link, location: 'Online' });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', form);
      setShowForm(false);
      setForm({ title: '', description: '', eventType: 'networking', date: '', location: '', meetingLink: '' });
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not create event');
    }
  };

  const handleRsvp = async (id) => {
    try {
      await api.post(`/events/${id}/rsvp`);
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not RSVP');
    }
  };

  return (
    <div className="events">
      <div className="events__header">
        <div>
          <h1 className="font-display glow-text events__title">EVENTS</h1>
          <p className="text-dim events__subtitle">Reunions, workshops, and networking sessions.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Close' : 'Host an event'}
        </button>
      </div>

      {showForm && (
        <form className="card events__form" onSubmit={handleCreate}>
          <input
            className="input-field"
            name="title"
            placeholder="Event title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            className="input-field"
            name="description"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            required
          />
          <div className="events__form-row">
            <select className="input-field" name="eventType" value={form.eventType} onChange={handleChange}>
              <option value="reunion">Reunion</option>
              <option value="webinar">Webinar</option>
              <option value="workshop">Workshop</option>
              <option value="networking">Networking</option>
              <option value="other">Other</option>
            </select>
            <input
              className="input-field"
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="events__form-row">
            <input
              className="input-field"
              name="location"
              placeholder="Location (or 'Online')"
              value={form.location}
              onChange={handleChange}
            />
            <div className="events__meet-input-wrapper">
              <input
                className="input-field"
                name="meetingLink"
                placeholder="Meeting link (optional)"
                value={form.meetingLink}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="btn-ghost events__generate-meet-btn" 
                onClick={generateMeetLink}
                title="Generate Google Meet Link"
              >
                <svg className="meet-camera-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
                Generate Link
              </button>
            </div>
          </div>
          <button className="btn-primary" type="submit">Create event</button>
        </form>
      )}

      {loading ? (
        <p className="text-dim">Loading...</p>
      ) : (
        <div className="events__grid">
          {events.length === 0 && <p className="text-dim">No upcoming events yet.</p>}
          {events.map((ev) => {
            const hasRsvpd = ev.rsvps?.some((r) => (r.user?._id || r.user) === user?._id);
            return (
              <div key={ev._id} className="card events__card">
                <span className="tag-badge events__type">{ev.eventType}</span>
                <h3 className="events__name">{ev.title}</h3>
                <span className="text-faint">
                  {new Date(ev.date).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
                {ev.location && <span className="text-faint events__location">{ev.location}</span>}
                {ev.meetingLink && (
                  <a 
                    href={ev.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="events__meet-link-btn"
                    title="Open Google Meet Session"
                  >
                    <svg className="meet-camera-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                    Join Google Meet
                  </a>
                )}
                <p className="text-dim events__desc">{ev.description}</p>
                <div className="events__footer">
                  <span className="text-faint">{ev.rsvps?.length || 0} attending</span>
                  <button
                    className={hasRsvpd ? 'btn-ghost' : 'btn-primary'}
                    onClick={() => !hasRsvpd && handleRsvp(ev._id)}
                    disabled={hasRsvpd}
                  >
                    {hasRsvpd ? 'You\'re going' : 'RSVP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

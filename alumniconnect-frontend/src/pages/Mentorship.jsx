import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Mentorship.css';

export default function Mentorship() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [myMentorships, setMyMentorships] = useState([]);
  const [view, setView] = useState('find'); // find | mine
  const [requestModal, setRequestModal] = useState(null); // mentor object
  const [form, setForm] = useState({ expertiseArea: '', message: '' });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mentorsRes, mineRes] = await Promise.all([
        api.get('/users/mentors'),
        api.get('/mentorships/me'),
      ]);
      setMentors(mentorsRes.data.filter((m) => m._id !== user?._id));
      setMyMentorships(mineRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openRequest = (mentor) => {
    setRequestModal(mentor);
    setForm({ expertiseArea: mentor.mentorExpertise?.[0] || '', message: '' });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mentorships', {
        mentor: requestModal._id,
        expertiseArea: form.expertiseArea,
        message: form.message,
      });
      setRequestModal(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send request');
    }
  };

  return (
    <div className="mentorship">
      <h1 className="font-display glow-text mentorship__title">MENTORSHIP</h1>
      <p className="text-dim mentorship__subtitle">
        Learn from alumni who've walked the path before you.
      </p>

      <div className="mentorship__tabs">
        <button className={`pill ${view === 'find' ? 'pill-active' : ''}`} onClick={() => setView('find')}>
          Find a mentor
        </button>
        <button className={`pill ${view === 'mine' ? 'pill-active' : ''}`} onClick={() => setView('mine')}>
          My mentorships
        </button>
      </div>

      {loading ? (
        <p className="text-dim">Loading...</p>
      ) : view === 'find' ? (
        <div className="mentorship__grid">
          {mentors.length === 0 && <p className="text-dim">No mentors have joined yet.</p>}
          {mentors.map((m) => (
            <div key={m._id} className="card card-glow-hover mentorship__card">
              <h3 className="mentorship__name">{m.name}</h3>
              <span className="text-faint">{m.designation} {m.company ? `at ${m.company}` : ''}</span>
              {m.bio && <p className="text-dim mentorship__bio">{m.bio}</p>}
              <div className="directory__tags mentorship__tags">
                {(m.mentorExpertise || []).map((tag) => (
                  <span key={tag} className="tag-badge">{tag}</span>
                ))}
              </div>
              <button className="btn-primary mentorship__request-btn" onClick={() => openRequest(m)}>
                Request mentorship
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mentorship__grid">
          {myMentorships.length === 0 && <p className="text-dim">No mentorships yet.</p>}
          {myMentorships.map((m) => (
            <div key={m._id} className="card mentorship__card">
              <div className="mentorship__status-row">
                <h3 className="mentorship__name">
                  {m.mentor._id === user._id ? m.mentee.name : m.mentor.name}
                </h3>
                <span className={`tag-badge mentorship__status mentorship__status--${m.status}`}>
                  {m.status}
                </span>
              </div>
              <span className="text-faint">{m.expertiseArea}</span>
              {m.message && <p className="text-dim mentorship__bio">"{m.message}"</p>}
            </div>
          ))}
        </div>
      )}

      {requestModal && (
        <div className="mentorship__modal-backdrop" onClick={() => setRequestModal(null)}>
          <div className="card mentorship__modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display glow-text-blue">Request {requestModal.name}</h3>
            <form onSubmit={submitRequest} className="mentorship__modal-form">
              <input
                className="input-field"
                placeholder="Area of expertise"
                value={form.expertiseArea}
                onChange={(e) => setForm({ ...form, expertiseArea: e.target.value })}
                required
              />
              <textarea
                className="input-field"
                placeholder="Short message introducing yourself..."
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <div className="mentorship__modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setRequestModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Send request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

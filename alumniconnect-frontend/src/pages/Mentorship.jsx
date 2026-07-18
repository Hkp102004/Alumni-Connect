import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Mentorship.css';
import FaqSection from '../components/FaqSection';

export default function Mentorship() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [myMentorships, setMyMentorships] = useState([]);
  const [view, setView] = useState('find');
  const [requestModal, setRequestModal] = useState(null);
  const [form, setForm] = useState({ expertiseArea: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredMentors = mentors.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.company?.toLowerCase().includes(q) ||
      m.designation?.toLowerCase().includes(q) ||
      (m.mentorExpertise || []).some((e) => e.toLowerCase().includes(q))
    );
  });

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

  const generateMeetLink = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part3 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `https://meet.google.com/${part1}-${part2}-${part3}`;
  };

  const handleUpdateStatus = async (mentorshipId, newStatus, meetingLinkVal) => {
    try {
      await api.put(`/mentorships/${mentorshipId}/status`, {
        status: newStatus,
        meetingLink: meetingLinkVal
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update mentorship status');
    }
  };

  const pendingCount = myMentorships.filter(m => m.status === 'pending').length;
  const activeCount = myMentorships.filter(m => m.status === 'active').length;

  return (
    <div className="ms-page">
      {/* Hero banner */}
      <section className="ms-hero">
        <div className="ms-hero__content">
          <h1 className="ms-hero__title">Find your mentor</h1>
          <p className="ms-hero__sub">Connect with experienced alumni who are ready to guide your career journey.</p>
        </div>
        <div className="ms-hero__stats">
          <div className="ms-stat">
            <span className="ms-stat__number">{mentors.length}</span>
            <span className="ms-stat__label">Mentors available</span>
          </div>
          <div className="ms-stat">
            <span className="ms-stat__number">{activeCount}</span>
            <span className="ms-stat__label">Active sessions</span>
          </div>
          <div className="ms-stat">
            <span className="ms-stat__number">{pendingCount}</span>
            <span className="ms-stat__label">Pending requests</span>
          </div>
        </div>
      </section>

      {/* Tab bar + Search */}
      <section className="ms-toolbar">
        <div className="ms-tabs">
          <button className={`ms-tab ${view === 'find' ? 'ms-tab--active' : ''}`} onClick={() => setView('find')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Explore mentors
          </button>
          <button className={`ms-tab ${view === 'mine' ? 'ms-tab--active' : ''}`} onClick={() => setView('mine')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            My mentorships
            {(pendingCount + activeCount > 0) && <span className="ms-tab__badge">{pendingCount + activeCount}</span>}
          </button>
        </div>
        {view === 'find' && (
          <div className="ms-search-wrap">
            <svg className="ms-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="ms-search"
              type="text"
              placeholder="Search by name, company, or expertise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </section>

      {/* Content */}
      <section className="ms-content">
        {loading ? (
          <div className="ms-loading">
            <div className="ms-spinner"></div>
            <p>Loading mentors...</p>
          </div>
        ) : view === 'find' ? (
          <>
            {filteredMentors.length === 0 ? (
              <div className="ms-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <h3>No mentors found</h3>
                <p>{search ? 'Try adjusting your search terms.' : 'No alumni have signed up as mentors yet. Check back soon!'}</p>
              </div>
            ) : (
              <div className="ms-grid">
                {filteredMentors.map((m) => (
                  <div key={m._id} className="ms-card">
                    <div className="ms-card__header">
                      <div className="ms-card__avatar">
                        {m.profilePicture ? (
                          <img src={m.profilePicture} alt={m.name} />
                        ) : (
                          <span>{m.name?.[0]?.toUpperCase() || '?'}</span>
                        )}
                      </div>
                      <div className="ms-card__info">
                        <h3 className="ms-card__name">{m.name}</h3>
                        <p className="ms-card__role">{m.designation || 'Alumni'}{m.company ? ` at ${m.company}` : ''}</p>
                        {m.location && (
                          <span className="ms-card__location">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {m.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {m.bio && <p className="ms-card__bio">{m.bio}</p>}

                    <div className="ms-card__expertise">
                      <span className="ms-card__expertise-label">Expertise</span>
                      <div className="ms-card__tags">
                        {(m.mentorExpertise || []).length > 0 ? (
                          m.mentorExpertise.map((tag) => (
                            <span key={tag} className="ms-tag">{tag}</span>
                          ))
                        ) : (
                          <span className="ms-tag ms-tag--muted">General guidance</span>
                        )}
                      </div>
                    </div>

                    <button className="ms-card__cta" onClick={() => openRequest(m)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/>
                      </svg>
                      Request mentorship
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {myMentorships.length === 0 ? (
              <div className="ms-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                  <path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/>
                </svg>
                <h3>No mentorships yet</h3>
                <p>Browse available mentors and send your first request.</p>
                <button className="ms-empty__cta" onClick={() => setView('find')}>Find a mentor</button>
              </div>
            ) : (
              <div className="ms-my-list">
                {myMentorships.map((m) => {
                  const isMentorForThis = m.mentor?._id === user?._id;
                  const otherUser = isMentorForThis ? m.mentee : m.mentor;

                  return (
                    <div key={m._id} className={`ms-session ms-session--${m.status}`}>
                      <div className="ms-session__left">
                        <div className="ms-session__avatar">
                          {otherUser?.profilePicture ? (
                            <img src={otherUser.profilePicture} alt={otherUser?.name} />
                          ) : (
                            <span>{otherUser?.name?.[0]?.toUpperCase() || '?'}</span>
                          )}
                        </div>
                        <div className="ms-session__info">
                          <h4 className="ms-session__name">{otherUser?.name || 'User'}</h4>
                          <p className="ms-session__meta">
                            {isMentorForThis ? 'Mentee' : 'Mentor'} &middot; {m.expertiseArea}
                          </p>
                          {m.message && <p className="ms-session__msg">"{m.message}"</p>}
                        </div>
                      </div>

                      <div className="ms-session__right">
                        <span className={`ms-status ms-status--${m.status}`}>
                          {m.status === 'pending' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          )}
                          {m.status === 'active' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                          )}
                          {m.status === 'completed' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M20 6 9 17l-5-5"/></svg>
                          )}
                          {m.status === 'declined' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
                          )}
                          {m.status}
                        </span>

                        {/* Pending actions for mentor */}
                        {m.status === 'pending' && isMentorForThis && (
                          <div className="ms-session__actions">
                            <button
                              className="ms-btn ms-btn--accept"
                              onClick={() => {
                                const link = generateMeetLink();
                                const userLink = prompt("Provide Google Meet link for this session:", link);
                                if (userLink !== null) {
                                  handleUpdateStatus(m._id, 'active', userLink);
                                }
                              }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M20 6 9 17l-5-5"/></svg>
                              Accept
                            </button>
                            <button
                              className="ms-btn ms-btn--decline"
                              onClick={() => handleUpdateStatus(m._id, 'declined')}
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {/* Active meeting link */}
                        {m.status === 'active' && (
                          <div className="ms-session__meet">
                            <a href={m.meetingLink || 'https://meet.google.com'} target="_blank" rel="noopener noreferrer" className="ms-meet-link">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z"/>
                                <rect x="1" y="6" width="14" height="12" rx="2" ry="2"/>
                              </svg>
                              Join meeting
                            </a>
                            {isMentorForThis && (
                              <div className="ms-session__mentor-actions">
                                <button
                                  className="ms-btn ms-btn--outline ms-btn--sm"
                                  onClick={() => {
                                    const newLink = prompt("Update Google Meet link:", m.meetingLink || generateMeetLink());
                                    if (newLink !== null) {
                                      handleUpdateStatus(m._id, 'active', newLink);
                                    }
                                  }}
                                >
                                  Update link
                                </button>
                                <button
                                  className="ms-btn ms-btn--complete ms-btn--sm"
                                  onClick={() => handleUpdateStatus(m._id, 'completed')}
                                >
                                  Complete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* FAQ Section */}
      <FaqSection
        title="Mentorship FAQs"
        faqs={[
          {
            question: "How do I request a mentorship session?",
            answer: "Browse available mentors on the 'Find a Mentor' tab, click 'Request Mentorship' on a mentor's card, select your interest area, and send a message."
          },
          {
            question: "How do we connect for the actual mentorship session?",
            answer: "Once the mentor accepts your request, they will provide a Google Meet link. You can join the meeting directly from the 'My Sessions' tab."
          },
          {
            question: "Who can host mentorship sessions?",
            answer: "Any registered Alumnus can toggle their mentor status in their profile settings to start offering mentorship."
          },
          {
            question: "What happens after a mentorship session is completed?",
            answer: "The mentor can mark the session as 'Completed'. You can then request another session or connect with other mentors."
          }
        ]}
      />

      {/* Request Modal */}
      {requestModal && (
        <div className="ms-modal-overlay" onClick={() => setRequestModal(null)}>
          <div className="ms-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ms-modal__close" onClick={() => setRequestModal(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <div className="ms-modal__header">
              <div className="ms-modal__avatar">
                {requestModal.profilePicture ? (
                  <img src={requestModal.profilePicture} alt={requestModal.name} />
                ) : (
                  <span>{requestModal.name?.[0]?.toUpperCase() || '?'}</span>
                )}
              </div>
              <div>
                <h3 className="ms-modal__name">Request mentorship</h3>
                <p className="ms-modal__sub">with {requestModal.name}</p>
              </div>
            </div>
            <form onSubmit={submitRequest} className="ms-modal__form">
              <div className="ms-form-group">
                <label>Area of interest</label>
                <input
                  type="text"
                  placeholder="e.g. System Design, Career Guidance..."
                  value={form.expertiseArea}
                  onChange={(e) => setForm({ ...form, expertiseArea: e.target.value })}
                  required
                />
              </div>
              <div className="ms-form-group">
                <label>Your message</label>
                <textarea
                  placeholder="Introduce yourself and explain what you'd like help with..."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <div className="ms-modal__footer">
                <button type="button" className="ms-btn ms-btn--outline" onClick={() => setRequestModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="ms-btn ms-btn--primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/>
                  </svg>
                  Send request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

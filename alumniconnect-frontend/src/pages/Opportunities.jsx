import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Opportunities.css';
import FaqSection from '../components/FaqSection';

export default function Opportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    type: 'job',
    location: '',
    description: '',
    applyLink: '',
  });

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/opportunities');
      setOpportunities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/opportunities', form);
      setShowForm(false);
      setForm({ title: '', company: '', type: 'job', location: '', description: '', applyLink: '' });
      loadOpportunities();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not post opportunity');
    }
  };

  const handleApply = async (id) => {
    try {
      await api.post(`/opportunities/${id}/apply`);
      loadOpportunities();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not apply');
    }
  };

  // Client-side filtering for fast responsive search
  const filteredOpportunities = opportunities.filter((op) => {
    const matchesTab = typeFilter === '' || op.type === typeFilter;
    const matchesSearch = 
      op.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Calculate statistics
  const totalCount = opportunities.length;
  const jobsCount = opportunities.filter(o => o.type === 'job').length;
  const internshipsCount = opportunities.filter(o => o.type === 'internship').length;

  const getTabCount = (tabType) => {
    if (tabType === '') return opportunities.length;
    return opportunities.filter(o => o.type === tabType).length;
  };

  return (
    <div className="op-page">
      {/* Hero Banner */}
      <section className="op-hero">
        <div className="op-hero__content">
          <h1 className="op-hero__title">Opportunities Hub</h1>
          <p className="op-hero__sub">Explore and apply to job openings and internships curated and shared by our alumni network.</p>
        </div>
        <div className="op-hero__stats">
          <div className="op-stat">
            <span className="op-stat__number">{totalCount}</span>
            <span className="op-stat__label">Total Openings</span>
          </div>
          <div className="op-stat">
            <span className="op-stat__number">{jobsCount}</span>
            <span className="op-stat__label">Jobs</span>
          </div>
          <div className="op-stat">
            <span className="op-stat__number">{internshipsCount}</span>
            <span className="op-stat__label">Internships</span>
          </div>
        </div>
      </section>

      {/* Toolbar - tabs + search */}
      <div className="op-toolbar">
        <div className="op-tabs">
          {[
            { id: '', label: 'All Postings' },
            { id: 'job', label: 'Jobs' },
            { id: 'internship', label: 'Internships' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`op-tab ${typeFilter === tab.id ? 'op-tab--active' : ''}`}
              onClick={() => setTypeFilter(tab.id)}
            >
              {tab.label}
              <span className="op-tab__badge">{getTabCount(tab.id)}</span>
            </button>
          ))}
        </div>

        <div className="op-toolbar__actions">
          <div className="op-search-wrap">
            <svg className="op-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="op-search"
              placeholder="Search by role, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {user?.role === 'alumni' && (
            <button className="op-btn op-btn--primary" onClick={() => setShowForm(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Post an Opening
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="op-loader-container">
          <div className="op-loader"></div>
        </div>
      ) : (
        <div className="op-grid">
          {filteredOpportunities.length === 0 ? (
            <div className="op-empty">
              <div className="op-empty__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  <path d="M12 11v6M9 14h6"/>
                </svg>
              </div>
              <h3 className="op-empty__title">No opportunities found</h3>
              <p className="op-empty__desc">There are no job postings matches your search. Try resetting filters or check back later!</p>
              {user?.role === 'alumni' && (
                <button className="op-btn op-btn--outline" onClick={() => setShowForm(true)}>
                  Post the first opening
                </button>
              )}
            </div>
          ) : (
            filteredOpportunities.map((op) => {
              const hasApplied = op.applicants?.some((a) => (a.user?._id || a.user) === user?._id);
              return (
                <div key={op._id} className="op-card">
                  <div className="op-card__header">
                    <span className={`op-badge op-badge--${op.type || 'job'}`}>
                      {op.type === 'internship' ? 'Internship' : 'Job'}
                    </span>
                    {op.location && (
                      <span className="op-card__location-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ marginRight: '4px' }}>
                          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {op.location}
                      </span>
                    )}
                  </div>

                  <div className="op-card__body">
                    <h3 className="op-card__title" title={op.title}>{op.title}</h3>
                    <h4 className="op-card__company">{op.company}</h4>
                    <p className="op-card__desc">{op.description}</p>
                  </div>

                  <div className="op-card__footer">
                    <div className="op-card__applicants">
                      <svg className="op-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                      </svg>
                      <span>{op.applicants?.length || 0} applicants</span>
                    </div>

                    {op.applyLink ? (
                      <a 
                        href={op.applyLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="op-btn op-btn--sm op-btn--primary"
                      >
                        Apply Externally
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" style={{ marginLeft: '4px' }}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
                        </svg>
                      </a>
                    ) : (
                      <button
                        className={`op-btn op-btn--sm ${hasApplied ? 'op-btn--success' : 'op-btn--outline'}`}
                        onClick={() => !hasApplied && handleApply(op._id)}
                        disabled={hasApplied}
                      >
                        {hasApplied ? (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12" style={{ marginRight: '4px' }}>
                              <path d="M20 6 9 17l-5-5"/>
                            </svg>
                            Applied
                          </>
                        ) : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* FAQ Section */}
      <FaqSection
        title="Opportunities FAQs"
        faqs={[
          {
            question: "Who can post job openings and internships?",
            answer: "Alumni can post openings by clicking the 'Post an Opening' button in the toolbar."
          },
          {
            question: "How do I apply for an opportunity?",
            answer: "For opportunities with direct applications, click 'Apply Now'. If the opportunity has an external link, click 'Apply Externally' to go to the company's portal."
          },
          {
            question: "What is the difference between jobs and internships?",
            answer: "Jobs are full-time opportunities typically for graduates, while Internships are short-term training placements suitable for current students."
          },
          {
            question: "Can students post opportunities?",
            answer: "No, currently only alumni can post opportunities to ensure they are verified listings from our professional network."
          }
        ]}
      />

      {/* Host Opportunity Modal */}
      {showForm && (
        <div className="op-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="op-modal" onClick={(e) => e.stopPropagation()}>
            <button className="op-modal__close" onClick={() => setShowForm(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

            <div className="op-modal__header">
              <h3 className="op-modal__title">Post a new opportunity</h3>
              <p className="op-modal__sub">Share job openings or internship possibilities with current students and fellow alumni.</p>
            </div>

            <form onSubmit={handleCreate} className="op-modal__form">
              <div className="op-form-grid">
                <div className="op-form-group">
                  <label>Role Title</label>
                  <input
                    className="op-input"
                    name="title"
                    placeholder="e.g. Software Engineer, Data Intern"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="op-form-group">
                  <label>Company</label>
                  <input
                    className="op-input"
                    name="company"
                    placeholder="e.g. Google, Microsoft, Startup"
                    value={form.company}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="op-form-grid">
                <div className="op-form-group">
                  <label>Opportunity Type</label>
                  <select className="op-select" name="type" value={form.type} onChange={handleChange}>
                    <option value="job">Full-time Job</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div className="op-form-group">
                  <label>Location</label>
                  <input
                    className="op-input"
                    name="location"
                    placeholder="e.g. Remote, Bangalore, New York"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="op-form-group">
                <label>Description</label>
                <textarea
                  className="op-textarea"
                  name="description"
                  placeholder="Provide role responsibilities, requirements, qualifications..."
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="op-form-group">
                <label>Application Link (Optional)</label>
                <input
                  className="op-input"
                  name="applyLink"
                  placeholder="https://company-careers-portal.com/job/123"
                  value={form.applyLink}
                  onChange={handleChange}
                />
              </div>

              <div className="op-modal__footer">
                <button type="button" className="op-btn op-btn--outline" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="op-btn op-btn--primary">
                  Post Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

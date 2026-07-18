import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Opportunities.css';

export default function Opportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    type: 'job',
    location: '',
    description: '',
    applyLink: '',
  });

  const loadOpportunities = async (type) => {
    setLoading(true);
    try {
      const params = type ? { type } : {};
      const res = await api.get('/opportunities', { params });
      setOpportunities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities(typeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/opportunities', form);
      setShowForm(false);
      setForm({ title: '', company: '', type: 'job', location: '', description: '', applyLink: '' });
      loadOpportunities(typeFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not post opportunity');
    }
  };

  const handleApply = async (id) => {
    try {
      await api.post(`/opportunities/${id}/apply`);
      loadOpportunities(typeFilter);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not apply');
    }
  };

  return (
    <div className="opportunities">
      <div className="opportunities__header">
        <div>
          <h1 className="font-display glow-text opportunities__title">OPPORTUNITIES</h1>
          <p className="text-dim opportunities__subtitle">Jobs and internships shared by alumni.</p>
        </div>
        {user?.role === 'alumni' && (
          <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Close' : 'Post an opportunity'}
          </button>
        )}
      </div>

      <div className="opportunities__tabs">
        {['', 'job', 'internship'].map((t) => (
          <button
            key={t || 'all'}
            className={`pill ${typeFilter === t ? 'pill-active' : ''}`}
            onClick={() => setTypeFilter(t)}
          >
            {t === '' ? 'All' : t === 'job' ? 'Jobs' : 'Internships'}
          </button>
        ))}
      </div>

      {showForm && (
        <form className="card opportunities__form" onSubmit={handleCreate}>
          <div className="opportunities__form-row">
            <input
              className="input-field"
              name="title"
              placeholder="Role title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <input
              className="input-field"
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className="opportunities__form-row">
            <select className="input-field" name="type" value={form.type} onChange={handleChange}>
              <option value="job">Job</option>
              <option value="internship">Internship</option>
            </select>
            <input
              className="input-field"
              name="location"
              placeholder="Location (or 'Remote')"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <textarea
            className="input-field"
            name="description"
            placeholder="Role description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            name="applyLink"
            placeholder="External application link (optional)"
            value={form.applyLink}
            onChange={handleChange}
          />
          <button className="btn-primary" type="submit">Post opportunity</button>
        </form>
      )}

      {loading ? (
        <p className="text-dim">Loading...</p>
      ) : (
        <div className="opportunities__grid">
          {opportunities.length === 0 && <p className="text-dim">No opportunities posted yet.</p>}
          {opportunities.map((op) => {
            const hasApplied = op.applicants?.some((a) => (a.user?._id || a.user) === user?._id);
            return (
              <div key={op._id} className="card opportunities__card">
                <span className="tag-badge opportunities__type">{op.type}</span>
                <h3 className="opportunities__name">{op.title}</h3>
                <span className="text-faint">{op.company} {op.location ? `· ${op.location}` : ''}</span>
                <p className="text-dim opportunities__desc">{op.description}</p>
                <div className="opportunities__footer">
                  <span className="text-faint">{op.applicants?.length || 0} applied</span>
                  {op.applyLink ? (
                    <a href={op.applyLink} target="_blank" rel="noreferrer" className="btn-primary">
                      Apply externally
                    </a>
                  ) : (
                    <button
                      className={hasApplied ? 'btn-ghost' : 'btn-primary'}
                      onClick={() => !hasApplied && handleApply(op._id)}
                      disabled={hasApplied}
                    >
                      {hasApplied ? 'Applied' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

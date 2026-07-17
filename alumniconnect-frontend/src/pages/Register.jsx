import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    batch: '',
    branch: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/directory');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card card auth-card--wide">
        <h1 className="font-display glow-text auth-title">JOIN THE NETWORK</h1>
        <p className="text-dim auth-subtitle">Create your AlumniConnect profile.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="input-field"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          <div className="auth-role-select">
            {['student', 'alumni'].map((r) => (
              <button
                type="button"
                key={r}
                className={`pill ${form.role === r ? 'pill-active' : ''}`}
                onClick={() => setForm({ ...form, role: r })}
              >
                {r === 'student' ? 'I\'m a student' : 'I\'m an alumnus'}
              </button>
            ))}
          </div>

          <div className="auth-form-row">
            <input
              className="input-field"
              name="batch"
              placeholder="Batch year (e.g. 2022)"
              value={form.batch}
              onChange={handleChange}
            />
            <input
              className="input-field"
              name="branch"
              placeholder="Branch (e.g. CSE)"
              value={form.branch}
              onChange={handleChange}
            />
          </div>

          {form.role === 'alumni' && (
            <input
              className="input-field"
              name="company"
              placeholder="Current company"
              value={form.company}
              onChange={handleChange}
            />
          )}

          <button className="btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-dim auth-footer">
          Already have an account? <Link to="/login" className="glow-text-blue">Log in</Link>
        </p>
      </div>
    </div>
  );
}

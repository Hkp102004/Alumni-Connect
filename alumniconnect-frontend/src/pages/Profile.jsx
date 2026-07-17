import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import './Profile.css';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    company: user?.company || '',
    designation: user?.designation || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: (user?.skills || []).join(', '),
    isMentor: user?.isMentor || false,
    mentorExpertise: (user?.mentorExpertise || []).join(', '),
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        mentorExpertise: form.mentorExpertise.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await api.put('/users/me', payload);
      setUser(res.data);
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile">
      <h1 className="font-display glow-text profile__title">YOUR PROFILE</h1>
      <p className="text-dim profile__subtitle">
        {user.role === 'alumni' ? 'Alumni' : 'Student'} · {user.email}
      </p>

      <form className="card profile__form" onSubmit={handleSubmit}>
        <div className="profile__row">
          <label className="text-faint">Name</label>
          <input className="input-field" name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="profile__row-double">
          <div className="profile__row">
            <label className="text-faint">Company</label>
            <input className="input-field" name="company" value={form.company} onChange={handleChange} />
          </div>
          <div className="profile__row">
            <label className="text-faint">Designation</label>
            <input className="input-field" name="designation" value={form.designation} onChange={handleChange} />
          </div>
        </div>

        <div className="profile__row">
          <label className="text-faint">Location</label>
          <input className="input-field" name="location" value={form.location} onChange={handleChange} />
        </div>

        <div className="profile__row">
          <label className="text-faint">Bio</label>
          <textarea
            className="input-field profile__textarea"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            maxLength={500}
            rows={4}
          />
        </div>

        <div className="profile__row">
          <label className="text-faint">Skills (comma separated)</label>
          <input className="input-field" name="skills" value={form.skills} onChange={handleChange} />
        </div>

        {user.role === 'alumni' && (
          <>
            <label className="profile__checkbox">
              <input type="checkbox" name="isMentor" checked={form.isMentor} onChange={handleChange} />
              <span>Available as a mentor</span>
            </label>

            {form.isMentor && (
              <div className="profile__row">
                <label className="text-faint">Mentorship areas (comma separated)</label>
                <input
                  className="input-field"
                  name="mentorExpertise"
                  value={form.mentorExpertise}
                  onChange={handleChange}
                  placeholder="e.g. Web Development, Product Management"
                />
              </div>
            )}
          </>
        )}

        <button className="btn-primary profile__submit" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
        {saved && <p className="glow-text-blue profile__saved">Profile updated.</p>}
      </form>
    </div>
  );
}

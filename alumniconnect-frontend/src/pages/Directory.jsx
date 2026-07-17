import { useEffect, useState } from 'react';
import api from '../api/client';
import './Directory.css';

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', role: '', batch: '', branch: '' });

  const fetchUsers = async (activeFilters) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(activeFilters).filter(([, v]) => v)
      );
      const res = await api.get('/users', { params });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(filters);
  };

  return (
    <div className="directory">
      <h1 className="font-display glow-text directory__title">ALUMNI DIRECTORY</h1>
      <p className="text-dim directory__subtitle">
        Discover graduates and students across every batch and branch.
      </p>

      <form className="directory__filters" onSubmit={handleSearch}>
        <input
          className="input-field"
          name="search"
          placeholder="Search by name or bio..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select className="input-field directory__select" name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="alumni">Alumni</option>
        </select>
        <input
          className="input-field directory__select"
          name="batch"
          placeholder="Batch"
          value={filters.batch}
          onChange={handleFilterChange}
        />
        <input
          className="input-field directory__select"
          name="branch"
          placeholder="Branch"
          value={filters.branch}
          onChange={handleFilterChange}
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-dim">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-dim">No one matches these filters yet.</p>
      ) : (
        <div className="directory__grid">
          {users.map((u) => (
            <div key={u._id} className="card card-glow-hover directory__card">
              <div className="directory__card-header">
                <div className="directory__avatar font-display">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="directory__name">{u.name}</h3>
                  <span className="text-faint directory__role">
                    {u.role === 'alumni' ? u.company || 'Alumni' : `Student · ${u.branch || ''}`}
                  </span>
                </div>
              </div>

              {u.bio && <p className="text-dim directory__bio">{u.bio}</p>}

              <div className="directory__tags">
                {u.batch && <span className="tag-badge">Batch {u.batch}</span>}
                {u.branch && <span className="tag-badge">{u.branch}</span>}
                {u.isMentor && <span className="tag-badge">Mentor</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

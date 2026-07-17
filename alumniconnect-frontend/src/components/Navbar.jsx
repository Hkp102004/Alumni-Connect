import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Directory', path: '/directory' },
  { label: 'Mentorship', path: '/mentorship' },
  { label: 'Events', path: '/events' },
  { label: 'Opportunities', path: '/opportunities' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand font-display glow-text">
        ALUMNI<span className="glow-text-blue">CONNECT</span>
      </Link>

      {user && (
        <div className="navbar__links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`pill navbar__pill ${location.pathname === item.path ? 'pill-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <div className="navbar__actions">
        {user ? (
          <>
            <Link to="/profile" className="pill navbar__pill">
              {user.name?.split(' ')[0] || 'Profile'}
            </Link>
            <button className="btn-ghost navbar__logout" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="pill navbar__pill">
              Log in
            </Link>
            <Link to="/register" className="btn-primary navbar__cta">
              Join
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

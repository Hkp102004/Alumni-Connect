import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <div className="landing__glow-orb" />
      <div className="landing__content">
        <h1 className="font-display glow-text landing__title">
          FIND YOUR NEXT
          <br />
          <span className="glow-text-blue">MENTOR & CONNECTION</span>
        </h1>
        <p className="text-dim landing__subtitle">
          Where graduates, students, and institutions meet. Build your network, find a mentor,
          discover opportunities, and stay connected long after graduation.
        </p>

        <div className="landing__actions">
          {user ? (
            <Link to="/directory" className="btn-primary">
              Browse the Directory
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary">
                Create your profile
              </Link>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
            </>
          )}
        </div>

        <div className="landing__stats">
          <div className="landing__stat card">
            <span className="font-display glow-text-blue landing__stat-number">01</span>
            <span className="text-dim">Build your profile & get discovered</span>
          </div>
          <div className="landing__stat card">
            <span className="font-display glow-text-blue landing__stat-number">02</span>
            <span className="text-dim">Request mentorship from alumni in your field</span>
          </div>
          <div className="landing__stat card">
            <span className="font-display glow-text-blue landing__stat-number">03</span>
            <span className="text-dim">RSVP to events & apply to opportunities</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/directory');
    }
  };

  return (
    <div className="landing">
      {/* Vibrant Hero Banner */}
      <div className="landing__hero-banner">
        <div className="landing__hero-container">
          <div className="landing__hero-left">
            <div className="landing__logo-badge">lumnus workspace</div>
            <h1 className="landing__hero-title">
              Alumni & Prospects Engagement Stack built for <span className="underline-text">Success & Efficiency</span>
            </h1>
            <p className="landing__hero-subtitle">
              Your professional mentorship and networking partner, grounded in the community you trust, built with modern directory features.
            </p>
            
            {/* Search Form */}
            <form className="landing__search-form" onSubmit={handleSearchSubmit}>
              <div className="landing__search-container">
                <svg className="landing__search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input 
                  type="text" 
                  className="landing__search-input" 
                  placeholder="Search alumni by name, company, or skills..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn-primary landing__search-btn">
                  Search
                </button>
              </div>
            </form>

            <div className="landing__actions">
              {!user && (
                <>
                  <Link to="/register" className="btn-primary-white">
                    Join the Network
                  </Link>
                  <Link to="/login" className="btn-ghost-white">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="landing__hero-right">
            {/* Overlapping Avatar Mockup Grid with dotted bg */}
            <div className="avatar-grid-container">
              <div className="avatar-grid__dots" />
              <div className="avatar-grid__cell avatar-grid__cell--1">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Alumni" />
              </div>
              <div className="avatar-grid__cell avatar-grid__cell--2">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Alumni" />
              </div>
              <div className="avatar-grid__cell avatar-grid__cell--3">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="Alumni" />
              </div>
              <div className="avatar-grid__cell avatar-grid__cell--4">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" alt="Alumni" />
              </div>
              <div className="avatar-grid__cell avatar-grid__cell--5">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Alumni" />
              </div>
              <div className="avatar-grid__cell avatar-grid__cell--6">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Alumni" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="landing__content">



        {/* Pathways Portal Section */}
        <div className="landing__portals-section">
          <h2 className="landing__portals-title">How can we help you today?</h2>
          <p className="landing__portals-subtitle">Choose a pathway to get started with the lumnus community.</p>
          
          <div className="landing__portals-grid">
            <Link to="/directory" className="landing__portal-card">
              <div className="landing__portal-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3>Alumni Directory</h3>
              <p>Discover, search, and connect with graduates across every industry and batch.</p>
              <span className="landing__portal-link">Browse directory →</span>
            </Link>

            <Link to="/mentorship" className="landing__portal-card">
              <div className="landing__portal-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3>Mentorship Hub</h3>
              <p>Connect with industry veterans for career coaching or share your expertise.</p>
              <span className="landing__portal-link">Find a mentor →</span>
            </Link>

            <Link to="/events" className="landing__portal-card">
              <div className="landing__portal-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3>Events & Meetups</h3>
              <p>Stay updated with workshops, networking calls, and alumni webinars.</p>
              <span className="landing__portal-link">View events →</span>
            </Link>

            <Link to="/opportunities" className="landing__portal-card">
              <div className="landing__portal-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3>Opportunities</h3>
              <p>Explore exclusive job recommendations, internships, and project openings.</p>
              <span className="landing__portal-link">Explore jobs →</span>
            </Link>
          </div>
        </div>

        {/* Feature Section 1: Two Column Layout (Profile Mockup) */}
        <div className="landing__feature-row">
          <div className="landing__feature-text">
            <div className="landing__feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h2>Create your profile</h2>
            <p>
              Build a professional profile highlighting your current company, branch, and areas of expertise. Let students and recruiters discover your achievements.
            </p>
            <ul className="landing__feature-list">
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Verified student & alumni status
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Showcase skills, companies, and batch details
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Toggle mentorship availability anytime
              </li>
            </ul>
          </div>
          
          <div className="landing__feature-graphic">
            {/* Visual Profile Card Mockup */}
            <div className="mockup-card profile-mockup">
              <div className="profile-mockup__header">
                <div className="profile-mockup__avatar">
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80" alt="Amit Patel" />
                </div>
                <div className="profile-mockup__details">
                  <h4>Amit Patel</h4>
                  <p>Senior Software Engineer</p>
                </div>
              </div>
              <div className="profile-mockup__body">
                <p>Happy to help with resume reviews, backend engineering paths, and system design mock interviews.</p>
              </div>
              <div className="profile-mockup__footer">
                <span className="mockup-badge">Batch 2020</span>
                <span className="mockup-badge">Mentor Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section 2: Two Column Layout (Mentorship Actions Mockup) */}
        <div className="landing__feature-row landing__feature-row--reverse">
          <div className="landing__feature-graphic">
            {/* Visual Action Mockup */}
            <div className="mockup-card action-mockup">
              <div className="action-mockup__item action-mockup__item--active">
                <div className="action-mockup__icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 112-2h2a2 2 0 012 2"></path></svg>
                </div>
                <span>+ Request Mentorship</span>
              </div>
              <div className="action-mockup__item">
                <div className="action-mockup__icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <span>Schedule Session</span>
              </div>
              <div className="action-mockup__item">
                <div className="action-mockup__icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </div>
                <span>Send Message</span>
              </div>
            </div>
          </div>

          <div className="landing__feature-text">
            <div className="landing__feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h2>Find your next mentor</h2>
            <p>
              Browse mentors in your domain, request professional guidance, and build meaningful career connections. Start learning from industry veterans.
            </p>
            <ul className="landing__feature-list">
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Filter mentors by industry or company
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Send direct structured mentorship requests
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Real-time status updates on requests
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Row A: LinkedIn Profile Sync */}
        <div className="landing__feature-row">
          <div className="landing__feature-text">
            <div className="landing__feature-icon">
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.8v8.37h2.8v-4.87c0-.26.05-.52.13-.7a1.11 1.11 0 0 1 .97-.7c.66 0 1.16.52 1.16 1.3v4.97h2.8M6.5 8.37a1.37 1.37 0 1 0 0-2.75 1.37 1.37 0 0 0 0 2.75M8 18.5V10.1H5.2v8.4H8z"></path>
              </svg>
            </div>
            <h2>LinkedIn Profile Sync & Data Enrichment</h2>
            <p>
              Keep your alumni database continuously updated. Automatically sync member profiles with LinkedIn to track career path transitions, role updates, and company migrations without manual surveys.
            </p>
            <ul className="landing__feature-list">
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Automatic profile enrichment & data sync
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Sync career moves and current company tags
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                LinkedIn social activity feeds integrated
              </li>
            </ul>
          </div>
          
          <div className="landing__feature-graphic">
            {/* Visual LinkedIn Connection Circle Mockup */}
            <div className="mockup-card linkedin-sync-mockup">
              <div className="linkedin-sync__central-badge">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div className="linkedin-sync__node linkedin-sync__node--1">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" alt="Alumni" />
              </div>
              <div className="linkedin-sync__node linkedin-sync__node--2">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80" alt="Alumni" />
              </div>
              <div className="linkedin-sync__node linkedin-sync__node--3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Alumni" />
              </div>
              <div className="linkedin-sync__node linkedin-sync__node--4">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Alumni" />
              </div>
              <div className="linkedin-sync__node linkedin-sync__node--5">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="Alumni" />
              </div>
              <div className="linkedin-sync__node linkedin-sync__node--6">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Alumni" />
              </div>
              {/* Central spinning or curved connection arrows */}
              <div className="linkedin-sync__arrow-ring" />
            </div>
          </div>
        </div>

        {/* Feature Row B: Google Meet Integration */}
        <div className="landing__feature-row landing__feature-row--reverse">
          <div className="landing__feature-text">
            <div className="landing__feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2>Online Alumni Events - End to End</h2>
            <p>
              Schedule, coordinate, and host online webinar sessions, professional panel workshops, or interactive homecoming events. Generate Google Meet links instantly within our dashboard.
            </p>
            <ul className="landing__feature-list">
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Google Meet link generation on event creation
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                "Join Meet" buttons directly on calendar cards
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Complete RSVP, schedule alerts & attendee metrics
              </li>
            </ul>
          </div>
          
          <div className="landing__feature-graphic">
            {/* Visual Meet Video Grid Mockup */}
            <div className="mockup-card video-grid-mockup">
              <div className="video-grid__grid">
                <div className="video-grid__cell cell--1">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" alt="Divya" />
                  <span>Divya Sharma</span>
                </div>
                <div className="video-grid__cell cell--2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Aarav" />
                  <span>Aarav Patel</span>
                </div>
                <div className="video-grid__cell cell--3">
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80" alt="Kunal" />
                  <span>Kunal Verma</span>
                </div>
                <div className="video-grid__cell cell--4">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Neha" />
                  <span>Neha Gupta</span>
                </div>
                <div className="video-grid__cell cell--5">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Rohan" />
                  <span>Rohan Mehta</span>
                </div>
                <div className="video-grid__cell cell--6">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Pooja" />
                  <span>Pooja Malhotra</span>
                </div>
              </div>
              <div className="video-grid__controls">
                <div className="control-btn control-btn--red" />
                <div className="control-btn" />
                <div className="control-btn" />
                <div className="control-btn" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Row C: Content & Customizations */}
        <div className="landing__feature-row">
          <div className="landing__feature-text">
            <div className="landing__feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </div>
            <h2>Engagement Bulletins & Newsletters</h2>
            <p>
              Increase community participation. Compose targeted newsletters, highlight outstanding alumni achievements, and custom-segment announcement emails for specific batches, industries, or geographic chapters.
            </p>
            <ul className="landing__feature-list">
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                "Alumni in News" bulletin boards & highlights
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Customizable newsletter templates & automation
              </li>
              <li>
                <svg className="bullet-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                Dedicated support channels and custom settings
              </li>
            </ul>
          </div>
          
          <div className="landing__feature-graphic">
            {/* Visual Bulletin Mockup */}
            <div className="mockup-card bulletin-mockup">
              <div className="bulletin-mockup__header">
                <h5>Alumni in News</h5>
                <span>7d ago</span>
              </div>
              <div className="bulletin-mockup__profile">
                <div className="bulletin-mockup__avatar">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Aidan" />
                </div>
                <div>
                  <h6>Aditya Sen</h6>
                  <p>CEO/Founder of FinScale</p>
                </div>
              </div>
              <div className="bulletin-mockup__article">
                <h6>FinScale raises $2M from Mars Growth Capital</h6>
                <p>Alumnus Aditya Sen stated, "It's exciting to see venture funding backing local innovation."</p>
              </div>
              <div className="bulletin-mockup__actions">
                <button type="button" className="mockup-btn">Share via Email</button>
                <button type="button" className="mockup-btn mockup-btn--active">Save to CRM</button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="landing__faq">
          <div className="landing__faq-left">
            <span className="landing__faq-tag">FAQ'S</span>
            <h2 className="landing__faq-title">Find the answer to your common questions</h2>
            <Link to="/profile" className="btn-ghost landing__faq-cta">
              Connect with Us
              <svg className="landing__faq-cta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </Link>
          </div>
          
          <div className="landing__faq-right">
            {[
              {
                question: "Is there a fee for students to participate in the mentorship program?",
                answer: "No, participation is completely free for verified students and alumni of our institution."
              },
              {
                question: "How are mentors selected for students?",
                answer: "Students can browse the directory, filter by field or interest, and request a mentor who aligns with their goals."
              },
              {
                question: "Can I request a specific mentor?",
                answer: "Yes. You can request any verified alumnus who has marked themselves as an active mentor in their profile."
              },
              {
                question: "How long does it take to get matched with a mentor?",
                answer: "It depends on the mentor's availability. Once you send a request, they will receive a notification and can accept or decline the request."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className={`landing__faq-item ${activeFaq === idx ? 'landing__faq-item--active' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="landing__faq-question">
                  <h3>{faq.question}</h3>
                  <svg className="landing__faq-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                <div className="landing__faq-answer">
                  <div className="landing__faq-answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

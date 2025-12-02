import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FeatureCardFlip from '../components/FeatureCardFlip';
import InteractiveFAPlayground from '../components/InteractiveFAPlayground';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your friendly path to <span className="highlight">master</span>
              <br />
              finite automata.
            </h1>
            
            <div className="hero-cta">
              <button className="btn-hero-primary" onClick={handleGetStarted}>
                Start Learning
              </button>
              <div className="btn-arrow-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <p className="hero-description">
              Build confidence in theory with story-driven practice, visual simulations, and an AI mentor that celebrates every milestone.
            </p>

            <div className="hero-social-proof">
              <div className="student-avatars">
                <div className="avatar avatar-1">👨‍💻</div>
                <div className="avatar avatar-2">👩‍💻</div>
                <div className="avatar avatar-3">👨‍🎓</div>
              </div>
              <div className="student-count">
                <strong>5K +</strong>
                <span>Students</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-clipart">
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                {/* Student figure */}
                <g id="student">
                  {/* Head */}
                  <circle cx="200" cy="120" r="35" fill="#ffd166" stroke="#1f2a44" strokeWidth="2"/>
                  {/* Hair */}
                  <path d="M 170 100 Q 200 80 230 100 Q 240 90 230 110 Q 200 95 170 110 Z" fill="#1f2a44"/>
                  {/* Body */}
                  <rect x="180" y="155" width="40" height="80" rx="5" fill="#667eea" stroke="#1f2a44" strokeWidth="2"/>
                  {/* Arms */}
                  <ellipse cx="165" cy="190" rx="8" ry="25" fill="#ffd166" stroke="#1f2a44" strokeWidth="2"/>
                  <ellipse cx="235" cy="190" rx="8" ry="25" fill="#ffd166" stroke="#1f2a44" strokeWidth="2"/>
                  {/* Legs */}
                  <rect x="185" y="235" width="12" height="50" rx="3" fill="#2ec4b6" stroke="#1f2a44" strokeWidth="2"/>
                  <rect x="203" y="235" width="12" height="50" rx="3" fill="#2ec4b6" stroke="#1f2a44" strokeWidth="2"/>
                  {/* Eyes */}
                  <circle cx="190" cy="115" r="4" fill="#1f2a44"/>
                  <circle cx="210" cy="115" r="4" fill="#1f2a44"/>
                  {/* Smile */}
                  <path d="M 190 130 Q 200 138 210 130" stroke="#1f2a44" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </g>
                
                {/* Book/Tablet */}
                <g id="book" transform="translate(140, 200)">
                  <rect x="0" y="0" width="60" height="40" rx="3" fill="#fff7f0" stroke="#1f2a44" strokeWidth="2"/>
                  <line x1="5" y1="15" x2="55" y2="15" stroke="#1f2a44" strokeWidth="1.5"/>
                  <line x1="5" y1="22" x2="50" y2="22" stroke="#1f2a44" strokeWidth="1.5"/>
                  <line x1="5" y1="29" x2="45" y2="29" stroke="#1f2a44" strokeWidth="1.5"/>
                </g>
                
                {/* Thought bubble */}
                <g id="thought">
                  <circle cx="280" cy="100" r="25" fill="#fff" stroke="#1f2a44" strokeWidth="2"/>
                  <circle cx="300" cy="85" r="8" fill="#fff" stroke="#1f2a44" strokeWidth="1.5"/>
                  <circle cx="310" cy="75" r="5" fill="#fff" stroke="#1f2a44" strokeWidth="1"/>
                  {/* FA symbol in thought */}
                  <circle cx="280" cy="100" r="12" fill="none" stroke="#667eea" strokeWidth="2"/>
                  <circle cx="280" cy="100" r="8" fill="none" stroke="#ff8a65" strokeWidth="1.5"/>
                  <line x1="272" y1="100" x2="288" y2="100" stroke="#1f2a44" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>
                </g>
                
                {/* Arrow marker */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#1f2a44"/>
                  </marker>
                </defs>
                
                {/* Stars for learning effect */}
                <g id="stars">
                  <path d="M 320 180 L 325 190 L 335 190 L 327 197 L 330 207 L 320 200 L 310 207 L 313 197 L 305 190 L 315 190 Z" fill="#ffd166" opacity="0.8"/>
                  <path d="M 80 160 L 83 167 L 90 167 L 84 172 L 87 179 L 80 174 L 73 179 L 76 172 L 70 167 L 77 167 Z" fill="#2ec4b6" opacity="0.8"/>
                  <path d="M 350 250 L 352 255 L 357 255 L 353 258 L 355 263 L 350 260 L 345 263 L 347 258 L 343 255 L 348 255 Z" fill="#ff8a65" opacity="0.8"/>
                </g>
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive FA Playground */}
      <section className="playground-section">
        <InteractiveFAPlayground />
      </section>

      {/* Journey Section */}
      <section className="how-it-works-section">
        <div className="journey-header">
          <h2 className="section-title">Your Acceptly Journey</h2>
          <p className="section-subtitle">
            Stay motivated with a simple loop: set an intention, experiment with automata, then capture the insight you just unlocked.
          </p>
        </div>

        <div className="journey-grid">
          <div className="journey-card">
            <div className="journey-icon">🧭</div>
            <h3 className="journey-title">Set Your Focus</h3>
            <p className="journey-body">
              Pick a goal—design an FA, tackle a tough concept, or warm up with a quiz. We highlight a gentle starting point based on your recent progress.
            </p>
            <div className="journey-tags">
              <span>Daily prompts</span>
              <span>Lightweight goals</span>
            </div>
          </div>

          <div className="journey-card">
            <div className="journey-icon">🛠️</div>
            <h3 className="journey-title">Build & Experiment</h3>
            <p className="journey-body">
              Drag states, run strings, and see transitions animate in real time. AI hints nudge you forward while keeping the “aha!” moment yours.
            </p>
            <div className="journey-tags">
              <span>Visualizer</span>
              <span>AI assist</span>
            </div>
          </div>

          <div className="journey-card">
            <div className="journey-icon">🎉</div>
            <h3 className="journey-title">Reflect & Level Up</h3>
            <p className="journey-body">
              Wrap up with a quick reflection, log your breakthrough, and unlock the next challenge with clarity about what clicked.
            </p>
            <div className="journey-tags">
              <span>Mini reflections</span>
              <span>Celebrate wins</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to learn with friends?</h2>
          <p>Join thousands of learners building intuition one transition at a time.</p>
          <button className="btn-cta" onClick={handleGetStarted}>
            🌟 Start My Learning Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <h4>🔷 Acceptly</h4>
            <p className="footer-tagline">From Mistakes to Mastery – One Transition at a Time</p>
            <p className="footer-description">The ultimate platform for mastering finite automata through interactive practice and AI-powered feedback.</p>
            <div className="footer-stats">
              <span>✓ 50+ Problems</span>
              <span>•</span>
              <span>✓ AI Hints</span>
              <span>•</span>
              <span>✓ 100% Free</span>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/problems">Practice Problems</Link></li>
              <li><Link to="/problems?type=fa">FA Simulation</Link></li>
              <li><Link to="/problems?type=mcq">MCQ Quizzes</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Team SVSMC</h4>
            <ul className="footer-links">
              <li>Sai Manoj Kartala</li>
              <li>Vinay Padala</li>
              <li>Siddartha Kurmashetti</li>
              <li>Sai Charan Reddy Kanukula</li>
              <li>Sushma Kasarla</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Project Info</h4>
            <ul className="footer-links">
              <li>CS5610 - Web Development</li>
              <li>Drill & Practice System</li>
              <li>Team B</li>
              <li className="footer-cta-small">
                <Link to="/login" className="footer-cta-link">Start Learning →</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© 2025 Acceptly. Built with ❤️ for learning.</p>
            <div className="footer-trust">
              <span>🔒 Secure</span>
              <span>•</span>
              <span>⚡ Fast</span>
              <span>•</span>
              <span>♿ Accessible</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


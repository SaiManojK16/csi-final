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
            <div className="binary-pattern">
              <span className="binary-code code-1">1<span className="highlight-binary">0</span>0</span>
              <span className="binary-code code-2">10<span className="highlight-binary">1</span>0</span>
              <span className="binary-code code-3"><span className="highlight-binary">0</span>01</span>
            </div>
            <div className="hero-image-container">
              <div className="geometric-shape shape-1"></div>
              <div className="geometric-shape shape-2"></div>
              <div className="geometric-shape shape-3"></div>
              <div className="hero-3d-image-wrapper">
                <svg 
                  viewBox="0 0 500 300" 
                  className="hero-3d-image"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#2ec4b6', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#1a9d8f', stopOpacity: 1}} />
                    </linearGradient>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#1f2a44" />
                    </marker>
                  </defs>
                  
                  {/* Start arrow */}
                  <line x1="40" y1="150" x2="90" y2="150" stroke="#2ec4b6" strokeWidth="2.5" markerEnd="url(#arrow)"/>
                  
                  {/* State q0 (start, non-accepting) */}
                  <circle cx="150" cy="150" r="40" fill="url(#stateGradient)" stroke="#1f2a44" strokeWidth="3"/>
                  <text x="150" y="158" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="700">q₀</text>
                  
                  {/* Self-loop on q0 for '1' */}
                  <path d="M 150 110 Q 110 110 110 150 Q 110 190 150 190 Q 190 190 190 150 Q 190 110 150 110" 
                        fill="none" stroke="#1f2a44" strokeWidth="2.5" markerEnd="url(#arrow)"/>
                  <text x="110" y="130" fill="#1f2a44" fontSize="18" fontWeight="600">1</text>
                  
                  {/* Transition q0 -> q1 on '0' */}
                  <line x1="190" y1="150" x2="310" y2="150" stroke="#1f2a44" strokeWidth="2.5" markerEnd="url(#arrow)"/>
                  <text x="250" y="140" fill="#1f2a44" fontSize="18" fontWeight="600">0</text>
                  
                  {/* State q1 (accepting - double circle) */}
                  <circle cx="350" cy="150" r="48" fill="none" stroke="#1f2a44" strokeWidth="2" opacity="0.4"/>
                  <circle cx="350" cy="150" r="40" fill="url(#stateGradient)" stroke="#1f2a44" strokeWidth="3"/>
                  <text x="350" y="158" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="700">q₁</text>
                  
                  {/* Self-loop on q1 for '0' */}
                  <path d="M 350 110 Q 390 110 390 150 Q 390 190 350 190 Q 310 190 310 150 Q 310 110 350 110" 
                        fill="none" stroke="#1f2a44" strokeWidth="2.5" markerEnd="url(#arrow)"/>
                  <text x="390" y="130" fill="#1f2a44" fontSize="18" fontWeight="600">0</text>
                  
                  {/* Transition q1 -> q0 on '1' */}
                  <path d="M 310 150 Q 250 120 190 150" fill="none" stroke="#1f2a44" strokeWidth="2.5" markerEnd="url(#arrow)"/>
                  <text x="250" y="125" fill="#1f2a44" fontSize="18" fontWeight="600">1</text>
                </svg>
              </div>
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


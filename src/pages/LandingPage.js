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
                  viewBox="0 0 600 400" 
                  className="hero-3d-image"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#2ec4b6', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#1a9d8f', stopOpacity: 1}} />
                    </linearGradient>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: 'rgba(46, 196, 182, 0.05)', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: 'rgba(255, 209, 102, 0.05)', stopOpacity: 1}} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <marker id="arrow" markerWidth="12" markerHeight="12" refX="11" refY="3" orient="auto">
                      <polygon points="0 0, 12 3, 0 6" fill="#1f2a44" />
                    </marker>
                  </defs>
                  
                  {/* Background */}
                  <rect width="600" height="400" fill="url(#bgGradient)" rx="20"/>
                  
                  {/* Title */}
                  <text x="300" y="40" textAnchor="middle" fill="#1f2a44" fontSize="24" fontWeight="700">Finite Automaton</text>
                  <text x="300" y="65" textAnchor="middle" fill="#475569" fontSize="14" fontWeight="500">Accepts strings ending with "0"</text>
                  
                  {/* Start arrow */}
                  <line x1="50" y1="220" x2="100" y2="220" stroke="#2ec4b6" strokeWidth="3" markerEnd="url(#arrow)"/>
                  <text x="30" y="225" fill="#2ec4b6" fontSize="12" fontWeight="600">Start</text>
                  
                  {/* State q0 (start, non-accepting) */}
                  <circle cx="180" cy="220" r="45" fill="url(#stateGradient)" stroke="#1f2a44" strokeWidth="3" filter="url(#glow)"/>
                  <text x="180" y="230" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="700">q₀</text>
                  
                  {/* Self-loop on q0 for '1' */}
                  <path d="M 180 175 Q 130 175 130 220 Q 130 265 180 265 Q 230 265 230 220 Q 230 175 180 175" 
                        fill="none" stroke="#1f2a44" strokeWidth="3" markerEnd="url(#arrow)"/>
                  <text x="130" y="195" fill="#1f2a44" fontSize="20" fontWeight="600">1</text>
                  
                  {/* Transition q0 -> q1 on '0' */}
                  <line x1="225" y1="220" x2="375" y2="220" stroke="#1f2a44" strokeWidth="3" markerEnd="url(#arrow)"/>
                  <rect x="290" y="205" width="20" height="20" fill="#ffffff" rx="4"/>
                  <text x="300" y="220" textAnchor="middle" fill="#1f2a44" fontSize="20" fontWeight="700">0</text>
                  
                  {/* State q1 (accepting - double circle) */}
                  <circle cx="420" cy="220" r="52" fill="none" stroke="#1f2a44" strokeWidth="2.5" opacity="0.5"/>
                  <circle cx="420" cy="220" r="45" fill="url(#stateGradient)" stroke="#1f2a44" strokeWidth="3" filter="url(#glow)"/>
                  <text x="420" y="230" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="700">q₁</text>
                  
                  {/* Accepting state indicator */}
                  <circle cx="420" cy="280" r="8" fill="#2ec4b6"/>
                  <text x="420" y="300" textAnchor="middle" fill="#1f2a44" fontSize="12" fontWeight="600">Accept</text>
                  
                  {/* Self-loop on q1 for '0' */}
                  <path d="M 420 175 Q 470 175 470 220 Q 470 265 420 265 Q 370 265 370 220 Q 370 175 420 175" 
                        fill="none" stroke="#1f2a44" strokeWidth="3" markerEnd="url(#arrow)"/>
                  <rect x="470" y="195" width="20" height="20" fill="#ffffff" rx="4"/>
                  <text x="480" y="210" textAnchor="middle" fill="#1f2a44" fontSize="20" fontWeight="700">0</text>
                  
                  {/* Transition q1 -> q0 on '1' */}
                  <path d="M 375 220 Q 300 180 225 220" fill="none" stroke="#1f2a44" strokeWidth="3" markerEnd="url(#arrow)"/>
                  <rect x="290" y="180" width="20" height="20" fill="#ffffff" rx="4"/>
                  <text x="300" y="195" textAnchor="middle" fill="#1f2a44" fontSize="20" fontWeight="700">1</text>
                  
                  {/* Legend */}
                  <g transform="translate(50, 320)">
                    <circle cx="0" cy="0" r="8" fill="#2ec4b6" stroke="#1f2a44" strokeWidth="2"/>
                    <text x="20" y="5" fill="#1f2a44" fontSize="12" fontWeight="500">Start State</text>
                    
                    <circle cx="120" cy="0" r="8" fill="none" stroke="#1f2a44" strokeWidth="2" opacity="0.5"/>
                    <circle cx="120" cy="0" r="8" fill="#2ec4b6" stroke="#1f2a44" strokeWidth="2"/>
                    <text x="140" y="5" fill="#1f2a44" fontSize="12" fontWeight="500">Accepting State</text>
                    
                    <line x1="250" y1="0" x2="280" y2="0" stroke="#1f2a44" strokeWidth="2" markerEnd="url(#arrow)"/>
                    <text x="290" y="5" fill="#1f2a44" fontSize="12" fontWeight="500">Transition</text>
                  </g>
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


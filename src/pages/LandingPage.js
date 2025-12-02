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
            <div className="hero-illustration">
              <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#ff8a65', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ff6b6b', stopOpacity: 1}} />
                  </linearGradient>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#2ec4b6', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#4ecdc4', stopOpacity: 1}} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Abstract geometric shapes representing states */}
                <g id="states">
                  {/* State 1 (q0) - Start state */}
                  <circle cx="150" cy="200" r="55" fill="url(#grad1)" opacity="0.9" filter="url(#glow)"/>
                  <circle cx="150" cy="200" r="45" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.7"/>
                  <text x="150" y="210" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="bold" fontFamily="Arial">q₀</text>
                  
                  {/* State 2 (q1) - Final/Accepting state with double circle */}
                  <circle cx="350" cy="200" r="55" fill="url(#grad2)" opacity="0.9" filter="url(#glow)"/>
                  <circle cx="350" cy="200" r="45" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.7"/>
                  {/* Outer circle for accepting state */}
                  <circle cx="350" cy="200" r="65" fill="none" stroke="url(#grad2)" strokeWidth="3" opacity="0.8"/>
                  <text x="350" y="210" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="bold" fontFamily="Arial">q₁</text>
                </g>
                
                {/* Transitions - straight lines between states, circular self-loops */}
                <g id="transitions">
                  {/* Straight transition from q0 to q1 (symbol: 0) */}
                  <line x1="205" y1="200" x2="295" y2="200" stroke="url(#grad3)" strokeWidth="4" opacity="0.8" markerEnd="url(#arrowhead)"/>
                  
                  {/* Circular self-loop on q0 (symbol: 1) */}
                  <ellipse cx="150" cy="200" rx="40" ry="25" fill="none" stroke="url(#grad1)" strokeWidth="3.5" opacity="0.7" markerEnd="url(#arrowhead-self)" transform="rotate(-45 150 200)"/>
                  
                  {/* Circular self-loop on q1 (symbol: 0) */}
                  <ellipse cx="350" cy="200" rx="40" ry="25" fill="none" stroke="url(#grad2)" strokeWidth="3.5" opacity="0.7" markerEnd="url(#arrowhead-self)" transform="rotate(45 350 200)"/>
                  
                  {/* Transition from q1 to q0 (symbol: 1) - curved below */}
                  <path d="M 295 200 Q 250 250 205 200" fill="none" stroke="url(#grad3)" strokeWidth="4" opacity="0.8" markerEnd="url(#arrowhead)"/>
                </g>
                
                {/* Arrow markers */}
                <defs>
                  <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 12 4, 0 8" fill="#2ec4b6"/>
                  </marker>
                  <marker id="arrowhead-self" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 12 4, 0 8" fill="#667eea"/>
                  </marker>
                </defs>
                
                {/* Symbol labels */}
                <g id="symbols">
                  {/* Symbol 0 on q0->q1 transition (straight line) */}
                  <circle cx="250" cy="180" r="22" fill="#fff" stroke="#2ec4b6" strokeWidth="2.5"/>
                  <text x="250" y="188" textAnchor="middle" fill="#2ec4b6" fontSize="20" fontWeight="bold" fontFamily="Arial">0</text>
                  
                  {/* Symbol 1 on q0 self-loop */}
                  <circle cx="120" cy="170" r="20" fill="#fff" stroke="#667eea" strokeWidth="2.5"/>
                  <text x="120" y="178" textAnchor="middle" fill="#667eea" fontSize="18" fontWeight="bold" fontFamily="Arial">1</text>
                  
                  {/* Symbol 0 on q1 self-loop */}
                  <circle cx="380" cy="170" r="20" fill="#fff" stroke="#ff8a65" strokeWidth="2.5"/>
                  <text x="380" y="178" textAnchor="middle" fill="#ff8a65" fontSize="18" fontWeight="bold" fontFamily="Arial">0</text>
                  
                  {/* Symbol 1 on q1->q0 transition (curved below) */}
                  <circle cx="250" cy="250" r="22" fill="#fff" stroke="#2ec4b6" strokeWidth="2.5"/>
                  <text x="250" y="258" textAnchor="middle" fill="#2ec4b6" fontSize="20" fontWeight="bold" fontFamily="Arial">1</text>
                </g>
                
                {/* Start indicator - only for q0 */}
                <g id="start">
                  <path d="M 50 200 L 95 200" stroke="#667eea" strokeWidth="4" markerEnd="url(#arrowhead-start)"/>
                  <circle cx="50" cy="200" r="10" fill="#667eea"/>
                </g>
                
                <defs>
                  <marker id="arrowhead-start" markerWidth="12" markerHeight="12" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 12 4, 0 8" fill="#667eea"/>
                  </marker>
                </defs>
                
                {/* Decorative elements - subtle background shapes */}
                <g id="decorative" opacity="0.1">
                  <circle cx="100" cy="250" r="40" fill="url(#grad1)"/>
                  <circle cx="400" cy="250" r="35" fill="url(#grad2)"/>
                  <circle cx="250" cy="300" r="30" fill="url(#grad3)"/>
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


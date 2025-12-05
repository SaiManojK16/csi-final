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


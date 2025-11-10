import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FeatureCardFlip from '../components/FeatureCardFlip';
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
              Learn to <span className="highlight">Master</span>
              <br />
              Finite Automata.
            </h1>
            
            <div className="hero-cta">
              <button className="btn-hero-primary" onClick={handleGetStarted}>
                Start Learning
              </button>
              <div className="btn-arrow-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <p className="hero-description">
              Master computer science theory with hands-on<br />
              practice, AI-powered feedback, and real-world<br />
              problem solving.
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
              <div className="student-illustration">
                <div className="laptop-screen">
                  <div className="code-line"></div>
                  <div className="code-line"></div>
                  <div className="code-line"></div>
                  <div className="automata-visual">
                    <div className="state-node">q0</div>
                    <div className="transition-arrow">→</div>
                    <div className="state-node accept">q1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Why Choose Acceptly?</h2>
        <p className="section-subtitle">
          Everything you need to master finite automata and CS fundamentals
        </p>

        <div className="features-grid">
          <FeatureCardFlip
            icon="🎯"
            title="FA Simulation"
            description="Draw and test your finite automata visually with instant feedback."
            features={[
              "Visual Drawing",
              "Step-by-step Traces",
              "Real-time Validation",
              "Test Cases"
            ]}
          />

          <FeatureCardFlip
            icon="📝"
            title="Interactive Quizzes"
            description="Practice with carefully crafted MCQs covering all topics."
            features={[
              "DFA & NFA",
              "Regular Expressions",
              "Question Tracking",
              "Detailed Explanations"
            ]}
          />

          <FeatureCardFlip
            icon="🤖"
            title="AI-Powered Hints"
            description="Get intelligent guidance when stuck without spoiling answers."
            features={[
              "Smart Hints",
              "Error Analysis",
              "Personalized Help",
              "Learning Path"
            ]}
          />

          <FeatureCardFlip
            icon="📊"
            title="Progress Dashboard"
            description="Monitor your learning journey with detailed analytics."
            features={[
              "Performance Tracking",
              "Topic Mastery",
              "Learning Insights",
              "Goal Setting"
            ]}
          />

          <FeatureCardFlip
            icon="⚡"
            title="Adaptive Difficulty"
            description="Problems adjust to your skill level automatically."
            features={[
              "Smart Leveling",
              "Personalized Practice",
              "Gradual Progression",
              "Challenge Matching"
            ]}
          />

          <FeatureCardFlip
            icon="🎓"
            title="Learn by Doing"
            description="Hands-on practice that helps you master concepts effectively."
            features={[
              "Interactive Learning",
              "Learn from Mistakes",
              "Build Real Automata",
              "Practical Skills"
            ]}
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Choose Your Challenge</h3>
              <p>Select from FA simulation or MCQ quizzes based on difficulty</p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Build & Practice</h3>
              <p>Draw automata or solve quizzes with real-time validation</p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get AI Feedback</h3>
              <p>Receive intelligent hints and error analysis from our AI tutor</p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Track Progress</h3>
              <p>Monitor your improvement and unlock harder challenges</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>Join students mastering finite automata through practice</p>
          <button className="btn-cta" onClick={handleGetStarted}>
            🚀 Start Practicing Now
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


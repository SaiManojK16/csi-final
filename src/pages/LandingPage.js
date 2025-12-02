import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FeatureCardFlip from '../components/FeatureCardFlip';
import InteractiveFAPlayground from '../components/InteractiveFAPlayground';
import './LandingPage.css';

// Interactive FA Diagram Component for Hero Section
const InteractiveFADiagram = () => {
  const [currentState, setCurrentState] = useState('q0');
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputString, setInputString] = useState('');
  const [path, setPath] = useState(['q0']);
  const [result, setResult] = useState(null);

  // FA Definition: Accepts strings ending with "0"
  const fa = {
    states: {
      q0: { x: 200, y: 200, isAccepting: false, isStart: true, label: 'q₀' },
      q1: { x: 400, y: 200, isAccepting: true, isStart: false, label: 'q₁' }
    },
    transitions: [
      { from: 'q0', to: 'q1', symbol: '0', type: 'normal' },
      { from: 'q0', to: 'q0', symbol: '1', type: 'self' },
      { from: 'q1', to: 'q1', symbol: '0', type: 'self' },
      { from: 'q1', to: 'q0', symbol: '1', type: 'normal' }
    ]
  };

  // Auto-demo: Simulate processing strings
  useEffect(() => {
    const demoStrings = ['10', '100', '1100', '0'];
    let stringIndex = 0;
    let charIndex = 0;
    let currentDemoState = 'q0';
    const demoPath = ['q0'];

    const interval = setInterval(() => {
      if (stringIndex >= demoStrings.length) {
        stringIndex = 0;
        charIndex = 0;
        currentDemoState = 'q0';
        demoPath.length = 1;
        setPath(['q0']);
        setCurrentState('q0');
        setInputString('');
        setResult(null);
        return;
      }

      const currentString = demoStrings[stringIndex];
      
      if (charIndex === 0) {
        setInputString('');
        setPath(['q0']);
        currentDemoState = 'q0';
        demoPath.length = 1;
        setCurrentState('q0');
        setResult(null);
      }

      if (charIndex < currentString.length) {
        const symbol = currentString[charIndex];
        setInputString(currentString.substring(0, charIndex + 1));
        
        const transition = fa.transitions.find(
          t => t.from === currentDemoState && t.symbol === symbol
        );
        
        if (transition) {
          currentDemoState = transition.to;
          demoPath.push(currentDemoState);
          setPath([...demoPath]);
          setCurrentState(currentDemoState);
        }
        
        charIndex++;
        
        if (charIndex === currentString.length) {
          const isAccepted = fa.states[currentDemoState].isAccepting;
          setResult(isAccepted ? 'accepted' : 'rejected');
          setTimeout(() => {
            stringIndex++;
            charIndex = 0;
          }, 2000);
        }
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="interactive-fa-hero">
      <svg 
        viewBox="0 0 600 350" 
        className="hero-3d-image"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#2ec4b6', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#1a9d8f', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id="activeStateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgba(46, 196, 182, 0.08)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(255, 209, 102, 0.08)', stopOpacity: 1}} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="activeGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker id="arrow" markerWidth="14" markerHeight="14" refX="13" refY="3.5" orient="auto">
            <polygon points="0 0, 14 3.5, 0 7" fill="#1f2a44" />
          </marker>
          <marker id="activeArrow" markerWidth="14" markerHeight="14" refX="13" refY="3.5" orient="auto">
            <polygon points="0 0, 14 3.5, 0 7" fill="#667eea" />
          </marker>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 200 200"
            to="360 200 200"
            dur="20s"
            repeatCount="indefinite"
            id="pulseRotate"
          />
        </defs>
        
        {/* Background with subtle animation */}
        <rect width="600" height="350" fill="url(#bgGradient)" rx="16"/>
        
        {/* Animated grid pattern */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(46, 196, 182, 0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="600" height="350" fill="url(#grid)" opacity="0.3"/>
        
        {/* Title */}
        <text x="300" y="35" textAnchor="middle" fill="#1f2a44" fontSize="26" fontWeight="800" letterSpacing="-0.5px">
          Interactive Finite Automaton
        </text>
        <text x="300" y="58" textAnchor="middle" fill="#475569" fontSize="14" fontWeight="500">
          Live Demo: Processing strings ending with "0"
        </text>
        
        {/* Input String Display */}
        <rect x="200" y="75" width="200" height="35" fill="#ffffff" rx="8" stroke="#e2e8f0" strokeWidth="2"/>
        <text x="210" y="95" fill="#64748b" fontSize="12" fontWeight="500">Input:</text>
        <text x="260" y="98" fill="#1f2a44" fontSize="16" fontWeight="700" letterSpacing="2px">
          {inputString || '—'}
        </text>
        {result && (
          <text x="410" y="98" fill={result === 'accepted' ? '#10b981' : '#ef4444'} fontSize="14" fontWeight="600">
            {result === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
          </text>
        )}
        
        {/* Path Display */}
        <text x="300" y="130" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="500">
          Path: {path.join(' → ')}
        </text>
        
        {/* Start arrow with animation */}
        <line 
          x1="50" y1="200" x2="140" y2="200" 
          stroke={currentState === 'q0' ? '#667eea' : '#2ec4b6'} 
          strokeWidth={currentState === 'q0' ? 4 : 3} 
          markerEnd={currentState === 'q0' ? "url(#activeArrow)" : "url(#arrow)"}
          opacity={currentState === 'q0' ? 1 : 0.7}
        />
        <text x="30" y="205" fill={currentState === 'q0' ? '#667eea' : '#2ec4b6'} fontSize="11" fontWeight="600">
          Start
        </text>
        
        {/* State q0 */}
        <circle 
          cx="200" cy="200" r="50" 
          fill={currentState === 'q0' ? "url(#activeStateGradient)" : "url(#stateGradient)"} 
          stroke={currentState === 'q0' ? "#667eea" : "#1f2a44"} 
          strokeWidth={currentState === 'q0' ? 4 : 3} 
          filter={currentState === 'q0' ? "url(#activeGlow)" : "url(#glow)"}
          style={{ transition: 'all 0.3s ease' }}
        />
        <text x="200" y="210" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="700">q₀</text>
        
        {/* Self-loop on q0 for '1' */}
        <path 
          d="M 200 150 Q 140 150 140 200 Q 140 250 200 250 Q 260 250 260 200 Q 260 150 200 150" 
          fill="none" 
          stroke={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q0' ? "#667eea" : "#1f2a44"} 
          strokeWidth={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q0' ? 4 : 3} 
          markerEnd={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q0' ? "url(#activeArrow)" : "url(#arrow)"}
          opacity={currentState === 'q0' ? 1 : 0.7}
        />
        <rect x="130" y="165" width="18" height="18" fill="#ffffff" rx="3" stroke={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q0' ? "#667eea" : "#1f2a44"} strokeWidth="2"/>
        <text x="139" y="177" textAnchor="middle" fill={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q0' ? "#667eea" : "#1f2a44"} fontSize="16" fontWeight="700">1</text>
        
        {/* Transition q0 -> q1 on '0' */}
        <line 
          x1="250" y1="200" x2="350" y2="200" 
          stroke={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q0' ? "#667eea" : "#1f2a44"} 
          strokeWidth={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q0' ? 4 : 3} 
          markerEnd={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q0' ? "url(#activeArrow)" : "url(#arrow)"}
          opacity={currentState === 'q1' ? 1 : 0.7}
        />
        <rect x="290" y="188" width="22" height="22" fill="#ffffff" rx="4" stroke={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q0' ? "#667eea" : "#1f2a44"} strokeWidth="2"/>
        <text x="301" y="203" textAnchor="middle" fill={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q0' ? "#667eea" : "#1f2a44"} fontSize="18" fontWeight="700">0</text>
        
        {/* State q1 (accepting - double circle) */}
        <circle cx="400" cy="200" r="58" fill="none" stroke={currentState === 'q1' ? "#667eea" : "#1f2a44"} strokeWidth="2.5" opacity={currentState === 'q1' ? 0.6 : 0.4}/>
        <circle 
          cx="400" cy="200" r="50" 
          fill={currentState === 'q1' ? "url(#activeStateGradient)" : "url(#stateGradient)"} 
          stroke={currentState === 'q1' ? "#667eea" : "#1f2a44"} 
          strokeWidth={currentState === 'q1' ? 4 : 3} 
          filter={currentState === 'q1' ? "url(#activeGlow)" : "url(#glow)"}
          style={{ transition: 'all 0.3s ease' }}
        />
        <text x="400" y="210" textAnchor="middle" fill="#ffffff" fontSize="24" fontWeight="700">q₁</text>
        
        {/* Accepting state indicator */}
        <circle cx="400" cy="270" r="10" fill={currentState === 'q1' ? "#10b981" : "#2ec4b6"} filter="url(#glow)"/>
        <text x="400" y="290" textAnchor="middle" fill="#1f2a44" fontSize="13" fontWeight="700">Accept</text>
        
        {/* Self-loop on q1 for '0' */}
        <path 
          d="M 400 150 Q 460 150 460 200 Q 460 250 400 250 Q 340 250 340 200 Q 340 150 400 150" 
          fill="none" 
          stroke={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q1' ? "#667eea" : "#1f2a44"} 
          strokeWidth={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q1' ? 4 : 3} 
          markerEnd={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q1' ? "url(#activeArrow)" : "url(#arrow)"}
          opacity={currentState === 'q1' ? 1 : 0.7}
        />
        <rect x="460" y="170" width="22" height="22" fill="#ffffff" rx="4" stroke={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q1' ? "#667eea" : "#1f2a44"} strokeWidth="2"/>
        <text x="471" y="186" textAnchor="middle" fill={currentState === 'q1' && path.length > 1 && path[path.length - 2] === 'q1' ? "#667eea" : "#1f2a44"} fontSize="18" fontWeight="700">0</text>
        
        {/* Transition q1 -> q0 on '1' */}
        <path 
          d="M 350 200 Q 300 170 250 200" 
          fill="none" 
          stroke={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q1' ? "#667eea" : "#1f2a44"} 
          strokeWidth={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q1' ? 4 : 3} 
          markerEnd={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q1' ? "url(#activeArrow)" : "url(#arrow)"}
          opacity={currentState === 'q0' ? 1 : 0.7}
        />
        <rect x="290" y="165" width="22" height="22" fill="#ffffff" rx="4" stroke={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q1' ? "#667eea" : "#1f2a44"} strokeWidth="2"/>
        <text x="301" y="180" textAnchor="middle" fill={currentState === 'q0' && path.length > 1 && path[path.length - 2] === 'q1' ? "#667eea" : "#1f2a44"} fontSize="18" fontWeight="700">1</text>
        
        {/* Status indicator */}
        <rect x="240" y="310" width="120" height="28" fill={result === 'accepted' ? 'rgba(16, 185, 129, 0.1)' : result === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)'} rx="14" stroke={result === 'accepted' ? '#10b981' : result === 'rejected' ? '#ef4444' : '#64748b'} strokeWidth="2"/>
        <text x="300" y="328" textAnchor="middle" fill={result === 'accepted' ? '#10b981' : result === 'rejected' ? '#ef4444' : '#64748b'} fontSize="13" fontWeight="600">
          {result === 'accepted' ? '✓ String Accepted' : result === 'rejected' ? '✗ String Rejected' : 'Processing...'}
        </text>
      </svg>
    </div>
  );
};

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
                <InteractiveFADiagram />
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


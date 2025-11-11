import React from 'react';
import AutomataBuilder from './components/AutomataBuilder';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🔷</span>
            <h1>Automata Practice</h1>
          </div>
          <nav className="nav-links">
            <a href="#practice">Practice</a>
            <a href="#learn">Learn</a>
            <a href="#community">Community</a>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        <div className="problem-section">
          <div className="problem-statement">
            <h2>Problem Statement</h2>
            <p>
              Design a Finite Automaton (FA) that accepts strings over the 
              alphabet {"{0, 1}"} that contain only 0's (no 1's allowed).
            </p>
            
            <div className="examples">
              <h3>Examples</h3>
              <div className="example">
                <span className="input">Input: <code>000</code></span>
                <span className="output accept">Output: Accept</span>
              </div>
              <div className="example">
                <span className="input">Input: <code>0101</code></span>
                <span className="output reject">Output: Reject</span>
              </div>
              <div className="example">
                <span className="input">Input: <code>0</code></span>
                <span className="output accept">Output: Accept</span>
              </div>
            </div>
          </div>
        </div>
        
        <AutomataBuilder />
      </main>
    </div>
  );
}

export default App;

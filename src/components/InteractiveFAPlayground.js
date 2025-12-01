import React, { useState, useEffect, useRef } from 'react';
import './InteractiveFAPlayground.css';

const InteractiveFAPlayground = () => {
  const [inputString, setInputString] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentState, setCurrentState] = useState('q0');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [path, setPath] = useState(['q0']);
  const [activeTransition, setActiveTransition] = useState(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 560, height: 360 });
  const canvasRef = useRef(null);
  const STATE_RADIUS = 28;

  // Example FA: Accepts strings ending in "01" 
  // Language: All binary strings that end with "01"
  // Examples: 01, 001, 101, 1001, 0001, etc.
  const fa = {
    states: {
      q0: { x: 150, y: 200, isAccepting: false, isStart: true, label: 'q₀' },
      q1: { x: 350, y: 150, isAccepting: false, isStart: false, label: 'q₁' },
      q2: { x: 350, y: 250, isAccepting: true, isStart: false, label: 'q₂' }
    },
    transitions: [
      { from: 'q0', to: 'q1', symbol: '0', type: 'normal' },
      { from: 'q0', to: 'q0', symbol: '1', type: 'self' },
      { from: 'q1', to: 'q1', symbol: '0', type: 'self' },
      { from: 'q1', to: 'q2', symbol: '1', type: 'normal' }, // Transition from q1 to q2 with symbol '1'
      { from: 'q2', to: 'q1', symbol: '0', type: 'normal' },
      { from: 'q2', to: 'q0', symbol: '1', type: 'normal' }
    ],
    alphabet: ['0', '1']
  };

  // Prepare responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      const width = Math.min(container.clientWidth, 640);
      const height = Math.max(320, Math.round(width * 0.65));
      setCanvasDimensions(prev => (
        prev.width === width && prev.height === height ? prev : { width, height }
      ));
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Process string step by step (same logic as FA simulation)
  const processString = async () => {
    if (!inputString) return;

    setIsProcessing(true);
    setCurrentState('q0');
    setCurrentIndex(-1);
    setResult(null);
    setPath(['q0']);
    setActiveTransition(null);

    let state = 'q0';
    const newPath = ['q0'];

    // Process each symbol step by step
    for (let i = 0; i < inputString.length; i++) {
      const symbol = inputString[i];
      
      // Highlight current character being read
      setCurrentIndex(i);
      
      // Find matching transition
      const matchingTransition = fa.transitions.find(t => 
        t.from === state && t.symbol === symbol
      );
      
      if (matchingTransition) {
        // Highlight the transition being taken
        setActiveTransition(matchingTransition);
        
        // Delay to show transition animation (same as FA simulation: 800ms)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Move to next state
        state = matchingTransition.to;
        newPath.push(state);
        setPath([...newPath]);
        setCurrentState(state);
      } else {
        // No valid transition - this shouldn't happen with a complete DFA
        console.error(`No transition from ${state} on symbol ${symbol}`);
        break;
      }
    }

    // Clear active transition and show final result
    setActiveTransition(null);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if final state is accepting
    const isAccepted = fa.states[state]?.isAccepting || false;
    setResult(isAccepted ? 'accepted' : 'rejected');
    setIsProcessing(false);
    setCurrentIndex(-1);
  };

  // Draw FA on canvas (similar to AutomataCanvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scale = window.devicePixelRatio || 1;
    const baseWidth = canvasDimensions.width;
    const baseHeight = canvasDimensions.height;

    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;
    canvas.style.width = `${baseWidth}px`;
    canvas.style.height = `${baseHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);

    // Clear canvas
    ctx.clearRect(0, 0, baseWidth, baseHeight);

    // Draw transitions
    fa.transitions.forEach(transition => {
      const fromState = fa.states[transition.from];
      const toState = fa.states[transition.to];
      
      // Check if this transition is active
      const isActive = activeTransition && 
        activeTransition.from === transition.from &&
        activeTransition.to === transition.to &&
        activeTransition.symbol === transition.symbol;

      if (transition.type === 'self') {
        // Self-loop (matching AutomataCanvas implementation)
        const loopX = fromState.x;
        const loopY = fromState.y - STATE_RADIUS - 25;
        const loopRadius = 18;
        
        // Draw full circle loop
        ctx.beginPath();
        ctx.arc(loopX, loopY, loopRadius, 0, 2 * Math.PI);
        
        if (isActive) {
          ctx.strokeStyle = '#667eea';
          ctx.lineWidth = 4;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#667eea';
        } else {
          ctx.strokeStyle = '#1C1C1E';
          ctx.lineWidth = 3;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Arrow for self-loop (proper arrow on the right side)
        ctx.beginPath();
        ctx.moveTo(loopX + loopRadius - 3, loopY - 3);
        ctx.lineTo(loopX + loopRadius - 10, loopY - 10);
        ctx.moveTo(loopX + loopRadius - 3, loopY - 3);
        ctx.lineTo(loopX + loopRadius - 10, loopY + 3);
        ctx.strokeStyle = isActive ? '#667eea' : '#1C1C1E';
        ctx.lineWidth = isActive ? 4 : 3;
        ctx.stroke();

        // Label with background
        const labelText = transition.symbol;
        ctx.font = 'bold 18px Inter, sans-serif';
        const textMetrics = ctx.measureText(labelText);
        const padding = 8;
        const bgWidth = textMetrics.width + padding * 2;
        const bgHeight = 24 + padding * 2;
        const labelY = loopY - loopRadius - 15;
        
        // Background box
        ctx.fillStyle = isActive ? '#E6F3FF' : 'white';
        ctx.fillRect(loopX - bgWidth/2, labelY - bgHeight/2, bgWidth, bgHeight);
        ctx.strokeStyle = isActive ? '#667eea' : '#1C1C1E';
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.strokeRect(loopX - bgWidth/2, labelY - bgHeight/2, bgWidth, bgHeight);
        
        // Label text
        ctx.fillStyle = isActive ? '#667eea' : '#1C1C1E';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, loopX, labelY);
      } else {
        // Normal transition
        const angle = Math.atan2(toState.y - fromState.y, toState.x - fromState.x);
        const startX = fromState.x + STATE_RADIUS * Math.cos(angle);
        const startY = fromState.y + STATE_RADIUS * Math.sin(angle);
        const endX = toState.x - STATE_RADIUS * Math.cos(angle);
        const endY = toState.y - STATE_RADIUS * Math.sin(angle);

        // Draw line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        
        if (isActive) {
          ctx.strokeStyle = '#667eea';
          ctx.lineWidth = 4;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#667eea';
        } else {
          ctx.strokeStyle = '#1C1C1E';
          ctx.lineWidth = 3;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw arrow
        const arrowLength = 12;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle - Math.PI / 6),
          endY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle + Math.PI / 6),
          endY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = isActive ? '#667eea' : '#1C1C1E';
        ctx.fill();

        // Label with background
        const midX = (fromState.x + toState.x) / 2;
        const midY = (fromState.y + toState.y) / 2;
        
        ctx.font = '700 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Background for label
        const labelText = transition.symbol;
        const textWidth = ctx.measureText(labelText).width;
        ctx.fillStyle = 'white';
        ctx.fillRect(midX - textWidth/2 - 4, midY - 10, textWidth + 8, 20);
        
        ctx.fillStyle = isActive ? '#667eea' : '#374151';
        ctx.fillText(labelText, midX, midY);
      }
    });

    // Draw states (similar to AutomataCanvas)
    Object.entries(fa.states).forEach(([stateName, state]) => {
      const isActive = currentState === stateName;
      const isInPath = path.includes(stateName);

      // Outer circle (accepting state) - double circle
      if (state.isAccepting) {
        ctx.beginPath();
        ctx.arc(state.x, state.y, STATE_RADIUS + 6, 0, 2 * Math.PI);
        ctx.strokeStyle = isActive ? '#667eea' : '#1C1C1E';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Main circle
      ctx.beginPath();
      ctx.arc(state.x, state.y, STATE_RADIUS, 0, 2 * Math.PI);
      
      if (isActive) {
        ctx.fillStyle = '#667eea';
        ctx.shadowColor = 'rgba(102, 126, 234, 0.5)';
        ctx.shadowBlur = 20;
      } else if (isInPath) {
        ctx.fillStyle = '#e0e7ff';
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = 'white';
        ctx.shadowBlur = 0;
      }
      
      ctx.fill();
      ctx.strokeStyle = isActive ? '#667eea' : '#1C1C1E';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // State label
      ctx.fillStyle = isActive ? 'white' : '#1C1C1E';
      ctx.font = '700 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.label || stateName, state.x, state.y);

      // Start arrow
      if (state.isStart) {
        ctx.beginPath();
        ctx.moveTo(state.x - 55, state.y);
        ctx.lineTo(state.x - STATE_RADIUS - 2, state.y);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Arrow head
        const arrowSize = 10;
        ctx.beginPath();
        ctx.moveTo(state.x - STATE_RADIUS - 2, state.y);
        ctx.lineTo(state.x - STATE_RADIUS - 2 - arrowSize, state.y - arrowSize/2);
        ctx.lineTo(state.x - STATE_RADIUS - 2 - arrowSize, state.y + arrowSize/2);
        ctx.closePath();
        ctx.fillStyle = '#667eea';
        ctx.fill();

        // "Start" label
        ctx.fillStyle = '#667eea';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Start', state.x - 70, state.y - 20);
      }
    });

  }, [currentState, path, activeTransition, canvasDimensions]);

  const handleReset = () => {
    setInputString('');
    setIsProcessing(false);
    setCurrentState('q0');
    setCurrentIndex(-1);
    setResult(null);
    setPath(['q0']);
  };

  const handleExampleClick = (example) => {
    setInputString(example);
    setResult(null);
    setCurrentState('q0');
    setCurrentIndex(-1);
    setPath(['q0']);
  };

  return (
    <div className="interactive-fa-playground">
      <div className="playground-header">
        <div className="header-badge">
          <span className="badge-icon">⚡</span>
          <span>Try It Live</span>
        </div>
        <h2 className="playground-title">Interactive FA Playground</h2>
        <p className="playground-subtitle">
          Watch how a finite automaton processes your input string step-by-step
        </p>
      </div>

      <div className="playground-content">
        <div className="fa-visualization">
          <div className="viz-header">
            <h3>Finite Automaton</h3>
            <span className="viz-description">Accepts strings ending in "01"</span>
          </div>
          <canvas ref={canvasRef} className="fa-canvas" />
          <div className="state-legend">
            <div className="legend-item">
              <div className="legend-circle accepting"></div>
              <span>Accepting State (double circle)</span>
            </div>
            <div className="legend-item">
              <div className="legend-circle non-accepting"></div>
              <span>Non-accepting State</span>
            </div>
          </div>
        </div>

        <div className="input-section">
          <div className="input-header">
            <h3>Input String</h3>
            <span className="input-helper">Enter 0's and 1's</span>
          </div>

          <div className="input-display">
            {inputString.split('').map((char, idx) => (
              <span
                key={idx}
                className={`input-char ${idx === currentIndex ? 'active' : ''} ${idx < currentIndex ? 'processed' : ''}`}
              >
                {char}
              </span>
            ))}
            {inputString.length === 0 && (
              <span className="input-placeholder">Type here...</span>
            )}
          </div>

          <input
            type="text"
            value={inputString}
            onChange={(e) => {
              const value = e.target.value.replace(/[^01]/g, '');
              setInputString(value);
              setResult(null);
              setCurrentState('q0');
              setCurrentIndex(-1);
              setPath(['q0']);
            }}
            placeholder="Enter string (e.g., 000, 101)"
            className="string-input"
            disabled={isProcessing}
            maxLength={20}
          />

          <div className="example-buttons">
            <span className="example-label">Try examples:</span>
            <button onClick={() => handleExampleClick('01')} className="example-btn">
              01
            </button>
            <button onClick={() => handleExampleClick('101')} className="example-btn">
              101
            </button>
            <button onClick={() => handleExampleClick('1001')} className="example-btn">
              1001
            </button>
            <button onClick={() => handleExampleClick('0011')} className="example-btn">
              0011
            </button>
          </div>

          <div className="control-buttons">
            <button
              onClick={processString}
              disabled={!inputString || isProcessing}
              className="process-btn"
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span>▶</span>
                  Process String
                </>
              )}
            </button>
            <button onClick={handleReset} className="reset-btn" disabled={isProcessing}>
              ↻ Reset
            </button>
          </div>

          {result && (
            <div className={`result-display ${result}`}>
              <div className="result-icon">
                {result === 'accepted' ? '✓' : '✗'}
              </div>
              <div className="result-content">
                <div className="result-status">
                  {result === 'accepted' ? 'Accepted!' : 'Rejected!'}
                </div>
                <div className="result-message">
                  {result === 'accepted'
                    ? 'The string ends with "01"'
                    : 'The string does not end with "01"'}
                </div>
                <div className="result-path">
                  Path: {path.join(' → ')}
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="processing-info">
              <div className="processing-header">
                <span className="processing-icon">⚙️</span>
                <span>Processing...</span>
              </div>
              <div className="processing-details">
                <div className="detail-item">
                  <span className="detail-label">Current State:</span>
                  <span className="detail-value">{currentState}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Reading:</span>
                  <span className="detail-value">
                    {currentIndex >= 0 ? inputString[currentIndex] : '-'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Path:</span>
                  <span className="detail-value path-value">{path.join(' → ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveFAPlayground;


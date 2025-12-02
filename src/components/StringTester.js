import React, { useState, useEffect, useRef, useCallback } from 'react';
import './StringTester.css';

const StringTester = ({ onTestString, states, startState, transitions, onTestResultsUpdate, onSimulationStateChange, problem, activeTab, setActiveTab }) => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  
  // Use refs to store latest values for event listener
  const onTestStringRef = useRef(onTestString);
  const onSimulationStateChangeRef = useRef(onSimulationStateChange);
  const onTestResultsUpdateRef = useRef(onTestResultsUpdate);
  const setActiveTabRef = useRef(setActiveTab);
  
  // Update refs when props change
  useEffect(() => {
    onTestStringRef.current = onTestString;
    onSimulationStateChangeRef.current = onSimulationStateChange;
    onTestResultsUpdateRef.current = onTestResultsUpdate;
    setActiveTabRef.current = setActiveTab;
  }, [onTestString, onSimulationStateChange, onTestResultsUpdate, setActiveTab]);

  // Use test cases from problem if available, otherwise use default
  const defaultTestCases = [
    { input: '', expected: true, description: 'Empty string ε (belongs to {0}* - ACCEPT)' },
    { input: '0', expected: true, description: 'Single 0 (belongs to {0}* - ACCEPT)' },
    { input: '00', expected: true, description: 'Two 0s (belongs to {0}* - ACCEPT)' },
    { input: '000', expected: true, description: 'Three 0s (belongs to {0}* - ACCEPT)' },
    { input: '0000', expected: true, description: 'Four 0s (belongs to {0}* - ACCEPT)' },
    { input: '1', expected: false, description: 'Single 1 (NOT in {0}* - REJECT)' },
    { input: '01', expected: false, description: '0 then 1 (NOT in {0}* - REJECT)' },
    { input: '10', expected: false, description: '1 then 0 (NOT in {0}* - REJECT)' },
    { input: '101', expected: false, description: '1-0-1 pattern (NOT in {0}* - REJECT)' },
    { input: '1111', expected: false, description: 'Only 1s (NOT in {0}* - REJECT)' }
  ];
  
  // Use problem test cases if available, otherwise use default
  const testCases = problem?.testCases && problem.testCases.length > 0 
    ? problem.testCases.map(tc => ({
        input: tc.input,
        expected: tc.expected,
        description: tc.description || `${tc.input} should ${tc.expected ? 'ACCEPT' : 'REJECT'}`
      }))
    : defaultTestCases;

  // Check if FA has no transitions (only accepts empty string)
  const hasNoTransitions = transitions.length === 0;
  
  // If FA has no transitions, use different test cases
  const emptyStringOnlyTestCases = [
    { input: '', expected: true, description: 'Empty string ε (only string accepted by this FA)' },
    { input: '0', expected: false, description: 'Single 0 (no transition - REJECT)' },
    { input: '1', expected: false, description: 'Single 1 (no transition - REJECT)' },
    { input: '00', expected: false, description: 'Two 0s (no transition - REJECT)' },
    { input: '01', expected: false, description: '0 then 1 (no transition - REJECT)' },
    { input: '10', expected: false, description: '1 then 0 (no transition - REJECT)' },
    { input: '000', expected: false, description: 'Three 0s (no transition - REJECT)' },
    { input: '101', expected: false, description: '1-0-1 pattern (no transition - REJECT)' },
    { input: '0000', expected: false, description: 'Four 0s (no transition - REJECT)' },
    { input: '1111', expected: false, description: 'Only 1s (no transition - REJECT)' }
  ];

  // Use appropriate test cases based on FA structure
  const activeTestCases = hasNoTransitions ? emptyStringOnlyTestCases : testCases;

  // Run all test cases - use useCallback to ensure stable reference
  const runAllTests = useCallback(async () => {
    if (!startState || states.size === 0) {
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    setCurrentTestIndex(0);
    
    // Clear any previous simulation state on canvas
    if (onSimulationStateChange) {
      onSimulationStateChange(null);
    }
    
    // Quick validation check
    const startStateObj = states.get(startState);
    
    // Analyze FA structure
    const acceptingStates = Array.from(states.values()).filter(s => s.isAccepting);
    
    // Check transitions from start state
    const transitionsFromStart = transitions.filter(t => t.from === startState);
    
    // Helper to check if symbol is in transition symbols (same logic as simulation)
    const symbolInTransition = (transitionSymbols, symbol) => {
      if (!transitionSymbols || !symbol) return false;
      const symbolList = transitionSymbols.split(',').map(s => s.trim()).filter(s => s.length > 0);
      return symbolList.includes(symbol);
    };
    
    const hasTransitionOn0 = transitionsFromStart.some(t => symbolInTransition(t.symbols, '0'));
    const hasTransitionOn1 = transitionsFromStart.some(t => symbolInTransition(t.symbols, '1'));

    const results = [];
    
    for (let i = 0; i < activeTestCases.length; i++) {
      setCurrentTestIndex(i);
      
      // Clear simulation state before each test
      if (onSimulationStateChangeRef.current) {
        onSimulationStateChangeRef.current(null);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      }
      
      const testCase = activeTestCases[i];
      
      // Run step-by-step simulation with visual feedback
      if (onSimulationStateChangeRef.current) {
        const simulationSteps = [];
        let currentState = startState;
        simulationSteps.push({ state: currentState, symbol: null, step: 0 });
        
        if (testCase.input === '') {
          // Empty string case - start state is final state
          simulationSteps.push({ 
            state: currentState, 
            symbol: 'ε', 
            step: 0,
            fromState: currentState,
            message: `Empty string: Start and end at ${currentState}`,
            completed: true
          });
          // Don't process further for empty string
        } else {
          // Process each symbol step by step
          for (let j = 0; j < testCase.input.length; j++) {
            const symbol = testCase.input[j];
            const fromState = currentState;
            
            // Find transition (use same logic as simulation)
            const symbolInTransition = (transitionSymbols, sym) => {
              if (!transitionSymbols || !sym) return false;
              const symbolList = transitionSymbols.split(',').map(s => s.trim()).filter(s => s.length > 0);
              return symbolList.includes(sym);
            };
            
            const transition = transitions.find(t => 
              t.from === fromState && symbolInTransition(t.symbols, symbol)
            );
            
            if (!transition) {
              simulationSteps.push({ 
                state: 'DEAD', 
                symbol: symbol, 
                step: j + 1,
                fromState: fromState,
                message: `No transition on '${symbol}' from ${fromState} → DEAD state`
              });
              currentState = 'DEAD';
              break;
            } else {
              currentState = transition.to;
              simulationSteps.push({ 
                state: currentState, 
                symbol: symbol, 
                step: j + 1,
                fromState: fromState,
                transition: transition,
                message: `${fromState} --'${symbol}'--> ${currentState}`
              });
            }
            
            // Update visual state on canvas
            if (onSimulationStateChangeRef.current && transition) {
              // Find the transition ID by matching from, to, and symbols
              const transitionId = transitions.findIndex(t => 
                t.from === transition.from && 
                t.to === transition.to && 
                t.symbols === transition.symbols
              );
              
              onSimulationStateChangeRef.current({
                activeState: currentState,
                activeTransition: transitionId >= 0 ? { id: transitionId, ...transition } : transition,
                simulationStep: j + 1,
                totalSteps: testCase.input.length,
                currentSymbol: symbol
              });
            }
            
            // Add delay for visual effect
            await new Promise(resolve => setTimeout(resolve, 800));
          }
        }
        
        // Set final simulation state on canvas (for non-empty strings)
        if (testCase.input !== '') {
          const finalStateObj = states.get(currentState);
          const isAccepting = currentState !== 'DEAD' && finalStateObj?.isAccepting;
          
          if (onSimulationStateChangeRef.current) {
            onSimulationStateChangeRef.current({
              activeState: currentState,
              activeTransition: null,
              simulationStep: testCase.input.length,
              totalSteps: testCase.input.length,
              completed: true,
              finalAccepted: isAccepting
            });
          }
        } else {
          // For empty string
          const finalStateObj = states.get(currentState);
          const isAccepting = finalStateObj?.isAccepting;
          
          if (onSimulationStateChangeRef.current) {
            onSimulationStateChangeRef.current({
              activeState: currentState,
              activeTransition: null,
              simulationStep: 0,
              totalSteps: 0,
              completed: true,
              finalAccepted: isAccepting
            });
          }
        }
      }
      
      // Add delay before showing result
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = onTestStringRef.current(testCase.input);
      
      // Test execution complete
      
      const testResult = {
        ...testCase,
        actual: result.accepted,
        passed: result.accepted === testCase.expected,
        path: result.path,
        error: result.error,
        failedAt: result.failedAt,
        // Debug info
        finalState: result.path ? result.path[result.path.length - 1] : null,
        pathLength: result.path ? result.path.length : 0
      };
      
      results.push(testResult);
      setTestResults([...results]);
    }
    
      // Pass results to parent component for AI analysis
      if (onTestResultsUpdateRef.current) {
        onTestResultsUpdateRef.current(results);
      }
      
      // Clear simulation state on canvas
      if (onSimulationStateChangeRef.current) {
        onSimulationStateChangeRef.current(null);
      }
      
      setCurrentTestIndex(-1);
      setIsRunning(false);
      setTestResults(results);
      // Switch to result tab after tests complete
      if (results.length > 0 && setActiveTabRef.current) {
        setActiveTabRef.current('result');
      }
  }, [startState, states, transitions, activeTestCases]);

  // Listen for runAllTests custom event
  useEffect(() => {
    const handleRunAllTests = () => {
      if (startState && states.size > 0 && !isRunning) {
        runAllTests();
      }
    };
    window.addEventListener('runAllTests', handleRunAllTests);
    return () => window.removeEventListener('runAllTests', handleRunAllTests);
  }, [startState, states.size, isRunning, runAllTests]); // Include runAllTests in dependencies

  // Get overall test results
  const getTestSummary = () => {
    if (testResults.length === 0) return null;
    
    const passed = testResults.filter(t => t.passed).length;
    const total = testResults.length;
    const percentage = Math.round((passed / total) * 100);
    
    return { passed, total, percentage };
  };

  const summary = getTestSummary();

  return (
    <div className="string-tester">


      {/* Test Results Section - LeetCode Style */}
      <div className="leetcode-results-container">
        {/* Tabs removed - now in parent header */}

          {/* Testcase Tab Content */}
          {activeTab === 'testcase' && (
            <div className="testcase-tab-content">
              <div className="testcase-buttons">
                {/* Show all test cases always */}
                {activeTestCases.map((tc, idx) => (
                  <button
                    key={idx}
                    className={`testcase-btn ${selectedTestCaseIndex === idx ? 'active' : ''} ${testResults[idx] ? (testResults[idx].passed ? 'passed' : 'failed') : ''}`}
                    onClick={() => {
                      setSelectedTestCaseIndex(idx);
                      // If results exist, switch to result tab to show details
                      if (testResults.length > 0 && testResults[idx]) {
                        setActiveTab('result');
                      }
                    }}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>
              {activeTestCases[selectedTestCaseIndex] && (
                <div className="testcase-inputs">
                  <div className="testcase-input-item">
                    <span className="input-label">Input:</span>
                    <code className="input-value">
                      {activeTestCases[selectedTestCaseIndex].input || '(empty)'}
                    </code>
                  </div>
                  {activeTestCases[selectedTestCaseIndex].description && (
                    <div className="testcase-input-item">
                      <span className="input-label">Description:</span>
                      <span className="input-description">
                        {activeTestCases[selectedTestCaseIndex].description}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Test Result Tab Content */}
          {activeTab === 'result' && testResults.length > 0 && (
            <div className="test-result-tab-content">
              {/* Status Header */}
              {summary && (
                <div className={`result-status ${summary.percentage === 100 ? 'accepted' : 'failed'}`}>
                  {summary.percentage === 100 ? (
                    <>
                      <span className="status-text">Accepted</span>
                      <span className="status-runtime">Runtime: 0 ms</span>
                    </>
                  ) : (
                    <span className="status-text">
                      {summary.passed}/{summary.total} Passed
                    </span>
                  )}
                </div>
              )}

              {/* Test Case Checkboxes */}
              <div className="testcase-checkboxes">
                {testResults.map((result, idx) => (
                  <label 
                    key={idx} 
                    className={`testcase-checkbox-label ${selectedTestCaseIndex === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedTestCaseIndex(idx)}
                  >
                    <input
                      type="checkbox"
                      checked={result.passed}
                      readOnly
                      className="testcase-checkbox"
                    />
                    <span className={`checkbox-custom ${result.passed ? 'checked' : 'unchecked'}`}>
                      {result.passed ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      )}
                    </span>
                    <span className="checkbox-label-text">Case {idx + 1}</span>
                  </label>
                ))}
              </div>

              {/* Selected Test Case Details */}
              {testResults[selectedTestCaseIndex] && (
                <div className="testcase-details">
                  <div className="detail-section">
                    <span className="detail-label">Input:</span>
                    <code className="detail-value">
                      {testResults[selectedTestCaseIndex].input || '(empty)'}
                    </code>
                  </div>
                  <div className="detail-section">
                    <span className="detail-label">Output:</span>
                    <code className={`detail-value ${testResults[selectedTestCaseIndex].passed ? 'success' : 'error'}`}>
                      {testResults[selectedTestCaseIndex].actual ? 'Accept' : 'Reject'}
                    </code>
                  </div>
                  <div className="detail-section">
                    <span className="detail-label">Expected:</span>
                    <code className="detail-value">
                      {testResults[selectedTestCaseIndex].expected ? 'Accept' : 'Reject'}
                    </code>
                  </div>
                  {testResults[selectedTestCaseIndex].finalState && (
                    <div className="detail-section">
                      <span className="detail-label">Final State:</span>
                      <code className="detail-value">
                        {testResults[selectedTestCaseIndex].finalState}
                      </code>
                    </div>
                  )}
                  {testResults[selectedTestCaseIndex].path && testResults[selectedTestCaseIndex].path.length > 0 && (
                    <div className="detail-section">
                      <span className="detail-label">Path:</span>
                      <code className="detail-value path-value">
                        {testResults[selectedTestCaseIndex].path.join(' → ')}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {states.size === 0 && (
        <div className="instructions-section">
          <div className="instructions-card">
            <div className="instructions-header">
              <h4>Getting Started</h4>
            </div>
            <ol className="instructions-list">
              <li>Use the "Add State" tool to create states</li>
              <li>Right-click states to set start/accepting states</li>
              <li>Use "Add Transition" to connect states</li>
              <li>Click "Run All Tests" to validate your FA</li>
            </ol>
          </div>
          
          <div className="hint-card">
            <div className="hint-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.15-3 5.19V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.81C7.21 13.15 6 11.22 6 9a6 6 0 0 1 6-6z"/>
                <path d="M12 9v3"/>
              </svg>
              <h5>Hint for "Only 0s" FA</h5>
            </div>
            <ul className="hint-list">
              <li><strong>Start state</strong> should be ACCEPTING (for empty string)</li>
              <li><strong>Add transition:</strong> Start state --'0'--> Start state (self-loop)</li>
              <li><strong>Missing transitions:</strong> If no transition for '1' from start state, it goes to DEAD state automatically</li>
              <li><strong>Alternative:</strong> You can explicitly create a reject state and add: Start state --'1'--> Reject state</li>
            </ul>
            <div className="important-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <strong>Important:</strong> Any missing transition automatically goes to a DEAD state (which rejects the string). You don't need to define every transition explicitly!
            </div>
          </div>
        </div>
      )}

      {states.size > 0 && !startState && (
        <div className="warning">
          <p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            No start state defined. Right-click a state to set it as the start state.
          </p>
        </div>
      )}

    </div>
  );
};

export default StringTester;

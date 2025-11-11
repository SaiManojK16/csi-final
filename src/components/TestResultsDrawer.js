import React from 'react';
import './TestResultsDrawer.css';

const TestResultsDrawer = ({ isOpen, onClose, testResults, summary }) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2 className="drawer-title">Test Results</h2>
          <p className="drawer-description">
            {summary && `${summary.passed} out of ${summary.total} test cases passed (${summary.percentage}%)`}
          </p>
          <button className="drawer-close" onClick={onClose}>×</button>
        </div>

        <div className="drawer-body">
          {summary && (
            <div className="test-summary-header">
              <div className={`summary-score-large ${summary.percentage >= 80 ? 'good' : summary.percentage >= 60 ? 'okay' : 'poor'}`}>
                {summary.passed}/{summary.total}
              </div>
              <div className="summary-percentage">
                {summary.percentage}% Passed
              </div>
            </div>
          )}

          <div className="test-results-list-drawer">
            {testResults.map((result, index) => (
              <div key={index} className={`test-result-item-drawer ${result.passed ? 'passed' : 'failed'}`}>
                <div className="test-header-drawer">
                  <span className="test-icon-drawer">
                    {result.passed ? '✅' : '❌'}
                  </span>
                  <span className="test-input-drawer">
                    Input: <code>{result.input || '(empty)'}</code>
                  </span>
                  <span className={`test-status-drawer ${result.passed ? 'passed' : 'failed'}`}>
                    {result.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                
                <div className="test-details-drawer">
                  <p className="test-description-drawer">{result.description}</p>
                  <div className="test-expectations-drawer">
                    <span>Expected: {result.expected ? 'Accept' : 'Reject'}</span>
                    <span>Actual: {result.actual ? 'Accept' : 'Reject'}</span>
                    {result.finalState && (
                      <span>Final State: {result.finalState}</span>
                    )}
                  </div>
                  
                  {result.path && result.path.length > 0 && (
                    <div className="path-trace-drawer">
                      <span>Path: </span>
                      <div className="path-steps-drawer">
                        {result.path.map((state, pathIndex) => (
                          <React.Fragment key={pathIndex}>
                            <span className="path-state-drawer">{state}</span>
                            {pathIndex < result.path.length - 1 && (
                              <span className="path-arrow-drawer">
                                →<sub>{result.input[pathIndex]}</sub>
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.error && (
                    <div className="error-details-drawer">
                      <span>Error: {result.error}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="drawer-footer">
          <button className="drawer-close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TestResultsDrawer;


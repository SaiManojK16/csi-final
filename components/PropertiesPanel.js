import React, { useState } from 'react';
import './PropertiesPanel.css';

const PropertiesPanel = ({ 
  selectedState, 
  selectedTransition,
  states,
  startState,
  transitions,
  onStateUpdate,
  onTransitionUpdate,
  onStateDelete,
  onTransitionDelete,
  onStateToggleAccepting,
  onStateSetStart,
  onClose
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // Show panel when something is selected
  React.useEffect(() => {
    if (selectedState || selectedTransition) {
      setIsCollapsed(false);
    }
  }, [selectedState, selectedTransition]);
  
  // Collapse when parent requests it
  React.useEffect(() => {
    if (onClose === true) {
      setIsCollapsed(true);
    }
  }, [onClose]);
  const selectedStateObj = selectedState ? states.get(selectedState) : null;
  const selectedTransitionObj = selectedTransition 
    ? transitions.find(t => t.id === selectedTransition) 
    : null;
  
  // Ensure isAccepting is explicitly boolean - with debugging
  const isAccepting = selectedStateObj ? (selectedStateObj.isAccepting === true) : false;
  
  // Debug: Log state when it changes
  React.useEffect(() => {
    if (selectedStateObj) {
      console.log('PropertiesPanel - Selected State:', {
        id: selectedState,
        label: selectedStateObj.label,
        isAccepting: selectedStateObj.isAccepting,
        type: typeof selectedStateObj.isAccepting,
        checked: isAccepting
      });
    }
  }, [selectedState, selectedStateObj, isAccepting]);

  const handleStateNameChange = (e) => {
    if (selectedState && onStateUpdate) {
      onStateUpdate(selectedState, { label: e.target.value });
    }
  };

  const handleTransitionSymbolsChange = (e) => {
    if (selectedTransition && onTransitionUpdate) {
      onTransitionUpdate(selectedTransition, { symbols: e.target.value });
    }
  };

  const hasSelection = selectedState || selectedTransition;
  
  return (
    <div className={`properties-panel ${isCollapsed ? 'collapsed' : ''} ${hasSelection ? 'has-selection' : ''}`}>
      <div className="panel-header">
        <h3>Properties</h3>
        <div className="panel-header-actions">
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isCollapsed ? (
                <polyline points="9 18 15 12 9 6"/>
              ) : (
                <polyline points="15 18 9 12 15 6"/>
              )}
            </svg>
          </button>
          <button 
            className="close-btn"
            onClick={() => {
              setIsCollapsed(true);
            }}
            title="Close Properties Panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="panel-content">
        {selectedStateObj ? (
          <div className="state-properties">
            <h4>State Properties</h4>
            
            <div className="property-group">
              <label htmlFor="state-name">Name</label>
              <input
                id="state-name"
                type="text"
                value={selectedStateObj.label || selectedState}
                onChange={handleStateNameChange}
                className="property-input"
                placeholder="e.g., q0"
              />
            </div>

            <div className="property-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={startState === selectedState}
                  onChange={(e) => {
                    if (e.target.checked && onStateSetStart) {
                      onStateSetStart(selectedState);
                    }
                  }}
                />
                <span>Initial State</span>
              </label>
            </div>

            <div className="property-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAccepting}
                  onChange={(e) => {
                    if (onStateToggleAccepting) {
                      onStateToggleAccepting(selectedState);
                    }
                  }}
                />
                <span>Final/Accept State</span>
                {isAccepting && (
                  <span className="accept-indicator">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    (Accepting)
                  </span>
                )}
              </label>
            </div>

            <div className="property-actions">
              <button
                className="delete-button"
                onClick={() => {
                  if (onStateDelete) {
                    onStateDelete(selectedState);
                  }
                }}
              >
                Delete State
              </button>
            </div>
          </div>
        ) : selectedTransitionObj ? (
          <div className="transition-properties">
            <h4>Transition Properties</h4>
            
            <div className="property-group">
              <label htmlFor="transition-symbols">Input Symbol(s)</label>
              <input
                id="transition-symbols"
                type="text"
                value={selectedTransitionObj.symbols || ''}
                onChange={handleTransitionSymbolsChange}
                className="property-input"
                placeholder="e.g., 0, 1, a"
              />
              <p className="property-hint">Separate multiple symbols with commas</p>
            </div>

            <div className="property-info">
              <div className="info-row">
                <span className="info-label">From:</span>
                <span className="info-value">{selectedTransitionObj.from}</span>
              </div>
              <div className="info-row">
                <span className="info-label">To:</span>
                <span className="info-value">{selectedTransitionObj.to}</span>
              </div>
              {selectedTransitionObj.from === selectedTransitionObj.to && (
                <div className="info-row">
                  <span className="info-badge">🔄 Self-Loop</span>
                </div>
              )}
            </div>

            <div className="property-actions">
              <button
                className="delete-button"
                onClick={() => {
                  if (onTransitionDelete) {
                    onTransitionDelete(selectedTransition);
                  }
                }}
              >
                Delete Transition
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-properties">
            <div className="empty-icon">📋</div>
            <p className="empty-text">
              Click a state or transition to view and edit properties.
            </p>
            
            {/* Show all states and transitions */}
            {states.size > 0 && (
              <div className="all-items-list">
                <h4>All States ({states.size})</h4>
                <div className="items-grid">
                  {Array.from(states.entries()).map(([id, state]) => (
                    <div key={id} className="item-card state-card">
                      <div className="item-header">
                        <span className="item-id">{state.label || id}</span>
                        {startState === id && <span className="item-badge start">Start</span>}
                        {state.isAccepting && <span className="item-badge accept">Accept</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {transitions.length > 0 && (
              <div className="all-items-list">
                <h4>All Transitions ({transitions.length})</h4>
                <div className="items-grid">
                  {transitions.map((transition) => {
                    const fromState = states.get(transition.from);
                    const toState = states.get(transition.to);
                    return (
                      <div key={transition.id} className="item-card transition-card">
                        <div className="item-header">
                          <span className="item-label">
                            {fromState?.label || transition.from} → {toState?.label || transition.to}
                          </span>
                          {transition.from === transition.to && (
                            <span className="item-badge self-loop">Self-Loop</span>
                          )}
                        </div>
                        <div className="item-symbols">{transition.symbols}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;


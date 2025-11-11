import React, { useState, useRef, useEffect } from 'react';
import './Toolbar.css';

const Toolbar = ({ mode, onModeChange, onClear, onRestartTour, onUndo, onRedo, canUndo, canRedo }) => {
  const [activeNotification, setActiveNotification] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const notificationTimeoutRef = useRef(null);

  const tools = [
    { 
      id: 'select', 
      label: 'Select', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>, 
      description: 'Select and move states' 
    },
    { 
      id: 'addState', 
      label: 'Add State', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, 
      description: 'Click to add new state' 
    },
    { 
      id: 'addTransition', 
      label: 'Add Transition', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>, 
      description: 'Click two states to connect them' 
    }
  ];

  const handleItemClick = (toolId) => {
    const newMode = mode === toolId ? null : toolId;
    onModeChange(newMode || 'select');
    
    // Show notification
    if (newMode) {
      setActiveNotification(newMode);
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      notificationTimeoutRef.current = setTimeout(() => {
        setActiveNotification(null);
      }, 1500);
    }
  };

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const getToolItem = (id) => tools.find(t => t.id === id);

  return (
    <div className="toolbar-animated-container">
      {activeNotification && (
        <div className="toolbar-notification notification-enter">
          <div className="notification-content">
            {getToolItem(activeNotification)?.label} selected!
          </div>
          <div className="notification-line" />
        </div>
      )}
      
      <div className="toolbar-animated">
        <div className="toolbar-items-group">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`toolbar-item-button ${mode === tool.id ? 'active' : ''}`}
              onClick={() => handleItemClick(tool.id)}
              title={tool.description}
            >
              <span className="toolbar-icon">{tool.icon}</span>
              {mode === tool.id && (
                <span className="toolbar-label toolbar-label-enter">{tool.label}</span>
              )}
            </button>
          ))}
          
          <button
            className="toolbar-item-button clear-btn"
            onClick={onClear}
            title="Clear all states and transitions"
          >
            <span className="toolbar-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </span>
            {mode === 'clear' && (
              <span className="toolbar-label toolbar-label-enter">Reset</span>
            )}
          </button>
          
          {/* Undo/Redo Buttons */}
          <div className="toolbar-divider" />
          
          <button
            className={`toolbar-item-button ${!canUndo ? 'disabled' : ''}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <span className="toolbar-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7v6h6"/>
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
              </svg>
            </span>
            {mode === 'undo' && (
              <span className="toolbar-label toolbar-label-enter">Undo</span>
            )}
          </button>
          
          <button
            className={`toolbar-item-button ${!canRedo ? 'disabled' : ''}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <span className="toolbar-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 7v6h-6"/>
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
              </svg>
            </span>
            {mode === 'redo' && (
              <span className="toolbar-label toolbar-label-enter">Redo</span>
            )}
          </button>
        </div>

        <button
          className={`toolbar-toggle ${isEditMode ? 'active' : ''}`}
          onClick={() => setIsEditMode(!isEditMode)}
        >
          <span className="toggle-icon">
            {isEditMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            )}
          </span>
          <span className="toggle-label">{isEditMode ? 'On' : 'Off'}</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;

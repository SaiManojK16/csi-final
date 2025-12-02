import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import './GuidedTour.css';

/**
 * GuidedTour Component
 * Interactive step-by-step tutorial system with tasks
 */
export const GuidedTour = ({
  steps = [],
  onComplete,
  onSkip,
  showWelcome = true,
  welcomeConfig = {},
  storageKey = 'guided-tour-completed',
  completedTasks: externalCompletedTasks,
  onTaskComplete,
  onTourStartRef, // Ref to expose startTour method
  renderInline = false, // If true, don't render overlay/tooltip, just expose step data
  onStepChange // Callback when step changes, for inline rendering
}) => {
  const [isActive, setIsActive] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [internalCompletedTasks, setInternalCompletedTasks] = useState(new Set());
  const [spotlightPosition, setSpotlightPosition] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [tooltipOffset, setTooltipOffset] = useState({ x: 0, y: 0 }); // User-adjusted position
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const overlayRef = useRef(null);
  const tooltipRef = useRef(null);
  
  // Use external completedTasks if provided, otherwise use internal state
  const completedTasks = externalCompletedTasks !== undefined ? externalCompletedTasks : internalCompletedTasks;
  
  // Expose startTour and skipTour methods via ref
  useImperativeHandle(onTourStartRef, () => ({
    startTour: () => {
      console.log('startTour called via ref');
      setIsActive(true);
      setShowWelcomeModal(false);
      setCurrentStep(0);
      if (externalCompletedTasks === undefined) {
        setInternalCompletedTasks(new Set());
      }
      // Clear localStorage to allow tour to show again
      localStorage.removeItem(storageKey);
    },
    skipTour: () => {
      console.log('skipTour called via ref');
      setIsActive(false);
      setShowWelcomeModal(false);
      localStorage.setItem(storageKey, 'true');
      onSkip?.();
    },
    isActive: isActive,
    currentStep: currentStep,
    currentStepData: steps[currentStep] || null,
    completedTasks: completedTasks,
    nextStep: nextStep,
    prevStep: prevStep,
    canProceed: canProceed
  }), [externalCompletedTasks, storageKey, isActive, onSkip, currentStep, steps, completedTasks]);
  
  // Notify parent when tour active state changes
  useEffect(() => {
    if (onTourStartRef && onTourStartRef.current) {
      // Update the ref's isActive property
      if (onTourStartRef.current.isActive !== isActive) {
        onTourStartRef.current.isActive = isActive;
      }
    }
  }, [isActive, onTourStartRef]);

  // Check if tour has been completed before
  // Don't show welcome modal if tutorial is accessed via tab (showWelcome will be false) or if rendering inline
  useEffect(() => {
    // Never show welcome modal if rendering inline
    if (renderInline) {
      setShowWelcomeModal(false);
      return;
    }
    const hasCompleted = localStorage.getItem(storageKey);
    // Only show welcome modal if showWelcome is true (not accessed via tab)
    if (!hasCompleted && showWelcome && !isActive) {
      setShowWelcomeModal(true);
    }
  }, [storageKey, showWelcome, isActive, renderInline]);

  // Listen for startTour custom event as fallback
  useEffect(() => {
    const handleStartTour = () => {
      console.log('startTour event received');
      if (!isActive) {
        setIsActive(true);
        setShowWelcomeModal(false);
        setCurrentStep(0);
        if (externalCompletedTasks === undefined) {
          setInternalCompletedTasks(new Set());
        }
        localStorage.removeItem(storageKey);
      }
    };
    
    window.addEventListener('startTour', handleStartTour);
    return () => window.removeEventListener('startTour', handleStartTour);
  }, [isActive, externalCompletedTasks, storageKey]);

  // Store refs to elements we've modified for cleanup
  const modifiedElementsRef = useRef([]);
  
  // Calculate positions when step changes
  // When renderInline is true, we still need position calculations for spotlight highlighting
  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    // Cleanup previous element modifications
    modifiedElementsRef.current.forEach(({ element, originalStyles }) => {
      if (element && element.style) {
        Object.assign(element.style, originalStyles);
      }
    });
    modifiedElementsRef.current = [];

    const updatePositions = () => {
      const step = steps[currentStep];
      let element = document.querySelector(step.selector);

      // If selector not found, try alternative selectors or wait a bit
      if (!element && step.selector === '.canvas-panel') {
        element = document.querySelector('.automata-canvas-container') || 
                  document.querySelector('.fa-canvas-panel') ||
                  document.querySelector('canvas');
      }
      
      if (!element && step.selector === '.toolbar-animated') {
        element = document.querySelector('.toolbar-animated-container') ||
                  document.querySelector('.canvas-toolbar-container');
      }
      
      if (!element && step.selector === '.simulation-panel') {
        element = document.querySelector('.string-tester') ||
                  document.querySelector('.test-panel-content');
      }

      if (element) {
        const rect = element.getBoundingClientRect();
        
        // Check if element is visible
        if (rect.width === 0 && rect.height === 0) {
          console.warn('Tour element has zero dimensions:', step.selector);
          return;
        }
        
        // Spotlight position (use viewport coordinates for fixed positioning)
        const highlightRect = {
          top: Math.max(0, rect.top - 10),
          left: Math.max(0, rect.left - 10),
          width: Math.max(20, rect.width + 20),
          height: Math.max(20, rect.height + 20)
        };
        setSpotlightPosition(highlightRect);
        
        // Ensure the element itself can receive clicks by raising its z-index
        if (element && element.style) {
          const originalStyles = {
            zIndex: element.style.zIndex || '',
            pointerEvents: element.style.pointerEvents || '',
            position: element.style.position || ''
          };
          
          const computedStyle = window.getComputedStyle(element);
          
          // Make element clickable above overlay
          element.style.zIndex = '10001';
          element.style.pointerEvents = 'auto';
          if (computedStyle.position === 'static') {
            element.style.position = 'relative';
            originalStyles.position = 'static';
          }
          
          // Store for cleanup
          modifiedElementsRef.current.push({ element, originalStyles });
        }

        // Tooltip position (centered on screen)
        const tooltipPos = calculateTooltipPosition(rect, step.position || 'center');
        setTooltipPosition({
          ...tooltipPos,
          elementRect: rect // Store element rect for arrow calculation
        });

        // Scroll element into view with padding to account for tooltip
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }, 100);
      } else {
        console.warn('Tour element not found:', step.selector, 'for step', currentStep + 1);
        // Don't hide tooltip if element not found - show tooltip anyway centered on screen
        // This allows tutorial to continue even if some selectors don't match
        const availableHeight = window.innerHeight - 40;
        const centeredTop = Math.max(20, (window.innerHeight - availableHeight) / 2);
        const centeredLeft = Math.max(20, (window.innerWidth - 600) / 2);
        setSpotlightPosition(null);
        setTooltipPosition({
          top: centeredTop,
          left: centeredLeft,
          width: 600,
          height: availableHeight,
          arrowDirection: 'bottom',
          arrowOffset: 300,
          elementRect: null
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(updatePositions, 100);
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
      
      // Cleanup element modifications
      modifiedElementsRef.current.forEach(({ element, originalStyles }) => {
        if (element && element.style) {
          Object.assign(element.style, originalStyles);
        }
      });
      modifiedElementsRef.current = [];
    };
  }, [isActive, currentStep, steps]);
  
  // Additional cleanup when tour ends
  useEffect(() => {
    if (!isActive) {
      modifiedElementsRef.current.forEach(({ element, originalStyles }) => {
        if (element && element.style) {
          Object.assign(element.style, originalStyles);
        }
      });
      modifiedElementsRef.current = [];
      // Reset tooltip offset when tour ends
      setTooltipOffset({ x: 0, y: 0 });
    }
  }, [isActive]);
  
  // Handle dragging the tooltip
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setTooltipOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);
  
  // Reset tooltip offset when step changes (optional - comment out if you want offset to persist)
  useEffect(() => {
    if (isActive) {
      // Uncomment the next line if you want offset to reset on each step
      // setTooltipOffset({ x: 0, y: 0 });
    }
  }, [currentStep, isActive]);

  const calculateTooltipPosition = (rect, position) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Responsive tooltip width - adapts to screen size
    const tooltipWidth = Math.min(600, Math.max(500, viewportWidth * 0.9));
    
    // Calculate available viewport height - leave more padding for safety and footer
    const padding = Math.max(20, viewportHeight * 0.02); // 2% of viewport or 20px minimum
    const footerHeight = 80; // Reserve space for footer
    const headerHeight = 60; // Reserve space for header
    const availableHeight = Math.min(600, viewportHeight - padding * 2 - footerHeight - headerHeight);
    
    const rightPadding = Math.max(40, viewportWidth * 0.05); // 5% of viewport or 40px minimum
    
    // Center the tooltip on screen for better visibility, but ensure it fits
    // Ensure tooltip doesn't go below viewport
    let top = Math.max(padding, Math.min((viewportHeight - availableHeight - footerHeight - headerHeight) / 2, viewportHeight - availableHeight - footerHeight - padding));
    let left = Math.max(padding, (viewportWidth - tooltipWidth - rightPadding) / 2);
    
    // Determine arrow direction based on where the element is relative to centered tooltip
    let arrowDirection = 'bottom'; // Default: arrow points down
    
    const tooltipCenterX = left + tooltipWidth / 2;
    const tooltipCenterY = top + availableHeight / 2;
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;
    
    // Calculate distances from tooltip center to element center
    const deltaX = elementCenterX - tooltipCenterX;
    const deltaY = elementCenterY - tooltipCenterY;
    
    // Determine which side of tooltip should have the arrow
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical alignment dominates
      if (deltaY > 0) {
        // Element is below tooltip, arrow should point down from tooltip
        arrowDirection = 'bottom';
      } else {
        // Element is above tooltip, arrow should point up from tooltip
        arrowDirection = 'top';
      }
    } else {
      // Horizontal alignment dominates
      if (deltaX > 0) {
        // Element is to the right of tooltip, arrow should point right from tooltip
        arrowDirection = 'right';
      } else {
        // Element is to the left of tooltip, arrow should point left from tooltip
        arrowDirection = 'left';
      }
    }

    // Constrain horizontal position to stay within viewport
    // Ensure tooltip fits on screen with padding (extra right padding)
    const maxLeft = Math.max(padding, viewportWidth - tooltipWidth - rightPadding);
    left = Math.max(padding, Math.min(left, maxLeft));
    
    // Constrain vertical position to stay within viewport
    const minTop = padding;
    const maxTop = viewportHeight - availableHeight - padding;
    top = Math.max(minTop, Math.min(top, maxTop));

    // Calculate arrow position on tooltip edge to point to element center
    let arrowOffset = 50; // Default to center
    const margin = 30; // Margin from tooltip edges
    
    if (arrowDirection === 'top' || arrowDirection === 'bottom') {
      // Arrow on top or bottom edge, position horizontally
      const elementCenter = rect.left + rect.width / 2;
      
      // Calculate offset from tooltip left edge to element center
      arrowOffset = elementCenter - left;
      
      // Clamp arrow position to be within tooltip bounds (with margin)
      arrowOffset = Math.max(margin, Math.min(tooltipWidth - margin, arrowOffset));
    } else {
      // Arrow on left or right edge, position vertically
      const elementCenter = rect.top + rect.height / 2;
      
      // Calculate offset from tooltip top edge to element center
      arrowOffset = elementCenter - top;
      
      // Clamp arrow position to be within tooltip bounds (with margin)
      // Use available height for calculation
      arrowOffset = Math.max(margin, Math.min(availableHeight - margin, arrowOffset));
    }

    // Ensure tooltip stays within viewport bounds
    top = Math.max(padding, Math.min(top, viewportHeight - availableHeight - padding));

    return { 
      top, 
      left, 
      width: tooltipWidth,
      arrowDirection,
      arrowOffset,
      height: availableHeight // Return available height for max-height constraint
    };
  };

  const startTour = () => {
    setShowWelcomeModal(false);
    setIsActive(true);
    setCurrentStep(0);
    if (externalCompletedTasks === undefined) {
      setInternalCompletedTasks(new Set());
    }
  };

  const skipTour = () => {
    setShowWelcomeModal(false);
    setIsActive(false);
    localStorage.setItem(storageKey, 'true');
    onSkip?.();
  };

  const completeTour = () => {
    setIsActive(false);
    localStorage.setItem(storageKey, 'true');
    onComplete?.();
  };

  const markTaskComplete = (taskId) => {
    if (onTaskComplete) {
      onTaskComplete(taskId);
    } else if (externalCompletedTasks === undefined) {
      setInternalCompletedTasks(new Set([...completedTasks, taskId]));
    }
  };
  
  // Expose markTaskComplete for parent components
  React.useImperativeHandle = React.useImperativeHandle || (() => {});

  // Debug: Log steps count when tour starts or steps change
  useEffect(() => {
    console.log('GuidedTour - Steps received:', steps?.length || 0, 'Steps array:', steps);
    if (isActive) {
      console.log('Tour active - Total steps:', steps.length, 'Current step:', currentStep);
    }
  }, [steps, isActive, currentStep]);
  
  const step = steps[currentStep];
  
  // Don't auto-advance - let user click Next manually after completing task
  // This allows them to interact with the UI while tutorial is open
  const isLastStep = currentStep === steps.length - 1;
  
  // Check if we can proceed - if requireTask is true, taskId must exist and be completed
  // Always allow proceeding if task is completed, but also allow clicking Next even if not completed yet
  // (the button will show as disabled but user can still complete task and click Next)
  const canProceed = step ? (!step.requireTask || (step.requireTask && step.taskId && completedTasks.has(step.taskId))) : true;

  const nextStep = () => {
    // Allow proceeding even if task not completed - user can complete task and click Next
    // The button shows as disabled visually, but we allow clicks
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isActive && !showWelcomeModal) return null;

  return createPortal(
    <>
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <>
          <div className="tour-overlay" onClick={skipTour} />
          <div className="tour-welcome-modal">
            <div className="tour-welcome-header">
              <div className="tour-welcome-icon">
                {welcomeConfig.icon || '🎓'}
              </div>
              <h2 className="tour-welcome-title">
                {welcomeConfig.title || 'Welcome to FA Builder!'}
              </h2>
              <p className="tour-welcome-subtitle">
                {welcomeConfig.subtitle || 'Let us show you around'}
              </p>
            </div>

            <div className="tour-welcome-body">
              <div className="tour-welcome-features">
                {(welcomeConfig.features || []).map((feature, index) => (
                  <div key={index} className="tour-welcome-feature">
                    <div className="tour-welcome-feature-icon">
                      {feature.icon}
                    </div>
                    <div className="tour-welcome-feature-content">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tour-welcome-footer">
              <button
                type="button"
                className="tour-welcome-skip"
                onClick={skipTour}
              >
                Skip Tour
              </button>
              <button
                type="button"
                className="tour-welcome-start"
                onClick={startTour}
              >
                Start Tutorial
              </button>
            </div>
          </div>
        </>
      )}

      {/* Active Tour */}
      {isActive && step && (
        <>
          {/* Minimal overlay - allows all interactions, just darkens background */}
          <div
            className="tour-overlay tour-entered"
            style={{
              pointerEvents: 'none', // Allow all clicks through
              background: 'rgba(0, 0, 0, 0.3)' // Lighter overlay so UI is more visible
            }}
          />

          {/* Spotlight - visual highlight only, doesn't block anything */}
          {spotlightPosition && (
            <div
              className="tour-spotlight"
              style={{
                top: `${spotlightPosition.top}px`,
                left: `${spotlightPosition.left}px`,
                width: `${spotlightPosition.width}px`,
                height: `${spotlightPosition.height}px`,
                pointerEvents: 'none' // Allow clicks through
              }}
            />
          )}

          {/* Tooltip */}
          {tooltipPosition && step && (
            <div
              ref={tooltipRef}
              className={`tour-tooltip ${isDragging ? 'dragging' : ''}`}
              data-position={tooltipPosition.arrowDirection || 'bottom'}
              style={{
                top: `${Math.max(20, Math.min(tooltipPosition.top + tooltipOffset.y, window.innerHeight - 200))}px`,
                left: `${Math.max(20, Math.min(tooltipPosition.left + tooltipOffset.x, window.innerWidth - Math.min(tooltipPosition.width || 600, window.innerWidth * 0.9) - 40))}px`,
                right: 'auto',
                width: `${Math.min(tooltipPosition.width || 600, window.innerWidth * 0.9)}px`,
                maxWidth: `${Math.min(tooltipPosition.width || 600, window.innerWidth - 80)}px`,
                height: 'auto',
                maxHeight: `${Math.min(window.innerHeight - 80, 600)}px`,
                minHeight: '300px',
                transform: 'none',
                position: 'fixed',
                cursor: isDragging ? 'grabbing' : 'default',
                bottom: 'auto'
              }}
            >
              {/* Directional Arrow pointing to element */}
              {tooltipPosition.arrowDirection && tooltipPosition.elementRect && (
                <div
                  className="tour-arrow"
                  data-direction={tooltipPosition.arrowDirection}
                  style={{
                    [tooltipPosition.arrowDirection === 'top' || tooltipPosition.arrowDirection === 'bottom' 
                      ? 'left' : 'top']: `${tooltipPosition.arrowOffset || 50}px`
                  }}
                />
              )}
              {/* Header - Draggable area */}
              <div 
                className="tour-header"
                onMouseDown={(e) => {
                  // Only start drag on header area, not on buttons or interactive elements
                  const target = e.target;
                  if (!target.closest('button') && 
                      !target.closest('.tour-close') &&
                      (target.classList.contains('tour-header') || 
                       target.closest('.tour-step-indicator') ||
                       target.closest('.tour-title'))) {
                    setIsDragging(true);
                    setDragStart({ x: e.clientX, y: e.clientY });
                    e.preventDefault();
                  }
                }}
                style={{
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none'
                }}
              >
                {/* Close Button */}
                <button
                  type="button"
                  className="tour-close"
                  onClick={skipTour}
                  aria-label="Close tour"
                  onMouseDown={(e) => {
                    e.stopPropagation(); // Prevent drag when clicking close
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  ×
                </button>
                
                <div className="tour-step-indicator">
                  <span className="tour-step-indicator-dot" />
                  Step {currentStep + 1} of {steps.length}
                </div>
                <h3 className="tour-title">{step.title}</h3>
              </div>

              {/* Body */}
              <div className="tour-body">
                <p className="tour-description">{step.description}</p>

                {/* Task */}
                {step.task && (
                  <div className={`tour-task ${completedTasks.has(step.taskId) ? 'completed' : ''}`}>
                    <div className="tour-task-header">
                      <span className="tour-task-icon">
                        {completedTasks.has(step.taskId) ? '✓' : '📝'}
                      </span>
                      <h4 className="tour-task-title">
                        {completedTasks.has(step.taskId) ? 'Task Completed!' : 'Your Task:'}
                      </h4>
                    </div>
                    <p className="tour-task-description">{step.task}</p>
                  </div>
                )}

                {/* Hint */}
                {step.hint && (
                  <div className="tour-hint">
                    <span className="tour-hint-icon">💡</span>
                    <span>{step.hint}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="tour-footer">
                {/* Progress Dots */}
                <div className="tour-progress">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`tour-progress-dot ${
                        index === currentStep ? 'active' : ''
                      } ${index < currentStep ? 'completed' : ''}`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="tour-actions">
                  <button
                    type="button"
                    className="tour-btn tour-btn-skip"
                    onClick={skipTour}
                  >
                    Skip
                  </button>

                  {currentStep > 0 && (
                    <button
                      type="button"
                      className="tour-btn tour-btn-prev"
                      onClick={prevStep}
                    >
                      ← Previous
                    </button>
                  )}

                  <button
                    type="button"
                    className={`tour-btn ${isLastStep ? 'tour-btn-finish' : 'tour-btn-next'} ${!canProceed ? 'disabled' : ''}`}
                    onClick={nextStep}
                    disabled={false}
                    title={!canProceed && step?.requireTask ? 'Complete the task first, then click Next' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    {isLastStep ? 'Finish' : 'Next →'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>,
    document.body
  );
};

/**
 * useTour Hook
 * Helper hook for managing tour state and task completion
 */
export const useTour = (tourId) => {
  const [tourState, setTourState] = useState({
    isActive: false,
    currentStep: 0,
    completedTasks: new Set()
  });

  const markTaskComplete = (taskId) => {
    setTourState(prev => ({
      ...prev,
      completedTasks: new Set([...prev.completedTasks, taskId])
    }));
  };

  const isTaskComplete = (taskId) => {
    return tourState.completedTasks.has(taskId);
  };

  const resetTour = () => {
    localStorage.removeItem(`guided-tour-completed-${tourId}`);
    setTourState({
      isActive: false,
      currentStep: 0,
      completedTasks: new Set()
    });
  };

  return {
    ...tourState,
    markTaskComplete,
    isTaskComplete,
    resetTour
  };
};

export default GuidedTour;


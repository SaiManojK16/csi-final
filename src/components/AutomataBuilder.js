import React, { useState, useRef, useCallback, useEffect } from 'react';
import AutomataCanvas from './AutomataCanvas';
import StringTester from './StringTester';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from './AlertDialog';
import { GuidedTour, useTour } from './GuidedTour';
import { FASimulationWelcome, FASimulationSteps, FATaskValidators } from '../tours/FASimulationTour';
import './AutomataBuilder.css';

const AutomataBuilder = ({ problem, problemId, onTestResultsUpdate, onTestStringReady, onStatesChange, showTestPanel, testPanelHeight = 300, isTestPanelMinimized = false, simulationState: externalSimulationState, onSimulationStateChange, onTourRef, testResults: externalTestResults, isAIHelperOpen = false }) => {
  const [states, setStates] = useState(new Map());
  const [transitions, setTransitions] = useState([]);
  const [startState, setStartState] = useState(null);
  const [mode, setMode] = useState('select'); // select, addState, addTransition
  const [selectedState, setSelectedState] = useState(null);
  const [selectedTransition, setSelectedTransition] = useState(null);
  const [transitionStart, setTransitionStart] = useState(null);
  const [testResults, setTestResults] = useState([]); // Store test results for AI analysis
  
  // Use external test results if provided, otherwise use internal state
  const currentTestResults = externalTestResults !== undefined ? externalTestResults : testResults;
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  // Use external simulation state if provided (from test panel), otherwise use internal
  const simulationState = externalSimulationState !== undefined ? externalSimulationState : null;
  const canvasRef = useRef(null);
  const nextStateId = useRef(0);
  
  // Undo/Redo History
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const historyRef = useRef({ history: [], index: -1 });
  
  // Save state to history
  const saveToHistory = useCallback((statesMap, transitionsArray, startStateId) => {
    const state = {
      states: new Map(statesMap),
      transitions: [...transitionsArray],
      startState: startStateId,
      timestamp: Date.now()
    };
    
    const newHistory = historyRef.current.history.slice(0, historyRef.current.index + 1);
    newHistory.push(state);
    // Limit history to 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      historyRef.current.index = newHistory.length - 1;
    }
    
    historyRef.current.history = newHistory;
    setHistory(newHistory);
    setHistoryIndex(historyRef.current.index);
  }, []);
  
  // Initialize with empty state
  useEffect(() => {
    if (historyRef.current.history.length === 0) {
      saveToHistory(new Map(), [], null);
    }
  }, [saveToHistory]);
  
  // Undo
  const undo = useCallback(() => {
    if (historyRef.current.index > 0) {
      historyRef.current.index--;
      const prevState = historyRef.current.history[historyRef.current.index];
      setStates(new Map(prevState.states));
      setTransitions([...prevState.transitions]);
      setStartState(prevState.startState);
      setHistoryIndex(historyRef.current.index);
    }
  }, []);
  
  // Redo
  const redo = useCallback(() => {
    if (historyRef.current.index < historyRef.current.history.length - 1) {
      historyRef.current.index++;
      const nextState = historyRef.current.history[historyRef.current.index];
      setStates(new Map(nextState.states));
      setTransitions([...nextState.transitions]);
      setStartState(nextState.startState);
      setHistoryIndex(historyRef.current.index);
    }
  }, []);
  
  // Check if undo/redo available
  const canUndo = historyRef.current.index > 0;
  const canRedo = historyRef.current.index < historyRef.current.history.length - 1;

  // Guided Tour
  const tour = useTour(`fa-simulation-${problemId}`);
  // Ensure steps are always available - use direct reference instead of ref to avoid stale data
  const tourStepsRef = useRef(FASimulationSteps);
  const tourRef = useRef(null); // Ref to access GuidedTour methods
  
  // Debug: Verify steps count
  useEffect(() => {
    console.log('FASimulationSteps count:', FASimulationSteps.length);
    console.log('tourStepsRef.current count:', tourStepsRef.current?.length);
  }, []);
  
  // Expose tour ref to parent
  useEffect(() => {
    if (onTourRef) {
      onTourRef(tourRef);
    }
  }, [onTourRef, tourRef]);
  
  // Listen for custom event to start tour
  useEffect(() => {
    const handleStartTour = () => {
      if (tourRef.current && tourRef.current.startTour) {
        tourRef.current.startTour();
      }
    };
    
    window.addEventListener('startTour', handleStartTour);
    return () => {
      window.removeEventListener('startTour', handleStartTour);
    };
  }, []);

  // Task validation for guided tour
  useEffect(() => {
    // Validate add-second-state
    if (FATaskValidators['add-second-state'](states)) {
      tour.markTaskComplete('add-second-state');
    }

    // Validate set-accept-state
    if (FATaskValidators['set-accept-state'](states)) {
      tour.markTaskComplete('set-accept-state');
    }
  }, [states, tour]);

  useEffect(() => {
    // Validate add-transition
    if (FATaskValidators['add-transition'](transitions)) {
      tour.markTaskComplete('add-transition');
    }
  }, [transitions, tour]);

  useEffect(() => {
    // Validate test-string - use currentTestResults which can be external or internal
    if (FATaskValidators['test-string'](currentTestResults)) {
      console.log('Tour: test-string task completed!', currentTestResults.length, 'test results');
      tour.markTaskComplete('test-string');
    }
  }, [currentTestResults, tour]);

  // Add a new state
  const addState = useCallback((x, y) => {
    const id = `q${nextStateId.current++}`;
    const newState = {
      id,
      x,
      y,
      isAccepting: false,
      label: id
    };
    
    setStates(prev => {
      const newStates = new Map(prev.set(id, newState));
      const isFirst = prev.size === 0;
      const newStartState = isFirst ? id : startState;
      
      if (isFirst) {
        setStartState(id);
      }
      
      // Save to history
      setTimeout(() => {
        saveToHistory(newStates, transitions, newStartState);
      }, 0);
      
      return newStates;
    });
    
    return id;
  }, [startState, transitions, saveToHistory]);

  // Toggle state as accepting
  const toggleAcceptingState = useCallback((stateId) => {
    console.log('Toggling accepting state for:', stateId);
    setStates(prev => {
      const newStates = new Map();
      // Create new state objects to ensure React detects the change
      prev.forEach((state, id) => {
        if (id === stateId) {
          // Create a new state object with toggled isAccepting
          const currentValue = state.isAccepting === true;
          const newValue = !currentValue;
          console.log(`State ${stateId}: ${currentValue} -> ${newValue}`);
          newStates.set(id, {
            ...state,
            isAccepting: newValue
          });
        } else {
          newStates.set(id, { ...state }); // Copy other states
        }
      });
      
      setTimeout(() => {
        saveToHistory(newStates, transitions, startState);
      }, 0);
      
      return newStates;
    });
  }, [transitions, startState, saveToHistory]);

  // Set start state (only one can be start state at a time)
  const setAsStartState = useCallback((stateId) => {
    // If stateId is null, remove start state
    if (stateId === null) {
      setStartState(null);
      setTimeout(() => {
        saveToHistory(states, transitions, null);
      }, 0);
      return;
    }
    
    // If clicking the same state that's already start, remove it
    if (startState === stateId) {
      setStartState(null);
      setTimeout(() => {
        saveToHistory(states, transitions, null);
      }, 0);
    } else {
      // Set new start state (automatically removes old one since only one can exist)
      setStartState(stateId);
      setTimeout(() => {
        saveToHistory(states, transitions, stateId);
      }, 0);
    }
  }, [states, transitions, startState, saveToHistory]);

  // Delete state
  const deleteState = useCallback((stateId) => {
    setStates(prev => {
      const newStates = new Map(prev);
      newStates.delete(stateId);
      return newStates;
    });
    
    // Remove transitions involving this state
    setTransitions(prev => {
      const filtered = prev.filter(t => t.from !== stateId && t.to !== stateId);
      setTimeout(() => {
        const newStates = new Map(states);
        newStates.delete(stateId);
        const newStartState = startState === stateId ? null : startState;
        setStartState(newStartState);
        saveToHistory(newStates, filtered, newStartState);
      }, 0);
      return filtered;
    });
    
    // Clear selection if deleted
    if (selectedState === stateId) {
      setSelectedState(null);
    }
  }, [states, startState, selectedState, saveToHistory]);

  // Move state (debounced history save for drag operations)
  const moveStateRef = useRef(null);
  const moveState = useCallback((stateId, x, y) => {
    setStates(prev => {
      const newStates = new Map(prev);
      const state = newStates.get(stateId);
      if (state) {
        state.x = x;
        state.y = y;
      }
      
      // Debounce history save during dragging
      if (moveStateRef.current) {
        clearTimeout(moveStateRef.current);
      }
      moveStateRef.current = setTimeout(() => {
        saveToHistory(newStates, transitions, startState);
      }, 300);
      
      return newStates;
    });
  }, [transitions, startState, saveToHistory]);

  // Add transition
  const addTransition = useCallback((fromId, toId, symbol) => {
    // Check if transition already exists
    const existingTransition = transitions.find(
      t => t.from === fromId && t.to === toId
    );
    
    if (existingTransition) {
      // Add symbol to existing transition
      const symbols = existingTransition.symbols.split(',').map(s => s.trim());
      if (!symbols.includes(symbol)) {
        existingTransition.symbols = [...symbols, symbol].join(', ');
        const updated = [...transitions];
        setTransitions(updated);
        setTimeout(() => {
          saveToHistory(states, updated, startState);
        }, 0);
      }
    } else {
      // Create new transition
      const newTransition = {
        id: `t${transitions.length}`,
        from: fromId,
        to: toId,
        symbols: symbol
      };
      setTransitions(prev => {
        const updated = [...prev, newTransition];
        setTimeout(() => {
          saveToHistory(states, updated, startState);
        }, 0);
        return updated;
      });
    }
  }, [transitions, states, startState, saveToHistory]);

  // Delete transition
  const deleteTransition = useCallback((transitionId) => {
    setTransitions(prev => {
      const filtered = prev.filter(t => t.id !== transitionId);
      setTimeout(() => {
        saveToHistory(states, filtered, startState);
      }, 0);
      return filtered;
    });
    if (selectedTransition === transitionId) {
      setSelectedTransition(null);
    }
  }, [selectedTransition, states, startState, saveToHistory]);
  
  // Update state properties
  const handleStateUpdate = useCallback((stateId, updates) => {
    setStates(prev => {
      const newStates = new Map(prev);
      const state = newStates.get(stateId);
      if (state) {
        Object.assign(state, updates);
      }
      return newStates;
    });
  }, []);
  
  // Update transition properties
  const handleTransitionUpdate = useCallback((transitionId, updates) => {
    setTransitions(prev => prev.map(t => 
      t.id === transitionId ? { ...t, ...updates } : t
    ));
  }, []);

  // Show reset confirmation
  const handleClearClick = () => {
    // Only show dialog if there's something to clear
    if (states.size > 0 || transitions.length > 0) {
      setResetDialogOpen(true);
    }
  };

  // Clear all (after confirmation)
  const clearAll = useCallback(() => {
    const emptyStates = new Map();
    const emptyTransitions = [];
    setStates(emptyStates);
    setTransitions(emptyTransitions);
    setStartState(null);
    setSelectedState(null);
    setTransitionStart(null);
    nextStateId.current = 0;
    setResetDialogOpen(false);
    setTimeout(() => {
      saveToHistory(emptyStates, emptyTransitions, null);
    }, 0);
  }, [saveToHistory]);

  // Helper function to parse transition symbols and check if symbol matches
  const symbolMatches = useCallback((transitionSymbols, symbol) => {
    if (!transitionSymbols || !symbol) return false;
    
    // Split by comma and trim each symbol
    const symbolList = transitionSymbols.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    // Check for exact match
    return symbolList.includes(symbol);
  }, []);

  // Test string against automaton (DFA simulation)
  const testString = useCallback((inputString) => {
    if (!startState || states.size === 0) {
      return { accepted: false, path: [], error: 'No start state defined' };
    }

    // Validate start state exists
    if (!states.has(startState)) {
      return { accepted: false, path: [], error: 'Start state does not exist' };
    }

    let currentState = startState;
    const path = [currentState];
    
    // Special case: empty string (ε)
    if (inputString === '' || inputString.length === 0) {
      const startStateObj = states.get(startState);
      const isAccepting = startStateObj && startStateObj.isAccepting === true;
      return {
        accepted: isAccepting,
        path: [startState],
        error: isAccepting 
          ? null 
          : 'String rejected - empty string requires accepting start state'
      };
    }
    
    // Process each symbol in the input string
    for (let i = 0; i < inputString.length; i++) {
      const symbol = inputString[i];
      
      // Skip if already in dead state
      if (currentState === 'DEAD') {
        path.push('DEAD');
        continue;
      }
      
      // Validate current state exists
      if (!states.has(currentState)) {
        currentState = 'DEAD';
        path.push('DEAD');
        continue;
      }
      
      // Find all transitions from current state that match this symbol
      const matchingTransitions = transitions.filter(t => 
        t.from === currentState && symbolMatches(t.symbols, symbol)
      );
      
      // For DFA: should have exactly one transition, but we'll take the first one
      if (matchingTransitions.length === 0) {
        // No transition defined for this symbol - go to dead state
        currentState = 'DEAD';
        path.push('DEAD');
        // Continue processing remaining symbols (all go to DEAD)
      } else if (matchingTransitions.length > 1) {
        // Multiple transitions for same symbol - non-deterministic, but for DFA simulation
        // we'll take the first one and warn
        console.warn(`Non-deterministic FA: Multiple transitions on '${symbol}' from state ${currentState}`);
        const transition = matchingTransitions[0];
        currentState = transition.to;
        path.push(currentState);
      } else {
        // Exactly one transition - follow it
        const transition = matchingTransitions[0];
        const nextState = transition.to;
        
        // Validate target state exists
        if (!states.has(nextState)) {
          console.warn(`Transition ${currentState} --'${symbol}'--> ${nextState} points to non-existent state`);
          currentState = 'DEAD';
          path.push('DEAD');
        } else {
          currentState = nextState;
          path.push(currentState);
        }
      }
    }
    
    // Check if final state is accepting
    let accepted = false;
    let error = null;
    
    if (currentState === 'DEAD') {
      accepted = false;
      error = 'String rejected - reached dead state (no transition defined for a symbol)';
    } else {
      const finalState = states.get(currentState);
      if (!finalState) {
        accepted = false;
        error = `String rejected - final state ${currentState} does not exist`;
      } else {
        accepted = finalState.isAccepting === true;
        error = accepted 
          ? null 
          : `String rejected - final state ${currentState} is not an accepting state`;
      }
    }
    
    return {
      accepted,
      path,
      error,
      finalState: currentState
    };
  }, [startState, states, transitions, symbolMatches]);

  // Notify parent when states change
  useEffect(() => {
    if (onStatesChange) {
      onStatesChange({ states, transitions, startState });
    }
  }, [states, transitions, startState, onStatesChange]);

  // Expose testString function to parent (after it's defined)
  useEffect(() => {
    if (onTestStringReady) {
      // Always update the function reference
      onTestStringReady(testString);
    }
  }, [onTestStringReady, testString, startState, states, transitions]);

  return (
    <div className="automata-builder-three-panel">
      {/* Two-Panel Layout - Canvas left, Properties right */}
      <div className="builder-layout">
        {/* Left Panel - Canvas */}
        <div className="canvas-panel">
          <AutomataCanvas
            ref={canvasRef}
            states={states}
            transitions={transitions}
            startState={startState}
            selectedState={selectedState}
            selectedTransition={selectedTransition}
            mode={mode}
            transitionStart={transitionStart}
            simulationState={simulationState}
            onStateAdd={addState}
            onStateSelect={(stateId) => {
              setSelectedState(stateId);
              setSelectedTransition(null);
            }}
            onTransitionSelect={(transitionId) => {
              setSelectedTransition(transitionId);
              setSelectedState(null);
            }}
            onStateMove={moveState}
            onStateToggleAccepting={toggleAcceptingState}
            onStateSetStart={setAsStartState}
            onStateDelete={deleteState}
            onTransitionStart={setTransitionStart}
            onTransitionAdd={addTransition}
            onTransitionDelete={deleteTransition}
            onZoomChange={(zoom) => {}}
          />
          
          {/* Toolbar at bottom center of canvas */}
          <div 
            className="canvas-toolbar-container"
            style={{ 
              bottom: showTestPanel 
                ? (isTestPanelMinimized ? '76px' : `${testPanelHeight + 40}px`)
                : '40px',
              transition: 'bottom 0.3s ease-out',
              display: 'block' // Always show toolbar - AI helper is now in a tab, not a modal
            }}
          >
            <Toolbar 
              mode={mode}
              onModeChange={(newMode) => {
                setMode(newMode);
                setSelectedState(null);
                setSelectedTransition(null);
              }}
              onClear={handleClearClick}
              onRestartTour={tour.resetTour}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </div>
        </div>

        {/* Right Panel - Properties */}
        <PropertiesPanel
          selectedState={selectedState}
          selectedTransition={selectedTransition}
          states={states}
          startState={startState}
          transitions={transitions}
          onStateUpdate={handleStateUpdate}
          onTransitionUpdate={handleTransitionUpdate}
          onStateDelete={deleteState}
          onTransitionDelete={deleteTransition}
          onStateToggleAccepting={toggleAcceptingState}
          onStateSetStart={setAsStartState}
          onClose={isAIHelperOpen}
        />
      </div>
      
      {/* Reset Confirmation Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen} variant="error">
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Automaton?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete all states, transitions, and your current work.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setResetDialogOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={clearAll}>
            Reset Automaton
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      {/* Guided Tour */}
      <GuidedTour
        steps={FASimulationSteps}
        welcomeConfig={FASimulationWelcome}
        storageKey={`guided-tour-completed-fa-${problemId}`}
        completedTasks={tour.completedTasks}
        onTaskComplete={tour.markTaskComplete}
        onComplete={() => console.log('Tour completed!')}
        onSkip={() => console.log('Tour skipped')}
        onTourStartRef={tourRef}
        showWelcome={false} // Don't show welcome modal - tutorial is accessed via tab
      />
      
    </div>
  );
};

export default AutomataBuilder;

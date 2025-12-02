import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { HiAcademicCap, HiSparkles } from 'react-icons/hi2';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '../components/AlertDialog';
import { ProfileEditDialog } from '../components/ProfileEditDialog';
import { getProblemById, getAllProblems } from '../data/problemsData';
import AutomataBuilder from '../components/AutomataBuilder';
import StringTester from '../components/StringTester';
import AIHelper from '../components/AIHelper';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import './FASimulation.css';

const FASimulation = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get all problems once - this is stable data
  const allProblemsRef = useRef(getAllProblems());
  const allProblems = allProblemsRef.current;
  
  // Use state to ensure problem updates when problemId changes
  const [problem, setProblem] = React.useState(() => getProblemById(problemId));
  const [currentProblemIndex, setCurrentProblemIndex] = React.useState(() => 
    allProblems.findIndex(p => p.id === problemId)
  );
  
  const [showTestPanel, setShowTestPanel] = useState(true); // Always show
  const [testPanelHeight, setTestPanelHeight] = useState(300);
  const [isTestPanelMinimized, setIsTestPanelMinimized] = useState(true); // Start minimized to give canvas more space
  const [isTestPanelFullscreen, setIsTestPanelFullscreen] = useState(false); // Fullscreen mode
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartY = useRef(0);
  const resizeStartHeight = useRef(0);
  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);
  const [isQuestionPanelMinimized, setIsQuestionPanelMinimized] = useState(false); // Question panel minimize state
  const [activeLeftTab, setActiveLeftTab] = useState('question'); // 'question' or 'ai' or 'tutorial'
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false); // Track tour active state
  const profileRef = useRef(null);

  // Handle test results from AutomataBuilder
  const [testResults, setTestResults] = useState([]);
  const testStringFnRef = useRef(null);
  const [testStringFn, setTestStringFn] = useState(null);
  const [builderStates, setBuilderStates] = useState({ states: new Map(), transitions: [], startState: null });
  const [simulationState, setSimulationState] = useState(null); // For canvas animation
  const [testSummary, setTestSummary] = useState(null); // For minimized panel display
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track if user has submitted
  const [activeTab, setActiveTab] = useState('testcase'); // Track active tab in test panel
  const tourRef = useRef(null); // Ref to access tutorial
  const navigationCounterRef = useRef(0); // Counter to force remounts
  
  // Update problem and index when problemId changes
  useEffect(() => {
    if (!problemId) return;
    
    const newProblem = getProblemById(problemId);
    const newIndex = allProblems.findIndex(p => p.id === problemId);
    
    // Always update if problemId changed, even if problem object is the same
    const problemChanged = !problem || problem.id !== problemId;
    const indexChanged = newIndex >= 0 && newIndex !== currentProblemIndex;
    
    if (problemChanged || indexChanged) {
      if (newProblem) {
        setProblem(newProblem);
      }
      if (newIndex >= 0) {
        setCurrentProblemIndex(newIndex);
      }
      
      // Always reset state when navigating to a new problem
      if (problemChanged) {
        setShowTestPanel(true); // Always show test panel
        setTestResults([]);
        setTestSummary(null);
        setTestStringFn(null);
        testStringFnRef.current = null;
        setBuilderStates({ states: new Map(), transitions: [], startState: null });
        setSimulationState(null);
        setIsSubmitting(false);
        setSubmitMessage(null);
        setIsAIHelperOpen(false);
        setIsTestPanelMinimized(true); // Start minimized to give canvas more space
        setHasSubmitted(false); // Reset submission state
        setActiveTab('testcase'); // Reset to testcase tab
        setIsQuestionPanelMinimized(false); // Reset question panel
        setActiveLeftTab('question'); // Reset to question tab
        
        // Force scroll to top when problem changes
        window.scrollTo(0, 0);
      }
    }
  }, [problemId, location.pathname, location.key, location.state?.timestamp, location.state?.navType]);

  // Update ref when function changes
  useEffect(() => {
    testStringFnRef.current = testStringFn;
  }, [testStringFn]);

  // Sync tour active state with ref
  useEffect(() => {
    const checkTourState = () => {
      // tourRef.current is the ref object, tourRef.current.current has the methods
      const tourMethods = tourRef.current?.current;
      if (tourMethods && tourMethods.isActive !== undefined) {
        setIsTourActive(tourMethods.isActive);
      }
    };
    
    // Check immediately
    checkTourState();
    
    // Check periodically to sync state (in case tour state changes externally)
    const interval = setInterval(checkTourState, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Resize handler for bottom panel
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartY.current = e.clientY;
    resizeStartHeight.current = testPanelHeight;
  }, [testPanelHeight]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    
    const deltaY = resizeStartY.current - e.clientY; // Inverted because we're resizing from bottom
    const newHeight = Math.max(200, Math.min(600, resizeStartHeight.current + deltaY));
    setTestPanelHeight(newHeight);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleSubmit = async () => {
    // If test panel is not open, open it first
    if (!showTestPanel) {
      setShowTestPanel(true);
      setIsTestPanelMinimized(false);
      return;
    }

    // If no test results, prompt to run tests first
    if (!testResults || testResults.length === 0) {
      setSubmitMessage({ type: 'error', text: 'Please run tests first before submitting.' });
      setTimeout(() => setSubmitMessage(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Calculate score
      const passed = testResults.filter(r => r.passed).length;
      const total = testResults.length;
      const score = total > 0 ? Math.round((passed / total) * 100) : 0;
      const isSolved = score === 100;

      // Submit to backend
      const response = await apiService.updateFAProgress(problemId, {
        status: isSolved ? 'solved' : 'attempted',
        score: score,
        testResults: testResults
      });

      if (response.success) {
        // Refresh user data in context
        const updatedUser = await apiService.getCurrentUser();
        if (updatedUser.success && updatedUser.user) {
          // Update localStorage and trigger context update
          localStorage.setItem('acceptly_user', JSON.stringify(updatedUser.user));
          window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser.user }));
        }

        // Mark as submitted
        setHasSubmitted(true);
        
        setSubmitMessage({
          type: isSolved ? 'success' : 'info',
          text: isSolved 
            ? `🎉 Accepted! All test cases passed (${passed}/${total}).`
            : `Submission recorded. ${passed}/${total} test cases passed (${score}%).`
        });

        // Show success message
        setTimeout(() => {
          setSubmitMessage(null);
        }, 5000);
      } else {
        throw new Error(response.message || 'Failed to submit');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitMessage({
        type: 'error',
        text: error.message || 'Failed to submit. Please try again.'
      });
      setTimeout(() => setSubmitMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunTests = () => {
    // Always show test panel
    if (!showTestPanel) {
      setShowTestPanel(true);
    }
    // Maximize test panel (set to half screen height)
    setIsTestPanelMinimized(false);
    setTestPanelHeight(400); // Set to half screen approximately
    // Switch to testcase tab
    setActiveTab('testcase');
    // Trigger test run from StringTester after panel opens
    setTimeout(() => {
      const event = new CustomEvent('runAllTests');
      window.dispatchEvent(event);
    }, 300);
  };

  const handlePreviousProblem = useCallback(() => {
    if (currentProblemIndex > 0 && currentProblemIndex <= allProblems.length) {
      const prevProblem = allProblems[currentProblemIndex - 1];
      if (prevProblem && prevProblem.id && prevProblem.id !== problemId) {
        // Increment navigation counter to force remount
        navigationCounterRef.current += 1;
        const timestamp = Date.now();
        navigate(`/practice/fa/${prevProblem.id}`, { 
          replace: true,
          state: { 
            fromNavigation: true, 
            timestamp, 
            navType: 'previous',
            navCounter: navigationCounterRef.current
          }
        });
        // Force immediate update
        window.scrollTo(0, 0);
      }
    }
  }, [navigate, allProblems, currentProblemIndex, problemId]);

  const handleNextProblem = useCallback(() => {
    if (currentProblemIndex >= 0 && currentProblemIndex < allProblems.length - 1) {
      const nextProblem = allProblems[currentProblemIndex + 1];
      if (nextProblem && nextProblem.id && nextProblem.id !== problemId) {
        // Increment navigation counter to force remount
        navigationCounterRef.current += 1;
        const timestamp = Date.now();
        navigate(`/practice/fa/${nextProblem.id}`, { 
          replace: true,
          state: { 
            fromNavigation: true, 
            timestamp, 
            navType: 'next',
            navCounter: navigationCounterRef.current
          }
        });
        // Force immediate update
        window.scrollTo(0, 0);
      }
    }
  }, [navigate, allProblems, currentProblemIndex, problemId]);

  const handleRandomProblem = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * allProblems.length);
    const randomProblem = allProblems[randomIndex];
    if (randomProblem && randomProblem.id !== problemId) {
      // Increment navigation counter to force remount
      navigationCounterRef.current += 1;
      const timestamp = Date.now();
      navigate(`/practice/fa/${randomProblem.id}`, { 
        replace: true,
        state: { 
          fromNavigation: true, 
          timestamp, 
          navType: 'random',
          navCounter: navigationCounterRef.current
        }
      });
      window.scrollTo(0, 0);
    }
  }, [navigate, allProblems, problemId]);

  const { logout } = useAuth();

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate('/');
  };

  const handleEditProfileClick = () => {
    setIsProfileOpen(false);
    setProfileEditOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleTestString = useCallback((inputString) => {
    console.log('handleTestString called with:', inputString);
    console.log('testStringFn:', typeof testStringFn, testStringFn);
    console.log('testStringFnRef.current:', typeof testStringFnRef.current, testStringFnRef.current);
    console.log('builderStates:', builderStates);
    
    // Try to get function from ref first, then state
    let fn = testStringFnRef.current;
    if (!fn && typeof testStringFn === 'function') {
      fn = testStringFn;
    }
    
    if (fn && typeof fn === 'function') {
      try {
        console.log('Using testString function');
        const result = fn(inputString);
        console.log('Test result:', result);
        return result;
      } catch (error) {
        console.error('Error in testString:', error);
        return { accepted: false, path: [], error: `Test error: ${error.message}` };
      }
    }
    
    // Fallback: use builderStates directly if function not ready
    console.log('Function not ready, using builderStates fallback');
    if (builderStates.states && builderStates.states.size > 0 && builderStates.startState) {
      // Create a simple test function on the fly
      const states = builderStates.states;
      const transitions = builderStates.transitions;
      const startState = builderStates.startState;
      
      if (!startState || !states.has(startState)) {
        return { accepted: false, path: [], error: 'No valid start state' };
      }
      
      // Simple simulation
      let currentState = startState;
      const path = [currentState];
      
      if (inputString === '' || inputString.length === 0) {
        const startStateObj = states.get(startState);
        const isAccepting = startStateObj && startStateObj.isAccepting === true;
        return {
          accepted: isAccepting,
          path: [startState],
          error: isAccepting ? null : 'String rejected - empty string requires accepting start state'
        };
      }
      
      const symbolMatches = (transitionSymbols, symbol) => {
        if (!transitionSymbols || !symbol) return false;
        const symbolList = transitionSymbols.split(',').map(s => s.trim()).filter(s => s.length > 0);
        return symbolList.includes(symbol);
      };
      
      for (let i = 0; i < inputString.length; i++) {
        const symbol = inputString[i];
        
        if (currentState === 'DEAD') {
          path.push('DEAD');
          continue;
        }
        
        if (!states.has(currentState)) {
          currentState = 'DEAD';
          path.push('DEAD');
          continue;
        }
        
        const matchingTransitions = transitions.filter(t => 
          t.from === currentState && symbolMatches(t.symbols, symbol)
        );
        
        if (matchingTransitions.length === 0) {
          currentState = 'DEAD';
          path.push('DEAD');
        } else {
          const transition = matchingTransitions[0];
          const nextState = transition.to;
          
          if (!states.has(nextState)) {
            currentState = 'DEAD';
            path.push('DEAD');
          } else {
            currentState = nextState;
            path.push(currentState);
          }
        }
      }
      
      let accepted = false;
      let error = null;
      
      if (currentState === 'DEAD') {
        accepted = false;
        error = 'String rejected - reached dead state';
      } else {
        const finalState = states.get(currentState);
        if (!finalState) {
          accepted = false;
          error = `String rejected - final state ${currentState} does not exist`;
        } else {
          accepted = finalState.isAccepting === true;
          error = accepted ? null : `String rejected - final state ${currentState} is not an accepting state`;
        }
      }
      
      return {
        accepted,
        path,
        error,
        finalState: currentState
      };
    }
    
    return { accepted: false, path: [], error: 'Automaton not ready. Please wait for initialization.' };
  }, [testStringFn, builderStates]);

  if (!problem) {
    return (
      <div className="fa-simulation-page">
        <div className="error-container">
          <h2>Problem Not Found</h2>
          <button onClick={() => navigate('/problems')}>← Back to Problems</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fa-simulation-page-new" key={`fa-page-${problemId}-${location.key || location.pathname}`}>
      {/* LeetCode Style Header - Problem Navigation */}
      <div className="fa-header-leetcode">
        <div className="fa-header-left">
          <Link to="/problems" className="header-logo">
            <span className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
            </span>
            <span className="logo-text-short">Acceptly</span>
          </Link>
          <div className="header-navigation">
            <button 
              className="nav-arrow-btn"
              onClick={handlePreviousProblem}
              disabled={currentProblemIndex <= 0}
              title="Previous Problem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button 
              className="nav-arrow-btn"
              onClick={handleNextProblem}
              disabled={currentProblemIndex >= allProblems.length - 1}
              title="Next Problem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <button 
              className="shuffle-btn"
              onClick={handleRandomProblem}
              title="Random Problem"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 3 21 3 21 8"/>
                <line x1="4" y1="20" x2="21" y2="3"/>
                <polyline points="21 16 21 21 16 21"/>
                <line x1="15" y1="15" x2="21" y2="21"/>
                <line x1="4" y1="4" x2="9" y2="9"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="fa-header-right">
          <button 
            className="header-icon-btn tutorial-btn"
            onClick={() => {
              console.log('Tutorial button clicked, tourRef:', tourRef.current);
              if (tourRef.current && tourRef.current.startTour) {
                tourRef.current.startTour();
              } else {
                console.warn('Tour ref not available or startTour method missing');
                // Try to find the tour component and start it
                const event = new CustomEvent('startTour');
                window.dispatchEvent(event);
              }
            }}
            title="Start Tutorial - Learn how to use the FA Builder"
          >
            <HiAcademicCap size={24} />
          </button>
          <button 
            className="header-icon-btn run-tests-btn"
            onClick={handleRunTests}
            title="Run Test Cases"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </button>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            {submitMessage && (
              <div className={`submit-message ${submitMessage.type}`}>
                {submitMessage.text}
              </div>
            )}
          </div>
          <button 
            className="header-icon-btn ai-assistant-btn"
            onClick={() => {
              setIsAIHelperOpen(true);
              setActiveLeftTab('ai');
              setIsQuestionPanelMinimized(false);
            }}
            title="AI Assistant"
          >
            <HiSparkles size={18} />
          </button>
          <div className="header-profile">
            <div className="profile-menu" ref={profileRef}>
              <button 
                className="profile-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Profile menu"
              >
                <div className="profile-avatar">
                  {(user?.username || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="user-avatar-large">
                      {(user?.username || user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <p className="user-name">{user?.username || user?.name || 'User'}</p>
                      <p className="user-email">{user?.email || 'No email'}</p>
                    </div>
                  </div>
                  
                  <div className="dropdown-menu">
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/dashboard');
                      }}
                    >
                      <span className="dropdown-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
                          <path d="M12 22H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/>
                          <path d="M22 22h-6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/>
                        </svg>
                      </span>
                      <span>Account Settings</span>
                    </button>
                    <button 
                      onClick={handleEditProfileClick}
                      className="dropdown-item"
                    >
                      <span className="dropdown-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </span>
                      <span>Edit Profile</span>
                    </button>
                    <button 
                      onClick={handleLogoutClick}
                      className="dropdown-item"
                    >
                      <span className="dropdown-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                      </span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Side by Side */}
      <div className="fa-main-layout" style={{ display: isTestPanelFullscreen ? 'none' : 'flex' }}>
        {/* Left Panel - Question/Tutorial/AI */}
        <div className={`fa-question-panel ${isQuestionPanelMinimized ? 'minimized' : ''}`}>
          {/* Tabs for Question, Tutorial, AI */}
          <div className="question-tabs">
            <button 
              className={`question-tab ${activeLeftTab === 'question' ? 'active' : ''}`}
              onClick={() => {
                setActiveLeftTab('question');
                setIsAIHelperOpen(false); // Close AI helper when switching to question
              }}
            >
              Description
            </button>
            <button 
              className={`question-tab ${activeLeftTab === 'tutorial' ? 'active' : ''}`}
              onClick={() => {
                setActiveLeftTab('tutorial');
                setIsAIHelperOpen(false); // Close AI helper when switching to tutorial
              }}
            >
              Tutorial
            </button>
            <button 
              className={`question-tab ${activeLeftTab === 'ai' ? 'active' : ''}`}
              onClick={() => {
                setActiveLeftTab('ai');
                setIsAIHelperOpen(true);
              }}
            >
              AI Assistant
            </button>
            <button
              className="question-panel-minimize-btn"
              onClick={() => setIsQuestionPanelMinimized(!isQuestionPanelMinimized)}
              title={isQuestionPanelMinimized ? 'Expand' : 'Minimize'}
            >
              {isQuestionPanelMinimized ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          
          {!isQuestionPanelMinimized && (
            <>
              {activeLeftTab === 'question' && (
                <>
                  <div className="question-header">
                    <h3>{problem.title || "Problem Statement"}</h3>
                    <div className="problem-badges">
                      <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                        {problem.difficulty}
                      </span>
                      <span className="badge badge-type">{problem.type}</span>
                      <span className="badge badge-hint">Hint</span>
                    </div>
                  </div>

                  <div className="question-content">
                    <p className="problem-description">{problem.description}</p>

                    {problem.examples && (
                      <div className="examples-section">
                        <h4>Examples</h4>
                        {problem.examples.map((ex, idx) => (
                          <div key={idx} className="example">
                            <span className="example-input">
                              Input: <code>{ex.input || '(empty)'}</code>
                            </span>
                            <span className={`example-output ${ex.expected ? 'accept' : 'reject'}`}>
                              Output: {ex.output}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="alphabet-info">
                      <strong>Alphabet:</strong> {'{' + problem.alphabet.join(', ') + '}'}
                    </div>
                  </div>
                </>
              )}

              {activeLeftTab === 'ai' && (
                <div className="ai-helper-panel-inline">
                  <AIHelper
                    problemStatement={problem?.description || ""}
                    problemTitle={problem?.title || ""}
                    problemExamples={problem?.examples || []}
                    problemAlphabet={problem?.alphabet || ['0', '1']}
                    states={builderStates.states}
                    transitions={builderStates.transitions}
                    startState={builderStates.startState}
                    testResults={testResults}
                    isOpen={true}
                    onClose={() => {
                      setIsAIHelperOpen(false);
                      setActiveLeftTab('question');
                    }}
                    hasSubmitted={hasSubmitted}
                    testPanelHeight={0}
                    inlineMode={true}
                  />
                </div>
              )}

              {activeLeftTab === 'tutorial' && (
                <div className="tutorial-panel-content">
                  <div className="tutorial-header">
                    <h3>📚 Interactive Tutorial</h3>
                    <p>Follow the steps below to learn how to build Finite Automata.</p>
                  </div>
                  <div className="tutorial-steps-list">
                    {isTourActive ? (
                      <div className="tutorial-active">
                        <p>Tutorial is currently active. Follow the instructions on the canvas.</p>
                        <button 
                          className="tutorial-skip-btn"
                          onClick={() => {
                            const tourMethods = tourRef.current?.current;
                            if (tourMethods && typeof tourMethods.skipTour === 'function') {
                              tourMethods.skipTour();
                              setIsTourActive(false);
                            } else {
                              // Fallback: dispatch event
                              const event = new CustomEvent('skipTour');
                              window.dispatchEvent(event);
                              setIsTourActive(false);
                            }
                          }}
                        >
                          Skip Tutorial
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="tutorial-welcome">
                          <h4>Welcome to FA Builder Tutorial!</h4>
                          <p>This tutorial will guide you through building your first Finite Automaton.</p>
                          <button 
                            className="tutorial-start-btn"
                            onClick={() => {
                              console.log('Start Tutorial clicked, tourRef:', tourRef.current);
                              console.log('tourRef.current?.current:', tourRef.current?.current);
                              console.log('tourRef.current?.current?.startTour:', tourRef.current?.current?.startTour);
                              
                              // Try to start the tour
                              // tourRef.current is the ref object from AutomataBuilder
                              // tourRef.current.current is the object with methods from useImperativeHandle
                              const tourMethods = tourRef.current?.current;
                              
                              if (tourMethods && typeof tourMethods.startTour === 'function') {
                                try {
                                  tourMethods.startTour();
                                  setIsTourActive(true);
                                  setActiveLeftTab('question'); // Switch to question after starting
                                  console.log('Tour started successfully');
                                } catch (error) {
                                  console.error('Error starting tour:', error);
                                  alert('Failed to start tutorial. Please try again.');
                                }
                              } else {
                                console.warn('Tour methods not available, trying event fallback');
                                // Try alternative: dispatch event
                                const event = new CustomEvent('startTour');
                                window.dispatchEvent(event);
                                setIsTourActive(true);
                                setActiveLeftTab('question');
                              }
                            }}
                          >
                            Start Tutorial
                          </button>
                        </div>
                        <div className="tutorial-steps-preview">
                          <h4>What you'll learn:</h4>
                          <ol>
                            <li>Add states to your automaton</li>
                            <li>Set start and accepting states</li>
                            <li>Create transitions between states</li>
                            <li>Test your automaton with test cases</li>
                          </ol>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Panel - Canvas */}
        <div 
          className="fa-canvas-panel"
          style={{
            paddingBottom: showTestPanel 
              ? (isTestPanelMinimized ? '36px' : `${testPanelHeight}px`)
              : '0px',
            transition: 'padding-bottom 0.3s ease-out'
          }}
        >
          <AutomataBuilder 
            key={`automata-${problemId}-${location.state?.timestamp || ''}`}
            problemId={problemId} 
            problem={problem}
            onTestResultsUpdate={setTestResults}
            onTestStringReady={(fn) => {
              console.log('TestString function received:', typeof fn, fn);
              setTestStringFn(() => fn); // Wrap in function to preserve the reference
              testStringFnRef.current = fn;
            }}
            onStatesChange={(newStates) => {
              console.log('States updated:', newStates);
              setBuilderStates(newStates);
            }}
            showTestPanel={showTestPanel}
            testPanelHeight={testPanelHeight}
            isTestPanelMinimized={isTestPanelMinimized}
            simulationState={simulationState}
            onSimulationStateChange={setSimulationState}
            onTourRef={(ref) => { 
              console.log('onTourRef called with:', ref);
              // ref is the ref object from AutomataBuilder, which has .current pointing to GuidedTour methods
              tourRef.current = ref;
              // Update tour active state when ref is set
              if (ref && ref.current && ref.current.isActive !== undefined) {
                setIsTourActive(ref.current.isActive);
              }
            }}
            testResults={testResults}
            isAIHelperOpen={isAIHelperOpen}
          />
        </div>
        </div>

      {/* Bottom Test Panel - Resizable */}
      {showTestPanel && (
        <div 
          className={`fa-test-panel ${isTestPanelMinimized ? 'minimized' : ''} ${isTestPanelFullscreen ? 'fullscreen' : ''}`}
          style={{ 
            height: isTestPanelMinimized ? '36px' : (isTestPanelFullscreen ? '100vh' : `${testPanelHeight}px`),
            left: isQuestionPanelMinimized ? '0' : '420px' // Adjust based on question panel state
          }}
        >
          <div className="test-panel-header-bar">
            <div className="test-panel-header-left">
              <button
                className="test-panel-minimize-btn"
                onClick={() => setIsTestPanelMinimized(!isTestPanelMinimized)}
                title={isTestPanelMinimized ? 'Maximize' : 'Minimize'}
              >
                {isTestPanelMinimized ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <div className="test-panel-tabs">
                <button 
                  className={`test-panel-tab ${activeTab === 'testcase' ? 'active' : ''}`}
                  onClick={() => {
                    if (isTestPanelMinimized) {
                      setIsTestPanelMinimized(false);
                    }
                    setActiveTab('testcase');
                  }}
                >
                  Testcase
                </button>
                <span className="test-panel-tab-separator">&gt;</span>
                <button 
                  className={`test-panel-tab ${activeTab === 'result' ? 'active' : ''}`}
                  onClick={() => {
                    if (isTestPanelMinimized) {
                      setIsTestPanelMinimized(false);
                    }
                    setActiveTab('result');
                  }}
                  disabled={testResults.length === 0}
                >
                  Test Result
                  {testSummary && testSummary.total > 0 && (
                    <span className={`test-summary-badge ${testSummary.passed === testSummary.total ? 'passed' : 'failed'}`}>
                      {testSummary.passed}/{testSummary.total}
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="test-panel-header-right">
              {!isTestPanelMinimized && (
                <button
                  className="test-panel-fullscreen-btn"
                  onClick={() => setIsTestPanelFullscreen(!isTestPanelFullscreen)}
                  title={isTestPanelFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isTestPanelFullscreen ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 6L2 2M6 6L6 2M6 6L2 6M10 6L14 2M10 6L10 2M10 6L14 6M6 10L2 14M6 10L6 14M6 10L2 10M10 10L14 14M10 10L10 14M10 10L14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 6L6 2M6 2L6 6M6 2L2 6M10 2L14 6M14 6L10 6M14 6L10 2M2 10L6 14M6 14L6 10M6 14L2 10M10 14L14 10M14 10L10 10M14 10L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
          </button>
              )}
            </div>
          </div>
          {!isTestPanelMinimized && (
            <>
              <div 
                className="test-panel-resizer"
                onMouseDown={handleMouseDown}
              >
                <div className="resizer-handle">☰</div>
              </div>
              <div className="test-panel-content">
                <StringTester
                  onTestString={handleTestString}
                  states={builderStates.states}
                  startState={builderStates.startState}
                  transitions={builderStates.transitions}
                  onTestResultsUpdate={(results) => {
                    setTestResults(results);
                    if (results && results.length > 0) {
                      const passed = results.filter(r => r.passed).length;
                      const total = results.length;
                      setTestSummary({ passed, total, percentage: Math.round((passed / total) * 100) });
                    }
                  }}
                  onSimulationStateChange={setSimulationState}
                  problem={problem}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* AI Helper Modal - Only show if not in inline mode */}
      {isAIHelperOpen && activeLeftTab !== 'ai' && (
        <AIHelper
          problemStatement={problem?.description || ""}
          problemTitle={problem?.title || ""}
          problemExamples={problem?.examples || []}
          problemAlphabet={problem?.alphabet || ['0', '1']}
          states={builderStates.states}
          transitions={builderStates.transitions}
          startState={builderStates.startState}
          testResults={testResults}
          isOpen={isAIHelperOpen}
          onClose={() => {
            setIsAIHelperOpen(false);
            setActiveLeftTab('question');
          }}
          hasSubmitted={hasSubmitted}
          testPanelHeight={showTestPanel ? (isTestPanelMinimized ? 36 : (isTestPanelFullscreen ? 0 : testPanelHeight)) : 0}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} variant="warning">
        <AlertDialogHeader>
          <AlertDialogTitle>Logout?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? Any unsaved progress will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setLogoutDialogOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="primary" onClick={handleConfirmLogout}>
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      {/* Profile Edit Dialog */}
      <ProfileEditDialog 
        open={profileEditOpen} 
        onOpenChange={setProfileEditOpen} 
      />
    </div>
  );
};

export default FASimulation;


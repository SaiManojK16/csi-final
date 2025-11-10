import React, { useState, useEffect, useRef } from 'react';
import { HiSparkles } from 'react-icons/hi2';
import geminiService from '../services/geminiService';
import './AIHelper.css';

const AIHelper = ({ 
  problemStatement, 
  problemTitle, 
  problemExamples,
  problemAlphabet,
  states,
  transitions,
  startState,
  testResults,
  isOpen = false,
  onClose = () => {},
  hasSubmitted = false, // Only allow chat after submission
  testPanelHeight = 0
}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get hint when button is clicked (only before submission)
  const getHint = async () => {
    if (isLoading || states.size === 0 || hasSubmitted) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const currentFA = { states, transitions, startState };
      const fullProblemStatement = `
Problem: ${problemTitle}

Description: ${problemStatement}

Alphabet: {${problemAlphabet.join(', ')}}

Examples:
${problemExamples.map(ex => 
  `Input: "${ex.input || '(empty)'}" → Expected: ${ex.expected ? 'ACCEPT' : 'REJECT'} (${ex.output})`
).join('\n')}
      `.trim();
      
      const hint = await geminiService.getProgressHint(fullProblemStatement, currentFA, messages);
      
      setMessages(prev => [...prev, {
        type: 'ai',
        text: hint,
        timestamp: new Date()
      }]);
    } catch (err) {
      setError(err.message || 'Failed to get hint');
      console.error('Error getting hint:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Send user message (only after submission)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || !hasSubmitted) return;

    const userMessage = inputText.trim();
    setInputText('');
    setError(null);

    // Add user message
    const newMessages = [...messages, {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    }];
    setMessages(newMessages);

    setIsLoading(true);

    try {
      const currentFA = { states, transitions, startState };
      const fullProblemStatement = `
Problem: ${problemTitle}

Description: ${problemStatement}

Alphabet: {${problemAlphabet.join(', ')}}

Examples:
${problemExamples.map(ex => 
  `Input: "${ex.input || '(empty)'}" → Expected: ${ex.expected ? 'ACCEPT' : 'REJECT'} (${ex.output})`
).join('\n')}
      `.trim();
      
      const response = await geminiService.getChatResponse(
        fullProblemStatement, 
        currentFA, 
        userMessage,
        newMessages,
        testResults // Pass test results for context
      );
      
      setMessages([...newMessages, {
        type: 'ai',
        text: response,
        timestamp: new Date()
      }]);
    } catch (err) {
      setError(err.message || 'Failed to get AI response');
      setMessages(prev => [...prev, {
        type: 'error',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate analysis function
  const generateAnalysis = React.useCallback(async () => {
    if (!testResults || testResults.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const currentFA = { states, transitions, startState };
      const fullProblemStatement = `
Problem: ${problemTitle}

Description: ${problemStatement}

Alphabet: {${problemAlphabet.join(', ')}}

Examples:
${problemExamples.map(ex => 
  `Input: "${ex.input || '(empty)'}" → Expected: ${ex.expected ? 'ACCEPT' : 'REJECT'} (${ex.output})`
).join('\n')}
      `.trim();
      
      const analysis = await geminiService.getAnalysis(fullProblemStatement, currentFA, testResults);
      
      // Set welcome message + analysis
      setMessages([
        {
          type: 'ai',
          text: `Great job submitting! 👏 Here's my analysis of your FA:`,
          timestamp: new Date()
        },
        {
          type: 'ai',
          text: analysis,
          timestamp: new Date(),
          isAnalysis: true
        },
        {
          type: 'ai',
          text: `You can now ask me questions about how to improve your FA, what went wrong, or get guidance on fixing issues. I'll only answer questions about this current problem.`,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error('Error generating analysis:', err);
      setError('Failed to generate analysis');
    } finally {
      setIsLoading(false);
    }
  }, [problemTitle, problemStatement, problemExamples, problemAlphabet, states, transitions, startState, testResults]);

  // Track if analysis has been generated
  const analysisGeneratedRef = useRef(false);
  
  // Reset analysis flag when problem changes
  useEffect(() => {
    if (!hasSubmitted) {
      analysisGeneratedRef.current = false;
    }
  }, [hasSubmitted]);

  // Get analysis after submission
  useEffect(() => {
    if (hasSubmitted && testResults && testResults.length > 0 && isOpen && !analysisGeneratedRef.current) {
      analysisGeneratedRef.current = true;
      // Clear previous messages and show analysis
      setMessages([]);
      setTimeout(() => {
        generateAnalysis();
      }, 500);
    }
  }, [hasSubmitted, testResults, isOpen, generateAnalysis]);


  // Welcome message based on submission state (only if no messages and not generating analysis)
  useEffect(() => {
    if (isOpen && messages.length === 0 && !isLoading && !hasSubmitted) {
      // Only show welcome if not submitted (submission will trigger analysis)
      setMessages([{
        type: 'ai',
        text: `👋 Hi! I'm your FA tutor. Click "Get Hint" below to receive hints as you build your automaton. After you submit, we can chat about improvements!`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div 
          className="ai-helper-panel"
          style={{
            bottom: `${testPanelHeight}px`,
            transition: 'bottom 0.3s ease-out'
          }}
        >
          <div className="ai-helper-header">
            <div className="ai-helper-title">
              <span className="ai-icon-large">
                <HiSparkles size={24} />
              </span>
              <div>
                <h3>AI Tutor</h3>
                <small className="ai-subtitle">Your friendly FA guide</small>
              </div>
            </div>
            <button 
              className="close-button"
              onClick={onClose}
              aria-label="Close AI Helper"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l8 8M12 4l-8 8"/>
              </svg>
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type}`}>
                <div className="message-content">
                  {msg.type === 'ai' && (
                    <span className="message-avatar">
                      <HiSparkles size={20} />
                    </span>
                  )}
                  {msg.type === 'user' && (
                    <span className="message-avatar user">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                  )}
                  <div className="message-text">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message ai">
                <div className="message-content">
                  <span className="message-avatar">
                    <HiSparkles size={20} />
                  </span>
                  <div className="message-text">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="ai-error-banner">
              <span className="error-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </span>
              <span>{error}</span>
            </div>
          )}

          {/* Before submission: Show Get Hint button */}
          {!hasSubmitted && (
            <div className="ai-hint-section">
              <button 
                className="get-hint-button"
                onClick={getHint}
                disabled={isLoading || states.size === 0}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-small"></span>
                    Getting hint...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.15-3 5.19V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.81C7.21 13.15 6 11.22 6 9a6 6 0 0 1 6-6z"/>
                      <path d="M12 9v3"/>
                    </svg>
                    Get Hint
                  </>
                )}
              </button>
              {states.size === 0 && (
                <p className="hint-info">Start building your FA to get hints!</p>
              )}
            </div>
          )}

          {/* After submission: Show chat input */}
          {hasSubmitted && (
            <div className="ai-chat-input">
              <form onSubmit={handleSend}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about improvements, what went wrong, or how to fix issues..."
                  disabled={isLoading}
                  className="chat-input-field"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="chat-send-button"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            </div>
          )}

          <div className="ai-helper-footer">
            <small>
              <HiSparkles size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
              Powered by Google Gemini AI
            </small>
          </div>
        </div>
      )}
    </>
  );
};

export default AIHelper;
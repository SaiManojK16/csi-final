import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getProblemById } from '../data/problemsData';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
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
import QuizResults from '../components/QuizResults';
import './QuizPage.css';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const quiz = getProblemById(quizId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit * 60 || 600); // seconds
  const [submitted, setSubmitted] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const profileRef = useRef(null);
  const questionScrollRef = useRef(null);

  // Auto-scroll to current question
  useEffect(() => {
    if (questionScrollRef.current) {
      questionScrollRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [currentQuestion]);

  // Reset state when quizId or location changes
  useEffect(() => {
    if (!quizId) return;
    
    setCurrentQuestion(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeLeft(quiz?.timeLimit * 60 || 600);
    setSubmitted(false);
    setSubmitDialogOpen(false);
    setShowResults(false);
    setQuizScore(null);
    
    // Force scroll to top when quiz changes
    window.scrollTo(0, 0);
  }, [quizId, location.key, quiz]);

  // Timer
  useEffect(() => {
    if (submitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

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

  if (!quiz || !quiz.questions) {
    return (
      <div className="quiz-page">
        <div className="error-container">
          <h2>Quiz Not Found</h2>
          <button onClick={() => navigate('/problems')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionIdx, answerIdx) => {
    setAnswers({ ...answers, [questionIdx]: answerIdx });
  };

  const toggleFlag = (questionIdx) => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(questionIdx)) {
      newFlagged.delete(questionIdx);
    } else {
      newFlagged.add(questionIdx);
    }
    setFlagged(newFlagged);
  };

  const handleSubmitClick = () => {
    // Show confirmation dialog
    setSubmitDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitted(true);
    setSubmitDialogOpen(false);
    
    // Calculate results
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const timeTaken = (quiz.timeLimit * 60) - timeLeft;

    // Submit to backend
    try {
      const answerIndices = quiz.questions.map((_, idx) => answers[idx] ?? -1);
      const response = await apiService.updateQuizProgress(quizId, {
        score: score,
        answers: answerIndices,
        totalQuestions: quiz.questions.length
      });

      if (response.success) {
        // Refresh user data in context
        const updatedUser = await apiService.getCurrentUser();
        if (updatedUser.success && updatedUser.user) {
          localStorage.setItem('acceptly_user', JSON.stringify(updatedUser.user));
          window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser.user }));
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Continue to show results even if API call fails
    }

    // Show results
    setQuizScore({
      score,
      correct,
      total: quiz.questions.length,
      timeTaken
    });
    setShowResults(true);
  };

  // Auto-submit when time runs out
  const handleSubmitQuiz = () => {
    if (timeLeft <= 1 && !submitted) {
      handleConfirmSubmit();
    }
  };

  const question = quiz.questions[currentQuestion];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = Object.keys(answers).length / quiz.questions.length * 100;

  return (
    <div className="quiz-page" key={`quiz-page-${quizId}-${location.key || ''}`}>
      {/* Quiz Container */}
      <div className="quiz-container">
        {/* Question Panel - Left (70%) */}
        <div className="quiz-question-panel">
          <div className="quiz-panel-header">
            <button 
              className="quiz-back-btn"
              onClick={() => navigate('/problems')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <div className="quiz-header-info">
              <span className="quiz-title-badge">{quiz.title}</span>
              <span className="quiz-count">{Object.keys(answers).length} / {quiz.questions.length} answered</span>
            </div>
          </div>

          <div className="quiz-questions-scroll">
            {quiz.questions.map((q, qIdx) => (
              <div 
                key={qIdx} 
                className={`quiz-question-item ${qIdx === currentQuestion ? 'active' : ''}`}
                ref={qIdx === currentQuestion ? questionScrollRef : null}
              >
                <div className="quiz-question-item-header">
                  <span className="quiz-question-item-number">Question {qIdx + 1}</span>
                  <button
                    className={`quiz-btn-flag-small ${flagged.has(qIdx) ? 'flagged' : ''}`}
                    onClick={() => toggleFlag(qIdx)}
                    title={flagged.has(qIdx) ? 'Remove flag' : 'Flag for review'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={flagged.has(qIdx) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                      <line x1="4" y1="22" x2="4" y2="15"/>
                    </svg>
                  </button>
                </div>

                <p className="quiz-question-text">{q.question}</p>

                <div className="quiz-options-list">
                  {q.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`quiz-option-item ${answers[qIdx] === idx ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(qIdx, idx)}
                    >
                      <div className="quiz-option-radio">
                        {answers[qIdx] === idx && <div className="radio-selected" />}
                      </div>
                      <span className="quiz-option-text">{option}</span>
                    </div>
                  ))}
                </div>

                {answers[qIdx] !== undefined && (
                  <button
                    className="quiz-btn-clear-small"
                    onClick={() => {
                      const newAnswers = { ...answers };
                      delete newAnswers[qIdx];
                      setAnswers(newAnswers);
                    }}
                  >
                    Clear Answer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Question Tracker - Right (30%) */}
        <div className="quiz-tracker-panel">
          {/* Timer Section */}
          <div className="quiz-timer-section">
            <div className="quiz-timer-display-large">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div className="quiz-timer-time">
                <span className="quiz-timer-minutes">{minutes}</span>
                <span className="quiz-timer-separator">:</span>
                <span className="quiz-timer-seconds">{seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="quiz-analytics-section">
            <h4 className="quiz-analytics-title">Progress</h4>
            <div className="quiz-analytics-grid">
              <div className="quiz-analytics-item">
                <div className="quiz-analytics-value">{Object.keys(answers).length}</div>
                <div className="quiz-analytics-label">Answered</div>
              </div>
              <div className="quiz-analytics-item">
                <div className="quiz-analytics-value">{quiz.questions.length - Object.keys(answers).length}</div>
                <div className="quiz-analytics-label">Unanswered</div>
              </div>
              <div className="quiz-analytics-item">
                <div className="quiz-analytics-value">{flagged.size}</div>
                <div className="quiz-analytics-label">Flagged</div>
              </div>
            </div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Question Tracker Grid */}
          <div className="quiz-tracker-section">
            <h4 className="quiz-tracker-title">Questions</h4>
            <div className="quiz-tracker-grid">
              {quiz.questions.map((_, idx) => (
                <button
                  key={idx}
                  className={`quiz-tracker-item 
                    ${idx === currentQuestion ? 'current' : ''}
                    ${answers[idx] !== undefined ? 'answered' : ''}
                    ${flagged.has(idx) ? 'flagged' : ''}
                  `}
                  onClick={() => setCurrentQuestion(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="quiz-submit-section">
            <button onClick={handleSubmitClick} className="quiz-btn-submit-full">
              Submit Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen} variant="warning">
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
          <AlertDialogDescription>
            {Object.keys(answers).length < quiz.questions.length ? (
              <>
                You have <strong>{quiz.questions.length - Object.keys(answers).length} unanswered question{quiz.questions.length - Object.keys(answers).length !== 1 ? 's' : ''}</strong>.
                Are you sure you want to submit? You won't be able to change your answers after submission.
              </>
            ) : (
              <>
                You've answered all {quiz.questions.length} questions. Ready to submit your quiz?
                You won't be able to change your answers after submission.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setSubmitDialogOpen(false)}>
            Review Answers
          </AlertDialogCancel>
          <AlertDialogAction variant="primary" onClick={handleConfirmSubmit}>
            Submit Quiz
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      {/* Quiz Results Modal */}
      {showResults && quizScore && (
        <QuizResults
          quiz={quiz}
          quizScore={quizScore}
          answers={answers}
          onClose={() => {
            setShowResults(false);
            navigate('/problems');
          }}
          onRetake={() => {
            setShowResults(false);
            setSubmitted(false);
            setAnswers({});
            setFlagged(new Set());
            setCurrentQuestion(0);
            setTimeLeft(quiz.timeLimit * 60);
            setQuizScore(null);
          }}
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

export default QuizPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizResults.css';

const QuizResults = ({ quiz, quizScore, answers, onClose, onRetake }) => {
  const navigate = useNavigate();
  const [detailedResults, setDetailedResults] = useState([]);
  const [topicAnalysis, setTopicAnalysis] = useState({});
  const [difficultyBreakdown, setDifficultyBreakdown] = useState({});
  const [conceptAnalysis, setConceptAnalysis] = useState([]);

  useEffect(() => {
    // Calculate detailed results
    const results = quiz.questions.map((q, idx) => {
      const userAnswer = answers[idx];
      const isCorrect = userAnswer === q.correctAnswer;
      return {
        question: q,
        questionNumber: idx + 1,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        topic: q.topic || 'General',
        difficulty: q.difficulty || quiz.difficulty || 'Medium'
      };
    });
    setDetailedResults(results);

    // Analyze by topic
    const topics = {};
    results.forEach(r => {
      const topic = r.topic;
      if (!topics[topic]) {
        topics[topic] = { total: 0, correct: 0 };
      }
      topics[topic].total++;
      if (r.isCorrect) topics[topic].correct++;
    });
    setTopicAnalysis(topics);

    // Analyze by difficulty
    const difficulties = {};
    results.forEach(r => {
      const diff = r.difficulty;
      if (!difficulties[diff]) {
        difficulties[diff] = { total: 0, correct: 0 };
      }
      difficulties[diff].total++;
      if (r.isCorrect) difficulties[diff].correct++;
    });
    setDifficultyBreakdown(difficulties);

    // Identify weak concepts
    const weakConcepts = Object.entries(topics)
      .filter(([_, stats]) => stats.correct / stats.total < 0.7)
      .map(([topic, stats]) => ({
        topic,
        accuracy: Math.round((stats.correct / stats.total) * 100),
        correct: stats.correct,
        total: stats.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
    setConceptAnalysis(weakConcepts);
  }, [quiz, answers]);

  const getTopicAccuracy = (topic) => {
    const stats = topicAnalysis[topic];
    return stats ? Math.round((stats.correct / stats.total) * 100) : 0;
  };

  const getDifficultyAccuracy = (difficulty) => {
    const stats = difficultyBreakdown[difficulty];
    return stats ? Math.round((stats.correct / stats.total) * 100) : 0;
  };

  return (
    <div className="quiz-results-overlay">
      <div className="quiz-results-container">
        <div className="quiz-results-header">
          <h2>Quiz Results</h2>
          <button className="quiz-results-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Score Summary */}
        <div className="quiz-results-summary">
          <div className="quiz-score-display">
            <div className="quiz-score-circle">
              <svg className="quiz-score-ring" viewBox="0 0 120 120">
                <circle
                  className="quiz-score-ring-bg"
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  className="quiz-score-ring-fill"
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={quizScore.score >= 70 ? '#22c55e' : quizScore.score >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - quizScore.score / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="quiz-score-text">
                <span className="quiz-score-value">{quizScore.score}</span>
                <span className="quiz-score-label">%</span>
              </div>
            </div>
            <div className="quiz-score-details">
              <div className="quiz-score-stat">
                <span className="quiz-score-stat-label">Correct</span>
                <span className="quiz-score-stat-value">{quizScore.correct}/{quizScore.total}</span>
              </div>
              <div className="quiz-score-stat">
                <span className="quiz-score-stat-label">Time</span>
                <span className="quiz-score-stat-value">
                  {Math.floor(quizScore.timeTaken / 60)}:{(quizScore.timeTaken % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="quiz-score-stat">
                <span className="quiz-score-stat-label">Accuracy</span>
                <span className="quiz-score-stat-value">{quizScore.score}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Performance */}
        {Object.keys(topicAnalysis).length > 0 && (
          <div className="quiz-results-section">
            <h3>Performance by Topic</h3>
            <div className="quiz-topic-grid">
              {Object.keys(topicAnalysis).map(topic => {
                const accuracy = getTopicAccuracy(topic);
                const stats = topicAnalysis[topic];
                return (
                  <div key={topic} className="quiz-topic-card">
                    <div className="quiz-topic-header">
                      <span className="quiz-topic-name">{topic}</span>
                      <span className={`quiz-topic-badge ${accuracy >= 70 ? 'good' : accuracy >= 50 ? 'medium' : 'poor'}`}>
                        {accuracy}%
                      </span>
                    </div>
                    <div className="quiz-topic-progress">
                      <div className="quiz-topic-progress-bar">
                        <div 
                          className={`quiz-topic-progress-fill ${accuracy >= 70 ? 'good' : accuracy >= 50 ? 'medium' : 'poor'}`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                    <div className="quiz-topic-stats">
                      {stats.correct} of {stats.total} correct
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Difficulty Breakdown */}
        {Object.keys(difficultyBreakdown).length > 0 && (
          <div className="quiz-results-section">
            <h3>Performance by Difficulty</h3>
            <div className="quiz-difficulty-grid">
              {['Easy', 'Medium', 'Hard'].map(difficulty => {
                if (!difficultyBreakdown[difficulty]) return null;
                const accuracy = getDifficultyAccuracy(difficulty);
                const stats = difficultyBreakdown[difficulty];
                return (
                  <div key={difficulty} className="quiz-difficulty-card">
                    <div className="quiz-difficulty-header">
                      <span className="quiz-difficulty-name">{difficulty}</span>
                      <span className={`quiz-difficulty-badge ${difficulty.toLowerCase()}`}>
                        {accuracy}%
                      </span>
                    </div>
                    <div className="quiz-difficulty-progress">
                      <div className="quiz-difficulty-progress-bar">
                        <div 
                          className={`quiz-difficulty-progress-fill ${difficulty.toLowerCase()}`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                    <div className="quiz-difficulty-stats">
                      {stats.correct} of {stats.total} correct
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Weak Concepts */}
        {conceptAnalysis.length > 0 && (
          <div className="quiz-results-section">
            <h3>Areas for Improvement</h3>
            <div className="quiz-weak-concepts">
              {conceptAnalysis.map(concept => (
                <div key={concept.topic} className="quiz-weak-concept-item">
                  <div className="quiz-weak-concept-info">
                    <span className="quiz-weak-concept-name">{concept.topic}</span>
                    <span className="quiz-weak-concept-accuracy">{concept.accuracy}% accuracy</span>
                  </div>
                  <div className="quiz-weak-concept-progress">
                    <div className="quiz-weak-concept-progress-bar">
                      <div 
                        className="quiz-weak-concept-progress-fill"
                        style={{ width: `${concept.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Review */}
        <div className="quiz-results-section">
          <h3>Question Review</h3>
          <div className="quiz-question-review">
            {detailedResults.map((result, idx) => (
              <div key={idx} className={`quiz-review-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="quiz-review-header">
                  <div className="quiz-review-number">
                    Question {result.questionNumber}
                    {result.isCorrect ? (
                      <span className="quiz-review-icon correct">✓</span>
                    ) : (
                      <span className="quiz-review-icon incorrect">✗</span>
                    )}
                  </div>
                  <div className="quiz-review-meta">
                    <span className="quiz-review-topic">{result.topic}</span>
                    <span className={`quiz-review-difficulty ${result.difficulty.toLowerCase()}`}>
                      {result.difficulty}
                    </span>
                  </div>
                </div>
                <div className="quiz-review-question">
                  {result.question.question}
                </div>
                <div className="quiz-review-answers">
                  <div className={`quiz-review-answer ${result.userAnswer === result.correctAnswer ? 'correct' : 'incorrect'}`}>
                    <span className="quiz-review-answer-label">Your Answer:</span>
                    <span className="quiz-review-answer-text">
                      {result.userAnswer !== undefined 
                        ? result.question.options[result.userAnswer] 
                        : 'Not answered'}
                    </span>
                  </div>
                  {!result.isCorrect && (
                    <div className="quiz-review-answer correct">
                      <span className="quiz-review-answer-label">Correct Answer:</span>
                      <span className="quiz-review-answer-text">
                        {result.question.options[result.correctAnswer]}
                      </span>
                    </div>
                  )}
                </div>
                {result.question.explanation && (
                  <div className="quiz-review-explanation">
                    <strong>Explanation:</strong> {result.question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="quiz-results-actions">
          <button className="quiz-results-btn secondary" onClick={onClose}>
            Back to Problems
          </button>
          <button className="quiz-results-btn primary" onClick={onRetake}>
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;


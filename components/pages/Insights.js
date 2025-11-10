import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import geminiService from '../services/geminiService';
import AIHelper from '../components/AIHelper';
import { faProblems, mcqQuizzes } from '../data/problemsData';
import './Insights.css';

const Insights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recommendations, setRecommendations] = useState({ retake: [], next: [] });
  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);
  const [weakConcepts, setWeakConcepts] = useState([]);
  const [strongConcepts, setStrongConcepts] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [activeConceptTab, setActiveConceptTab] = useState(null); // Selected concept for improvement tips
  const [activeActionTab, setActiveActionTab] = useState('retake'); // 'retake' or 'next'
  const [conceptImprovements, setConceptImprovements] = useState({}); // Store improvement tips per concept

  useEffect(() => {
    fetchInsights();
  }, [user]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // Get all progress data
      const progressResponse = await apiService.getProgress();
      if (progressResponse.success && progressResponse.progress) {
        const progress = progressResponse.progress;
        
        // Update user in localStorage if needed
        if (user) {
          const updatedUser = { ...user, progress: progress };
          localStorage.setItem('acceptly_user', JSON.stringify(updatedUser));
        }
        
        // Calculate overall statistics
        const stats = calculateStats(progress);
        setOverallStats(stats);

        // Identify weak and strong concepts
        const { weak, strong } = analyzeConcepts(progress);
        setWeakConcepts(weak);
        setStrongConcepts(strong);

        // Generate charts data
        const chartData = generateChartData(progress);
        setCharts(chartData);

        // Get AI insights
        const aiInsights = await geminiService.getInsights(progress);
        setInsights(aiInsights);

        // Get recommendations
        const recs = await geminiService.getRecommendations(progress, weak);
        
        // Ensure we always have recommendation arrays
        const finalRecs = {
          retake: (recs.retake && Array.isArray(recs.retake)) ? recs.retake : [],
          next: (recs.next && Array.isArray(recs.next)) ? recs.next : []
        };
        
        // If no recommendations, get initial recommendations
        if (finalRecs.retake.length === 0 && finalRecs.next.length === 0) {
          const initialRecs = geminiService.getInitialRecommendations();
          setRecommendations(initialRecs);
        } else {
          setRecommendations(finalRecs);
        }

        // Set first concept as active if available
        if (weak.length > 0) {
          setActiveConceptTab(weak[0].concept);
          await getConceptImprovement(weak[0].concept);
        }
      } else {
        // If no progress data, set defaults
        setOverallStats({
          faSolved: 0,
          faTotal: 0,
          faAvgScore: 0,
          quizTotal: 0,
          quizAvgScore: 0,
          totalSubmissions: 0
        });
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      setOverallStats({
        faSolved: 0,
        faTotal: 0,
        faAvgScore: 0,
        quizTotal: 0,
        quizAvgScore: 0,
        totalSubmissions: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (progress) => {
    // Backend structure: progress.faSimulation.problems[] and progress.mcqs.quizzes[]
    const faProblemsProgress = progress.faSimulation?.problems || [];
    const quizProgress = progress.mcqs?.quizzes || [];

    // Get solved/completed items
    const solvedFAProblems = faProblemsProgress.filter(p => p.status === 'solved');
    const completedQuizzes = quizProgress.filter(q => q.status === 'completed');
    
    // Get attempted items (submitted at least once)
    const attemptedFAProblems = faProblemsProgress.filter(p => (p.attempts || 0) > 0);
    const attemptedQuizzes = quizProgress.filter(q => (q.attempts || 0) > 0);

    // Calculate FA stats
    const faSolved = solvedFAProblems.length;
    const faAttempted = attemptedFAProblems.length;
    const faTotal = faProblemsProgress.length;
    const faAvgScore = faProblemsProgress.length > 0
      ? Math.round(faProblemsProgress.reduce((sum, p) => sum + (p.bestScore || 0), 0) / faProblemsProgress.length)
      : 0;

    // Calculate Quiz stats
    const quizCompleted = completedQuizzes.length;
    const quizAttempted = attemptedQuizzes.length;
    const quizAvgScore = quizProgress.length > 0
      ? Math.round(quizProgress.reduce((sum, q) => sum + (q.bestScore || 0), 0) / quizProgress.length)
      : 0;

    // Calculate total submissions (sum of all attempts)
    const faSubmissions = faProblemsProgress.reduce((sum, p) => sum + (p.attempts || 0), 0);
    const quizSubmissions = quizProgress.reduce((sum, q) => sum + (q.attempts || 0), 0);
    const totalSubmissions = faSubmissions + quizSubmissions;
    
    // Calculate overall performance
    const overallAvgScore = (faAvgScore + quizAvgScore) / 2 || 0;

    return {
      faSolved,
      faAttempted,
      faTotal,
      faAvgScore,
      quizCompleted,
      quizAttempted,
      quizAvgScore,
      totalSubmissions,
      faSubmissions,
      quizSubmissions,
      overallAvgScore
    };
  };

  const analyzeConcepts = (progress) => {
    const conceptStats = {};
    
    // Backend structure: progress.faSimulation.problems[] and progress.mcqs.quizzes[]
    const faProblemsProgress = progress.faSimulation?.problems || [];
    const quizProgress = progress.mcqs?.quizzes || [];
    
    // Analyze FA problems
    faProblemsProgress.forEach(problemProgress => {
      const problem = faProblems.find(p => p.id === problemProgress.problemId);
      if (problem) {
        // Extract topic/type from problem
        const topic = problem.type || 'DFA';
        if (!conceptStats[topic]) {
          conceptStats[topic] = { total: 0, correct: 0, score: 0 };
        }
        conceptStats[topic].total++;
        if (problemProgress.status === 'solved') {
          conceptStats[topic].correct++;
        }
        conceptStats[topic].score += problemProgress.bestScore || 0;
      }
    });

    // Analyze quizzes
    quizProgress.forEach(quizProgressItem => {
      const quiz = mcqQuizzes.find(q => q.id === quizProgressItem.quizId);
      if (quiz) {
        // Extract topic from quiz
        const topic = quiz.topic || 'General';
        if (!conceptStats[topic]) {
          conceptStats[topic] = { total: 0, correct: 0, score: 0 };
        }
        conceptStats[topic].total++;
        if (quizProgressItem.status === 'completed' || (quizProgressItem.bestScore || 0) >= 70) {
          conceptStats[topic].correct++;
        }
        conceptStats[topic].score += quizProgressItem.bestScore || 0;
      }
    });

    // Calculate accuracy for each concept
    const concepts = Object.entries(conceptStats).map(([concept, stats]) => ({
      concept,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      avgScore: stats.total > 0 ? Math.round(stats.score / stats.total) : 0,
      total: stats.total
    }));

    const weak = concepts
      .filter(c => c.accuracy < 70 && c.total > 0)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    const strong = concepts
      .filter(c => c.accuracy >= 70 && c.total > 0)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5);

    return { weak, strong };
  };

  const generateChartData = (progress) => {
    // Backend structure: progress.faSimulation.problems[] and progress.mcqs.quizzes[]
    const faProblemsProgress = progress.faSimulation?.problems || [];
    const quizProgress = progress.mcqs?.quizzes || [];

    // Get solved/completed IDs
    const solvedFAIds = faProblemsProgress.filter(p => p.status === 'solved').map(p => p.problemId);
    const completedQuizIds = quizProgress.filter(q => q.status === 'completed').map(q => q.quizId);

    // Analyze entire question bank
    const faStatsByDifficulty = {
      Easy: { total: 0, solved: 0, attempted: 0, avgScore: 0, scores: [] },
      Medium: { total: 0, solved: 0, attempted: 0, avgScore: 0, scores: [] },
      Hard: { total: 0, solved: 0, attempted: 0, avgScore: 0, scores: [] }
    };

    const quizStatsByDifficulty = {
      Easy: { total: 0, solved: 0, attempted: 0, avgScore: 0, scores: [] },
      Medium: { total: 0, solved: 0, attempted: 0, avgScore: 0, scores: [] },
      Hard: { total: 0, solved: 0, attempted: 0, avgScore: 0, scores: [] }
    };

    // Analyze all FA problems from question bank
    faProblems.forEach(problem => {
      const diff = problem.difficulty || 'Easy';
      faStatsByDifficulty[diff].total++;
      
      const progress = faProblemsProgress.find(p => p.problemId === problem.id);
      if (progress) {
        faStatsByDifficulty[diff].attempted++;
        if (progress.status === 'solved') {
          faStatsByDifficulty[diff].solved++;
        }
        if (progress.bestScore) {
          faStatsByDifficulty[diff].scores.push(progress.bestScore);
        }
      }
    });

    // Analyze all Quizzes from question bank
    mcqQuizzes.forEach(quiz => {
      const diff = quiz.difficulty || 'Easy';
      quizStatsByDifficulty[diff].total++;
      
      const progress = quizProgress.find(q => q.quizId === quiz.id);
      if (progress) {
        quizStatsByDifficulty[diff].attempted++;
        if (progress.status === 'completed') {
          quizStatsByDifficulty[diff].solved++;
        }
        if (progress.bestScore) {
          quizStatsByDifficulty[diff].scores.push(progress.bestScore);
        }
      }
    });

    // Calculate average scores
    Object.keys(faStatsByDifficulty).forEach(diff => {
      const stats = faStatsByDifficulty[diff];
      if (stats.scores.length > 0) {
        stats.avgScore = Math.round(stats.scores.reduce((sum, s) => sum + s, 0) / stats.scores.length);
      }
    });

    Object.keys(quizStatsByDifficulty).forEach(diff => {
      const stats = quizStatsByDifficulty[diff];
      if (stats.scores.length > 0) {
        stats.avgScore = Math.round(stats.scores.reduce((sum, s) => sum + s, 0) / stats.scores.length);
      }
    });

    // Concept performance
    const conceptPerformance = {};
    
    faProblemsProgress.forEach(problemProgress => {
      const problem = faProblems.find(p => p.id === problemProgress.problemId);
      if (problem) {
        const topic = problem.type || 'DFA';
        if (!conceptPerformance[topic]) {
          conceptPerformance[topic] = { scores: [], count: 0, solved: 0, attempted: 0 };
        }
        conceptPerformance[topic].attempted++;
        if (problemProgress.status === 'solved') {
          conceptPerformance[topic].solved++;
        }
        conceptPerformance[topic].scores.push(problemProgress.bestScore || 0);
        conceptPerformance[topic].count++;
      }
    });

    quizProgress.forEach(quizProgressItem => {
      const quiz = mcqQuizzes.find(q => q.id === quizProgressItem.quizId);
      if (quiz) {
        const topic = quiz.topic || 'General';
        if (!conceptPerformance[topic]) {
          conceptPerformance[topic] = { scores: [], count: 0, solved: 0, attempted: 0 };
        }
        conceptPerformance[topic].attempted++;
        if (quizProgressItem.status === 'completed') {
          conceptPerformance[topic].solved++;
        }
        conceptPerformance[topic].scores.push(quizProgressItem.bestScore || 0);
        conceptPerformance[topic].count++;
      }
    });

    const conceptData = Object.entries(conceptPerformance)
      .filter(([_, data]) => data.scores.length > 0)
      .map(([concept, data]) => ({
        concept,
        avgScore: Math.round(data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length),
        count: data.count,
        solved: data.solved,
        attempted: data.attempted,
        accuracy: data.attempted > 0 ? Math.round((data.solved / data.attempted) * 100) : 0
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    // Performance over time
    const allSubmissions = [
      ...faProblemsProgress.map(p => ({
        date: p.lastAttempt || new Date().toISOString(),
        score: p.bestScore || 0,
        type: 'FA',
        difficulty: faProblems.find(prob => prob.id === p.problemId)?.difficulty || 'Easy'
      })),
      ...quizProgress.map(q => ({
        date: q.lastAttempt || new Date().toISOString(),
        score: q.bestScore || 0,
        type: 'Quiz',
        difficulty: mcqQuizzes.find(quiz => quiz.id === q.quizId)?.difficulty || 'Easy'
      }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      timeline: allSubmissions,
      concepts: conceptData,
      faStatsByDifficulty,
      quizStatsByDifficulty,
      totalFAProblems: faProblems.length,
      totalQuizzes: mcqQuizzes.length
    };
  };

  // Get improvement tips for a specific concept
  const getConceptImprovement = async (concept) => {
    if (conceptImprovements[concept]) {
      return conceptImprovements[concept];
    }

    try {
      const progress = user?.progress || {};
      const improvement = await geminiService.getConceptImprovement(concept, progress);
      setConceptImprovements(prev => ({
        ...prev,
        [concept]: improvement
      }));
      return improvement;
    } catch (error) {
      console.error('Error fetching concept improvement:', error);
      return null;
    }
  };

  // Handle concept tab click
  const handleConceptTabClick = async (concept) => {
    setActiveConceptTab(concept);
    await getConceptImprovement(concept);
  };

  // Get problem/quiz title from recommendation
  const getProblemTitle = (recTitle) => {
    // Try to extract ID (e.g., "fa-002" or "mcq-001")
    const faMatch = recTitle.match(/fa-(\d+)/i);
    const quizMatch = recTitle.match(/mcq-(\d+)/i);
    
    if (faMatch) {
      const problem = faProblems.find(p => p.id === `fa-${faMatch[1].padStart(3, '0')}`);
      return problem ? problem.title : recTitle;
    }
    
    if (quizMatch) {
      const quiz = mcqQuizzes.find(q => q.id === `mcq-${quizMatch[1].padStart(3, '0')}`);
      return quiz ? quiz.title : recTitle;
    }
    
    return recTitle;
  };

  // Get problem/quiz ID and type from recommendation
  const getProblemInfo = (recTitle) => {
    const faMatch = recTitle.match(/fa-(\d+)/i);
    const quizMatch = recTitle.match(/mcq-(\d+)/i);
    
    if (faMatch) {
      const id = `fa-${faMatch[1].padStart(3, '0')}`;
      return { id, type: 'fa' };
    }
    
    if (quizMatch) {
      const id = `mcq-${quizMatch[1].padStart(3, '0')}`;
      return { id, type: 'quiz' };
    }
    
    return null;
  };

  // Handle navigation to problem/quiz
  const handleNavigateToProblem = (recTitle) => {
    const info = getProblemInfo(recTitle);
    if (info) {
      navigate(`/practice/${info.type}/${info.id}`);
    }
  };

  // Format improvement text with markdown-like styling
  const formatImprovementText = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let currentList = [];
    let inList = false;
    let listType = 'ul'; // 'ul' or 'ol'

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        if (inList && currentList.length > 0) {
          elements.push(
            <ul key={`list-${idx}`} className="improvement-list">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
          currentList = [];
          inList = false;
        }
        return;
      }

      // Check for bold text **text** or *text*
      const boldRegex = /\*\*(.*?)\*\*/g;
      const italicRegex = /\*(.*?)\*/g;
      
      // Headers (## or **)
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        if (inList && currentList.length > 0) {
          elements.push(
            <ul key={`list-${idx}`} className="improvement-list">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
          currentList = [];
          inList = false;
        }
        const headerText = trimmed.replace(/\*\*/g, '');
        elements.push(
          <h3 key={idx} className="improvement-header">{headerText}</h3>
        );
      }
      // Numbered list items (1. or a. or b. etc.)
      else if (/^[0-9]+\./.test(trimmed) || /^[a-z]\)/.test(trimmed)) {
        if (inList && listType !== 'ol') {
          elements.push(
            <ul key={`list-${idx}`} className="improvement-list">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
          currentList = [];
        }
        inList = true;
        listType = 'ol';
        const listText = trimmed.replace(/^[0-9]+\.\s*/, '').replace(/^[a-z]\)\s*/, '');
        currentList.push(formatInlineText(listText));
      }
      // Bullet points (- or *)
      else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        if (inList && listType !== 'ul') {
          elements.push(
            <ol key={`list-${idx}`} className="improvement-list">
              {currentList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          );
          currentList = [];
        }
        inList = true;
        listType = 'ul';
        const listText = trimmed.replace(/^[-*]\s*/, '');
        currentList.push(formatInlineText(listText));
      }
      // Regular paragraph
      else {
        if (inList && currentList.length > 0) {
          const ListComponent = listType === 'ol' ? 'ol' : 'ul';
          elements.push(
            React.createElement(ListComponent, { key: `list-${idx}`, className: 'improvement-list' },
              currentList.map((item, i) => React.createElement('li', { key: i }, item))
            )
          );
          currentList = [];
          inList = false;
        }
        elements.push(
          <p key={idx} className="improvement-paragraph">
            {formatInlineText(trimmed)}
          </p>
        );
      }
    });

    // Close any remaining list
    if (inList && currentList.length > 0) {
      const ListComponent = listType === 'ol' ? 'ol' : 'ul';
      elements.push(
        React.createElement(ListComponent, { key: 'list-final', className: 'improvement-list' },
          currentList.map((item, i) => React.createElement('li', { key: i }, item))
        )
      );
    }

    return elements;
  };

  // Format inline text (bold, italic)
  const formatInlineText = (text) => {
    const parts = [];
    let lastIndex = 0;
    let key = 0;

    // Process bold **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let boldMatches = [];
    
    while ((match = boldRegex.exec(text)) !== null) {
      boldMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1]
      });
    }

    // Process italic *text* (not already bold)
    const italicRegex = /\*(.*?)\*/g;
    let italicMatches = [];
    
    while ((match = italicRegex.exec(text)) !== null) {
      // Check if this match is not part of a bold match
      const isPartOfBold = boldMatches.some(bm => 
        match.index >= bm.start && match.index + match[0].length <= bm.end
      );
      if (!isPartOfBold) {
        italicMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[1]
        });
      }
    }

    // Combine and sort all matches
    const allMatches = [
      ...boldMatches.map(m => ({ ...m, type: 'bold' })),
      ...italicMatches.map(m => ({ ...m, type: 'italic' }))
    ].sort((a, b) => a.start - b.start);

    // Build parts array
    allMatches.forEach(match => {
      // Add text before match
      if (match.start > lastIndex) {
        parts.push(text.substring(lastIndex, match.start));
      }
      
      // Add formatted match
      if (match.type === 'bold') {
        parts.push(<strong key={key++}>{match.text}</strong>);
      } else {
        parts.push(<em key={key++}>{match.text}</em>);
      }
      
      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  if (loading) {
    return (
      <div className="insights-page">
        <div className="insights-loading">
          <div className="insights-spinner"></div>
          <p>Analyzing your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-page">
      <div className="insights-container">
        {/* Header */}
        <div className="insights-header">
          <h1>Insights & Analytics</h1>
        </div>

        {/* Two Column Layout */}
        <div className="insights-main-layout">
          {/* Left Column - Wider */}
          <div className="insights-left-column">
            {/* Summary Cards */}
            {overallStats && (
              <div className="summary-cards-row">
                <div className="summary-card activity-card">
                  <div className="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v6m0 6v6m8-8h-6m-6 0H4"/>
                    </svg>
                    <span>Activity</span>
                  </div>
                  <div className="activity-streak">
                    <span className="streak-number">{overallStats.totalSubmissions}</span>
                    <span className="streak-label">total submissions</span>
                  </div>
                  <div className="activity-breakdown">
                    <span className="breakdown-item">FA: {overallStats.faSubmissions}</span>
                    <span className="breakdown-item">Quiz: {overallStats.quizSubmissions}</span>
                  </div>
                </div>

                <div className="summary-card progress-card">
                  <div className="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    <span>Progress</span>
                  </div>
                  <div className="progress-stats">
                    <div className="progress-item">
                      <span className="progress-label">FA Problems</span>
                      <span className="progress-value-large">{overallStats.faAttempted || 0}</span>
                    </div>
                    <div className="progress-item">
                      <span className="progress-label">Quizzes</span>
                      <span className="progress-value-large">{overallStats.quizAttempted || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="summary-card level-card">
                  <div className="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span>Performance</span>
                  </div>
                  <div className="level-display">
                    <span className="level-value">{Math.round(overallStats.overallAvgScore || 0)}%</span>
                  </div>
                  <div className="level-subtext">Overall Average</div>
                </div>
              </div>
            )}

            {/* Overall AI Insights */}
            {insights && (
              <div className="overall-insights-section">
                <div className="section-header-simple">
                  <h2>Your Performance Overview</h2>
                </div>
                
                {insights.overallAnalysis && (
                  <div className="overall-analysis">
                    <p>{insights.overallAnalysis}</p>
                  </div>
                )}

                <div className="insights-grid">
                  {insights.strengths && insights.strengths.length > 0 && (
                    <div className="insight-card strengths">
                      <div className="insight-card-header">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <h3>Strengths</h3>
                      </div>
                      <ul className="insight-list">
                        {insights.strengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insights.weaknesses && insights.weaknesses.length > 0 && (
                    <div className="insight-card weaknesses">
                      <div className="insight-card-header">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <h3>Weaknesses</h3>
                      </div>
                      <ul className="insight-list">
                        {insights.weaknesses.map((weakness, idx) => (
                          <li key={idx}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insights.whatToFocusOn && insights.whatToFocusOn.length > 0 && (
                    <div className="insight-card focus">
                      <div className="insight-card-header">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <h3>What to Focus On</h3>
                      </div>
                      <ul className="insight-list">
                        {insights.whatToFocusOn.map((focus, idx) => (
                          <li key={idx}>{focus}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Insights Section with Concept Tabs */}
            <div className="ai-insights-section">
              <div className="ai-insights-header">
                <div className="ai-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <div className="ai-insights-title-group">
                  <h2>AI Insights</h2>
                  <p>How to improve specific concepts</p>
                </div>
              </div>

              {/* Concept Tabs */}
              {weakConcepts.length > 0 && (
                <div className="concept-tabs">
                  {weakConcepts.map((concept, idx) => (
                    <button
                      key={idx}
                      className={`concept-tab ${activeConceptTab === concept.concept ? 'active' : ''}`}
                      onClick={() => handleConceptTabClick(concept.concept)}
                    >
                      <span className="concept-name">{concept.concept}</span>
                      <span className="concept-accuracy">{concept.accuracy}%</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Improvement Tips */}
              {activeConceptTab && conceptImprovements[activeConceptTab] && (
                <div className="improvement-content">
                  <div className="improvement-text">
                    {formatImprovementText(conceptImprovements[activeConceptTab])}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Recommended Actions */}
          <div className="insights-right-column">
            <div className="right-column-header">
              <h2>Recommended Actions</h2>
            </div>

            {/* Action Tabs */}
            <div className="action-tabs">
              <button
                className={`action-tab ${activeActionTab === 'retake' ? 'active' : ''}`}
                onClick={() => setActiveActionTab('retake')}
              >
                Retake
              </button>
              <button
                className={`action-tab ${activeActionTab === 'next' ? 'active' : ''}`}
                onClick={() => setActiveActionTab('next')}
              >
                Try Next
              </button>
            </div>

            <div className="recommended-actions">
              {activeActionTab === 'retake' && (
                <>
                  {recommendations.retake && recommendations.retake.length > 0 ? (
                    recommendations.retake.map((rec, idx) => (
                      <div key={idx} className="action-card urgent">
                        <div className="action-card-header">
                          <h3>{getProblemTitle(rec.title)}</h3>
                          <span className="action-badge not-started">Retake</span>
                        </div>
                        <p className="action-description">{rec.reason}</p>
                        <div className="action-footer">
                          <button 
                            className="action-btn primary"
                            onClick={() => handleNavigateToProblem(rec.title)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                            Retake Now
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No problems to retake at the moment. Keep practicing!</p>
                    </div>
                  )}
                </>
              )}

              {activeActionTab === 'next' && (
                <>
                  {recommendations.next && recommendations.next.length > 0 ? (
                    recommendations.next.map((rec, idx) => (
                      <div key={idx} className="action-card">
                        <div className="action-card-header">
                          <h3>{getProblemTitle(rec.title)}</h3>
                          <span className="action-badge in-progress">New</span>
                        </div>
                        <p className="action-description">{rec.reason}</p>
                        <div className="action-footer">
                          <button 
                            className="action-btn secondary"
                            onClick={() => handleNavigateToProblem(rec.title)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                            Start Now
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No new problems recommended at the moment.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <button 
        className="ai-chat-fab"
        onClick={() => setIsAIHelperOpen(!isAIHelperOpen)}
        title="AI Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <path d="M13 8H7M17 12H7"/>
        </svg>
      </button>

      {/* AI Helper */}
      <AIHelper
        problemStatement=""
        problemTitle="Insights & Analytics"
        problemExamples={[]}
        problemAlphabet={[]}
        states={new Map()}
        transitions={[]}
        startState={null}
        testResults={[]}
        isOpen={isAIHelperOpen}
        onClose={() => setIsAIHelperOpen(false)}
        hasSubmitted={true}
        testPanelHeight={0}
      />
    </div>
  );
};

export default Insights;

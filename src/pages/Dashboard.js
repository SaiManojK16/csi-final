import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import './Dashboard.css';
import { faProblems, mcqQuizzes } from '../data/problemsData';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'solved', 'attempted'
  const [difficultyFilter, setDifficultyFilter] = useState({ easy: false, medium: false, hard: false });
  const [showTags, setShowTags] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sort states
  const [sortColumn, setSortColumn] = useState('lastSubmitted');
  const [sortDirection, setSortDirection] = useState('desc');

  // Graph states
  const [graphTab, setGraphTab] = useState('solved'); // 'solved' or 'submissions'
  const [graphPeriod, setGraphPeriod] = useState('D'); // 'D', 'W', 'M'
  const [graphDate, setGraphDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Expanded rows
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch progress from backend on mount and when user changes
  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        try {
          const response = await apiService.getProgress();
          if (response.success) {
            // Update user in localStorage and trigger context update
            const updatedUser = { ...user, progress: response.progress };
            localStorage.setItem('acceptly_user', JSON.stringify(updatedUser));
            window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      }
    };
    fetchProgress();
  }, [user]);

  // Calculate statistics from backend structure
  const calculateStats = () => {
    const progress = user?.progress || {};
    
    // Backend structure: progress.faSimulation.problems[] and progress.mcqs.quizzes[]
    const faProblemsProgress = progress.faSimulation?.problems || [];
    const quizProgress = progress.mcqs?.quizzes || [];
    
    // Get solved/completed items
    const solvedFAProblems = faProblemsProgress.filter(p => p.status === 'solved');
    const completedQuizzes = quizProgress.filter(q => q.status === 'completed');
    
    // Total solved (FA + Quizzes)
    const totalSolved = solvedFAProblems.length + completedQuizzes.length;
    
    // Get IDs for difficulty counting
    const solvedFAIds = solvedFAProblems.map(p => p.problemId);
    const completedQuizIds = completedQuizzes.map(q => q.quizId);
    
    // Count by difficulty - FA problems
    const solvedFAEasy = faProblems.filter(p => p.difficulty === 'Easy' && solvedFAIds.includes(p.id)).length;
    const solvedFAMedium = faProblems.filter(p => p.difficulty === 'Medium' && solvedFAIds.includes(p.id)).length;
    const solvedFAHard = faProblems.filter(p => p.difficulty === 'Hard' && solvedFAIds.includes(p.id)).length;
    
    // Count by difficulty - Quizzes
    const completedQuizEasy = mcqQuizzes.filter(q => q.difficulty === 'Easy' && completedQuizIds.includes(q.id)).length;
    const completedQuizMedium = mcqQuizzes.filter(q => q.difficulty === 'Medium' && completedQuizIds.includes(q.id)).length;
    const completedQuizHard = mcqQuizzes.filter(q => q.difficulty === 'Hard' && completedQuizIds.includes(q.id)).length;
    
    // Combine counts
    const solvedEasy = solvedFAEasy + completedQuizEasy;
    const solvedMedium = solvedFAMedium + completedQuizMedium;
    const solvedHard = solvedFAHard + completedQuizHard;
    
    // Total available
    const totalFA = faProblems.length;
    const totalQuizzes = mcqQuizzes.length;
    const totalItems = totalFA + totalQuizzes;
    
    const totalEasy = faProblems.filter(p => p.difficulty === 'Easy').length + 
                      mcqQuizzes.filter(q => q.difficulty === 'Easy').length;
    const totalMedium = faProblems.filter(p => p.difficulty === 'Medium').length + 
                        mcqQuizzes.filter(q => q.difficulty === 'Medium').length;
    const totalHard = faProblems.filter(p => p.difficulty === 'Hard').length + 
                      mcqQuizzes.filter(q => q.difficulty === 'Hard').length;

    // Calculate total submissions (sum of all attempts from both FA and quizzes)
    const faSubmissions = faProblemsProgress.reduce((sum, p) => sum + (p.attempts || 0), 0);
    const quizSubmissions = quizProgress.reduce((sum, q) => sum + (q.attempts || 0), 0);
    const totalSubmissions = faSubmissions + quizSubmissions;
    
    // Calculate acceptance rate: (solved + completed) / total submissions
    const acceptanceRate = totalSubmissions > 0 
      ? Math.round((totalSolved / totalSubmissions) * 100) 
      : 0;
    
    // Beats percentage: solved / total available items
    const beatsPercentage = totalItems > 0 
      ? Math.min(Math.round((totalSolved / totalItems) * 100), 100) 
      : 0;

    return {
      totalSolved,
      totalFA: totalItems, // Total items (FA + Quizzes)
      beatsPercentage,
      easy: { solved: solvedEasy, total: totalEasy },
      medium: { solved: solvedMedium, total: totalMedium },
      hard: { solved: solvedHard, total: totalHard },
      submissions: totalSubmissions,
      acceptance: acceptanceRate
    };
  };

  const stats = calculateStats();

  // Get practice history from backend structure
  const getPracticeHistory = () => {
    const progress = user?.progress || {};
    const faProblemsProgress = progress.faSimulation?.problems || [];
    const quizProgress = progress.mcqs?.quizzes || [];
    
    const historyMap = new Map();
    
    // Process FA problem submissions from backend structure
    faProblemsProgress.forEach(problemProgress => {
      const problem = faProblems.find(p => p.id === problemProgress.problemId);
      if (problem) {
        const key = problemProgress.problemId;
        const isSolved = problemProgress.status === 'solved';
        const lastAttempt = problemProgress.lastAttempt ? new Date(problemProgress.lastAttempt) : new Date();
        const bestScore = problemProgress.bestScore || 0;
        
        // Determine result based on status and score
        let lastResult = 'Wrong Answer';
        if (isSolved) {
          lastResult = 'Accepted';
        } else if (problemProgress.status === 'attempted' && bestScore > 0) {
          lastResult = `${bestScore}% Passed`;
        } else if (problemProgress.status === 'attempted') {
          lastResult = 'Wrong Answer';
        }
        
        // Ensure attempts is at least 1 if the item exists in progress
        const attempts = Math.max(problemProgress.attempts || 0, problemProgress.status !== 'unsolved' ? 1 : 0);
        
        historyMap.set(key, {
          problemId: problemProgress.problemId,
          problemName: problem.title,
          difficulty: problem.difficulty,
          itemType: 'fa',
          lastSubmitted: lastAttempt,
          lastResult: lastResult,
          submissions: Array(attempts).fill(null).map((_, idx) => ({
            date: lastAttempt,
            result: isSolved && idx === (attempts - 1) ? 'Accepted' : 
                    (bestScore > 0 && idx === (attempts - 1) ? `${bestScore}% Passed` : 'Wrong Answer'),
            language: 'FA',
            runtime: 'N/A',
            memory: 'N/A'
          })),
          isSolved: isSolved,
          attempts: attempts
        });
      }
    });

    // Process quiz submissions from backend structure
    quizProgress.forEach(quizProgressItem => {
      const quizData = mcqQuizzes.find(q => q.id === quizProgressItem.quizId);
      if (quizData) {
        const key = `quiz-${quizProgressItem.quizId}`;
        const isCompleted = quizProgressItem.status === 'completed';
        const lastAttempt = quizProgressItem.lastAttempt ? new Date(quizProgressItem.lastAttempt) : new Date();
        const bestScore = quizProgressItem.bestScore || 0;
        
        // Determine result based on status and score
        let lastResult = 'Wrong Answer';
        if (isCompleted) {
          lastResult = 'Accepted';
        } else if (quizProgressItem.status === 'attempted' && bestScore >= 70) {
          // If score is 70%+ but status is still 'attempted', show as passed
          lastResult = `${bestScore}% Passed`;
        } else if (quizProgressItem.status === 'attempted' && bestScore > 0) {
          lastResult = `${bestScore}% Passed`;
        }
        
        // Ensure attempts is at least 1 if the item exists in progress
        const attempts = Math.max(quizProgressItem.attempts || 0, quizProgressItem.status !== 'not_started' ? 1 : 0);
        
        historyMap.set(key, {
          problemId: quizProgressItem.quizId,
          problemName: quizData.title,
          difficulty: quizData.difficulty || 'Easy',
          itemType: 'quiz',
          lastSubmitted: lastAttempt,
          lastResult: lastResult,
          submissions: Array(attempts).fill(null).map((_, idx) => ({
            date: lastAttempt,
            result: isCompleted && idx === (attempts - 1) ? 'Accepted' : 
                    (bestScore > 0 && idx === (attempts - 1) ? `${bestScore}% Passed` : 'Wrong Answer'),
            language: 'Quiz',
            runtime: 'N/A',
            memory: 'N/A'
          })),
          isSolved: isCompleted,
          attempts: attempts
        });
      }
    });

    // Convert to array and sort
    let history = Array.from(historyMap.values());

    // Apply filters
    if (statusFilter === 'solved') {
      history = history.filter(h => h.isSolved);
    } else if (statusFilter === 'attempted') {
      history = history.filter(h => !h.isSolved);
    }

    if (difficultyFilter.easy || difficultyFilter.medium || difficultyFilter.hard) {
      history = history.filter(h => {
        if (difficultyFilter.easy && h.difficulty === 'Easy') return true;
        if (difficultyFilter.medium && h.difficulty === 'Medium') return true;
        if (difficultyFilter.hard && h.difficulty === 'Hard') return true;
        return false;
      });
    }

    // Sort
    history.sort((a, b) => {
      let aVal, bVal;
      switch (sortColumn) {
        case 'lastSubmitted':
          aVal = new Date(a.lastSubmitted).getTime();
          bVal = new Date(b.lastSubmitted).getTime();
          break;
        case 'problem':
          aVal = a.problemName.toLowerCase();
          bVal = b.problemName.toLowerCase();
          break;
        case 'lastResult':
          aVal = a.lastResult;
          bVal = b.lastResult;
          break;
        case 'submissions':
          aVal = a.submissions.length;
          bVal = b.submissions.length;
          break;
        default:
          return 0;
      }
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return history;
  };

  // Calculate graph data based on practice history
  const getGraphData = () => {
    const history = getPracticeHistory();
    let dataPoints = [];
    
    // Determine date range based on period
    let startDate, endDate, interval;
    const [year, month] = graphDate.split('-').map(Number);
    
    if (graphPeriod === 'D') {
      // Daily: Show data for the selected month, grouped by day
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
      interval = 'day';
    } else if (graphPeriod === 'W') {
      // Weekly: Show data for the selected month, grouped by week
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
      interval = 'week';
    } else {
      // Monthly: Show data for the year, grouped by month
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
      interval = 'month';
    }
    
    // Initialize data points
    if (interval === 'day') {
      const daysInMonth = endDate.getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        dataPoints.push({ date: new Date(year, month - 1, i), value: 0, label: `${month}.${i.toString().padStart(2, '0')}` });
      }
    } else if (interval === 'week') {
      const weeks = Math.ceil(endDate.getDate() / 7);
      for (let i = 0; i < weeks; i++) {
        const weekStart = new Date(year, month - 1, i * 7 + 1);
        dataPoints.push({ date: weekStart, value: 0, label: `Week ${i + 1}` });
      }
    } else {
      for (let i = 0; i < 12; i++) {
        dataPoints.push({ date: new Date(year, i, 1), value: 0, label: `${i + 1}` });
      }
    }
    
    // Aggregate data from history
    history.forEach(item => {
      const itemDate = new Date(item.lastSubmitted);
      if (itemDate < startDate || itemDate > endDate) return;
      
      let pointIndex = -1;
      if (interval === 'day') {
        pointIndex = itemDate.getDate() - 1;
      } else if (interval === 'week') {
        pointIndex = Math.floor((itemDate.getDate() - 1) / 7);
      } else {
        pointIndex = itemDate.getMonth();
      }
      
      if (pointIndex >= 0 && pointIndex < dataPoints.length) {
        if (graphTab === 'solved' && item.isSolved) {
          dataPoints[pointIndex].value += 1;
        } else if (graphTab === 'submissions') {
          dataPoints[pointIndex].value += item.attempts || 1;
        }
      }
    });
    
    return dataPoints;
  };

  const graphData = getGraphData();
  const maxValue = Math.max(...graphData.map(d => d.value), 1);
  const yAxisLabels = [];
  if (maxValue <= 5) {
    yAxisLabels.push(0, Math.ceil(maxValue / 2), maxValue);
  } else if (maxValue <= 10) {
    yAxisLabels.push(0, 5, 10);
  } else {
    const step = Math.ceil(maxValue / 5);
    for (let i = 0; i <= 5; i++) {
      yAxisLabels.push(i * step);
    }
  }

  // Generate date options dynamically
  const generateDateOptions = () => {
    const options = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Generate options for current year (last 3 months)
    for (let i = 0; i < 3; i++) {
      const month = currentMonth - i;
      if (month > 0) {
        options.push(`${currentYear}-${String(month).padStart(2, '0')}`);
      } else {
        const prevYear = currentYear - 1;
        const prevMonth = 12 + month;
        options.push(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);
      }
    }
    
    return options.reverse();
  };

  const dateOptions = generateDateOptions();

  const practiceHistory = getPracticeHistory();

  // Format relative time
  const formatRelativeTime = (date) => {
    const now = new Date();
    const time = new Date(date);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[time.getDay()];
    }
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format date for submission details
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
  };

  // Handle sort
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (problemId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(problemId)) {
      newExpanded.delete(problemId);
    } else {
      newExpanded.add(problemId);
    }
    setExpandedRows(newExpanded);
  };

  // Reset filters
  const resetFilters = () => {
    setStatusFilter('all');
    setDifficultyFilter({ easy: false, medium: false, hard: false });
    setShowTags(false);
  };

  // Pagination - reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, difficultyFilter, sortColumn, sortDirection]);

  const totalPages = Math.ceil(practiceHistory.length / itemsPerPage);
  const paginatedHistory = practiceHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="leetcode-dashboard">
      <div className="dashboard-container">
        {/* Left Column - Practice History */}
        <div className="practice-history-panel">
          <div className="panel-header">
            <h2>Practice History</h2>
            <div className="header-actions">
              <button 
                className="filter-btn" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                title="Filter"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Popup */}
          {isFilterOpen && (
            <div className="filter-popup-overlay" onClick={() => setIsFilterOpen(false)}>
              <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
                <div className="filter-section">
                  <div className="filter-label">Status</div>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="status"
                        value="all"
                        checked={statusFilter === 'all'}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      />
                      <span>All</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="status"
                        value="solved"
                        checked={statusFilter === 'solved'}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      />
                      <span>Solved</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="status"
                        value="attempted"
                        checked={statusFilter === 'attempted'}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      />
                      <span>Attempted</span>
                    </label>
                  </div>
                </div>

                <div className="filter-section">
                  <div className="filter-label">Difficulty</div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={difficultyFilter.easy}
                        onChange={(e) => setDifficultyFilter({ ...difficultyFilter, easy: e.target.checked })}
                      />
                      <span>Easy</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={difficultyFilter.medium}
                        onChange={(e) => setDifficultyFilter({ ...difficultyFilter, medium: e.target.checked })}
                      />
                      <span>Med.</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={difficultyFilter.hard}
                        onChange={(e) => setDifficultyFilter({ ...difficultyFilter, hard: e.target.checked })}
                      />
                      <span>Hard</span>
                    </label>
                  </div>
                </div>

                <div className="filter-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={showTags}
                      onChange={(e) => setShowTags(e.target.checked)}
                    />
                    <span>Show tags</span>
                  </label>
                </div>

                <div className="filter-actions">
                  <button className="reset-btn" onClick={resetFilters}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v4h4M8 14V10H4M2 8h4M10 8h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('lastSubmitted')}>
                    Last Submitted
                    <button className="sort-btn">
                      {sortColumn === 'lastSubmitted' ? (
                        sortDirection === 'asc' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        )
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15"/>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      )}
                    </button>
                  </th>
                  <th onClick={() => handleSort('problem')}>
                    Problem
                    <button className="sort-btn">
                      {sortColumn === 'problem' ? (
                        sortDirection === 'asc' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        )
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15"/>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      )}
                    </button>
                  </th>
                  <th onClick={() => handleSort('lastResult')}>
                    Last Result
                    <button className="sort-btn">
                      {sortColumn === 'lastResult' ? (
                        sortDirection === 'asc' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        )
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15"/>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      )}
                    </button>
                  </th>
                  <th onClick={() => handleSort('submissions')}>
                    Submissions
                    <button className="sort-btn">
                      {sortColumn === 'submissions' ? (
                        sortDirection === 'asc' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        )
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15"/>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.length > 0 ? (
                  paginatedHistory.map((item, index) => (
                    <React.Fragment key={item.problemId}>
                      <tr 
                        className="history-row"
                        onClick={() => navigate(item.itemType === 'fa' ? `/practice/fa/${item.problemId}` : `/practice/quiz/${item.problemId}`)}
                      >
                        <td className="date-cell">{formatRelativeTime(item.lastSubmitted)}</td>
                        <td className="problem-cell">
                          <div className="problem-info">
                            <span className="problem-number">{item.problemId.split('-')[1] || index + 1}.</span>
                            <span className="problem-title">{item.problemName}</span>
                            {item.itemType === 'quiz' && (
                              <span className="item-type-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14 2 14 8 20 8"/>
                                  <line x1="16" y1="13" x2="8" y2="13"/>
                                  <line x1="16" y1="17" x2="8" y2="17"/>
                                  <polyline points="10 9 9 9 8 9"/>
                                </svg>
                                Quiz
                              </span>
                            )}
                          </div>
                          <div className={`difficulty-badge-small ${item.difficulty.toLowerCase()}`}>
                            {item.difficulty}
                          </div>
                        </td>
                        <td>
                          <span className={`result-badge ${item.lastResult.toLowerCase().replace(' ', '-')}`}>
                            {item.lastResult}
                          </span>
                        </td>
                        <td className="submissions-cell">
                          <span className="submission-count">{item.submissions.length}</span>
                          {item.submissions.length > 0 && (
                            <button
                              className="expand-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(item.problemId);
                              }}
                            >
                              {expandedRows.has(item.problemId) ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="18 15 12 9 6 15"/>
                                </svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="6 9 12 15 18 9"/>
                                </svg>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedRows.has(item.problemId) && item.submissions.length > 0 && (
                        <tr className="detail-row">
                          <td colSpan="4">
                            <table className="submission-details-table">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Result</th>
                                  <th>Language</th>
                                  <th>Runtime</th>
                                  <th>Memory</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.submissions.map((sub, idx) => (
                                  <tr key={idx}>
                                    <td>{formatDate(sub.date)}</td>
                                    <td>
                                      <span className={`result-badge ${sub.result.toLowerCase().replace(' ', '-')}`}>
                                        {sub.result}
                                      </span>
                                    </td>
                                    <td>{sub.language}</td>
                                    <td>
                                      {sub.runtime === 'N/A' ? (
                                        <span className="na-value">
                                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                            <path d="M8 5v6M8 5h3M8 11H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                          </svg>
                                          N/A
                                        </span>
                                      ) : (
                                        sub.runtime
                                      )}
                                    </td>
                                    <td>
                                      {sub.memory === 'N/A' ? (
                                        <span className="na-value">
                                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                            <rect x="2" y="5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                            <path d="M6 9h4M7 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                          </svg>
                                          N/A
                                        </span>
                                      ) : (
                                        sub.memory
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <div className="empty-content">
                        <p className="empty-text">No practice history found</p>
                        <button 
                          className="practice-btn"
                          onClick={() => navigate('/problems')}
                        >
                          Practice
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn prev"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                title="Previous"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              
              <div className="page-numbers">
                {currentPage > 3 && totalPages > 5 && (
                  <>
                    <button
                      className="page-number"
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                    {currentPage > 4 && <span className="page-ellipsis">...</span>}
                  </>
                )}
                
                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    className={`page-number ${pageNum === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                
                {currentPage < totalPages - 2 && totalPages > 5 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="page-ellipsis">...</span>}
                    <button
                      className="page-number"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                className="page-btn next"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                title="Next"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="summary-panel">
          <div className="panel-header">
            <h2>Summary</h2>
          </div>

          {/* Total Solved Card */}
          <div className="summary-card">
            <div className="card-label">Total Solved</div>
            <div className="card-value-large">
              <span className="value-number solved-blue">{stats.totalSolved}</span>
              <span className="value-label">Problems</span>
            </div>
            <div className="beats-percentage">
              Beats {stats.beatsPercentage}%
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '4px', display: 'inline-block' }}>
                <path d="M8 2l2 4h4l-3 3 1 4-4-3-4 3 1-4-3-3h4l2-4z" fill="currentColor"/>
              </svg>
            </div>
            <div className="difficulty-breakdown">
              <button 
                className={`diff-item easy ${difficultyFilter.easy ? 'active' : ''}`}
                onClick={() => setDifficultyFilter({ ...difficultyFilter, easy: !difficultyFilter.easy })}
              >
                <span className="diff-label">Easy</span>
                <span className="diff-count">{stats.easy.solved}</span>
              </button>
              <button 
                className={`diff-item medium ${difficultyFilter.medium ? 'active' : ''}`}
                onClick={() => setDifficultyFilter({ ...difficultyFilter, medium: !difficultyFilter.medium })}
              >
                <span className="diff-label">Med.</span>
                <span className="diff-count">{stats.medium.solved}</span>
              </button>
              <button 
                className={`diff-item hard ${difficultyFilter.hard ? 'active' : ''}`}
                onClick={() => setDifficultyFilter({ ...difficultyFilter, hard: !difficultyFilter.hard })}
              >
                <span className="diff-label">Hard</span>
                <span className="diff-count">{stats.hard.solved}</span>
              </button>
            </div>
          </div>

          {/* Submissions and Acceptance Cards - Side by Side */}
          <div className="summary-cards-row">
            <div className="summary-card">
              <div className="card-label">Submissions</div>
              <div className="card-value submissions-purple">{stats.submissions}</div>
            </div>

            <div className="summary-card">
              <div className="card-label">Acceptance</div>
              <div className="card-value acceptance-green">{stats.acceptance}%</div>
            </div>
          </div>

          {/* Solved / Submissions Graph Card */}
          <div className="summary-card graph-card">
            <div className="graph-header">
              <div className="graph-tabs">
                <button 
                  className={`graph-tab ${graphTab === 'solved' ? 'active' : ''}`}
                  onClick={() => setGraphTab('solved')}
                >
                  Solved
                </button>
                <button 
                  className={`graph-tab ${graphTab === 'submissions' ? 'active' : ''}`}
                  onClick={() => setGraphTab('submissions')}
                >
                  Submissions
                </button>
              </div>
              <div className="graph-controls">
                <select 
                  className="period-select"
                  value={graphPeriod}
                  onChange={(e) => setGraphPeriod(e.target.value)}
                >
                  <option value="D">D</option>
                  <option value="W">W</option>
                  <option value="M">M</option>
                </select>
                <select 
                  className="date-select"
                  value={graphDate}
                  onChange={(e) => setGraphDate(e.target.value)}
                >
                  {dateOptions.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="graph-content">
              {graphData.length > 0 ? (
                <>
                  <div className="graph-bars-container">
                    {graphData.map((point, index) => {
                      const height = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
                      return (
                        <div key={index} className="graph-bar-wrapper">
                          <div 
                            className={`graph-bar ${graphTab === 'solved' ? 'solved-bar' : 'submissions-bar'}`}
                            style={{ height: `${Math.max(height, 0)}%` }}
                            title={`${point.label}: ${point.value}`}
                          >
                            {point.value > 0 && (
                              <span className="graph-bar-value">{point.value}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="graph-axis">
                    {graphData.length > 0 && (
                      <>
                        <span className="axis-label">{graphData[0].label}</span>
                        {graphData.length > 1 && (
                          <span className="axis-label">{graphData[graphData.length - 1].label}</span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="graph-y-axis">
                    {yAxisLabels.map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-data-message">
                  <p>No data available</p>
                </div>
              )}
            </div>
            <div className="difficulty-breakdown">
              <div className="diff-item easy">
                <span className="diff-label">Easy</span>
                <span className="diff-count">{stats.easy.solved}</span>
              </div>
              <div className="diff-item medium">
                <span className="diff-label">Med.</span>
                <span className="diff-count">{stats.medium.solved}</span>
              </div>
              <div className="diff-item hard">
                <span className="diff-label">Hard</span>
                <span className="diff-count">{stats.hard.solved}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

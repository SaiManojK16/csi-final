import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { faProblems, mcqQuizzes } from '../data/problemsData';
import './ProblemSelection.css';

const ProblemSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all'); // 'all', 'fa', 'quiz', 'saved'
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('custom'); // 'custom', 'difficulty', 'acceptance', 'id', 'title'
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'solved', 'unsolved', 'attempted'
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // 'all', 'Easy', 'Medium', 'Hard'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'fa', 'quiz'
  const [savedProblems, setSavedProblems] = useState(new Set()); // Set of problem IDs
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get topic counts for FA problems
  const getTopicCounts = () => {
    const dfaCount = faProblems.filter(p => p.type === 'DFA').length;
    const nfaCount = faProblems.filter(p => p.type === 'NFA').length;
    const regexCount = faProblems.filter(p => p.type === 'Regular Expression').length;
    
    return {
      'all': faProblems.length + mcqQuizzes.length,
      'dfa': dfaCount,
      'nfa': nfaCount,
      'regex': regexCount,
      'quiz': mcqQuizzes.length
    };
  };

  const topicCounts = getTopicCounts();

  // Get difficulty counts
  const getDifficultyCounts = () => {
    const items = selectedType === 'fa' ? faProblems : selectedType === 'quiz' ? mcqQuizzes : [...faProblems, ...mcqQuizzes];
    return {
      'easy': items.filter(item => item.difficulty === 'Easy').length,
      'medium': items.filter(item => item.difficulty === 'Medium').length,
      'hard': items.filter(item => item.difficulty === 'Hard').length
    };
  };

  const difficultyCounts = getDifficultyCounts();

  // Apply filters from filter dialog
  const applyDialogFilters = (items) => {
    let filtered = items;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        const status = getProblemStatus(item.id, item.itemType);
        if (statusFilter === 'solved') return status.isSolved;
        if (statusFilter === 'unsolved') return !status.isViewed && !status.isAttempted;
        if (statusFilter === 'attempted') return status.isAttempted && !status.isSolved;
        return true;
      });
    }

    // Apply difficulty filter from dialog
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(item => item.difficulty === difficultyFilter);
    }

    // Apply type filter from dialog
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.itemType === typeFilter);
    }

    return filtered;
  };

  // Load saved problems from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedProblems');
    if (saved) {
      try {
        setSavedProblems(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Error loading saved problems:', e);
      }
    }
  }, []);

  // Get user progress for solved/viewed status
  const getProblemStatus = (itemId, itemType) => {
    const progress = user?.progress || {};
    if (itemType === 'fa') {
      const problemProgress = progress.faSimulation?.problems?.find(p => p.problemId === itemId);
      if (problemProgress) {
        return {
          isSolved: problemProgress.status === 'solved',
          isViewed: problemProgress.status !== 'unsolved',
          isAttempted: problemProgress.status === 'attempted'
        };
      }
    } else {
      const quizProgress = progress.mcqs?.quizzes?.find(q => q.quizId === itemId);
      if (quizProgress) {
        return {
          isSolved: quizProgress.status === 'completed',
          isViewed: quizProgress.status !== 'not_started',
          isAttempted: quizProgress.status === 'attempted'
        };
      }
    }
    return { isSolved: false, isViewed: false, isAttempted: false };
  };

  // Toggle save/bookmark
  const toggleSave = (e, itemId) => {
    e.stopPropagation();
    const newSaved = new Set(savedProblems);
    if (newSaved.has(itemId)) {
      newSaved.delete(itemId);
    } else {
      newSaved.add(itemId);
    }
    setSavedProblems(newSaved);
    localStorage.setItem('savedProblems', JSON.stringify(Array.from(newSaved)));
  };

  // Filter problems and quizzes
  let filteredItems = [];
  
  if (selectedType === 'saved') {
    // Show only saved problems
    const allItems = [
      ...faProblems.map(p => ({ ...p, itemType: 'fa' })),
      ...mcqQuizzes.map(q => ({ ...q, itemType: 'quiz' }))
    ];
    filteredItems = allItems.filter(item => savedProblems.has(item.id));
  } else {
    if (selectedType === 'fa' || selectedType === 'all') {
      filteredItems.push(...faProblems.map(p => ({ ...p, itemType: 'fa' })));
    }
    
    if (selectedType === 'quiz' || selectedType === 'all') {
      filteredItems.push(...mcqQuizzes.map(q => ({ ...q, itemType: 'quiz' })));
    }
  }

  if (selectedDifficulty !== 'all') {
    filteredItems = filteredItems.filter(item => item.difficulty === selectedDifficulty);
  }

  if (selectedTopic !== 'all') {
    if (selectedTopic === 'dfa') {
      filteredItems = filteredItems.filter(item => item.type === 'DFA' || item.itemType === 'quiz');
    } else if (selectedTopic === 'nfa') {
      filteredItems = filteredItems.filter(item => item.type === 'NFA');
    } else if (selectedTopic === 'regex') {
      filteredItems = filteredItems.filter(item => item.type === 'Regular Expression');
    } else if (selectedTopic === 'quiz') {
      filteredItems = filteredItems.filter(item => item.itemType === 'quiz');
    }
  }

  // Apply dialog filters
  filteredItems = applyDialogFilters(filteredItems);

  if (searchQuery) {
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort items
  filteredItems = [...filteredItems].sort((a, b) => {
    switch(sortBy) {
      case 'difficulty':
        const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0);
      case 'acceptance':
        // Sort by acceptance rate (placeholder)
        return 0;
      case 'id':
        return a.id.localeCompare(b.id);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'custom':
      default:
        return 0; // Keep original order
    }
  });

  const calculateAcceptance = (problemId) => {
    // Simplified acceptance rate - you can replace this with actual data
    const baseRate = Math.floor(Math.random() * 40) + 50;
    return `${baseRate}.${Math.floor(Math.random() * 10)}%`;
  };

  const getSolvedCount = () => {
    const progress = user?.progress || {};
    const faSolved = progress.faSimulation?.problems?.filter(p => p.status === 'solved').length || 0;
    const quizCompleted = progress.mcqs?.quizzes?.filter(q => q.status === 'completed').length || 0;
    return faSolved + quizCompleted;
  };

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, selectedDifficulty, selectedTopic, searchQuery, sortBy, statusFilter, difficultyFilter, typeFilter]);

  // Generate page numbers
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsSortDropdownOpen(false);
    };
    if (isSortDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isSortDropdownOpen]);

  return (
    <div className="leetcode-problems-page">
      <div className="problems-layout">
        {/* Left Sidebar */}
        <div className="problems-sidebar">
          <div className="sidebar-section">
            <div 
              className={`sidebar-item ${selectedType === 'all' ? 'active' : ''}`} 
              onClick={() => { setSelectedType('all'); setSelectedTopic('all'); }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>All Problems</span>
            </div>
            <div 
              className={`sidebar-item ${selectedType === 'saved' ? 'active' : ''}`} 
              onClick={() => setSelectedType('saved')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2l2 4h4l-3 3 1 4-4-3-4 3 1-4-3-3h4l2-4z" stroke="currentColor" strokeWidth="2" fill={selectedType === 'saved' ? 'currentColor' : 'none'}/>
              </svg>
              <span>Saved {savedProblems.size > 0 && `(${savedProblems.size})`}</span>
            </div>
            <div 
              className={`sidebar-item ${selectedType === 'fa' ? 'active' : ''}`} 
              onClick={() => setSelectedType('fa')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>FA Simulation</span>
            </div>
            <div 
              className={`sidebar-item ${selectedType === 'quiz' ? 'active' : ''}`} 
              onClick={() => setSelectedType('quiz')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 7l8 5 8-5-8-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>Quizzes</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="problems-main">
          {/* Topic Filters */}
          <div className="topic-filters">
            <div className="topic-row">
              <span 
                className={`topic-item ${selectedTopic === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedTopic('all')}
              >
                All {topicCounts.all}
              </span>
              <span 
                className={`topic-item ${selectedTopic === 'dfa' ? 'active' : ''}`}
                onClick={() => setSelectedTopic('dfa')}
              >
                DFA {topicCounts.dfa}
              </span>
              <span 
                className={`topic-item ${selectedTopic === 'nfa' ? 'active' : ''}`}
                onClick={() => setSelectedTopic('nfa')}
              >
                NFA {topicCounts.nfa}
              </span>
              <span 
                className={`topic-item ${selectedTopic === 'regex' ? 'active' : ''}`}
                onClick={() => setSelectedTopic('regex')}
              >
                Regular Expression {topicCounts.regex}
              </span>
              <span 
                className={`topic-item ${selectedTopic === 'quiz' ? 'active' : ''}`}
                onClick={() => setSelectedTopic('quiz')}
              >
                Quizzes {topicCounts.quiz}
              </span>
            </div>
            <div className="topic-buttons">
              <button 
                className={`topic-btn ${selectedType === 'all' ? 'active' : ''}`} 
                onClick={() => setSelectedType('all')}
              >
                <span>All Types</span>
              </button>
              <button 
                className={`topic-btn ${selectedType === 'fa' ? 'active' : ''}`} 
                onClick={() => setSelectedType('fa')}
              >
                <span>FA Simulation</span>
              </button>
              <button 
                className={`topic-btn ${selectedType === 'quiz' ? 'active' : ''}`} 
                onClick={() => setSelectedType('quiz')}
              >
                <span>MCQ Quizzes</span>
              </button>
              <button 
                className={`topic-btn ${selectedDifficulty === 'Easy' ? 'active' : ''}`} 
                onClick={() => setSelectedDifficulty(selectedDifficulty === 'Easy' ? 'all' : 'Easy')}
              >
                <span>Easy ({difficultyCounts.easy})</span>
              </button>
              <button 
                className={`topic-btn ${selectedDifficulty === 'Medium' ? 'active' : ''}`} 
                onClick={() => setSelectedDifficulty(selectedDifficulty === 'Medium' ? 'all' : 'Medium')}
              >
                <span>Medium ({difficultyCounts.medium})</span>
              </button>
              <button 
                className={`topic-btn ${selectedDifficulty === 'Hard' ? 'active' : ''}`} 
                onClick={() => setSelectedDifficulty(selectedDifficulty === 'Hard' ? 'all' : 'Hard')}
              >
                <span>Hard ({difficultyCounts.hard})</span>
              </button>
            </div>
          </div>

          {/* Problem List Controls */}
          <div className="list-controls">
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="search-icon">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search questions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="control-actions">
              <div className="sort-filter-group">
                <div className="sort-container">
                  <button 
                    className="control-btn sort-btn" 
                    title="Sort"
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                  {isSortDropdownOpen && (
                    <div className="sort-dropdown" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className={`sort-option ${sortBy === 'custom' ? 'active' : ''}`}
                        onClick={() => { setSortBy('custom'); setIsSortDropdownOpen(false); }}
                      >
                        Custom {sortBy === 'custom' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                      <button 
                        className={`sort-option ${sortBy === 'difficulty' ? 'active' : ''}`}
                        onClick={() => { setSortBy('difficulty'); setIsSortDropdownOpen(false); }}
                      >
                        Difficulty {sortBy === 'difficulty' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                      <button 
                        className={`sort-option ${sortBy === 'acceptance' ? 'active' : ''}`}
                        onClick={() => { setSortBy('acceptance'); setIsSortDropdownOpen(false); }}
                      >
                        Acceptance {sortBy === 'acceptance' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                      <button 
                        className={`sort-option ${sortBy === 'id' ? 'active' : ''}`}
                        onClick={() => { setSortBy('id'); setIsSortDropdownOpen(false); }}
                      >
                        Question ID {sortBy === 'id' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                      <button 
                        className={`sort-option ${sortBy === 'title' ? 'active' : ''}`}
                        onClick={() => { setSortBy('title'); setIsSortDropdownOpen(false); }}
                      >
                        Title {sortBy === 'title' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  className="control-btn filter-btn" 
                  title="Filter"
                  onClick={() => setIsFilterDialogOpen(!isFilterDialogOpen)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="progress-info">
                <span>{getSolvedCount()}/{filteredItems.length} Solved</span>
                <button 
                  className="refresh-btn" 
                  onClick={() => {
                    setStatusFilter('all');
                    setDifficultyFilter('all');
                    setTypeFilter('all');
                    setSelectedType('all');
                    setSelectedDifficulty('all');
                    setSelectedTopic('all');
                    setSearchQuery('');
                    setSortBy('custom');
                  }}
                  title="Reset all filters"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M3 21v-5h5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Dialog */}
          {isFilterDialogOpen && (
            <div className="filter-dialog-overlay" onClick={() => setIsFilterDialogOpen(false)}>
              <div className="filter-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="filter-dialog-header">
                  <h3>Filter Problems</h3>
                  <button 
                    className="filter-close-btn"
                    onClick={() => setIsFilterDialogOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                
                <div className="filter-dialog-body">
                  {/* Status Filter */}
                  <div className="filter-section">
                    <div className="filter-section-title">Status</div>
                    <div className="filter-options">
                      <button
                        className={`filter-option ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                      >
                        All
                      </button>
                      <button
                        className={`filter-option ${statusFilter === 'solved' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('solved')}
                      >
                        Solved
                      </button>
                      <button
                        className={`filter-option ${statusFilter === 'unsolved' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('unsolved')}
                      >
                        Unsolved
                      </button>
                      <button
                        className={`filter-option ${statusFilter === 'attempted' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('attempted')}
                      >
                        Attempted
                      </button>
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div className="filter-section">
                    <div className="filter-section-title">Difficulty</div>
                    <div className="filter-options">
                      <button
                        className={`filter-option ${difficultyFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setDifficultyFilter('all')}
                      >
                        All
                      </button>
                      <button
                        className={`filter-option difficulty-easy ${difficultyFilter === 'Easy' ? 'active' : ''}`}
                        onClick={() => setDifficultyFilter('Easy')}
                      >
                        Easy
                      </button>
                      <button
                        className={`filter-option difficulty-medium ${difficultyFilter === 'Medium' ? 'active' : ''}`}
                        onClick={() => setDifficultyFilter('Medium')}
                      >
                        Medium
                      </button>
                      <button
                        className={`filter-option difficulty-hard ${difficultyFilter === 'Hard' ? 'active' : ''}`}
                        onClick={() => setDifficultyFilter('Hard')}
                      >
                        Hard
                      </button>
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div className="filter-section">
                    <div className="filter-section-title">Type</div>
                    <div className="filter-options">
                      <button
                        className={`filter-option ${typeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setTypeFilter('all')}
                      >
                        All
                      </button>
                      <button
                        className={`filter-option ${typeFilter === 'fa' ? 'active' : ''}`}
                        onClick={() => setTypeFilter('fa')}
                      >
                        FA Simulation
                      </button>
                      <button
                        className={`filter-option ${typeFilter === 'quiz' ? 'active' : ''}`}
                        onClick={() => setTypeFilter('quiz')}
                      >
                        MCQ Quiz
                      </button>
                    </div>
                  </div>
                </div>

                <div className="filter-dialog-footer">
                  <button 
                    className="filter-reset-btn"
                    onClick={() => {
                      setStatusFilter('all');
                      setDifficultyFilter('all');
                      setTypeFilter('all');
                    }}
                  >
                    Reset
                  </button>
                  <button 
                    className="filter-apply-btn"
                    onClick={() => setIsFilterDialogOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Problems Table */}
          <div className="problems-table-container">
            <table className="problems-table">
              <thead>
                <tr>
                  <th className="col-status">Status</th>
                  <th className="col-title">Title</th>
                  <th className="col-acceptance">Acceptance</th>
                  <th className="col-difficulty">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-problems">
                      <p>No problems found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, index) => {
                    const status = getProblemStatus(item.id, item.itemType);
                    const isSaved = savedProblems.has(item.id);
                    return (
                      <tr 
                        key={item.id} 
                        className={`problem-row ${status.isSolved ? 'solved' : ''} ${!status.isViewed ? 'unviewed' : ''}`}
                        onClick={() => navigate(item.itemType === 'fa' ? `/practice/fa/${item.id}` : `/practice/quiz/${item.id}`)}
                      >
                        <td className="status-cell">
                          {status.isSolved ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="status-icon solved-icon">
                              <circle cx="8" cy="8" r="6" fill="#28a745" stroke="#28a745" strokeWidth="1.5"/>
                              <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : status.isViewed ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="status-icon viewed-icon">
                              <circle cx="8" cy="8" r="6" stroke="#ffa116" strokeWidth="1.5" fill="#fff3cd"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="status-icon unviewed-icon">
                              <circle cx="8" cy="8" r="6" stroke="#e5e5e5" strokeWidth="1.5" fill="none"/>
                            </svg>
                          )}
                        </td>
                        <td className="title-cell">
                          <span className="problem-number">{(currentPage - 1) * itemsPerPage + index + 1}.</span>
                          <span className="problem-title">
                            {item.title}
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
                          </span>
                          <button
                            className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
                            onClick={(e) => toggleSave(e, item.id)}
                            title={isSaved ? 'Remove from saved' : 'Save problem'}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                              <path d="M8 2l2 4h4l-3 3 1 4-4-3-4 3 1-4-3-3h4l2-4z"/>
                            </svg>
                          </button>
                        </td>
                        <td className="acceptance-cell">
                          {item.itemType === 'fa' ? calculateAcceptance(item.id) : `${item.totalQuestions} Questions`}
                        </td>
                        <td className="difficulty-cell">
                          <span className={`difficulty-badge ${item.difficulty.toLowerCase()}`}>
                            {item.difficulty === 'Easy' ? 'Easy' : item.difficulty === 'Medium' ? 'Med.' : 'Hard'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="problems-pagination">
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
      </div>
    </div>
  );
};

export default ProblemSelection;

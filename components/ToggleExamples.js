import React, { useState } from 'react';
import {
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  useToggleState,
  useToggleGroup
} from './Toggle';

/**
 * FUNCTIONAL TOGGLE EXAMPLES FOR ACCEPTLY PROJECT
 * These are fully functional with state management
 */

// ============================================
// 1. PROBLEM DIFFICULTY FILTER (For ProblemSelection)
// ============================================

export const DifficultyFilter = ({ onFilterChange }) => {
  const { value, setValue } = useToggleGroup([], 'multiple');

  const handleChange = (newValue) => {
    setValue(newValue);
    onFilterChange?.(newValue);
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
        Difficulty
      </label>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={handleChange}
      >
        <ToggleGroupItem value="easy" color="success">
          🟢 Easy
        </ToggleGroupItem>
        <ToggleGroupItem value="medium" color="warning">
          🟡 Medium
        </ToggleGroupItem>
        <ToggleGroupItem value="hard" color="error">
          🔴 Hard
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

// Usage in ProblemSelection.js:
/*
const [difficultyFilters, setDifficultyFilters] = useState([]);

const filteredProblems = problems.filter(problem => {
  if (difficultyFilters.length === 0) return true;
  return difficultyFilters.includes(problem.difficulty.toLowerCase());
});

<DifficultyFilter onFilterChange={setDifficultyFilters} />
*/

// ============================================
// 2. PROBLEM TYPE FILTER (For ProblemSelection)
// ============================================

export const ProblemTypeFilter = ({ onFilterChange }) => {
  const { value, setValue } = useToggleGroup([], 'multiple');

  const handleChange = (newValue) => {
    setValue(newValue);
    onFilterChange?.(newValue);
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
        Problem Type
      </label>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={handleChange}
        separated
      >
        <ToggleGroupItem value="dfa" icon="🔷">
          DFA
        </ToggleGroupItem>
        <ToggleGroupItem value="nfa" icon="🔶">
          NFA
        </ToggleGroupItem>
        <ToggleGroupItem value="regex" icon="📝">
          Regex
        </ToggleGroupItem>
        <ToggleGroupItem value="quiz" icon="📋">
          Quiz
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

// Usage:
/*
const [typeFilters, setTypeFilters] = useState([]);

const filteredProblems = problems.filter(problem => {
  if (typeFilters.length === 0) return true;
  return typeFilters.includes(problem.type.toLowerCase());
});

<ProblemTypeFilter onFilterChange={setTypeFilters} />
*/

// ============================================
// 3. STATUS FILTER (Solved/Unsolved)
// ============================================

export const StatusFilter = ({ onFilterChange }) => {
  const { value, setValue } = useToggleGroup([], 'multiple');

  const handleChange = (newValue) => {
    setValue(newValue);
    onFilterChange?.(newValue);
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
        Status
      </label>
      <ToggleGroup
        type="multiple"
        value={value}
        onValueChange={handleChange}
      >
        <ToggleGroupItem value="solved" icon="✓">
          Solved
        </ToggleGroupItem>
        <ToggleGroupItem value="attempted" icon="○">
          Attempted
        </ToggleGroupItem>
        <ToggleGroupItem value="new" icon="★">
          New
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

// ============================================
// 4. VIEW MODE TOGGLE (List/Grid)
// ============================================

export const ViewModeToggle = ({ onViewChange }) => {
  const [view, setView] = useState('grid');

  const handleChange = (newView) => {
    if (newView) {
      setView(newView);
      onViewChange?.(newView);
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={handleChange}
      size="sm"
    >
      <ToggleGroupItem value="list" icon="☰">
        List
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" icon="▦">
        Grid
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

// Usage:
/*
const [viewMode, setViewMode] = useState('grid');

<ViewModeToggle onViewChange={setViewMode} />

{viewMode === 'grid' ? (
  <div className="problems-grid">{/* Grid layout */}</div>
) : (
  <div className="problems-list">{/* List layout */}</div>
)}
*/

// ============================================
// 5. SORT ORDER TOGGLE
// ============================================

export const SortToggle = ({ onSortChange }) => {
  const [sort, setSort] = useState('newest');

  const handleChange = (newSort) => {
    if (newSort) {
      setSort(newSort);
      onSortChange?.(newSort);
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={sort}
      onValueChange={handleChange}
      size="sm"
    >
      <ToggleGroupItem value="newest">
        Newest
      </ToggleGroupItem>
      <ToggleGroupItem value="popular">
        Popular
      </ToggleGroupItem>
      <ToggleGroupItem value="difficulty">
        Difficulty
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

// ============================================
// 6. QUIZ SETTINGS TOGGLES
// ============================================

export const QuizSettings = ({ settings, onSettingsChange }) => {
  const [quizSettings, setQuizSettings] = useState(settings || {
    showHints: true,
    showTimer: true,
    allowFlagging: true
  });

  const toggleSetting = (key) => {
    const newSettings = {
      ...quizSettings,
      [key]: !quizSettings[key]
    };
    setQuizSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <Toggle
          pressed={quizSettings.showHints}
          onPressedChange={() => toggleSetting('showHints')}
          icon="💡"
        >
          Show Hints
        </Toggle>
      </div>

      <div>
        <Toggle
          pressed={quizSettings.showTimer}
          onPressedChange={() => toggleSetting('showTimer')}
          icon="⏱️"
        >
          Show Timer
        </Toggle>
      </div>

      <div>
        <Toggle
          pressed={quizSettings.allowFlagging}
          onPressedChange={() => toggleSetting('allowFlagging')}
          icon="🚩"
        >
          Allow Flagging
        </Toggle>
      </div>
    </div>
  );
};

// ============================================
// 7. BOOKMARK/FAVORITE TOGGLE
// ============================================

export const BookmarkToggle = ({ problemId, isBookmarked, onToggle }) => {
  const { isOn, toggle } = useToggleState(isBookmarked);

  const handleToggle = () => {
    toggle();
    onToggle?.(problemId, !isOn);
  };

  return (
    <Toggle
      pressed={isOn}
      onPressedChange={handleToggle}
      icon="🔖"
      size="sm"
      color={isOn ? 'primary' : undefined}
    >
      {isOn ? 'Bookmarked' : 'Bookmark'}
    </Toggle>
  );
};

// ============================================
// 8. COMPLETE FILTER BAR (For ProblemSelection)
// ============================================

export const ProblemFilterBar = ({ onFiltersChange }) => {
  const [difficulty, setDifficulty] = useState([]);
  const [types, setTypes] = useState([]);
  const [status, setStatus] = useState([]);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('newest');

  const handleFilterChange = () => {
    onFiltersChange?.({
      difficulty,
      types,
      status,
      view,
      sort
    });
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [difficulty, types, status, view, sort]);

  return (
    <div className="filter-bar" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      background: 'var(--gray-50)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: '24px'
    }}>
      {/* Difficulty Filter */}
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
          Difficulty
        </label>
        <ToggleGroup
          type="multiple"
          value={difficulty}
          onValueChange={setDifficulty}
        >
          <ToggleGroupItem value="easy" className="toggle-difficulty-easy">
            🟢 Easy
          </ToggleGroupItem>
          <ToggleGroupItem value="medium" className="toggle-difficulty-medium">
            🟡 Medium
          </ToggleGroupItem>
          <ToggleGroupItem value="hard" className="toggle-difficulty-hard">
            🔴 Hard
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Type Filter */}
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
          Problem Type
        </label>
        <ToggleGroup
          type="multiple"
          value={types}
          onValueChange={setTypes}
          separated
        >
          <ToggleGroupItem value="dfa">🔷 DFA</ToggleGroupItem>
          <ToggleGroupItem value="nfa">🔶 NFA</ToggleGroupItem>
          <ToggleGroupItem value="regex">📝 Regex</ToggleGroupItem>
          <ToggleGroupItem value="quiz">📋 Quiz</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Status Filter */}
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
          Status
        </label>
        <ToggleGroup
          type="multiple"
          value={status}
          onValueChange={setStatus}
        >
          <ToggleGroupItem value="solved">✓ Solved</ToggleGroupItem>
          <ToggleGroupItem value="attempted">○ Attempted</ToggleGroupItem>
          <ToggleGroupItem value="new">★ New</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* View & Sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            View
          </label>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={setView}
            size="sm"
          >
            <ToggleGroupItem value="list">☰ List</ToggleGroupItem>
            <ToggleGroupItem value="grid">▦ Grid</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
            Sort By
          </label>
          <ToggleGroup
            type="single"
            value={sort}
            onValueChange={setSort}
            size="sm"
          >
            <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
            <ToggleGroupItem value="popular">Popular</ToggleGroupItem>
            <ToggleGroupItem value="difficulty">Difficulty</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

// Usage in ProblemSelection.js:
/*
const [filters, setFilters] = useState({
  difficulty: [],
  types: [],
  status: [],
  view: 'grid',
  sort: 'newest'
});

const filteredProblems = problems.filter(problem => {
  // Apply difficulty filter
  if (filters.difficulty.length > 0 && !filters.difficulty.includes(problem.difficulty.toLowerCase())) {
    return false;
  }
  
  // Apply type filter
  if (filters.types.length > 0 && !filters.types.includes(problem.type.toLowerCase())) {
    return false;
  }
  
  // Apply status filter
  if (filters.status.length > 0 && !filters.status.includes(problem.status.toLowerCase())) {
    return false;
  }
  
  return true;
});

<ProblemFilterBar onFiltersChange={setFilters} />
*/

// Export all examples
export default {
  DifficultyFilter,
  ProblemTypeFilter,
  StatusFilter,
  ViewModeToggle,
  SortToggle,
  QuizSettings,
  BookmarkToggle,
  ProblemFilterBar
};


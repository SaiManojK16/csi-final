import React from 'react';
import {
  Badge,
  DifficultyBadge,
  StatusBadge,
  TypeBadge,
  CountBadge,
  NotificationBadge,
  VerifiedBadge,
  AchievementBadge,
  BadgeGroup,
  IconBadge
} from './Badge';

/**
 * USAGE EXAMPLES FOR ACCEPTLY PROJECT
 * Copy these into your components where badges are needed
 */

// ============================================
// 1. BASIC BADGE VARIANTS
// ============================================

export const BasicBadgesExample = () => {
  return (
    <BadgeGroup>
      <Badge>Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </BadgeGroup>
  );
};

// ============================================
// 2. DIFFICULTY BADGES (For Problems)
// ============================================

export const DifficultyBadgesExample = () => {
  return (
    <BadgeGroup>
      <DifficultyBadge difficulty="Easy" />
      <DifficultyBadge difficulty="Medium" />
      <DifficultyBadge difficulty="Hard" />
    </BadgeGroup>
  );
};

// Usage in Problem Cards:
/*
<div className="problem-card">
  <h3>{problem.title}</h3>
  <DifficultyBadge difficulty={problem.difficulty} />
</div>
*/

// ============================================
// 3. STATUS BADGES (Progress Indicators)
// ============================================

export const StatusBadgesExample = () => {
  return (
    <BadgeGroup>
      <StatusBadge status="Solved" />
      <StatusBadge status="In-Progress" />
      <StatusBadge status="Locked" />
      <StatusBadge status="New" />
    </BadgeGroup>
  );
};

// Usage in Problem Lists:
/*
<div className="problem-item">
  <h4>{problem.title}</h4>
  <StatusBadge status={problem.status} />
</div>
*/

// ============================================
// 4. TYPE BADGES (Problem Categories)
// ============================================

export const TypeBadgesExample = () => {
  return (
    <BadgeGroup>
      <TypeBadge type="DFA" />
      <TypeBadge type="NFA" />
      <TypeBadge type="Regex" />
      <TypeBadge type="Quiz" />
    </BadgeGroup>
  );
};

// Usage in Problem Cards:
/*
<div className="problem-header">
  <TypeBadge type={problem.type} />
  <DifficultyBadge difficulty={problem.difficulty} />
</div>
*/

// ============================================
// 5. COUNT/NUMBER BADGES
// ============================================

export const CountBadgesExample = () => {
  return (
    <BadgeGroup>
      <CountBadge count={8} />
      <CountBadge count={99} variant="destructive" />
      <CountBadge count={150} max={99} variant="outline" />
      <CountBadge count={20} variant="success" />
    </BadgeGroup>
  );
};

// Usage in Dashboard Stats:
/*
<div className="stat-card">
  <h3>Problems Solved</h3>
  <CountBadge count={solvedCount} variant="success" />
</div>
*/

// ============================================
// 6. NOTIFICATION BADGES (Floating)
// ============================================

export const NotificationBadgeExample = () => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button className="header-icon-btn">
        <span>🔔</span>
      </button>
      <NotificationBadge count={5} show={true} />
    </div>
  );
};

// Usage in Header:
/*
<button className="header-icon-btn" aria-label="Notifications">
  <span className="icon-bell">🔔</span>
  <NotificationBadge count={notificationCount} show={notificationCount > 0} />
</button>
*/

// ============================================
// 7. VERIFIED BADGES
// ============================================

export const VerifiedBadgesExample = () => {
  return (
    <BadgeGroup>
      <VerifiedBadge />
      <VerifiedBadge>Completed</VerifiedBadge>
      <VerifiedBadge>100% Accuracy</VerifiedBadge>
    </BadgeGroup>
  );
};

// Usage in User Profile:
/*
<div className="user-achievement">
  <span>Quiz Master</span>
  <VerifiedBadge>Verified</VerifiedBadge>
</div>
*/

// ============================================
// 8. ACHIEVEMENT BADGES
// ============================================

export const AchievementBadgesExample = () => {
  return (
    <BadgeGroup>
      <AchievementBadge icon="🏆">Winner</AchievementBadge>
      <AchievementBadge icon="⭐">100 Streak</AchievementBadge>
      <AchievementBadge icon="🎯">Perfect Score</AchievementBadge>
    </BadgeGroup>
  );
};

// Usage in Dashboard:
/*
<div className="achievements">
  <h3>Recent Achievements</h3>
  {achievements.map(achievement => (
    <AchievementBadge key={achievement.id} icon={achievement.icon}>
      {achievement.name}
    </AchievementBadge>
  ))}
</div>
*/

// ============================================
// 9. ICON BADGES
// ============================================

export const IconBadgesExample = () => {
  return (
    <BadgeGroup>
      <IconBadge icon="✓" variant="success">Approved</IconBadge>
      <IconBadge icon="⚠️" variant="warning">Warning</IconBadge>
      <IconBadge icon="✗" variant="destructive">Failed</IconBadge>
      <IconBadge icon="ℹ️" variant="info">Info</IconBadge>
    </BadgeGroup>
  );
};

// ============================================
// 10. REMOVABLE BADGES (Tags)
// ============================================

export const RemovableBadgesExample = () => {
  const [tags, setTags] = React.useState(['DFA', 'Beginner', 'Practice']);

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <BadgeGroup>
      {tags.map(tag => (
        <Badge
          key={tag}
          variant="secondary"
          removable
          onRemove={() => removeTag(tag)}
        >
          {tag}
        </Badge>
      ))}
    </BadgeGroup>
  );
};

// ============================================
// 11. INTERACTIVE/CLICKABLE BADGES
// ============================================

export const InteractiveBadgesExample = () => {
  const [selected, setSelected] = React.useState('all');

  return (
    <BadgeGroup>
      <Badge
        variant={selected === 'all' ? 'primary' : 'outline'}
        onClick={() => setSelected('all')}
      >
        All
      </Badge>
      <Badge
        variant={selected === 'easy' ? 'success' : 'outline'}
        onClick={() => setSelected('easy')}
      >
        Easy
      </Badge>
      <Badge
        variant={selected === 'medium' ? 'warning' : 'outline'}
        onClick={() => setSelected('medium')}
      >
        Medium
      </Badge>
      <Badge
        variant={selected === 'hard' ? 'destructive' : 'outline'}
        onClick={() => setSelected('hard')}
      >
        Hard
      </Badge>
    </BadgeGroup>
  );
};

// Usage in Problem Filters:
/*
const [difficulty, setDifficulty] = useState('all');

<div className="filters">
  <Badge
    variant={difficulty === 'all' ? 'primary' : 'outline'}
    onClick={() => setDifficulty('all')}
  >
    All
  </Badge>
  <Badge
    variant={difficulty === 'easy' ? 'success' : 'outline'}
    onClick={() => setDifficulty('easy')}
  >
    Easy
  </Badge>
  {/* ... more filters */}
</div>
*/

// ============================================
// 12. BADGE SIZES
// ============================================

export const BadgeSizesExample = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <BadgeGroup>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </BadgeGroup>
      
      <BadgeGroup>
        <CountBadge count={5} size="sm" />
        <CountBadge count={99} size="md" />
        <CountBadge count={150} max={99} size="lg" />
      </BadgeGroup>
    </div>
  );
};

// ============================================
// 13. ANIMATED BADGES
// ============================================

export const AnimatedBadgesExample = () => {
  return (
    <BadgeGroup>
      <Badge variant="primary" className="badge-pulse">Live</Badge>
      <Badge variant="success" className="badge-shimmer">New</Badge>
    </BadgeGroup>
  );
};

// Usage for "New" features:
/*
<div className="feature">
  <h4>AI Helper</h4>
  <Badge variant="accent" className="badge-shimmer">New</Badge>
</div>
*/

// ============================================
// 14. COMPLEX BADGE GROUPS (Real Example)
// ============================================

export const ProblemCardBadgesExample = ({ problem }) => {
  return (
    <div className="problem-card">
      <div className="problem-header">
        <h3>{problem.title}</h3>
        <BadgeGroup>
          <DifficultyBadge difficulty={problem.difficulty} />
          <TypeBadge type={problem.type} />
          {problem.isNew && (
            <Badge variant="accent" className="badge-shimmer">New</Badge>
          )}
          {problem.status === 'solved' && (
            <IconBadge icon="✓" variant="success">Solved</IconBadge>
          )}
        </BadgeGroup>
      </div>
      <p className="problem-description">{problem.description}</p>
    </div>
  );
};

// ============================================
// 15. DASHBOARD STATS BADGES
// ============================================

export const DashboardStatBadgesExample = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Problems Solved</h3>
        <div className="stat-value">
          {stats.solved}
          <CountBadge count={stats.solved} variant="success" />
        </div>
      </div>
      
      <div className="stat-card">
        <h3>Current Streak</h3>
        <div className="stat-value">
          {stats.streak} days
          {stats.streak >= 7 && (
            <AchievementBadge icon="🔥">On Fire!</AchievementBadge>
          )}
        </div>
      </div>
      
      <div className="stat-card">
        <h3>Quiz Score</h3>
        <div className="stat-value">
          {stats.quizScore}%
          {stats.quizScore === 100 && (
            <VerifiedBadge>Perfect!</VerifiedBadge>
          )}
        </div>
      </div>
    </div>
  );
};

// Export all examples
export default {
  BasicBadgesExample,
  DifficultyBadgesExample,
  StatusBadgesExample,
  TypeBadgesExample,
  CountBadgesExample,
  NotificationBadgeExample,
  VerifiedBadgesExample,
  AchievementBadgesExample,
  IconBadgesExample,
  RemovableBadgesExample,
  InteractiveBadgesExample,
  BadgeSizesExample,
  AnimatedBadgesExample,
  ProblemCardBadgesExample,
  DashboardStatBadgesExample
};


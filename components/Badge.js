import React from 'react';
import './Badge.css';

/**
 * Badge Component
 * Versatile label component for status, categories, counts, etc.
 * 
 * @param {string} variant - Badge style variant
 * @param {string} size - Badge size (sm, md, lg)
 * @param {boolean} pill - Make badge circular/pill shaped
 * @param {boolean} dot - Show dot indicator
 * @param {boolean} removable - Show remove button
 * @param {function} onRemove - Callback when remove button clicked
 * @param {string} className - Additional CSS classes
 * @param {ReactNode} children - Badge content
 */
export const Badge = ({
  variant = 'default',
  size = 'md',
  pill = false,
  dot = false,
  removable = false,
  onRemove,
  onClick,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = ['badge'];
  
  // Add variant class
  if (variant !== 'default') {
    baseClasses.push(`badge-${variant}`);
  } else {
    baseClasses.push('badge-default');
  }
  
  // Add size class
  if (size !== 'md') {
    baseClasses.push(`badge-${size}`);
  }
  
  // Add modifier classes
  if (pill) baseClasses.push('badge-pill');
  if (dot) baseClasses.push('badge-dot');
  if (removable) baseClasses.push('badge-removable');
  if (onClick) baseClasses.push('badge-interactive');
  
  // Add custom classes
  if (className) baseClasses.push(className);
  
  const badgeClasses = baseClasses.join(' ');
  
  return (
    <span
      className={badgeClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      {children}
      {removable && onRemove && (
        <button
          type="button"
          className="badge-remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
};

/**
 * DifficultyBadge
 * Pre-styled badge for difficulty levels
 */
export const DifficultyBadge = ({ difficulty, ...props }) => {
  const variant = difficulty?.toLowerCase() || 'medium';
  return (
    <Badge variant={variant} {...props}>
      {difficulty}
    </Badge>
  );
};

/**
 * StatusBadge
 * Pre-styled badge for status indicators
 */
export const StatusBadge = ({ status, ...props }) => {
  const statusMap = {
    solved: 'solved',
    'in-progress': 'in-progress',
    locked: 'locked',
    new: 'new',
    completed: 'solved',
    pending: 'in-progress'
  };
  
  const variant = statusMap[status?.toLowerCase()] || 'secondary';
  
  return (
    <Badge variant={variant} {...props}>
      {status}
    </Badge>
  );
};

/**
 * TypeBadge
 * Pre-styled badge for problem types
 */
export const TypeBadge = ({ type, ...props }) => {
  const typeMap = {
    dfa: 'dfa',
    nfa: 'nfa',
    regex: 'regex',
    quiz: 'quiz',
    mcq: 'quiz'
  };
  
  const variant = typeMap[type?.toLowerCase()] || 'secondary';
  
  return (
    <Badge variant={variant} {...props}>
      {type}
    </Badge>
  );
};

/**
 * CountBadge
 * Circular badge for counts/numbers
 */
export const CountBadge = ({ count, max = 99, variant = 'primary', ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <Badge variant={variant} pill size="sm" {...props}>
      {displayCount}
    </Badge>
  );
};

/**
 * NotificationBadge
 * Floating badge for notifications (typically on icons/buttons)
 */
export const NotificationBadge = ({ count, max = 99, show = true }) => {
  if (!show || count === 0) return null;
  
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <span className="badge-notification">
      {displayCount}
    </span>
  );
};

/**
 * VerifiedBadge
 * Badge with checkmark icon for verified status
 */
export const VerifiedBadge = ({ children = 'Verified', ...props }) => {
  return (
    <Badge variant="verified" className="badge-icon" {...props}>
      <span className="icon">✓</span>
      {children}
    </Badge>
  );
};

/**
 * AchievementBadge
 * Special styled badge for achievements
 */
export const AchievementBadge = ({ children, icon, ...props }) => {
  return (
    <Badge variant="achievement" className="badge-icon" {...props}>
      {icon && <span className="icon">{icon}</span>}
      {children}
    </Badge>
  );
};

/**
 * BadgeGroup
 * Container for multiple badges
 */
export const BadgeGroup = ({ children, className = '', ...props }) => {
  return (
    <div className={`badge-group ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * IconBadge
 * Badge with an icon
 */
export const IconBadge = ({ icon, children, variant = 'default', ...props }) => {
  return (
    <Badge variant={variant} className="badge-icon" {...props}>
      {icon && <span className="icon">{icon}</span>}
      {children}
    </Badge>
  );
};

// Export all components
export default {
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
};


import React from 'react';
import { Link } from 'react-router-dom';
import './Pagination.css';

/**
 * Pagination
 * Main pagination container
 */
export const Pagination = ({ 
  children, 
  className = '',
  variant = 'default', // default, quiz, compact, large, rounded, separated
  ...props 
}) => {
  const classes = [
    'pagination',
    variant !== 'default' ? `pagination-${variant}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <nav className={classes} role="navigation" aria-label="Pagination" {...props}>
      {children}
    </nav>
  );
};

/**
 * PaginationContent
 * Container for pagination items
 */
export const PaginationContent = ({ children, className = '' }) => {
  return (
    <ul className={`pagination-content ${className}`}>
      {children}
    </ul>
  );
};

/**
 * PaginationItem
 * Individual pagination item wrapper
 */
export const PaginationItem = ({ children, className = '' }) => {
  return (
    <li className={`pagination-item ${className}`}>
      {children}
    </li>
  );
};

/**
 * PaginationLink
 * Link to a specific page
 */
export const PaginationLink = ({ 
  to,
  href,
  children, 
  isActive = false,
  disabled = false,
  answered = false,
  flagged = false,
  onClick,
  className = '',
  ...props 
}) => {
  const classes = [
    'pagination-link',
    isActive ? 'active' : '',
    disabled ? 'disabled' : '',
    answered ? 'answered' : '',
    flagged ? 'flagged' : '',
    className
  ].filter(Boolean).join(' ');

  if (disabled) {
    return (
      <span className={classes} aria-disabled="true" {...props}>
        {children}
      </span>
    );
  }

  if (to) {
    return (
      <Link 
        to={to} 
        className={classes} 
        aria-current={isActive ? 'page' : undefined}
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a 
        href={href} 
        className={classes}
        aria-current={isActive ? 'page' : undefined}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * PaginationPrevious
 * Previous page button
 */
export const PaginationPrevious = ({ 
  to,
  href,
  onClick,
  disabled = false,
  children = 'Previous',
  className = '',
  ...props 
}) => {
  const classes = `pagination-previous ${className}`;

  if (disabled) {
    return (
      <button
        type="button"
        className={classes}
        disabled
        aria-label="Previous page"
        {...props}
      >
        {children}
      </button>
    );
  }

  if (to) {
    return (
      <Link 
        to={to} 
        className={classes}
        aria-label="Previous page"
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a 
        href={href} 
        className={classes}
        aria-label="Previous page"
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label="Previous page"
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * PaginationNext
 * Next page button
 */
export const PaginationNext = ({ 
  to,
  href,
  onClick,
  disabled = false,
  children = 'Next',
  className = '',
  ...props 
}) => {
  const classes = `pagination-next ${className}`;

  if (disabled) {
    return (
      <button
        type="button"
        className={classes}
        disabled
        aria-label="Next page"
        {...props}
      >
        {children}
      </button>
    );
  }

  if (to) {
    return (
      <Link 
        to={to} 
        className={classes}
        aria-label="Next page"
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a 
        href={href} 
        className={classes}
        aria-label="Next page"
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-label="Next page"
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * PaginationEllipsis
 * Ellipsis indicator (...)
 */
export const PaginationEllipsis = ({ className = '' }) => {
  return (
    <span 
      className={`pagination-ellipsis ${className}`} 
      aria-hidden="true"
    />
  );
};

/**
 * PaginationInfo
 * Information text (e.g., "Page 2 of 10")
 */
export const PaginationInfo = ({ 
  currentPage, 
  totalPages,
  className = '' 
}) => {
  return (
    <span className={`pagination-info ${className}`}>
      Page {currentPage} of {totalPages}
    </span>
  );
};

/**
 * usePagination Hook
 * Helper hook for pagination logic
 */
export const usePagination = ({ 
  totalItems, 
  itemsPerPage = 10,
  initialPage = 1,
  maxPageNumbers = 5 // Max page numbers to show
}) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const halfMax = Math.floor(maxPageNumbers / 2);

    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxPageNumbers - 1) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  // Calculate items for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    getPageNumbers,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
    startIndex,
    endIndex,
    itemsOnPage: endIndex - startIndex
  };
};

// Export all components
export default {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationInfo,
  usePagination
};


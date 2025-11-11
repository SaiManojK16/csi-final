import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './AlertDialog.css';

/**
 * AlertDialog Component
 * Modal dialog for confirmations and important user actions
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onOpenChange - Callback when dialog open state changes
 * @param {string} variant - Dialog variant (default, warning, error, success, info)
 * @param {ReactNode} children - Dialog content
 */
export const AlertDialog = ({ 
  open, 
  onOpenChange,
  variant = 'default',
  children 
}) => {
  const overlayRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onOpenChange?.(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.classList.add('alert-dialog-open');
      
      // Focus trap
      const focusableElements = overlayRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      firstElement?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('alert-dialog-open');
    };
  }, [open, onOpenChange]);

  // Handle backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
    }
  };

  if (!open) return null;

  const variantClass = variant !== 'default' ? `alert-dialog-${variant}` : '';

  return createPortal(
    <div 
      ref={overlayRef}
      className="alert-dialog-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={`alert-dialog-content ${variantClass}`}>
        {children}
      </div>
    </div>,
    document.body
  );
};

/**
 * AlertDialogTrigger
 * Button or element that opens the dialog
 */
export const AlertDialogTrigger = ({ children, asChild, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props);
  }
  
  return <button {...props}>{children}</button>;
};

/**
 * AlertDialogContent
 * Main content container (wrapper for header, body, footer)
 */
export const AlertDialogContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`alert-dialog-content-inner ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * AlertDialogHeader
 * Header section containing title and description
 */
export const AlertDialogHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`alert-dialog-header ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * AlertDialogTitle
 * Main title of the dialog
 */
export const AlertDialogTitle = ({ children, className = '', ...props }) => {
  return (
    <h2 className={`alert-dialog-title ${className}`} {...props}>
      {children}
    </h2>
  );
};

/**
 * AlertDialogDescription
 * Descriptive text explaining the action
 */
export const AlertDialogDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`alert-dialog-description ${className}`} {...props}>
      {children}
    </p>
  );
};

/**
 * AlertDialogBody
 * Optional body content area
 */
export const AlertDialogBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`alert-dialog-body ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * AlertDialogFooter
 * Footer containing action buttons
 */
export const AlertDialogFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`alert-dialog-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * AlertDialogClose
 * Close button (X) in top-right corner
 */
export const AlertDialogClose = ({ onClick, className = '', ...props }) => {
  return (
    <button
      type="button"
      className={`alert-dialog-close ${className}`}
      onClick={onClick}
      aria-label="Close dialog"
      {...props}
    >
      ×
    </button>
  );
};

/**
 * AlertDialogCancel
 * Cancel action button
 */
export const AlertDialogCancel = ({ 
  children = 'Cancel', 
  onClick, 
  className = '',
  ...props 
}) => {
  return (
    <button
      type="button"
      className={`alert-dialog-action alert-dialog-cancel ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * AlertDialogAction
 * Primary action button
 */
export const AlertDialogAction = ({ 
  children = 'Continue', 
  onClick,
  variant = 'primary',
  loading = false,
  className = '',
  ...props 
}) => {
  const variantClass = `alert-dialog-action-${variant}`;
  
  return (
    <button
      type="button"
      className={`alert-dialog-action ${variantClass} ${className}`}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading && <span className="alert-dialog-spinner" />}
      {children}
    </button>
  );
};

/**
 * AlertDialogIcon
 * Optional icon display
 */
export const AlertDialogIcon = ({ children, className = '', ...props }) => {
  return (
    <div className={`alert-dialog-icon ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * useAlertDialog Hook
 * Convenient hook for managing dialog state
 */
export const useAlertDialog = (initialState = false) => {
  const [open, setOpen] = React.useState(initialState);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  const toggle = () => setOpen(prev => !prev);

  return {
    open,
    setOpen,
    show,
    hide,
    toggle
  };
};

/**
 * Confirmation Dialog (Pre-configured)
 * Ready-to-use confirmation dialog
 */
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
  destructive = false,
  loading = false,
  icon,
  ...props
}) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} variant={variant}>
      <AlertDialogHeader>
        {icon && <AlertDialogIcon>{icon}</AlertDialogIcon>}
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleCancel}>
          {cancelText}
        </AlertDialogCancel>
        <AlertDialogAction
          variant={destructive ? 'destructive' : 'primary'}
          onClick={handleConfirm}
          loading={loading}
        >
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
};

// Export all components
export default {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogClose,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogIcon,
  useAlertDialog,
  ConfirmDialog
};


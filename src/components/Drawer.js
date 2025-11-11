import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Drawer.css';

/**
 * useMediaQuery Hook
 * Detects if screen matches media query
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

/**
 * Drawer Component
 * Bottom sheet for mobile, dialog for desktop
 * 
 * @param {boolean} open - Controls drawer visibility
 * @param {function} onOpenChange - Callback when drawer open state changes
 * @param {string} size - Drawer size (sm, md, lg, full)
 * @param {ReactNode} children - Drawer content
 */
export const Drawer = ({ 
  open, 
  onOpenChange,
  size = 'md',
  children 
}) => {
  const overlayRef = useRef(null);
  const [closing, setClosing] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.classList.add('drawer-open');
      
      // Focus trap
      const focusableElements = overlayRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      firstElement?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('drawer-open');
    };
  }, [open]);

  // Handle close with animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onOpenChange?.(false);
    }, 200);
  };

  // Handle backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!open && !closing) return null;

  return createPortal(
    <div 
      ref={overlayRef}
      className={`drawer-overlay ${closing ? 'closing' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={`drawer-content drawer-${size} ${closing ? 'closing' : ''}`}>
        <div className="drawer-handle" aria-hidden="true" />
        {children}
      </div>
    </div>,
    document.body
  );
};

/**
 * DrawerTrigger
 * Button or element that opens the drawer
 */
export const DrawerTrigger = ({ children, asChild, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props);
  }
  
  return <button {...props}>{children}</button>;
};

/**
 * DrawerContent
 * Main content container
 */
export const DrawerContent = ({ children, className = '', ...props }) => {
  return <>{children}</>;
};

/**
 * DrawerHeader
 * Header section containing title and description
 */
export const DrawerHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`drawer-header ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * DrawerTitle
 * Main title of the drawer
 */
export const DrawerTitle = ({ children, className = '', ...props }) => {
  return (
    <h2 className={`drawer-title ${className}`} {...props}>
      {children}
    </h2>
  );
};

/**
 * DrawerDescription
 * Descriptive text
 */
export const DrawerDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`drawer-description ${className}`} {...props}>
      {children}
    </p>
  );
};

/**
 * DrawerBody
 * Main body content area
 */
export const DrawerBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`drawer-body ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * DrawerFooter
 * Footer containing action buttons
 */
export const DrawerFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`drawer-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * DrawerClose
 * Close button (X) in top-right corner
 */
export const DrawerClose = ({ onClick, asChild, children, className = '', ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick, ...props });
  }
  
  return (
    <button
      type="button"
      className={`drawer-close ${className}`}
      onClick={onClick}
      aria-label="Close drawer"
      {...props}
    >
      {children || '×'}
    </button>
  );
};

/**
 * ResponsiveDialog
 * Shows Dialog on desktop, Drawer on mobile
 */
export const ResponsiveDialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = 'md'
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <>
      {trigger}
      
      <Drawer open={open} onOpenChange={onOpenChange} size={size}>
        <DrawerClose onClick={() => onOpenChange(false)} />
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <DrawerBody>
          {children}
        </DrawerBody>
        {footer && (
          <DrawerFooter>
            {footer}
          </DrawerFooter>
        )}
      </Drawer>
    </>
  );
};

// Export all components
export default {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  ResponsiveDialog,
  useMediaQuery
};


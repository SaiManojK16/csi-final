import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from './AlertDialog';
import { ProfileEditDialog } from './ProfileEditDialog';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const profileRef = useRef(null);
  const displayName = user?.username || 'Learner';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate('/');
  };

  const handleEditProfileClick = () => {
    setIsProfileOpen(false);
    setProfileEditOpen(true);
  };

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  return (
    <header className="leetcode-header">
      <div className="header-container">
        {/* Left Side - Logo and Navigation */}
        <div className="header-left">
          <Link to="/" className="logo-link">
            <span className="logo-text">Acceptly</span>
          </Link>
          
          {isAuthenticated && (
            <nav className="header-nav">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Overview
              </Link>
              <Link 
                to="/problems" 
                className={`nav-link ${isActive('/problems') ? 'active' : ''}`}
              >
                Problems
              </Link>
              <Link 
                to="/insights" 
                className={`nav-link ${isActive('/insights') ? 'active' : ''}`}
              >
                Insights
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="header-right">
          {isAuthenticated ? (
            <>
              <div className="profile-menu" ref={profileRef}>
                <button 
                  className="profile-trigger"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="Open profile menu"
                  aria-expanded={isProfileOpen}
                >
                  <div className="profile-avatar">
                    {initials}
                  </div>
                  <div className="profile-meta">
                    <span className="profile-greeting">Hey there</span>
                    <span className="profile-name">{displayName}</span>
                  </div>
                  <span className={`profile-caret ${isProfileOpen ? 'open' : ''}`} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="user-avatar-large">
                        {initials}
                      </div>
                      <div className="user-details">
                        <p className="user-name">{displayName}</p>
                        <p className="user-email">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="dropdown-section">
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/dashboard');
                        }}
                      >
                        <span className="dropdown-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 3L2 12h3v7h6v-5h2v5h6v-7h3z"/>
                          </svg>
                        </span>
                        <span>Dashboard</span>
                      </button>
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/account');
                        }}
                      >
                        <span className="dropdown-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/>
                            <path d="M5 22a7 7 0 0 1 14 0"/>
                          </svg>
                        </span>
                        <span>Account Overview</span>
                      </button>
                      <button 
                        onClick={handleEditProfileClick}
                        className="dropdown-item"
                      >
                        <span className="dropdown-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </span>
                        <span>Edit Profile</span>
                      </button>
                    </div>

                    <div className="dropdown-footer">
                      <button 
                        onClick={handleLogoutClick}
                        className="dropdown-signout"
                      >
                        <span className="dropdown-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                        </span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/auth" className="get-started-btn">
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen} variant="warning">
        <AlertDialogHeader>
          <AlertDialogTitle>Logout?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? Any unsaved progress will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setLogoutDialogOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="primary" onClick={handleConfirmLogout}>
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      {/* Profile Edit Dialog */}
      <ProfileEditDialog
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
      />
    </header>
  );
};

export default Header;

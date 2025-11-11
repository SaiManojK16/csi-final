import React, { useState, useEffect } from 'react';
import {
  ResponsiveDialog,
  DrawerFooter,
  DrawerClose
} from './Drawer';
import { useAuth } from '../context/AuthContext';
import './ProfileEditDialog.css';

export const ProfileEditDialog = ({ open, onOpenChange }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    institution: user?.institution || '',
    learningFocus: user?.learningFocus || ''
  });

  const initials = (formData.username || 'AU').slice(0, 2).toUpperCase();

  useEffect(() => {
    if (open) {
      setFormData({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        institution: user?.institution || '',
        learningFocus: user?.learningFocus || ''
      });
    }
  }, [open, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser?.(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Profile"
      description="Update how your teammates see you across Acceptly."
      size="md"
      footer={
        <DrawerFooter>
          <DrawerClose asChild>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </DrawerClose>
          <button
            type="submit"
            form="profile-form"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </DrawerFooter>
      }
    >
      <form id="profile-form" onSubmit={handleSubmit} className="profile-form">
        <div className="profile-dialog-overview">
          <div className="profile-avatar-circle">{initials}</div>
          <div className="profile-dialog-copy">
            <h3>Make it yours</h3>
            <p>
              Personal details help classmates recognise you across study rooms, group sessions,
              and progress boards. Everything here is optional—share as much as you like.
            </p>
          </div>
        </div>

        <div className="profile-form-section">
          <div className="profile-section-header">
            <h4>Basics</h4>
            <p>Used across leaderboards, practice history, and collaborative rooms.</p>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Display name</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={loading}
              />
              <p className="form-hint">We recommend something other students will recognise quickly.</p>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
              <p className="form-hint">Only visible to you—used for notifications and account recovery.</p>
            </div>
          </div>
        </div>

        <div className="profile-form-section">
          <div className="profile-section-header">
            <h4>Academic</h4>
            <p>Help Acceptly tailor suggestions and reminders to your learning goals.</p>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="institution">Institution (optional)</label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="Your school or organisation"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="learningFocus">Learning focus (optional)</label>
              <select
                id="learningFocus"
                name="learningFocus"
                value={formData.learningFocus}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Pick an area</option>
                <option value="automata">Finite Automata Mastery</option>
                <option value="theory">CS Theory Foundations</option>
                <option value="interview">Interview Preparation</option>
                <option value="teaching">Teaching / Mentoring</option>
              </select>
            </div>
          </div>
        </div>

        <div className="profile-form-section">
          <div className="profile-section-header">
            <h4>Bio</h4>
            <p>Share a sentence about your current goal or what motivates you.</p>
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio (optional)</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="E.g. “I’m practicing NFAs for an upcoming theory exam.”"
              rows="4"
              disabled={loading}
            />
            <p className="form-hint">This shows up in study groups and challenge leaderboards.</p>
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  );
};

/**
 * SettingsDialog
 * Example of another responsive dialog for settings
 */
export const SettingsDialog = ({ open, onOpenChange }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Settings"
      description="Manage your account settings and preferences."
      size="md"
      footer={
        <>
          <DrawerClose asChild>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
          </DrawerClose>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-md)',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius)',
          cursor: 'pointer'
        }}
        onClick={() => handleToggle('notifications')}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
              Push Notifications
            </h4>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
              Receive push notifications for quiz reminders
            </p>
          </div>
          <div style={{
            width: '44px',
            height: '24px',
            borderRadius: 'var(--radius-full)',
            background: settings.notifications ? 'var(--primary-600)' : 'var(--gray-300)',
            position: 'relative',
            transition: 'all var(--transition-base)'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '2px',
              left: settings.notifications ? '22px' : '2px',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-sm)'
            }} />
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-md)',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius)',
          cursor: 'pointer'
        }}
        onClick={() => handleToggle('emailUpdates')}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
              Email Updates
            </h4>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
              Receive weekly progress reports via email
            </p>
          </div>
          <div style={{
            width: '44px',
            height: '24px',
            borderRadius: 'var(--radius-full)',
            background: settings.emailUpdates ? 'var(--primary-600)' : 'var(--gray-300)',
            position: 'relative',
            transition: 'all var(--transition-base)'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '2px',
              left: settings.emailUpdates ? '22px' : '2px',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-sm)'
            }} />
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-md)',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius)',
          cursor: 'pointer'
        }}
        onClick={() => handleToggle('darkMode')}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
              Dark Mode
            </h4>
            <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
              Switch to dark theme (Coming soon)
            </p>
          </div>
          <div style={{
            width: '44px',
            height: '24px',
            borderRadius: 'var(--radius-full)',
            background: settings.darkMode ? 'var(--primary-600)' : 'var(--gray-300)',
            position: 'relative',
            transition: 'all var(--transition-base)',
            opacity: 0.5
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '2px',
              left: settings.darkMode ? '22px' : '2px',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-sm)'
            }} />
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default ProfileEditDialog;


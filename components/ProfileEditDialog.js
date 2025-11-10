import React, { useState } from 'react';
import {
  ResponsiveDialog,
  DrawerFooter,
  DrawerClose
} from './Drawer';
import { useAuth } from '../context/AuthContext';

/**
 * ProfileEditDialog
 * Responsive dialog/drawer for editing user profile
 * Shows as dialog on desktop, drawer on mobile
 */
export const ProfileEditDialog = ({ open, onOpenChange }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    institution: user?.institution || ''
  });

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
      // API call to update profile
      await updateUser?.(formData);
      
      // Show success message (you can add a toast notification here)
      console.log('Profile updated successfully!');
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Profile"
      description="Make changes to your profile here. Click save when you're done."
      size="md"
      footer={
        <>
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
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      }
    >
      <form id="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your username"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="institution">Institution (Optional)</label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="Your school or university"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio (Optional)</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows="4"
            disabled={loading}
            style={{ resize: 'vertical' }}
          />
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


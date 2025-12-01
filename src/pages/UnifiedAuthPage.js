import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UnifiedAuthPage.css';

const UnifiedAuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'signin', 'signup'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();


  const handleEmailContinue = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Check if email exists in the system
      const response = await fetch('http://localhost:5001/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.exists) {
        // Email exists - show sign in form
        setStep('signin');
      } else {
        // Email doesn't exist - show sign up form
        setStep('signup');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
      navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await signup(username, email, password);
      if (result.success) {
      navigate('/dashboard');
      } else {
        setError(result.message || 'Failed to create account');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setError('');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="unified-auth-page">
      <div className="auth-background">
        <div className="auth-circle circle-1"></div>
        <div className="auth-circle circle-2"></div>
        <div className="auth-circle circle-3"></div>
      </div>

      <div className="unified-auth-container">
        <div className="unified-auth-card">
          <div className="auth-header">
            {step === 'email' && (
              <>
                <h2>Welcome!</h2>
                <p className="auth-description">
                  Enter your email to continue
                </p>
              </>
            )}
            {step === 'signin' && (
              <>
                <h2>Welcome back!</h2>
                <p className="auth-description">
                  Sign in to continue learning
                </p>
              </>
            )}
            {step === 'signup' && (
              <>
                <h2>Create your account</h2>
                <p className="auth-description">
                  Let's get you started on your learning journey
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="error-banner" role="alert" aria-live="polite">
              <span className="error-icon" aria-hidden="true">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailContinue} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span className="required-mark" aria-label="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoFocus
                  required
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                />
              </div>

              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small" aria-hidden="true"></span>
                    Checking...
                  </>
                ) : (
                  <>
                    Continue
                    <span className="btn-arrow" aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'signin' && (
            <form onSubmit={handleSignIn} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="signin-email">Email Address</label>
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  disabled
                  className="input-locked"
                  aria-label="Email address (locked)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="signin-password">
                  Password <span className="required-mark" aria-label="required">*</span>
                </label>
                <input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                />
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="btn-forgot"
              >
                Forgot your password?
              </button>

              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small" aria-hidden="true"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <button type="button" onClick={handleBack} className="btn-auth-secondary">
                <span aria-hidden="true">← </span>Back
              </button>
            </form>
          )}

          {step === 'signup' && (
            <form onSubmit={handleSignUp} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="signup-email">Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  disabled
                  className="input-locked"
                  aria-label="Email address (locked)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-username">
                  Username <span className="required-mark" aria-label="required">*</span>
                </label>
                <input
                  id="signup-username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                  aria-required="true"
                  aria-invalid={error && !username.trim() ? 'true' : 'false'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">
                  Password <span className="required-mark" aria-label="required">*</span>
                </label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                  aria-required="true"
                  aria-invalid={error && password.length < 6 ? 'true' : 'false'}
                  aria-describedby="password-hint"
                />
                <p id="password-hint" className="input-hint">At least 6 characters</p>
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm">
                  Confirm Password <span className="required-mark" aria-label="required">*</span>
                </label>
                <input
                  id="signup-confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  aria-required="true"
                  aria-invalid={error && password !== confirmPassword ? 'true' : 'false'}
                />
              </div>

              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small" aria-hidden="true"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <button type="button" onClick={handleBack} className="btn-auth-secondary">
                <span aria-hidden="true">← </span>Back
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p className="auth-terms">
              By continuing, you agree to our{' '}
              <a href="#terms">Terms of Service</a> and{' '}
              <a href="#privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuthPage;


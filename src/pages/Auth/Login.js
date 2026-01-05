import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { firebaseAuth } from '../../firebase';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await firebaseAuth.signIn(formData.email, formData.password);
      
      // Отримуємо дані користувача
      const userDataFromDb = await firebaseAuth.getUserData(user.uid);
      
      const userProfileData = {
        uid: user.uid,
        name: user.displayName || userDataFromDb?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        phone: user.phoneNumber || userDataFromDb?.phone || '',
        avatar: user.photoURL || userDataFromDb?.avatar || '',
        joinDate: userDataFromDb?.joinDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        bio: userDataFromDb?.bio || '',
        theme: userDataFromDb?.theme || 'blue',
        socialLinks: userDataFromDb?.socialLinks || {
          instagram: '',
          facebook: '',
          twitter: ''
        }
      };

      login(user, userProfileData);
      navigate('/profile');
      
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please try again.';
      
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await firebaseAuth.signInWithGoogle();
      
      const userProfileData = {
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email,
        phone: user.phoneNumber || '',
        avatar: user.photoURL || '',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        bio: '',
        theme: 'blue',
        socialLinks: {
          instagram: '',
          facebook: '',
          twitter: ''
        }
      };
      
      login(user, userProfileData);
      navigate('/profile');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Демо-режим
    const userProfileData = {
      uid: 'demo-user-12345',
      name: 'Demo User',
      email: 'demo@iona.com',
      phone: '+1 (555) 123-4567',
      avatar: '',
      joinDate: 'March 2024',
      bio: 'Welcome to IONA demo account! Explore all features without registration.',
      theme: 'blue',
      socialLinks: {
        instagram: '@iona_demo',
        facebook: 'iona.demo',
        twitter: '@iona_demo'
      }
    };
    
    localStorage.setItem('hairSalonUserData', JSON.stringify(userProfileData));
    login(null, userProfileData);
    navigate('/profile');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your IONA account</p>
        </div>

        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '8px' }}>
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#C53030"/>
            </svg>
            {error}
          </div>
        )}

        <div className="social-login">
          <button className="social-btn google" onClick={handleGoogleLogin} disabled={loading}>
            <span className="social-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </span>
            Continue with Google
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-options">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                disabled={loading}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-btn primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <button 
          className="auth-btn demo" 
          onClick={handleDemoLogin}
          disabled={loading}
        >
          Try Demo Account
        </button>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
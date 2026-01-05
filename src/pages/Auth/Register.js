import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { firebaseAuth } from '../../firebase';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Валідація
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Реєстрація через Firebase
      const user = await firebaseAuth.signUp(formData.email, formData.password, {
        name: formData.name,
        email: formData.email
      });

      // Профіль користувача
      const userProfileData = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: '',
        avatar: '',
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
      console.error('Registration error:', err);

      let errorMessage = 'Registration failed. Please try again.';

      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use. Please try another one.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password sign-up is not enabled. Please contact support.';
          break;
        default:
          errorMessage = 'Registration failed. Please try again.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
      console.error('Google signup error:', err);
      setError('Google signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Join IONA</h1>
          <p>Create your account to get started</p>
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
          <button className="social-btn google" onClick={handleGoogleSignup} disabled={loading}>
            Sign up with Google
          </button>
        </div>

        <div className="divider"><span>or</span></div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter your full name" required disabled={loading} />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Enter your email" required disabled={loading} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Create a password (min. 6 characters)" minLength="6" required disabled={loading} />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} placeholder="Confirm your password" required disabled={loading} />
          </div>

          <div className="form-options">
            <label className="checkbox">
              <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})} required disabled={loading} />
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="auth-btn primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;

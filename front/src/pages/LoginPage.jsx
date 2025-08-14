// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

// You would import these icons from your assets folder
// import GoogleIcon from '../assets/google-icon.svg';
// import GitHubIcon from '../assets/github-icon.svg';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Determine if we're on register page or login page
  const isRegisterPage = location.pathname === '/register';
  const [isLogin, setIsLogin] = useState(!isRegisterPage);

  // Update state when route changes
  useEffect(() => {
    setIsLogin(!isRegisterPage);
  }, [isRegisterPage]);

  // Real API integration
  const handleAuth = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
      if (isLogin) {
        // Login
        const response = await ApiService.login({
          email: data.email,
          password: data.password
        });
        
        login(response.user, response.token);
        alert('Login successful!');
        navigate('/');
      } else {
        // Register
        await ApiService.register({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword
        });
        
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      alert(error.message || 'Authentication failed');
    }
  };

  const handleSocialLogin = (provider) => {
    // This would redirect to the backend route for OAuth
    // e.g., window.location.href = `/api/auth/${provider}`;
    console.log(`Logging in with ${provider}`);
    alert(`Redirecting to ${provider} for authentication...`);
    // On successful callback from backend, user would be redirected to home
  };

  const switchAuthMode = () => {
    if (isLogin) {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        <p>{isLogin ? 'Welcome back!' : 'Join our community of creators.'}</p>
        
        <form onSubmit={handleAuth} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required />
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="divider">OR</div>

        <div className="social-login-buttons">
          <button onClick={() => handleSocialLogin('google')} className="btn btn-social google">
            {/* <img src={GoogleIcon} alt="Google" /> */}
            Continue with Google
          </button>
          <button onClick={() => handleSocialLogin('github')} className="btn btn-social github">
            {/* <img src={GitHubIcon} alt="GitHub" /> */}
            Continue with GitHub
          </button>
        </div>

        <div className="auth-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={switchAuthMode} className="btn-link">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
// src/components/Navbar.jsx

import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">BrainShelf</Link>
      
      {/* Mobile menu button */}
      <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Navigation menu */}
      <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul className="navbar-nav">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/upload" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              Upload Project
            </NavLink>
          </li>
        </ul>
        
        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <span className="navbar-username">Welcome, {user?.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-primary" onClick={closeMenu}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;
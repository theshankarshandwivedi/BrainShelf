// src/components/Navbar.jsx

import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  // This would come from your auth context or Redux store
  const isAuthenticated = true; // Use `false` to see the logged-out state
  const user = { username: 'dev_user' };

  const handleLogout = () => {
    // Clear user session/token and update auth state
    alert('Logged out!');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">BrainShelf</Link>
      <ul className="navbar-nav">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/upload" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Upload Project
          </NavLink>
        </li>
      </ul>
      <div className="navbar-auth">
        {isAuthenticated ? (
          <>
            <span className="navbar-username">Welcome, {user.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
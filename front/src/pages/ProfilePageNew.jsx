// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import ProjectCard from '../components/ProjectCard';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // If no username in params and user is authenticated, redirect to their profile
  useEffect(() => {
    if (!username && currentUser?.username) {
      navigate(`/profile/${currentUser.username}`, { replace: true });
    }
  }, [username, currentUser, navigate]);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const targetUsername = username || currentUser?.username;
      
      if (!targetUsername) {
        setError('No user specified');
        setLoading(false);
        return;
      }

      // Fetch user data
      const userData = await apiService.getUserProfile(targetUsername);
      setUser(userData);
      
      // Fetch user's projects
      const projects = await apiService.getUserProjects(userData._id);
      setUserProjects(projects);
      
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  }, [username, currentUser?.username]);

  useEffect(() => {
    const targetUsername = username || currentUser?.username;
    if (targetUsername) {
      fetchUserProfile();
    }
  }, [username, currentUser?.username, fetchUserProfile]);

  // Loading and error states
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-error">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-not-found">
            <h2>User not found</h2>
            <p>The user you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && user && currentUser.username === user.username;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=007bff&color=fff&size=120`}
              alt={user.name}
            />
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-username">@{user.username}</p>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            {user.location && (
              <p className="profile-location">📍 {user.location}</p>
            )}
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{userProjects.length}</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">{user.followers || 0}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{user.following || 0}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="profile-section">
          <h2>Basic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p>{user.name}</p>
            </div>
            <div className="info-item">
              <label>Username</label>
              <p>@{user.username}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            {user.bio && (
              <div className="info-item full-width">
                <label>Bio</label>
                <p>{user.bio}</p>
              </div>
            )}
            {user.location && (
              <div className="info-item">
                <label>Location</label>
                <p>{user.location}</p>
              </div>
            )}
            {user.website && (
              <div className="info-item">
                <label>Website</label>
                <p>
                  <a href={user.website} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="profile-section">
          <h2>Projects ({userProjects.length})</h2>
          {userProjects.length > 0 ? (
            <div className="projects-grid">
              {userProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <p>No projects found</p>
              {isOwnProfile && (
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/upload')}
                >
                  Upload Your First Project
                </button>
              )}
            </div>
          )}
        </div>

        {/* Social Links (if available) */}
        {(user.github || user.linkedin || user.twitter) && (
          <div className="profile-section">
            <h2>Social Links</h2>
            <div className="social-links">
              {user.github && (
                <a 
                  href={user.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link"
                  aria-label={`${user.name}'s GitHub profile`}
                >
                  <span className="social-icon">📦</span> GitHub
                </a>
              )}
              {user.linkedin && (
                <a 
                  href={user.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link"
                  aria-label={`${user.name}'s LinkedIn profile`}
                >
                  <span className="social-icon">💼</span> LinkedIn
                </a>
              )}
              {user.twitter && (
                <a 
                  href={user.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link"
                  aria-label={`${user.name}'s Twitter profile`}
                >
                  <span className="social-icon">🐦</span> Twitter
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

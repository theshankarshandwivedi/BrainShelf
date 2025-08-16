// src/pages/ProfilePageEditable.jsx
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
  
  // Edit states
  const [editMode, setEditMode] = useState({
    about: false,
    contact: false,
    skills: false
  });
  
  // Form states
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    website: '',
    skills: []
  });
  
  const [newSkill, setNewSkill] = useState('');

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
      
      // Populate form data with user data
      setFormData({
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
        skills: userData.skills || []
      });
      
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

  // Edit helper functions
  const toggleEditMode = (section) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const saveSection = async (section) => {
    try {
      let updateData = {};
      
      switch (section) {
        case 'about':
          updateData = { bio: formData.bio };
          break;
        case 'contact':
          updateData = { 
            location: formData.location, 
            website: formData.website 
          };
          break;
        case 'skills':
          updateData = { skills: formData.skills };
          break;
        case 'education':
          updateData = { education: formData.education };
          break;
        case 'experience':
          updateData = { experience: formData.experience };
          break;
        case 'social':
          updateData = { 
            github: formData.github,
            linkedin: formData.linkedin,
            twitter: formData.twitter
          };
          break;
        default:
          return;
      }

      const updatedUser = await apiService.updateUserProfile(user._id, updateData);
      setUser(updatedUser);
      toggleEditMode(section);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  useEffect(() => {
    const targetUsername = username || currentUser?.username;
    if (targetUsername) {
      fetchUserProfile();
    }
  }, [username, currentUser?.username, fetchUserProfile]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-error">
            <h2>Error loading profile</h2>
            <p>{error}</p>
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

        {/* About Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>📝 About</h2>
            {isOwnProfile && (
              <button 
                className="btn-edit"
                onClick={() => toggleEditMode('about')}
              >
                {editMode.about ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>
          <div className="about-content">
            {editMode.about ? (
              <div className="edit-form">
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Write something about yourself..."
                  className="bio-textarea"
                  rows={6}
                />
                <div className="form-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => saveSection('about')}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleEditMode('about')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {user.bio ? (
                  <p className="bio-text">{user.bio}</p>
                ) : (
                  <div className="empty-content">
                    <p className="empty-text">No bio available</p>
                    {isOwnProfile && (
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => toggleEditMode('about')}
                      >
                        Add Bio
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Contact & Location */}
        <div className="profile-section">
          <div className="section-header">
            <h2>📍 Contact & Location</h2>
            {isOwnProfile && (
              <button 
                className="btn-edit"
                onClick={() => toggleEditMode('contact')}
              >
                {editMode.contact ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>
          {editMode.contact ? (
            <div className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your location"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => saveSection('contact')}
                >
                  Save
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => toggleEditMode('contact')}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="contact-grid">
              <div className="contact-item">
                <span className="contact-label">📧 Email</span>
                <span className="contact-value">{user.email}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">📍 Location</span>
                <span className="contact-value">
                  {user.location || (
                    <span className="empty-value">
                      Not specified
                      {isOwnProfile && <button className="btn-add-info" onClick={() => toggleEditMode('contact')}>+ Add</button>}
                    </span>
                  )}
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-label">🌐 Website</span>
                <span className="contact-value">
                  {user.website ? (
                    <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="website-link">
                      {user.website}
                    </a>
                  ) : (
                    <span className="empty-value">
                      Not provided
                      {isOwnProfile && <button className="btn-add-info" onClick={() => toggleEditMode('contact')}>+ Add</button>}
                    </span>
                  )}
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-label">📅 Member Since</span>
                <span className="contact-value">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Skills Section - Always Visible */}
        <div className="profile-section">
          <div className="section-header">
            <h2>🛠️ Skills & Technologies</h2>
            {isOwnProfile && (
              <button 
                className="btn-edit"
                onClick={() => toggleEditMode('skills')}
              >
                {editMode.skills ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>
          <div className="skills-content">
            {editMode.skills ? (
              <div className="edit-form">
                <div className="skills-edit">
                  <div className="add-skill">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      className="form-input"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={addSkill}
                    >
                      Add
                    </button>
                  </div>
                  <div className="skills-container">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag editable">
                        {skill}
                        <button 
                          className="remove-skill"
                          onClick={() => removeSkill(skill)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="form-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => saveSection('skills')}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleEditMode('skills')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {user.skills && user.skills.length > 0 ? (
                  <div className="skills-container">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="empty-content">
                    <p className="empty-text">No skills listed yet</p>
                    {isOwnProfile && (
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => toggleEditMode('skills')}
                      >
                        Add Skills
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="profile-section">
          <h2>🚀 Projects ({userProjects.length})</h2>
          {userProjects.length > 0 ? (
            <div className="projects-grid">
              {userProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <div className="no-projects-icon">📁</div>
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
      </div>
    </div>
  );
};

export default ProfilePage;

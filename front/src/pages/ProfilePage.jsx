// src/pages/ProfilePageEditable.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import ProjectCard from '../components/ProjectCard';
import FollowButton from '../components/FollowButton';
import FollowersModal from '../components/FollowersModal';
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
    skills: false,
    education: false,
    experience: false,
    social: false
  });
  
  // Form states
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    website: '',
    skills: [],
    education: {
      college: '',
      year: '',
      degree: '',
      field: ''
    },
    experience: [],
    social: {
      github: '',
      linkedin: '',
      twitter: '',
      other: ''
    }
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    position: '',
    company: '',
    duration: '',
    description: ''
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('followers'); // 'followers' or 'following'
  
  // Follow state
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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
      
      // Set follower/following counts
      setFollowersCount(userData.followers || 0);
      setFollowingCount(userData.following || 0);
      
      // Populate form data with user data
      setFormData({
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
        skills: userData.skills || [],
        education: {
          college: userData.education?.college || '',
          year: userData.education?.year || '',
          degree: userData.education?.degree || '',
          field: userData.education?.field || ''
        },
        experience: userData.experience || [],
        social: {
          github: userData.social?.github || '',
          linkedin: userData.social?.linkedin || '',
          twitter: userData.social?.twitter || '',
          other: userData.social?.other || ''
        }
      });
      
      // Fetch user's projects
      console.log('Fetching projects for user:', userData);
      const projects = await apiService.getUserProjects(userData._id);
      console.log('Projects received:', projects);
      setUserProjects(projects);
      
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  }, [username, currentUser?.username]);

  // Modal handlers
  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Follow status change handler
  const handleFollowChange = ({ isFollowing, followersCount: newCount }) => {
    if (newCount !== undefined) {
      setFollowersCount(newCount);
      // Update user object as well
      setUser(prev => ({
        ...prev,
        followers: newCount
      }));
    }
  };

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

  const addExperience = () => {
    if (newExperience.position && newExperience.company) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience, id: Date.now() }]
      }));
      setNewExperience({
        position: '',
        company: '',
        duration: '',
        description: ''
      });
    }
  };

  const removeExperience = (expId) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== expId)
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
              <div className="stat stat-item clickable" onClick={() => handleOpenModal('followers')}>
                <span className="stat-number">{followersCount}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat stat-item clickable" onClick={() => handleOpenModal('following')}>
                <span className="stat-number">{followingCount}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            {/* Follow Button */}
            {user && user._id && (
              <FollowButton
                userId={user._id}
                onFollowChange={handleFollowChange}
              />
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>📝 About</h2>
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
                    className="btn btn-save btn-sm"
                    onClick={() => saveSection('about')}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-cancel btn-sm"
                    onClick={() => toggleEditMode('about')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="section-content">
                {user.bio ? (
                  <p className="bio-text">{user.bio}</p>
                ) : (
                  <div className="empty-content">
                    <p className="empty-text">No bio available</p>
                  </div>
                )}
                {isOwnProfile && (
                  <div className="section-edit-btn">
                    <button 
                      className="btn btn-edit btn-sm"
                      onClick={() => toggleEditMode('about')}
                    >
                      {user.bio ? 'Edit' : 'Add Bio'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact & Location */}
        <div className="profile-section">
          <div className="section-header">
            <h2>📍 Contact & Location</h2>
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
                  className="btn btn-save btn-sm"
                  onClick={() => saveSection('contact')}
                >
                  Save
                </button>
                <button 
                  className="btn btn-cancel btn-sm"
                  onClick={() => toggleEditMode('contact')}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="section-content">
              <div className="contact-grid">
                <div className="contact-item">
                  <span className="contact-label">📧 Email</span>
                  <span className="contact-value">{user.email}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">📍 Location</span>
                  <span className="contact-value">
                    {user.location || <span className="empty-value">Not specified</span>}
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
                      <span className="empty-value">Not provided</span>
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
              {isOwnProfile && (
                <div className="section-edit-btn">
                  <button 
                    className="btn btn-edit btn-sm"
                    onClick={() => toggleEditMode('contact')}
                  >
                    Edit Contact Info
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Skills Section - Always Visible */}
        <div className="profile-section">
          <div className="section-header">
            <h2>🛠️ Skills & Technologies</h2>
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
                      className="btn btn-edit btn-sm"
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
                    className="btn btn-save btn-sm"
                    onClick={() => saveSection('skills')}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-cancel btn-sm"
                    onClick={() => toggleEditMode('skills')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="section-content">
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
                  </div>
                )}
                {isOwnProfile && (
                  <div className="section-edit-btn">
                    <button 
                      className="btn btn-edit btn-sm"
                      onClick={() => toggleEditMode('skills')}
                    >
                      {user.skills && user.skills.length > 0 ? 'Edit Skills' : 'Add Skills'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Education Section - Always Visible */}
        <div className="profile-section">
          <div className="section-header">
            <h2>🎓 Education</h2>
          </div>
          <div className="education-content">
            {editMode.education ? (
              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>College/University</label>
                    <input
                      type="text"
                      value={formData.education.college}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        education: { ...prev.education, college: e.target.value }
                      }))}
                      placeholder="Enter college name..."
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      value={formData.education.year}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        education: { ...prev.education, year: e.target.value }
                      }))}
                      placeholder="e.g., 2020-2024"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      value={formData.education.degree}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        education: { ...prev.education, degree: e.target.value }
                      }))}
                      placeholder="e.g., Bachelor's, Master's"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input
                      type="text"
                      value={formData.education.field}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        education: { ...prev.education, field: e.target.value }
                      }))}
                      placeholder="e.g., Computer Science"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button 
                    className="btn btn-save btn-sm"
                    onClick={() => saveSection('education')}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-cancel btn-sm"
                    onClick={() => toggleEditMode('education')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="section-content">
                {user.education && (user.education.college || user.education.degree) ? (
                  <div className="education-info">
                    <div className="education-item">
                      <strong>{user.education.degree || 'Degree'}</strong>
                      {user.education.field && <span> in {user.education.field}</span>}
                    </div>
                    <div className="education-details">
                      <span>{user.education.college}</span>
                      {user.education.year && <span> • {user.education.year}</span>}
                    </div>
                  </div>
                ) : (
                  <div className="empty-content">
                    <p className="empty-text">No education information added yet</p>
                  </div>
                )}
                {isOwnProfile && (
                  <div className="section-edit-btn">
                    <button 
                      className="btn btn-edit btn-sm"
                      onClick={() => toggleEditMode('education')}
                    >
                      {user.education && (user.education.college || user.education.degree) ? 'Edit Education' : 'Add Education'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Experience Section - Always Visible */}
        <div className="profile-section">
          <div className="section-header">
            <h2>💼 Professional Experience</h2>
          </div>
          <div className="experience-content">
            {editMode.experience ? (
              <div className="edit-form">
                <div className="add-experience">
                  <h4>Add New Experience</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Position/Role</label>
                      <input
                        type="text"
                        value={newExperience.position}
                        onChange={(e) => setNewExperience(prev => ({
                          ...prev,
                          position: e.target.value
                        }))}
                        placeholder="e.g., Software Developer"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience(prev => ({
                          ...prev,
                          company: e.target.value
                        }))}
                        placeholder="e.g., Tech Corp"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="text"
                        value={newExperience.duration}
                        onChange={(e) => setNewExperience(prev => ({
                          ...prev,
                          duration: e.target.value
                        }))}
                        placeholder="e.g., Jan 2020 - Present"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description (Optional)</label>
                    <textarea
                      value={newExperience.description}
                      onChange={(e) => setNewExperience(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                      placeholder="Brief description of your role and responsibilities..."
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                  <button 
                    className="btn btn-edit btn-sm"
                    onClick={addExperience}
                  >
                    Add Experience
                  </button>
                </div>

                {formData.experience.length > 0 && (
                  <div className="experience-list">
                    <h4>Current Experience</h4>
                    {formData.experience.map((exp) => (
                      <div key={exp.id} className="experience-item editable">
                        <div className="experience-header">
                          <strong>{exp.position}</strong>
                          <span className="company"> at {exp.company}</span>
                          <button 
                            className="remove-experience"
                            onClick={() => removeExperience(exp.id)}
                          >
                            ×
                          </button>
                        </div>
                        <div className="experience-duration">{exp.duration}</div>
                        {exp.description && (
                          <div className="experience-description">{exp.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    className="btn btn-save btn-sm"
                    onClick={() => saveSection('experience')}
                  >
                    Save All Changes
                  </button>
                  <button 
                    className="btn btn-cancel btn-sm"
                    onClick={() => toggleEditMode('experience')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="section-content">
                {user.experience && user.experience.length > 0 ? (
                  <div className="experience-list">
                    {user.experience.map((exp, index) => (
                      <div key={index} className="experience-item">
                        <div className="experience-header">
                          <strong>{exp.position}</strong>
                          <span className="company"> at {exp.company}</span>
                        </div>
                        <div className="experience-duration">{exp.duration}</div>
                        {exp.description && (
                          <div className="experience-description">{exp.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-content">
                    <p className="empty-text">No professional experience added yet</p>
                  </div>
                )}
                {isOwnProfile && (
                  <div className="section-edit-btn">
                    <button 
                      className="btn btn-edit btn-sm"
                      onClick={() => toggleEditMode('experience')}
                    >
                      {user.experience && user.experience.length > 0 ? 'Edit Experience' : 'Add Experience'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Social Links Section - Always Visible */}
        <div className="profile-section">
          <div className="section-header">
            <h2>🔗 Social Links</h2>
          </div>
          <div className="social-content">
            {editMode.social ? (
              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>🐙 GitHub</label>
                    <input
                      type="text"
                      value={formData.social.github}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social: { ...prev.social, github: e.target.value }
                      }))}
                      placeholder="GitHub username or URL"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>💼 LinkedIn</label>
                    <input
                      type="text"
                      value={formData.social.linkedin}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social: { ...prev.social, linkedin: e.target.value }
                      }))}
                      placeholder="LinkedIn profile URL"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>🐦 Twitter</label>
                    <input
                      type="text"
                      value={formData.social.twitter}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social: { ...prev.social, twitter: e.target.value }
                      }))}
                      placeholder="Twitter username or URL"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>📧 Other</label>
                    <input
                      type="text"
                      value={formData.social.other}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        social: { ...prev.social, other: e.target.value }
                      }))}
                      placeholder="Portfolio, blog, or other URL"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button 
                    className="btn btn-save btn-sm"
                    onClick={() => saveSection('social')}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-cancel btn-sm"
                    onClick={() => toggleEditMode('social')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="section-content">
                {user.social && (user.social.github || user.social.linkedin || user.social.twitter || user.social.other) ? (
                  <div className="social-links">
                    {user.social.github && (
                      <a 
                        href={user.social.github.startsWith('http') ? user.social.github : `https://github.com/${user.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        🐙 GitHub
                      </a>
                    )}
                    {user.social.linkedin && (
                      <a 
                        href={user.social.linkedin.startsWith('http') ? user.social.linkedin : `https://linkedin.com/in/${user.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        💼 LinkedIn
                      </a>
                    )}
                    {user.social.twitter && (
                      <a 
                        href={user.social.twitter.startsWith('http') ? user.social.twitter : `https://twitter.com/${user.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        🐦 Twitter
                      </a>
                    )}
                    {user.social.other && (
                      <a 
                        href={user.social.other.startsWith('http') ? user.social.other : `https://${user.social.other}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        🔗 Other
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="empty-content">
                    <p className="empty-text">No social links added yet</p>
                  </div>
                )}
                {isOwnProfile && (
                  <div className="section-edit-btn">
                    <button 
                      className="btn btn-edit btn-sm"
                      onClick={() => toggleEditMode('social')}
                    >
                      {user.social && (user.social.github || user.social.linkedin || user.social.twitter || user.social.other) ? 'Edit Social Links' : 'Add Social Links'}
                    </button>
                  </div>
                )}
              </div>
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

      {/* Followers/Following Modal */}
      <FollowersModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        userId={user?._id}
        type={modalType}
        username={user?.username}
      />
    </div>
  );
};

export default ProfilePage;

// src/components/ProjectModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

const ProjectModal = ({ project, isOpen, onClose, onProjectDeleted }) => {
  const [userRating, setUserRating] = useState(0);
  const [currentAverage, setCurrentAverage] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    onClose(); // Close the modal first
    navigate(`/projects?search=${encodeURIComponent(tag)}`);
  };

  const handleDeleteClick = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await ApiService.deleteProject(project._id);
      if (onProjectDeleted) {
        onProjectDeleted(project._id);
      }
      onClose(); // Close the modal
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if current user owns this project
  const canDelete = isAuthenticated && user && project?.user === user.username;

  const fetchUserRating = useCallback(async () => {
    if (!project?._id || !isAuthenticated) return;
    
    try {
      const response = await ApiService.getUserRating(project._id);
      if (response.success) {
        setUserRating(response.data.userRating || 0);
        setCurrentAverage(response.data.averageRating || 0);
        setTotalRatings(response.data.totalRatings || 0);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  }, [project?._id, isAuthenticated]);

  useEffect(() => {
    if (project && isOpen) {
      setCurrentAverage(project.averageRating || 0);
      setTotalRatings(project.totalRatings || 0);
      
      // Fetch user's existing rating if authenticated
      if (isAuthenticated && user) {
        fetchUserRating();
      }
    }
  }, [project, isOpen, isAuthenticated, user, fetchUserRating]);

  const handleRatingSubmit = async (newRating) => {
    if (!isAuthenticated || !user) {
      alert('You must be logged in to rate projects.');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting rating:', { projectId: project._id, rating: newRating, user: user });
      const response = await ApiService.rateProject(project._id, newRating);
      console.log('Rating response:', response);
      
      if (response.success) {
        setUserRating(newRating);
        setCurrentAverage(response.data.averageRating);
        setTotalRatings(response.data.totalRatings);
        alert('Rating submitted successfully!');
      } else {
        console.error('Rating failed:', response);
        alert(`Failed to submit rating: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      let errorMessage = 'Failed to submit rating. Please try again.';
      
      // More specific error messages
      if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Project not found.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid rating value.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{project.name}</h2>
          <div className="modal-header-actions">
            {canDelete && (
              <button 
                className="modal-delete-btn" 
                onClick={handleDeleteClick}
                disabled={isDeleting}
                title="Delete project"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
        
        <div className="modal-body">
          <div className="project-modal-meta">
            <span className="project-author">
              By {project.user?.name || project.user?.username || project.user} 
              {project.user?.username && ` (@${project.user.username})`}
            </span>
            {project.githubLink && (
              <div className="project-github-link">
                <a 
                  href={project.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  <svg className="github-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="white"/>
                  </svg>
                  View on GitHub
                </a>
              </div>
            )}
            <div className="project-tags">
              {project.tags?.map(tag => (
                <span 
                  key={tag} 
                  className="tag clickable" 
                  onClick={() => handleTagClick(tag)}
                  title={`Search for projects with "${tag}" tag`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <img 
            src={project.image} 
            alt={project.name} 
            className="project-modal-image" 
          />
          
          <div className="project-modal-content">
            <h3>About this Project</h3>
            <p className="project-description">
              {project.description?.long || project.description}
            </p>
          </div>

          <div className="project-rating-section">
            <h4>Project Rating</h4>
            <div className="rating-display">
              <div className="current-rating">
                <span>Average Rating: </span>
                <StarRating 
                  rating={currentAverage} 
                  interactive={false}
                  size="medium"
                  showNumber={true}
                />
                <span className="total-ratings">({totalRatings} ratings)</span>
              </div>
              
              {isAuthenticated ? (
                <div className="user-rating">
                  <h5>Your Rating:</h5>
                  <StarRating 
                    rating={userRating}
                    onRatingChange={handleRatingSubmit}
                    interactive={!loading}
                    size="large"
                    showNumber={false}
                  />
                  {loading && <span>Submitting...</span>}
                  {userRating > 0 && <span>You rated: {userRating} stars</span>}
                </div>
              ) : (
                <p className="login-prompt">
                  You must be logged in to rate projects.
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

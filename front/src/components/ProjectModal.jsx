// src/components/ProjectModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [userRating, setUserRating] = useState(0);
  const [currentAverage, setCurrentAverage] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated, user } = useAuth();

  const fetchUserRating = useCallback(async () => {
    if (!project?._id || !user?.id) return;
    
    try {
      const response = await ApiService.getUserRating(project._id, user.id);
      setUserRating(response.userRating || 0);
      setCurrentAverage(response.averageRating || 0);
      setTotalRatings(response.totalRatings || 0);
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  }, [project?._id, user?.id]);

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
      const response = await ApiService.rateProject(project._id, newRating, user.id);
      setUserRating(newRating);
      setCurrentAverage(response.averageRating);
      setTotalRatings(response.totalRatings);
      alert(response.message);
    } catch (error) {
      alert(error.message || 'Failed to submit rating');
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
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="project-modal-meta">
            <span className="project-author">
              By {project.user?.name || project.user?.username || project.user} 
              {project.user?.username && ` (@${project.user.username})`}
            </span>
            <div className="project-tags">
              {project.tags?.map(tag => (
                <span key={tag} className="tag">{tag}</span>
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

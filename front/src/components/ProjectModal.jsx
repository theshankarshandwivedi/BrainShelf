// src/components/ProjectModal.jsx

import React, { useState } from 'react';
import Rating from './Rating';

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [userRating, setUserRating] = useState(0);
  
  // This would come from your auth context
  const isAuthenticated = true;

  const handleRatingSubmit = (newRating) => {
    if (!isAuthenticated) {
      alert('You must be logged in to rate projects.');
      return;
    }
    setUserRating(newRating);
    // API call to submit the rating to `/api/projects/${project._id}/rate`
    alert(`You rated this project ${newRating} stars!`);
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
              By {project.user?.name || project.user?.username} (@{project.user.username})
            </span>
            <div className="project-tags">
              {project.tags.map(tag => (
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
              {project.description?.long || project.description?.short}
            </p>
          </div>

          <div className="project-rating-section">
            <h4>Rate this Project</h4>
            <div className="rating-display">
              <span>Current Rating: {project.rating.toFixed(1)} / 5.0</span>
              <Rating 
                value={userRating || project.rating} 
                onRate={handleRatingSubmit} 
                readOnly={!isAuthenticated}
              />
            </div>
            {!isAuthenticated && (
              <p className="login-prompt">
                You must be logged in to rate projects.
              </p>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary">
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

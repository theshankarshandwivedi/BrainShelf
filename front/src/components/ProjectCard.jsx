// src/components/ProjectCard.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import ApiService from '../services/api';

const ProjectCard = ({ project, onClick, onProjectDeleted }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!project) return null;

  const handleCardClick = () => {
    if (onClick) {
      onClick(project);
    }
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking author
  };

  const handleTagClick = (e, tag) => {
    e.stopPropagation(); // Prevent card click when clicking tag
    navigate(`/projects?search=${encodeURIComponent(tag)}`);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await ApiService.deleteProject(project._id);
      if (onProjectDeleted) {
        onProjectDeleted(project._id);
      }
      // Optionally show success message
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if current user owns this project
  const canDelete = isAuthenticated && user && project.user === user.username;

  return (
    <div className="project-card" onClick={handleCardClick}>
      <div className="project-card-image-container">
        <img src={project.image} alt={project.name} className="project-card-image" />
        {/* Username overlay on top right of image */}
        <Link 
          to={`/profile/${project.user?.username || project.user}`}
          className="project-card-author-overlay"
          onClick={handleAuthorClick}
        >
          @{project.user?.username || project.user}
        </Link>
      </div>
      
      <div className="project-card-body">
        <div className="project-card-header">
          <h3 className="project-card-title">{project.name}</h3>
          <div className="project-card-actions">
            {/* GitHub icon */}
            <div className="project-card-github">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="currentColor"/>
              </svg>
            </div>
            {/* Delete button - only show if user owns this project */}
            {canDelete && (
              <button
                className="project-card-delete-btn"
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
          </div>
        </div>
        
        {/* Fixed space for description */}
        <div className="project-card-description-container">
          <p className="project-card-description">
            {project.description?.short || project.description}
          </p>
        </div>
        
        {/* Tags below description */}
        {project.tags && project.tags.length > 0 && (
          <div className="project-card-tags">
            {project.tags.map((tag, index) => (
              <span 
                key={index} 
                className="project-tag clickable" 
                onClick={(e) => handleTagClick(e, tag)}
                title={`Search for projects with "${tag}" tag`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Rating at bottom - single line format */}
        <div className="project-rating-section">
          <div className="project-rating-single-line">
            <span className="rating-value">{(project.averageRating || 0).toFixed(1)}</span>
            <StarRating 
              rating={project.averageRating || 0} 
              interactive={false}
              size="small"
              showNumber={false}
            />
            <span className="total-ratings">({project.totalRatings || 0} ratings)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
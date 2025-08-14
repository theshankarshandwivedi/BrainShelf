// src/components/ProjectCard.jsx

import React from 'react';
import StarRating from './StarRating';

const ProjectCard = ({ project, onClick }) => {
  if (!project) return null;

  const handleCardClick = () => {
    if (onClick) {
      onClick(project);
    }
  };

  return (
    <div className="project-card" onClick={handleCardClick}>
      <img src={project.image} alt={project.name} className="project-card-image" />
      <div className="project-card-body">
        <h3 className="project-card-title">{project.name}</h3>
        <p className="project-card-description">
          {project.description?.short || project.description}
        </p>
        <div className="project-card-footer">
          <span className="project-card-author">by @{project.user?.username || project.user}</span>
          <div className="project-rating">
            <StarRating 
              rating={project.averageRating || 0} 
              interactive={false}
              size="small"
              showNumber={true}
            />
            <span className="total-ratings">({project.totalRatings || 0} ratings)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
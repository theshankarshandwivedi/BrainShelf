// src/components/ProjectCard.jsx

import React from 'react';
import Rating from './Rating'; // A component to display stars

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
        <p className="project-card-description">{project.description.short}</p>
        <div className="project-card-footer">
          <span className="project-card-author">by @{project.user.username}</span>
          <Rating value={project.rating} readOnly={true} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
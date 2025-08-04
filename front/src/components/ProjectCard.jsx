// src/components/ProjectCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating'; // A component to display stars

const ProjectCard = ({ project }) => {
  if (!project) return null;

  return (
    <div className="project-card">
      <Link to={`/project/${project._id}`} className="card-link">
        <img src={project.image} alt={project.name} className="project-card-image" />
        <div className="project-card-body">
          <h3 className="project-card-title">{project.name}</h3>
          <p className="project-card-description">{project.description.short}</p>
          <div className="project-card-footer">
            <span className="project-card-author">by @{project.user.username}</span>
            <Rating value={project.rating} readOnly={true} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
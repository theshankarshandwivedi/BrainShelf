// src/pages/ProjectDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Rating from '../components/Rating';

// Dummy data for a single project
const dummyProjectDetails = {
  _id: '1',
  name: 'AI-Powered Chatbot',
  image: 'https://via.placeholder.com/800x600',
  rating: 4.5,
  user: {
    name: 'Jane Doe',
    username: 'janedoe',
    educationalDetails: 'M.S. in Computer Science, Stanford University',
  },
  description: {
    short: 'A chatbot using NLP to understand user queries.',
    long: 'This project is a sophisticated AI-powered chatbot built with the MERN stack and integrated with the Dialogflow API for natural language processing. It features real-time communication via WebSockets, user authentication, and a dashboard for analyzing conversation logs. The goal was to create a seamless and intelligent conversational agent for customer support applications.'
  },
  tags: ['AI', 'React', 'Node.js', 'WebSocket', 'Dialogflow'],
};


const ProjectDetailPage = () => {
  const { id } = useParams(); // Gets the project ID from the URL (e.g., /project/1)
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // This would come from your auth context
  const isAuthenticated = true;

  useEffect(() => {
    // Fetch project details from `/api/projects/${id}`
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setProject(dummyProjectDetails);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleRatingSubmit = (newRating) => {
    if (!isAuthenticated) {
      // Redirect to login page, passing the current page as the redirect destination
      navigate(`/login?redirect=/project/${id}`);
      return;
    }
    // API call to submit the rating to `/api/projects/${id}/rate`
    alert(`You rated this project ${newRating} stars!`);
    // Ideally, you would refetch the project to get the new average rating
  };

  if (loading) return <div className="loader">Loading Project Details...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="project-detail-container">
      <h1 className="project-detail-title">{project.name}</h1>
      <div className="project-detail-meta">
        <span>By {project.user.name} (@{project.user.username})</span>
        <div className="project-tags">
          {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>

      <img src={project.image} alt={project.name} className="project-detail-image" />
      
      <div className="project-detail-content">
        <h2>About this Project</h2>
        <p>{project.description.long}</p>
      </div>

      <div className="project-rating-section">
        <h3>Rate this Project</h3>
        <p>Current Rating: {project.rating.toFixed(1)} / 5.0</p>
        <Rating 
          value={project.rating} 
          onRate={handleRatingSubmit} 
          readOnly={!isAuthenticated}
        />
        {!isAuthenticated && <p>You must be <a href="/login">logged in</a> to rate.</p>}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
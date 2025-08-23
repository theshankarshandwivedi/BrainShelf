import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Rating from '../components/Rating';
import ApiService from '../services/api';

const ProjectDetailPage = () => {
  const { id } = useParams(); // Gets the project ID from the URL (e.g., /project/1)
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // This would come from your auth context
  const isAuthenticated = true;

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getProject(id);
        setProject(response.project);
      } catch (error) {
        console.error('Error fetching project:', error);
        // Handle error - maybe navigate back or show error message
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
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
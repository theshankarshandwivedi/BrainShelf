import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import ApiService from '../services/api';

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleProjectDeleted = (deletedProjectId) => {
    // Remove the deleted project from the list
    setProjects(prevProjects => 
      prevProjects.filter(project => project._id !== deletedProjectId)
    );
    // Close modal if the deleted project was selected
    if (selectedProject && selectedProject._id === deletedProjectId) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await ApiService.getAllProjects();
        // Show only first 4 projects on home page
        setProjects((response.projects || []).slice(0, 4));
      } catch (error) {
        console.error('Error fetching projects:', error);
        // No fallback - show empty state
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="loader">Loading projects...</div>;
  }

  return (
    <div className="homepage-container">
      <div>
        <h1>Welcome to BrainShelf</h1>
        <p>Your hub for discovering, sharing, and showcasing innovative developer projects.</p>
      </div>
      <header className="homepage-header">
        
      </header>
      <main className="project-grid">
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onClick={handleProjectClick}
              onProjectDeleted={handleProjectDeleted}
            />
          ))
        ) : (
          <p>No projects found. Be the first to upload one!</p>
        )}
      </main>

      {/* See More Projects Button */}
      {projects.length > 0 && (
        <div className="see-more-container">
          <Link to="/projects" className="button-32">
            <svg className="see-more-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L12 22M12 22L18 16M12 22L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>See More Projects</span>
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      )}
      
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomePage;
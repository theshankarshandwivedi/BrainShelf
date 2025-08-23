import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import ApiService from '../services/api';
import './AllProjectsPage.css';

const AllProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [searchParams] = useSearchParams();

  // Initialize search term from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Update URL without causing a navigation
    const newUrl = value ? 
      `${window.location.pathname}?search=${encodeURIComponent(value)}` : 
      window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  };

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
        setProjects(response.projects || []);
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

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.tags && project.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return <div className="loader">Loading all projects...</div>;
  }

  return (
    <div className="all-projects-page">
      <div className="page-header">
        <h1>All Projects</h1>
        <p>Discover amazing projects from our community</p>
      </div>

      <div className="projects-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
          <option value="newest">Sort by Newest</option>
        </select>
      </div>

      <div className="projects-grid">
        {filteredAndSortedProjects.length > 0 ? (
          filteredAndSortedProjects.map(project => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onClick={handleProjectClick}
              onProjectDeleted={handleProjectDeleted}
            />
          ))
        ) : (
          <div className="no-projects">
            {searchTerm ? 
              <p>No projects found matching "{searchTerm}"</p> :
              <p>No projects available yet. Be the first to upload one!</p>
            }
          </div>
        )}
      </div>
      
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AllProjectsPage;

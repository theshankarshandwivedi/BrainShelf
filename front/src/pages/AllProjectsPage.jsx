// src/pages/AllProjectsPage.jsx

import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import ApiService from '../services/api';
import './AllProjectsPage.css';

// Dummy data fallback
const dummyProjects = [
  { 
    _id: '1', 
    name: 'AI-Powered Chatbot', 
    image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', 
    averageRating: 4.5,
    totalRatings: 12,
    ratings: [],
    user: 'janedoe', 
    description: 'A chatbot using NLP to understand user queries. This project is a sophisticated AI-powered chatbot built with the MERN stack and integrated with the Dialogflow API for natural language processing.',
    tags: ['AI', 'React', 'Node.js'] 
  },
  { 
    _id: '2', 
    name: 'E-commerce Platform', 
    image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', 
    averageRating: 4.8,
    totalRatings: 25,
    ratings: [],
    user: 'johnsmith', 
    description: 'A full-stack e-commerce site with payment integration. A comprehensive e-commerce platform built with the MERN stack featuring user authentication and payment processing.',
    tags: ['MERN', 'Stripe'] 
  },
  { 
    _id: '3', 
    name: 'Portfolio Website Builder', 
    image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', 
    averageRating: 4.2,
    totalRatings: 8,
    ratings: [],
    user: 'dev_user', 
    description: 'A tool to quickly generate and deploy portfolio websites. A drag-and-drop portfolio website builder that allows developers and designers to create professional portfolios.',
    tags: ['Next.js', 'Vercel'] 
  },
  { 
    _id: '4', 
    name: 'Weather App', 
    image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', 
    averageRating: 3.9,
    totalRatings: 15,
    ratings: [],
    user: 'weatherdev', 
    description: 'A responsive weather application with location-based forecasts.',
    tags: ['React', 'API'] 
  },
  { 
    _id: '5', 
    name: 'Task Management Tool', 
    image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', 
    averageRating: 4.6,
    totalRatings: 20,
    ratings: [],
    user: 'productivityguru', 
    description: 'A collaborative task management platform with real-time updates.',
    tags: ['Vue.js', 'Socket.io'] 
  },
];

const AllProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await ApiService.getAllProjects();
        setProjects(response.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to dummy data
        setProjects(dummyProjects);
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
            onChange={(e) => setSearchTerm(e.target.value)}
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

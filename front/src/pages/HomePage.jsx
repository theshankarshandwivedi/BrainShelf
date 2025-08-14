// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import ApiService from '../services/api';

// Dummy data to simulate API response
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
];


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

  if (loading) {
    return <div className="loader">Loading projects...</div>;
  }

  return (
    <div className="homepage-container">
      <div>
      <h1>Welcome to BrainShelf</h1>
      <p>Your one-stop solution for all your project needs.</p>
    </div>
      <header className="homepage-header">
        <h1>Discover Amazing Projects</h1>
        <p>Explore projects from developers and designers around the world.</p>
        {/* You can add a search bar here */}
      </header>
      <main className="project-grid">
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onClick={handleProjectClick}
            />
          ))
        ) : (
          <p>No projects found. Be the first to upload one!</p>
        )}
      </main>
      
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomePage;
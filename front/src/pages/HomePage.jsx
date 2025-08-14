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
    rating: 4.5, 
    user: { username: 'janedoe', name: 'Jane Doe' }, 
    description: { 
      short: 'A chatbot using NLP to understand user queries.',
      long: 'This project is a sophisticated AI-powered chatbot built with the MERN stack and integrated with the Dialogflow API for natural language processing. It features real-time communication via WebSockets, user authentication, and a dashboard for analyzing conversation logs. The goal was to create a seamless and intelligent conversational agent for customer support applications.'
    }, 
    tags: ['AI', 'React', 'Node.js'] 
  },
  { 
    _id: '2', 
    name: 'E-commerce Platform', 
    image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', 
    rating: 4.8, 
    user: { username: 'johnsmith', name: 'John Smith' }, 
    description: { 
      short: 'A full-stack e-commerce site with payment integration.',
      long: 'A comprehensive e-commerce platform built with the MERN stack featuring user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and an admin dashboard. The platform includes features like product search, filtering, reviews, and real-time inventory management.'
    }, 
    tags: ['MERN', 'Stripe'] 
  },
  { 
    _id: '3', 
    name: 'Portfolio Website Builder', 
    image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', 
    rating: 4.2, 
    user: { username: 'dev_user', name: 'Dev User' }, 
    description: { 
      short: 'A tool to quickly generate and deploy portfolio websites.',
      long: 'A drag-and-drop portfolio website builder that allows developers and designers to create professional portfolios without coding. Features include customizable templates, project showcases, contact forms, blog integration, and one-click deployment to various hosting platforms.'
    }, 
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
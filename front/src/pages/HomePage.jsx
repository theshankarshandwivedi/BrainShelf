// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';

// Dummy data to simulate API response
const dummyProjects = [
  { _id: '1', name: 'AI-Powered Chatbot', image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', rating: 4.5, user: { username: 'janedoe' }, description: { short: 'A chatbot using NLP to understand user queries.' }, tags: ['AI', 'React', 'Node.js'] },
  { _id: '2', name: 'E-commerce Platform', image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', rating: 4.8, user: { username: 'johnsmith' }, description: { short: 'A full-stack e-commerce site with payment integration.' }, tags: ['MERN', 'Stripe'] },
  { _id: '3', name: 'Portfolio Website Builder', image: 'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=', rating: 4.2, user: { username: 'dev_user' }, description: { short: 'A tool to quickly generate and deploy portfolio websites.' }, tags: ['Next.js', 'Vercel'] },
];


const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });

    // Simulating API call
    setTimeout(() => {
      setProjects(dummyProjects);
      setLoading(false);
    }, 1000);
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
          projects.map(project => <ProjectCard key={project._id} project={project} />)
        ) : (
          <p>No projects found. Be the first to upload one!</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
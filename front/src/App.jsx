import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import UploadProjectPage from './pages/UploadProject';
import ProjectCard from './components/ProjectCard';
import Rating from './components/Rating';
import HomePage from './pages/HomePage'; 
import Footer from './components/Footer';


function App() {
  return (
  <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadProjectPage />} />
        <Route path="/projects/:id" element={<ProjectCard />} />
        <Route path="/projects/:id/rating" element={<Rating />} />
      </Routes>
    </Router>
  </>
    
  );
}

export default App;

import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import UploadProjectPage from './pages/UploadProject';
import ProjectCard from './components/ProjectCard';
import Rating from './components/Rating';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadProjectPage />
            </ProtectedRoute>
          } />
          <Route path="/projects/:id" element={<ProjectCard />} />
          <Route path="/projects/:id/rating" element={<Rating />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

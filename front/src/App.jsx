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
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
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
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

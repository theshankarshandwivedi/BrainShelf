// src/pages/ProfilePage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  
  console.log('ProfilePage component mounted with:', { username, currentUser });
  
  // For now, let's just render a simple test component
  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Profile Page Test</h1>
        <p>Username from params: {username || 'None'}</p>
        <p>Current user: {currentUser?.username || 'Not logged in'}</p>
        <p>This is a test to see if routing works</p>
        
        {username && (
          <div>
            <h2>Profile for: @{username}</h2>
            <p>This would be {username}'s profile page.</p>
          </div>
        )}
        
        {!username && currentUser && (
          <div>
            <h2>Your Profile</h2>
            <p>Welcome, {currentUser.username}!</p>
            <p>This would be your profile page.</p>
          </div>
        )}
        
        {!username && !currentUser && (
          <div>
            <h2>Please log in</h2>
            <p>You need to be logged in to view profiles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

// src/pages/UploadProjectPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

const UploadProjectPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTagInput = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (tagInput && !tags.includes(tagInput)) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      // Add additional fields
      formData.append('user', user?.username || 'Anonymous');
      formData.append('tags', JSON.stringify(tags));
      
      await ApiService.uploadProject(formData);
      alert('Project uploaded successfully!');
      navigate('/');
    } catch (error) {
      alert(error.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page-container">
      <h2>Upload Your Project</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="name">Project Name</label>
          <input type="text" id="name" name="name" required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="8" required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="githubLink">GitHub Repository URL</label>
          <input 
            type="url" 
            id="githubLink" 
            name="githubLink" 
            placeholder="https://github.com/username/repository"
            pattern="https://github\.com/[a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+"
            title="Please enter a valid GitHub repository URL"
          />
          <small className="form-help">Optional: Link to your project's GitHub repository</small>
        </div>

        <div className="form-group">
          <label htmlFor="imgFile">Project Image</label>
          <input type="file" id="imgFile" name="imgFile" accept="image/*" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Tags (press Space or Enter to add)</label>
          <div className="tag-input-container">
             {tags.map(tag => (
              <div key={tag} className="tag">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>&times;</button>
              </div>
            ))}
            <input 
              type="text" 
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              placeholder="e.g., React, AI, Design"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Submit Project'}
        </button>
      </form>
    </div>
  );
};

export default UploadProjectPage;
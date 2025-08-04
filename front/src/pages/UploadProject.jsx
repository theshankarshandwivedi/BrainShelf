// src/pages/UploadProjectPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadProjectPage = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // In a real app, you'd handle file uploads properly
    const projectData = {
      name: formData.get('name'),
      shortDescription: formData.get('shortDescription'),
      longDescription: formData.get('longDescription'),
      image: formData.get('image'), // This would be a file object
      tags: tags
    };

    console.log("Uploading project:", projectData);
    // Make POST request to `/api/projects`
    alert('Project uploaded successfully!');
    navigate('/'); // Navigate to homepage after upload
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
          <label htmlFor="shortDescription">Short Description (Max 150 characters)</label>
          <input type="text" id="shortDescription" name="shortDescription" maxLength="150" required />
        </div>

        <div className="form-group">
          <label htmlFor="longDescription">Long Description</label>
          <textarea id="longDescription" name="longDescription" rows="8" required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="image">Project Image</label>
          <input type="file" id="image" name="image" accept="image/*" required />
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

        <button type="submit" className="btn btn-primary">Submit Project</button>
      </form>
    </div>
  );
};

export default UploadProjectPage;
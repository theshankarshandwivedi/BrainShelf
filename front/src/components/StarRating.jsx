// src/components/StarRating.jsx
import React, { useState } from 'react';

const StarRating = ({
  rating = 0, 
  onRatingChange = null, 
  interactive = false, 
  size = 'medium',
  showNumber = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const starCount = 5;
  const currentRating = hoverRating || rating;
  
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };
  
  const handleClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };
  
  const handleMouseEnter = (starValue) => {
    if (interactive) {
      setHoverRating(starValue);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  return (
    <div className={`star-rating ${sizeClasses[size]} ${interactive ? 'interactive' : ''}`}>
      <div className="stars">
        {[...Array(starCount)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= currentRating;
          
          return (
            <span
              key={index}
              className={`star ${isFilled ? 'filled' : 'empty'} ${interactive ? 'clickable' : ''}`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              style={{
                color: isFilled ? '#ffd700' : '#ccc',
                cursor: interactive ? 'pointer' : 'default',
                transition: 'color 0.2s ease'
              }}
            >
              ★
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span className="rating-number" style={{ marginLeft: '8px' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;

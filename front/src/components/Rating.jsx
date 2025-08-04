// src/components/Rating.jsx

import React, { useState } from 'react';

const Rating = ({ value, onRate, readOnly = false }) => {
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0);

  const handleClick = (newValue) => {
    if (!readOnly && onRate) {
      onRate(newValue);
    }
  };

  const handleMouseOver = (newHoverValue) => {
    if (!readOnly) {
      setHoverValue(newHoverValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(undefined);
    }
  };

  return (
    <div className="rating-stars">
      {stars.map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${readOnly ? 'read-only' : ''} ${(hoverValue || value) >= ratingValue ? 'filled' : ''}`}
            onClick={() => handleClick(ratingValue)}
            onMouseOver={() => handleMouseOver(ratingValue)}
            onMouseLeave={handleMouseLeave}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
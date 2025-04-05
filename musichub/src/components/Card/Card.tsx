// src/components/Card/Card.tsx
import React from 'react';
import './Card.css';

// Define the interface for the props
interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  type: 'music' | 'merch' | 'artist'; // Type can only be one of these strings
  link?: string; // Link is optional (indicated by ?) and should be a string if provided
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void; // Add onClick handler
}

// Apply the interface to the component's props
const Card: React.FC<CardProps> = ({ title, description, imageUrl, type, link = '#', onClick }) => {
  // Add a class for music and merch cards to indicate they're interactive
  const cardClassName = `card smooth-transition card-type-${type} ${type === 'music' || type === 'merch' ? 'playable-card' : ''}`;
  
  return (
    <a 
      href={link} 
      className="card-link" 
      target={type === 'artist' ? "_blank" : ""} 
      rel={type === 'artist' ? "noopener noreferrer" : ""}
      onClick={onClick}
    >
      <div className={cardClassName}>
        <div className="card-image-container">
          <img src={imageUrl} alt={title} className="card-image" />
          {type === 'music' && (
            <div className="play-overlay">
              <div className="play-icon"></div>
              <span className="preview-text">Preview</span>
            </div>
          )}
          {type === 'merch' && (
            <div className="play-overlay merch-overlay">
              <div className="details-icon"></div>
              <span className="preview-text">View Details</span>
            </div>
          )}
        </div>
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <span className="card-type-badge">{type}</span>
        </div>
      </div>
    </a>
  );
};

export default Card;
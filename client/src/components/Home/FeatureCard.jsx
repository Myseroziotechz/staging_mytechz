import React from 'react';
import './FeatureCard.css';

const FeatureCard = ({ icon, title, description, onClick, className = '' }) => {
  return (
    <div 
      className={`feature-card-component ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="feature-card-icon">
        {typeof icon === 'string' ? <i className={icon}></i> : icon}
      </div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </div>
  );
};

export default FeatureCard;

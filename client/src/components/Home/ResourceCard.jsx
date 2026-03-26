import React from 'react';
import './ResourceCard.css';

const ResourceCard = ({ icon, title, description, meta, badge, onClick }) => {
  return (
    <div 
      className="resource-card-component"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="resource-card-icon">
        <i className={icon}></i>
      </div>
      <h3 className="resource-card-title">{title}</h3>
      <p className="resource-card-description">{description}</p>
      {meta && (
        <div className="resource-card-meta">
          {meta.map((item, index) => (
            <span key={index}>
              <i className={item.icon}></i> {item.text}
            </span>
          ))}
          {badge && (
            <span className={`resource-badge-component ${badge.toLowerCase()}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceCard;

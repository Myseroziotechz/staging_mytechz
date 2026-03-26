import React from 'react';
import './SkillCard.css';

const SkillCard = ({ icon, title, demand, jobCount, onClick }) => {
  return (
    <div 
      className="skill-card-component"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="skill-card-icon">{icon}</div>
      <h4 className="skill-card-title">{title}</h4>
      <div className="skill-card-demand">
        <span className={`demand-badge-component ${demand.toLowerCase()}`}>
          {demand}
        </span>
        <span className="job-count-component">{jobCount}</span>
      </div>
    </div>
  );
};

export default SkillCard;

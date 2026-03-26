import React from 'react';
import './StatsCard.css';

const StatsCard = ({ icon, number, label, color = 'primary' }) => {
  return (
    <div className={`stats-card-component ${color}`}>
      <div className="stats-icon">
        <i className={icon}></i>
      </div>
      <div className="stats-content">
        <div className="stats-number">{number}</div>
        <div className="stats-label">{label}</div>
      </div>
    </div>
  );
};

export default StatsCard;

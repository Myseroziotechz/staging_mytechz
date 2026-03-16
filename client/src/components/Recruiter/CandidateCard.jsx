import React, { useState } from 'react';
import './CandidateCard.css';

function CandidateCard({ candidate, onSave, onView }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(candidate.id);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#6366f1', '#8b5cf6', '#06b6d4', '#4A90E2', 
      '#f59e0b', '#ef4444', '#ec4899', '#84cc16'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="candidate-card">
      <div className="candidate-card-header">
        <div className="candidate-avatar" style={{ backgroundColor: getAvatarColor(candidate.name) }}>
          {candidate.profilePhoto ? (
            <img src={candidate.profilePhoto} alt={candidate.name} />
          ) : (
            <span className="avatar-initials">{getInitials(candidate.name)}</span>
          )}
        </div>
        
        <div className="candidate-basic-info">
          <div className="candidate-role-badge">Professional</div>
          <div className="candidate-salary">
            <i className="ri-money-dollar-circle-line"></i>
          </div>
          <button
            className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            title={isSaved ? 'Remove from saved' : 'Save profile'}
          >
            <i className="ri-bookmark-line"></i>
          </button>
        </div>
      </div>

      <div className="candidate-details-section">
        <div className="candidate-name-section">
          <h3 className="candidate-name">{candidate.name}</h3>
          <p className="candidate-job-role">{candidate.jobRole}</p>
        </div>
        
        <div className="detail-row">
          <i className="ri-map-pin-line"></i>
          <span className="detail-text">{candidate.location || 'Location not specified'}</span>
        </div>
        <div className="detail-row">
          <i className="ri-briefcase-line"></i>
          <span className="detail-text">{candidate.experience} years experience</span>
        </div>
        <div className="detail-row">
          <i className="ri-graduation-cap-line"></i>
          <span className="detail-text">{candidate.education || 'Education not specified'}</span>
        </div>
      </div>

      <div className="candidate-footer">
        <div className="completion-section">
          <div className="completion-indicator" style={{ 
            backgroundColor: candidate.profileCompletion >= 70 ? '#4A90E2' : 
                           candidate.profileCompletion >= 40 ? '#f59e0b' : '#ef4444' 
          }}></div>
          <span className="completion-text">{candidate.profileCompletion}% complete</span>
        </div>
        
        <div className="last-active">
          <i className="ri-time-line"></i>
          <span>Active {candidate.lastActive}</span>
        </div>
      </div>

      <div className="candidate-card-actions">
        <button 
          className="view-profile-btn full-width"
          onClick={(e) => {
            e.stopPropagation();
            onView(candidate);
          }}
        >
          <i className="ri-eye-line"></i>
          View Profile
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;
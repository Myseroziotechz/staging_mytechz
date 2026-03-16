import React, { useState } from 'react';
import './JobPostCard.css';

function JobPostCard({ job, onStatusChange, onDelete, onViewApplications, onEdit }) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4A90E2';
      case 'closed': return '#ef4444';
      case 'draft': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'ri-play-circle-line';
      case 'closed': return 'ri-stop-circle-line';
      case 'draft': return 'ri-draft-line';
      default: return 'ri-question-line';
    }
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return 'No deadline';
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(newStatus);
    setShowActions(false);
  };

  return (
    <div className="job-post-card">
      <div className="job-post-header">
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          <p className="job-location">
            <i className="ri-map-pin-line"></i>
            {job.location} • {job.workMode}
          </p>
        </div>
        
        <div className="job-status-section">
          <div 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(job.status) }}
          >
            <i className={getStatusIcon(job.status)}></i>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </div>
          
          <div className="job-actions-dropdown">
            <button 
              className="actions-toggle"
              onClick={() => setShowActions(!showActions)}
            >
              <i className="ri-more-2-line"></i>
            </button>
            
            {showActions && (
              <div className="actions-menu">
                <button onClick={() => onEdit()}>
                  <i className="ri-edit-line"></i>
                  Edit Job
                </button>
                
                {job.status === 'draft' && (
                  <button onClick={() => handleStatusChange('active')}>
                    <i className="ri-play-line"></i>
                    Publish Job
                  </button>
                )}
                
                {job.status === 'active' && (
                  <button onClick={() => handleStatusChange('closed')}>
                    <i className="ri-pause-line"></i>
                    Close Job
                  </button>
                )}
                
                {job.status === 'closed' && (
                  <button onClick={() => handleStatusChange('active')}>
                    <i className="ri-play-line"></i>
                    Reopen Job
                  </button>
                )}
                
                <button 
                  onClick={() => onDelete()}
                  className="delete-action"
                >
                  <i className="ri-delete-bin-line"></i>
                  Delete Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="job-post-details">
        <div className="job-meta">
          <span className="job-type">
            <i className="ri-briefcase-line"></i>
            {job.jobType}
          </span>
          <span className="job-salary">
            <i className="ri-money-dollar-circle-line"></i>
            {job.salary}
          </span>
        </div>
        
        <div className="job-description">
          <p>{job.shortDescription}</p>
        </div>
        
        <div className="job-skills">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="skill-tag more">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="job-post-stats">
        <div className="stat-item">
          <div className="stat-number">{job.applicationsCount}</div>
          <div className="stat-label">Applications</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{job.viewsCount}</div>
          <div className="stat-label">Views</div>
        </div>
        <div className="stat-item">
          <div className="stat-date">
            <div className="stat-label">Posted</div>
            <div className="stat-value">{formatDate(job.postedDate)}</div>
          </div>
        </div>
      </div>

      <div className="job-post-footer">
        <div className="deadline-info">
          <i className="ri-time-line"></i>
          <span className={getDaysLeft(job.deadline).includes('Expired') ? 'expired' : ''}>
            {getDaysLeft(job.deadline)}
          </span>
        </div>
        
        <div className="job-post-actions">
          {job.applicationsCount > 0 && (
            <button 
              className="view-applications-btn"
              onClick={() => onViewApplications()}
            >
              <i className="ri-group-line"></i>
              View Applications
            </button>
          )}
          
          <button 
            className="manage-btn"
            onClick={() => onEdit()}
          >
            <i className="ri-settings-line"></i>
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobPostCard;
import React, { useState, useEffect } from 'react';
import './NaukriJobCard.css';

const NaukriJobCard = ({ job, onApply, onSave, isSaved = false }) => {
  const [saved, setSaved] = useState(isSaved);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isJobSaved = savedJobs.includes(job.id);
    setSaved(isJobSaved);
  }, [job.id]);

  const handleSave = (e) => {
    e.stopPropagation();
    const newSavedState = !saved;
    setSaved(newSavedState);
    
    // Update localStorage
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (newSavedState) {
      // Add to saved jobs
      if (!savedJobs.includes(job.id)) {
        savedJobs.push(job.id);
      }
    } else {
      // Remove from saved jobs
      const index = savedJobs.indexOf(job.id);
      if (index > -1) {
        savedJobs.splice(index, 1);
      }
    }
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    
    if (onSave) {
      onSave(job.id, newSavedState);
    }
  };

  const handleApply = (e) => {
    e.stopPropagation();
    if (onApply) {
      onApply(job.id);
    } else {
      window.location.href = `/jobs/${job.id}`;
    }
  };

  const handleViewDetails = () => {
    window.location.href = `/jobs/${job.id}`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const formatSalary = () => {
    if (!job.min_salary && !job.max_salary) return null;
    
    const currency = job.currency === 'INR' ? '₹' : job.currency === 'USD' ? '$' : '€';
    const period = job.salary_period === 'annually' ? 'PA' : job.salary_period === 'monthly' ? 'PM' : 'PH';
    
    if (job.min_salary && job.max_salary) {
      return `${currency}${(job.min_salary / 100000).toFixed(1)}-${(job.max_salary / 100000).toFixed(1)} LPA`;
    }
    return `${currency}${((job.min_salary || job.max_salary) / 100000).toFixed(1)} LPA`;
  };

  return (
    <div className="naukri-job-card" onClick={handleViewDetails}>
      <div className="naukri-job-card-header">
        <div className="naukri-job-card-title-section">
          <h3 className="naukri-job-title">{job.job_title}</h3>
          <p className="naukri-job-company">{job.company_name || job.recruiter_name}</p>
          {job.company_rating && (
            <div className="naukri-job-rating">
              <i className="ri-star-fill"></i>
              <span>{job.company_rating}</span>
              {job.company_reviews && (
                <span className="naukri-job-reviews">({job.company_reviews} reviews)</span>
              )}
            </div>
          )}
        </div>
        <button 
          className={`naukri-job-save ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          title={saved ? 'Unsave job' : 'Save job'}
        >
          <i className={saved ? 'ri-heart-fill' : 'ri-heart-line'}></i>
        </button>
      </div>

      <div className="naukri-job-card-meta">
        <div className="naukri-job-meta-item">
          <i className="ri-briefcase-line"></i>
          <span>{job.experience_level || 'Not specified'}</span>
        </div>
        {formatSalary() && (
          <div className="naukri-job-meta-item">
            <i className="ri-money-dollar-circle-line"></i>
            <span>{formatSalary()}</span>
          </div>
        )}
        <div className="naukri-job-meta-item">
          <i className="ri-map-pin-line"></i>
          <span>{job.location}</span>
        </div>
      </div>

      <div className="naukri-job-card-details">
        <div className="naukri-job-detail-item">
          <i className="ri-time-line"></i>
          <span>{job.job_type}</span>
        </div>
        <div className="naukri-job-detail-item">
          <i className="ri-home-office-line"></i>
          <span>{job.work_mode}</span>
        </div>
      </div>

      {job.job_description && (
        <p className="naukri-job-description">
          {job.job_description.length > 150 
            ? `${job.job_description.substring(0, 150)}...` 
            : job.job_description}
        </p>
      )}

      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="naukri-job-skills">
          {job.requiredSkills.slice(0, 5).map((skill, index) => (
            <span key={index} className="naukri-job-skill-tag">
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 5 && (
            <span className="naukri-job-skill-more">
              +{job.requiredSkills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="naukri-job-card-footer">
        <div className="naukri-job-posted">
          <i className="ri-time-line"></i>
          <span>{getTimeAgo(job.created_at)}</span>
        </div>
        <div className="naukri-job-actions">
          <button 
            className="naukri-job-btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            View Details
          </button>
          <button 
            className="naukri-job-btn-primary"
            onClick={handleApply}
          >
            Apply Now
          </button>
        </div>
      </div>

      {job.is_featured && (
        <div className="naukri-job-featured-badge">
          <i className="ri-star-fill"></i>
          Featured
        </div>
      )}
    </div>
  );
};

export default NaukriJobCard;

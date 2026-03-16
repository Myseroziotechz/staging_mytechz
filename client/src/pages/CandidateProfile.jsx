import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CandidateProfile.css';

function CandidateProfile() {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidateProfile();
  }, [candidateId]);

  const fetchCandidateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/candidate/${candidateId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCandidate(data.candidate || data);
      } else {
        setError('Failed to load candidate profile');
      }
    } catch (error) {
      console.error('Error fetching candidate profile:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="candidate-profile-page">
        <div className="loading">
          <i className="ri-loader-line"></i>
          <p>Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="candidate-profile-page">
        <div className="error-state">
          <i className="ri-error-warning-line"></i>
          <h3>Profile Not Found</h3>
          <p>{error || 'The candidate profile you are looking for does not exist.'}</p>
          <button 
            className="back-btn"
            onClick={() => window.history.back()}
          >
            <i className="ri-arrow-left-line"></i>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-profile-page">
      <div className="candidate-profile-container">
        <div className="profile-header">
          <button 
            className="back-button"
            onClick={() => window.history.back()}
          >
            <i className="ri-arrow-left-line"></i>
            Back to Search
          </button>
          
          <div className="profile-main-info">
            <div className="profile-avatar">
              {candidate.profilePhoto ? (
                <img src={candidate.profilePhoto} alt={candidate.name} />
              ) : (
                <div className="default-avatar">
                  <span>{candidate.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
                </div>
              )}
            </div>
            
            <div className="profile-details">
              <h1 className="candidate-name">{candidate.name}</h1>
              <p className="candidate-role">{candidate.jobRole || 'Professional'}</p>
              <div className="candidate-meta">
                <span className="location">
                  <i className="ri-map-pin-line"></i>
                  {candidate.location || 'Location not specified'}
                </span>
                <span className="experience">
                  <i className="ri-briefcase-line"></i>
                  {candidate.experience} years experience
                </span>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="contact-btn">
                <i className="ri-message-line"></i>
                Contact Candidate
              </button>
              <button className="save-btn">
                <i className="ri-bookmark-line"></i>
                Save Profile
              </button>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <span>{candidate.email || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <span>{candidate.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Professional Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Experience</label>
                <span>{candidate.experience} years</span>
              </div>
              <div className="info-item">
                <label>Education</label>
                <span>{candidate.education || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {candidate.skills && candidate.skills.length > 0 && (
            <div className="profile-section">
              <h3>Skills</h3>
              <div className="skills-list">
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {candidate.bio && (
            <div className="profile-section">
              <h3>About</h3>
              <p className="bio-text">{candidate.bio}</p>
            </div>
          )}

          <div className="profile-section">
            <h3>Profile Links</h3>
            <div className="links-grid">
              {candidate.linkedin && (
                <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
                  <i className="ri-linkedin-line"></i>
                  LinkedIn Profile
                </a>
              )}
              {candidate.github && (
                <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="profile-link">
                  <i className="ri-github-line"></i>
                  GitHub Profile
                </a>
              )}
              {candidate.portfolio && (
                <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="profile-link">
                  <i className="ri-global-line"></i>
                  Portfolio Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfile;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NaukriJobDetail.css';
import '../styles/NaukriCommon.css';

function NaukriJobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJobDetails();
    window.scrollTo(0, 0);
  }, [jobId]);

  // Load saved state from localStorage
  useEffect(() => {
    if (jobId) {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const isJobSaved = savedJobs.includes(parseInt(jobId));
      setIsSaved(isJobSaved);
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('Fetching job details for jobId:', jobId);
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/jobs/${jobId}`;
      console.log('API URL:', apiUrl);

      const response = await fetch(apiUrl, { headers });
      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Job data received:', data);
        setJob(data.job);
        setHasApplied(data.has_applied || false);
        
        // Fetch similar jobs
        fetchSimilarJobs(data.job);
      } else {
        console.error('Response not OK:', response.status);
        if (window.showPopup) {
          window.showPopup('Job not found', 'error');
        }
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      if (window.showPopup) {
        window.showPopup('Failed to load job details', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSimilarJobs = async (currentJob) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/jobs/public`
      );

      if (response.ok) {
        const data = await response.json();
        // Filter similar jobs based on location, job type, or skills
        const similar = (data.jobs || [])
          .filter(j => j.id !== currentJob.id)
          .filter(j => 
            j.location === currentJob.location || 
            j.job_type === currentJob.job_type ||
            j.work_mode === currentJob.work_mode
          )
          .slice(0, 4);
        setSimilarJobs(similar);
      }
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
    }
  };

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      if (window.showPopup) {
        window.showPopup('Please login to apply', 'warning');
      }
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'candidate') {
      if (window.showPopup) {
        window.showPopup('Only candidates can apply for jobs', 'error');
      }
      return;
    }

    setIsApplying(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/jobs/${jobId}/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            cover_letter: coverLetter,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setHasApplied(true);
        setShowCoverLetter(false);
        if (window.showPopup) {
          window.showPopup('Application submitted successfully!', 'success');
        }
      } else {
        if (window.showPopup) {
          window.showPopup(data.message || 'Failed to submit application', 'error');
        }
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      if (window.showPopup) {
        window.showPopup('An error occurred. Please try again.', 'error');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    
    // Update localStorage
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const jobIdNum = parseInt(jobId);
    
    if (newSavedState) {
      // Add to saved jobs
      if (!savedJobs.includes(jobIdNum)) {
        savedJobs.push(jobIdNum);
      }
    } else {
      // Remove from saved jobs
      const index = savedJobs.indexOf(jobIdNum);
      if (index > -1) {
        savedJobs.splice(index, 1);
      }
    }
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    
    if (window.showPopup) {
      window.showPopup(newSavedState ? 'Job saved successfully' : 'Job removed from saved', 'success');
    }
  };

  const formatSalary = (job) => {
    if (!job) return 'Not disclosed';
    
    const currency = job.currency === 'INR' ? '₹' : job.currency === 'USD' ? '$' : '€';
    
    if (job.min_salary && job.max_salary) {
      return `${currency}${(job.min_salary / 100000).toFixed(1)}-${(job.max_salary / 100000).toFixed(1)} LPA`;
    }
    if (job.min_salary) {
      return `${currency}${(job.min_salary / 100000).toFixed(1)} LPA`;
    }
    if (job.max_salary) {
      return `Up to ${currency}${(job.max_salary / 100000).toFixed(1)} LPA`;
    }
    
    return 'Not disclosed';
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

  const parseJSONField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="naukri-page">
        <div className="naukri-container">
          <div className="naukri-loading">
            <div className="naukri-spinner"></div>
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="naukri-page">
        <div className="naukri-container">
          <div className="naukri-error">
            <i className="ri-error-warning-line"></i>
            <h2>Job not found</h2>
            <button className="naukri-btn naukri-btn-primary" onClick={() => navigate('/jobs')}>
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const skills = parseJSONField(job.required_skills || job.requiredSkills);
  const responsibilities = parseJSONField(job.key_responsibilities || job.keyResponsibilities);
  const requirements = parseJSONField(job.requirements);

  return (
    <div className="naukri-page naukri-job-detail-page">
      <div className="naukri-container">
        <div className="naukri-job-detail-layout">
          {/* Left Column - Job Details */}
          <main className="naukri-job-detail-main">
            {/* Job Header */}
            <div className="naukri-job-detail-header">
              <div className="naukri-job-detail-title-section">
                <h1 className="naukri-job-detail-title">{job.job_title}</h1>
                <p className="naukri-job-detail-company">{job.company_name || job.recruiter_name}</p>
                {job.company_rating && (
                  <div className="naukri-job-detail-rating">
                    <i className="ri-star-fill"></i>
                    <span>{job.company_rating}</span>
                    {job.company_reviews && (
                      <span className="naukri-job-detail-reviews">({job.company_reviews} reviews)</span>
                    )}
                  </div>
                )}
              </div>

              <div className="naukri-job-detail-actions">
                <button 
                  className={`naukri-btn-icon ${isSaved ? 'saved' : ''}`}
                  onClick={handleSave}
                  title={isSaved ? 'Unsave job' : 'Save job'}
                >
                  <i className={isSaved ? 'ri-heart-fill' : 'ri-heart-line'}></i>
                </button>
                {hasApplied ? (
                  <button className="naukri-btn naukri-btn-applied" disabled>
                    <i className="ri-check-line"></i>
                    Applied
                  </button>
                ) : (
                  <button 
                    className="naukri-btn naukri-btn-primary"
                    onClick={() => setShowCoverLetter(true)}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>

            {/* Job Meta Info */}
            <div className="naukri-job-detail-meta">
              <div className="naukri-job-detail-meta-item">
                <i className="ri-briefcase-line"></i>
                <div>
                  <span className="meta-label">Experience</span>
                  <span className="meta-value">{job.experience_level || 'Not specified'}</span>
                </div>
              </div>
              <div className="naukri-job-detail-meta-item">
                <i className="ri-money-dollar-circle-line"></i>
                <div>
                  <span className="meta-label">Salary</span>
                  <span className="meta-value">{formatSalary(job)}</span>
                </div>
              </div>
              <div className="naukri-job-detail-meta-item">
                <i className="ri-map-pin-line"></i>
                <div>
                  <span className="meta-label">Location</span>
                  <span className="meta-value">{job.location}</span>
                </div>
              </div>
              <div className="naukri-job-detail-meta-item">
                <i className="ri-time-line"></i>
                <div>
                  <span className="meta-label">Posted</span>
                  <span className="meta-value">{getTimeAgo(job.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Job Highlights */}
            <div className="naukri-job-detail-section">
              <h2 className="naukri-section-title">Job highlights</h2>
              <div className="naukri-job-highlights">
                <div className="naukri-highlight-item">
                  <i className="ri-time-line"></i>
                  <span>{job.job_type}</span>
                </div>
                <div className="naukri-highlight-item">
                  <i className="ri-home-office-line"></i>
                  <span>{job.work_mode}</span>
                </div>
                {job.application_deadline && (
                  <div className="naukri-highlight-item">
                    <i className="ri-calendar-line"></i>
                    <span>Apply by {new Date(job.application_deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="naukri-job-detail-section">
              <h2 className="naukri-section-title">Job description</h2>
              <p className="naukri-job-description-text">
                {job.job_description || job.description || 'No description available'}
              </p>
            </div>

            {/* Key Responsibilities */}
            {responsibilities.length > 0 && (
              <div className="naukri-job-detail-section">
                <h2 className="naukri-section-title">Key responsibilities</h2>
                <ul className="naukri-job-list">
                  {responsibilities.map((item, index) => (
                    <li key={index}>
                      <i className="ri-check-line"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="naukri-job-detail-section">
                <h2 className="naukri-section-title">Requirements</h2>
                <ul className="naukri-job-list">
                  {requirements.map((item, index) => (
                    <li key={index}>
                      <i className="ri-check-line"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Role Details */}
            <div className="naukri-job-detail-section">
              <h2 className="naukri-section-title">Role details</h2>
              <div className="naukri-role-details-grid">
                <div className="naukri-role-detail-item">
                  <span className="role-label">Job Type</span>
                  <span className="role-value">{job.job_type}</span>
                </div>
                <div className="naukri-role-detail-item">
                  <span className="role-label">Work Mode</span>
                  <span className="role-value">{job.work_mode}</span>
                </div>
                <div className="naukri-role-detail-item">
                  <span className="role-label">Experience Level</span>
                  <span className="role-value">{job.experience_level || 'Not specified'}</span>
                </div>
                <div className="naukri-role-detail-item">
                  <span className="role-label">Location</span>
                  <span className="role-value">{job.location}</span>
                </div>
              </div>
            </div>

            {/* Key Skills */}
            {skills.length > 0 && (
              <div className="naukri-job-detail-section">
                <h2 className="naukri-section-title">Key skills</h2>
                <div className="naukri-job-skills-tags">
                  {skills.map((skill, index) => (
                    <span key={index} className="naukri-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button at Bottom */}
            <div className="naukri-job-detail-footer">
              {hasApplied ? (
                <button className="naukri-btn naukri-btn-applied naukri-btn-large" disabled>
                  <i className="ri-check-line"></i>
                  Applied
                </button>
              ) : (
                <button 
                  className="naukri-btn naukri-btn-primary naukri-btn-large"
                  onClick={() => setShowCoverLetter(true)}
                >
                  Apply Now
                </button>
              )}
            </div>
          </main>

          {/* Right Column - Similar Jobs */}
          <aside className="naukri-job-detail-sidebar">
            <div className="naukri-sidebar-sticky">
              <h3 className="naukri-sidebar-title">Jobs you might be interested in</h3>
              <div className="naukri-similar-jobs">
                {similarJobs.length > 0 ? (
                  similarJobs.map((similarJob) => (
                    <div 
                      key={similarJob.id} 
                      className="naukri-similar-job-card"
                      onClick={() => navigate(`/jobs/${similarJob.id}`)}
                    >
                      <h4 className="naukri-similar-job-title">{similarJob.job_title}</h4>
                      <p className="naukri-similar-job-company">{similarJob.company_name || similarJob.recruiter_name}</p>
                      <div className="naukri-similar-job-meta">
                        <span>
                          <i className="ri-briefcase-line"></i>
                          {similarJob.experience_level || 'Not specified'}
                        </span>
                        <span>
                          <i className="ri-map-pin-line"></i>
                          {similarJob.location}
                        </span>
                      </div>
                      <p className="naukri-similar-job-posted">{getTimeAgo(similarJob.created_at)}</p>
                    </div>
                  ))
                ) : (
                  <p className="naukri-no-similar-jobs">No similar jobs found</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Cover Letter Modal */}
      {showCoverLetter && !hasApplied && (
        <div className="naukri-modal-overlay" onClick={() => setShowCoverLetter(false)}>
          <div className="naukri-modal" onClick={(e) => e.stopPropagation()}>
            <div className="naukri-modal-header">
              <h3>Apply for {job.job_title}</h3>
              <button className="naukri-modal-close" onClick={() => setShowCoverLetter(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="naukri-modal-body">
              <label className="naukri-modal-label">Cover Letter (Optional)</label>
              <textarea
                className="naukri-modal-textarea"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit for this role..."
                rows="8"
              />
            </div>
            <div className="naukri-modal-footer">
              <button 
                className="naukri-btn naukri-btn-secondary" 
                onClick={() => setShowCoverLetter(false)}
              >
                Cancel
              </button>
              <button 
                className="naukri-btn naukri-btn-primary" 
                onClick={handleApply} 
                disabled={isApplying}
              >
                {isApplying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NaukriJobDetail;

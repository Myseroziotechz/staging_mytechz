import { useState, useEffect } from 'react';
import './Reports.css';

function Reports() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    rejectedApplications: 0
  });

  useEffect(() => {
    fetchApplicationsData();
  }, []);

  const fetchApplicationsData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/applications/recruiter`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        
        // Calculate stats
        const total = data.applications?.length || 0;
        const pending = data.applications?.filter(app => app.status === 'pending').length || 0;
        const shortlisted = data.applications?.filter(app => app.status === 'shortlisted').length || 0;
        const rejected = data.applications?.filter(app => app.status === 'rejected').length || 0;
        
        setStats({
          totalApplications: total,
          pendingApplications: pending,
          shortlistedApplications: shortlisted,
          rejectedApplications: rejected
        });
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/applications/${applicationId}/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh the applications data
        fetchApplicationsData();
        if (window.showPopup) {
          window.showPopup('Application status updated successfully!', 'success');
        }
      } else {
        if (window.showPopup) {
          window.showPopup('Failed to update application status', 'error');
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      if (window.showPopup) {
        window.showPopup('Error updating application status', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="reports-container">
        <div className="reports-loading">
          <i className="ri-loader-4-line"></i>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Job Applications</h1>
            <p>Manage candidates who have applied to your jobs</p>
          </div>
        </div>
      </div>

      <div className="reports-main">
        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="ri-file-list-3-line"></i>
            </div>
            <h2>No Applications Yet</h2>
            <p>Start posting jobs to receive applications from candidates</p>
            <button 
              className="primary-action-btn"
              onClick={() => window.location.href = '/recruiter/post-job'}
            >
              <i className="ri-add-line"></i>
              Post Your First Job
            </button>
          </div>
        ) : (
          <>
            <div className="metrics-grid">
              <div className="metric-card blue">
                <div className="metric-icon">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">{stats.totalApplications}</div>
                  <div className="metric-label">Total Applications</div>
                </div>
              </div>

              <div className="metric-card orange">
                <div className="metric-icon">
                  <i className="ri-time-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">{stats.pendingApplications}</div>
                  <div className="metric-label">Pending Review</div>
                </div>
              </div>

              <div className="metric-card blue">
                <div className="metric-icon">
                  <i className="ri-checkbox-circle-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">{stats.shortlistedApplications}</div>
                  <div className="metric-label">Shortlisted</div>
                </div>
              </div>

              <div className="metric-card red">
                <div className="metric-icon">
                  <i className="ri-close-circle-line"></i>
                </div>
                <div className="metric-content">
                  <div className="metric-value">{stats.rejectedApplications}</div>
                  <div className="metric-label">Rejected</div>
                </div>
              </div>
            </div>

            <div className="applications-section">
              <div className="section-header">
                <h2>Recent Applications</h2>
              </div>
              
              <div className="applications-list">
                {applications.map((application) => (
                  <div key={application.id} className="application-card">
                    <div className="application-header">
                      <div className="candidate-info">
                        <div className="candidate-avatar">
                          <span>{application.candidate_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
                        </div>
                        <div className="candidate-details">
                          <h3 className="candidate-name">{application.candidate_name}</h3>
                          <p className="candidate-email">{application.candidate_email}</p>
                        </div>
                      </div>
                      
                      <div className="application-meta">
                        <span className={`status-badge ${application.status}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                        <span className="application-date">
                          {new Date(application.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="job-info">
                      <h4 className="job-title">{application.job_title}</h4>
                      <p className="job-location">{application.job_location}</p>
                    </div>

                    {application.cover_letter && (
                      <div className="cover-letter">
                        <h5>Cover Letter:</h5>
                        <p>{application.cover_letter}</p>
                      </div>
                    )}

                    <div className="application-actions">
                      {application.status === 'pending' && (
                        <>
                          <button 
                            className="action-btn shortlist"
                            onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                          >
                            <i className="ri-checkbox-circle-line"></i>
                            Shortlist
                          </button>
                          <button 
                            className="action-btn reject"
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          >
                            <i className="ri-close-circle-line"></i>
                            Reject
                          </button>
                        </>
                      )}
                      
                      {application.status === 'shortlisted' && (
                        <button 
                          className="action-btn contact"
                          onClick={() => window.location.href = `mailto:${application.candidate_email}`}
                        >
                          <i className="ri-mail-line"></i>
                          Contact Candidate
                        </button>
                      )}
                      
                      <button 
                        className="action-btn view"
                        onClick={() => window.location.href = `/recruiter/candidate/${application.candidate_id}`}
                      >
                        <i className="ri-eye-line"></i>
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;

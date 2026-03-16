import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [webinarRegistrations, setWebinarRegistrations] = useState([]);
  const [admissionApplications, setAdmissionApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalWebinars: 0,
    totalAdmissions: 0,
    totalWebinarRegistrations: 0,
    totalAdmissionApplications: 0
  });

  // Form states
  const [userForm, setUserForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', role: 'candidate', password: ''
  });
  const [webinarForm, setWebinarForm] = useState({
    title: '', speaker: '', organization: '', date: '', time: '', mode: 'online',
    platform: '', price: 0, category: 'technology', description: '', agenda: ''
  });
  const [admissionForm, setAdmissionForm] = useState({
    collegeName: '', location: '', courses: '', eligibility: '', deadline: '',
    fees: '', contactEmail: '', contactPhone: '', description: ''
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchJobs(),
        fetchWebinars(),
        fetchAdmissions(),
        fetchWebinarRegistrations(),
        fetchAdmissionApplications()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setStats(prev => ({ ...prev, totalUsers: data.users?.length || 0 }));
      } else {
        console.error('Failed to fetch users:', response.status);
        // Fallback to existing users from authentication
        const fallbackResponse = await fetch(`${API_BASE}/api/auth/users`, {
          headers: getAuthHeaders()
        });
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setUsers(fallbackData.users || []);
          setStats(prev => ({ ...prev, totalUsers: fallbackData.users?.length || 0 }));
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/jobs/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
        setStats(prev => ({ ...prev, totalJobs: data.jobs?.length || 0 }));
      } else {
        console.error('Failed to fetch jobs:', response.status);
        // Fallback to public jobs endpoint
        const fallbackResponse = await fetch(`${API_BASE}/api/jobs/public`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setJobs(fallbackData.jobs || []);
          setStats(prev => ({ ...prev, totalJobs: fallbackData.jobs?.length || 0 }));
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchWebinars = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/webinars/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setWebinars(data.webinars || []);
        setStats(prev => ({ ...prev, totalWebinars: data.webinars?.length || 0 }));
      }
    } catch (error) {
      console.error('Error fetching webinars:', error);
    }
  };

  const fetchAdmissions = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/admissions/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAdmissions(data.admissions || []);
        setStats(prev => ({ ...prev, totalAdmissions: data.admissions?.length || 0 }));
      }
    } catch (error) {
      console.error('Error fetching admissions:', error);
    }
  };

  const fetchWebinarRegistrations = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/webinar-registrations/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setWebinarRegistrations(data.registrations || []);
        setStats(prev => ({ ...prev, totalWebinarRegistrations: data.registrations?.length || 0 }));
      }
    } catch (error) {
      console.error('Error fetching webinar registrations:', error);
    }
  };

  const fetchAdmissionApplications = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/admission-applications/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAdmissionApplications(data.applications || []);
        setStats(prev => ({ ...prev, totalAdmissionApplications: data.applications?.length || 0 }));
      }
    } catch (error) {
      console.error('Error fetching admission applications:', error);
    }
  };

  // User Management Functions
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userForm)
      });
      
      if (response.ok) {
        alert('User created successfully!');
        setShowModal(false);
        setUserForm({ firstName: '', lastName: '', email: '', phone: '', role: 'candidate', password: '' });
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to create user'}`);
      }
    } catch (error) {
      alert('Error creating user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${editingItem.id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userForm)
      });
      
      if (response.ok) {
        alert('User updated successfully!');
        setShowModal(false);
        setEditingItem(null);
        fetchUsers();
      } else {
        alert('Error updating user');
      }
    } catch (error) {
      alert('Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        alert('User deleted successfully!');
        fetchUsers();
      } else {
        alert('Error deleting user');
      }
    } catch (error) {
      alert('Error deleting user');
    }
  };

  // Job Management Functions
  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job post?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/jobs/${jobId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        alert('Job post deleted successfully!');
        fetchJobs();
      } else {
        alert('Error deleting job post');
      }
    } catch (error) {
      alert('Error deleting job post');
    }
  };

  // Webinar Management Functions
  const handleCreateWebinar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/webinars/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(webinarForm)
      });
      
      if (response.ok) {
        alert('Webinar created successfully!');
        setShowModal(false);
        setWebinarForm({
          title: '', speaker: '', organization: '', date: '', time: '', mode: 'online',
          platform: '', price: 0, category: 'technology', description: '', agenda: ''
        });
        fetchWebinars();
      } else {
        alert('Error creating webinar');
      }
    } catch (error) {
      alert('Error creating webinar');
    }
  };

  const handleUpdateWebinar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/webinars/${editingItem.id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(webinarForm)
      });
      
      if (response.ok) {
        alert('Webinar updated successfully!');
        setShowModal(false);
        setEditingItem(null);
        fetchWebinars();
      } else {
        alert('Error updating webinar');
      }
    } catch (error) {
      alert('Error updating webinar');
    }
  };

  const handleDeleteWebinar = async (webinarId) => {
    if (!confirm('Are you sure you want to delete this webinar?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/webinars/${webinarId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        alert('Webinar deleted successfully!');
        fetchWebinars();
      } else {
        alert('Error deleting webinar');
      }
    } catch (error) {
      alert('Error deleting webinar');
    }
  };

  // Admission Management Functions
  const handleCreateAdmission = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/admissions/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(admissionForm)
      });
      
      if (response.ok) {
        alert('Admission post created successfully!');
        setShowModal(false);
        setAdmissionForm({
          collegeName: '', location: '', courses: '', eligibility: '', deadline: '',
          fees: '', contactEmail: '', contactPhone: '', description: ''
        });
        fetchAdmissions();
      } else {
        alert('Error creating admission post');
      }
    } catch (error) {
      alert('Error creating admission post');
    }
  };

  const handleUpdateAdmission = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/admissions/${editingItem.id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(admissionForm)
      });
      
      if (response.ok) {
        alert('Admission post updated successfully!');
        setShowModal(false);
        setEditingItem(null);
        fetchAdmissions();
      } else {
        alert('Error updating admission post');
      }
    } catch (error) {
      alert('Error updating admission post');
    }
  };

  const handleDeleteAdmission = async (admissionId) => {
    if (!confirm('Are you sure you want to delete this admission post?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/admissions/${admissionId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        alert('Admission post deleted successfully!');
        fetchAdmissions();
      } else {
        alert('Error deleting admission post');
      }
    } catch (error) {
      alert('Error deleting admission post');
    }
  };

  // Registration Status Update Functions
  const updateRegistrationStatus = async (registrationId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/webinar-registrations/${registrationId}/status/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        alert('Registration status updated successfully!');
        fetchWebinarRegistrations();
      } else {
        alert('Error updating registration status');
      }
    } catch (error) {
      alert('Error updating registration status');
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/admission-applications/${applicationId}/status/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        alert('Application status updated successfully!');
        fetchAdmissionApplications();
      } else {
        alert('Error updating application status');
      }
    } catch (error) {
      alert('Error updating application status');
    }
  };

  // Modal Functions
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
    
    if (item) {
      if (type === 'user') {
        setUserForm({
          firstName: item.firstName || item.first_name || '',
          lastName: item.lastName || item.last_name || '',
          email: item.email || '',
          phone: item.phone || '',
          role: item.role || 'candidate',
          password: ''
        });
      } else if (type === 'webinar') {
        setWebinarForm({
          title: item.title || '',
          speaker: item.speaker || '',
          organization: item.organization || '',
          date: item.date || '',
          time: item.time || '',
          mode: item.mode || 'online',
          platform: item.platform || '',
          price: item.price || 0,
          category: item.category || 'technology',
          description: item.description || '',
          agenda: item.agenda || ''
        });
      } else if (type === 'admission') {
        setAdmissionForm({
          collegeName: item.collegeName || item.college_name || '',
          location: item.location || '',
          courses: item.courses || '',
          eligibility: item.eligibility || '',
          deadline: item.deadline || '',
          fees: item.fees || '',
          contactEmail: item.contactEmail || item.contact_email || '',
          contactPhone: item.contactPhone || item.contact_phone || '',
          description: item.description || ''
        });
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setUserForm({ firstName: '', lastName: '', email: '', phone: '', role: 'candidate', password: '' });
    setWebinarForm({
      title: '', speaker: '', organization: '', date: '', time: '', mode: 'online',
      platform: '', price: 0, category: 'technology', description: '', agenda: ''
    });
    setAdmissionForm({
      collegeName: '', location: '', courses: '', eligibility: '', deadline: '',
      fees: '', contactEmail: '', contactPhone: '', description: ''
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalJobs}</h3>
            <p>Job Posts</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalWebinars}</h3>
            <p>Webinars</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalAdmissions}</h3>
            <p>Admissions</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalWebinarRegistrations}</h3>
            <p>Webinar Registrations</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalAdmissionApplications}</h3>
            <p>Admission Applications</p>
          </div>
        </div>
      </header>

      <nav className="admin-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          <i className="ri-dashboard-line"></i> Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          <i className="ri-user-line"></i> Manage Users
        </button>
        <button 
          className={activeTab === 'jobs' ? 'active' : ''} 
          onClick={() => setActiveTab('jobs')}
        >
          <i className="ri-briefcase-line"></i> Manage Jobs
        </button>
        <button 
          className={activeTab === 'webinars' ? 'active' : ''} 
          onClick={() => setActiveTab('webinars')}
        >
          <i className="ri-presentation-line"></i> Manage Webinars
        </button>
        <button 
          className={activeTab === 'admissions' ? 'active' : ''} 
          onClick={() => setActiveTab('admissions')}
        >
          <i className="ri-school-line"></i> Manage Admissions
        </button>
        <button 
          className={activeTab === 'webinar-registrations' ? 'active' : ''} 
          onClick={() => setActiveTab('webinar-registrations')}
        >
          <i className="ri-user-check-line"></i> Webinar Registrations
        </button>
        <button 
          className={activeTab === 'admission-applications' ? 'active' : ''} 
          onClick={() => setActiveTab('admission-applications')}
        >
          <i className="ri-file-user-line"></i> Admission Applications
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>System Overview</h2>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => openModal('user')}>
                <div className="button-content">
                  <i className="ri-user-add-line"></i> Add User
                </div>
              </button>
              <button className="action-btn" onClick={() => openModal('webinar')}>
                <div className="button-content">
                  <i className="ri-presentation-line"></i> Add Webinar
                </div>
              </button>
              <button className="action-btn" onClick={() => openModal('admission')}>
                <div className="button-content">
                  <i className="ri-school-line"></i> Add Admission
                </div>
              </button>
            </div>
            
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Recent Users</h3>
                <div className="recent-list">
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="recent-item">
                      <span>{user.firstName || user.first_name} {user.lastName || user.last_name}</span>
                      <small>{user.role}</small>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="overview-card">
                <h3>Recent Jobs</h3>
                <div className="recent-list">
                  {jobs.slice(0, 5).map(job => (
                    <div key={job.id} className="recent-item">
                      <span>{job.job_title || job.title}</span>
                      <small>{job.company || 'Company'}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h2>User Management</h2>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.firstName || user.first_name} {user.lastName || user.last_name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                      </td>
                      <td>{new Date(user.createdAt || user.created_at || user.date_joined).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn" 
                            onClick={() => openModal('user', user)}
                            title="Edit User"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <div className="section-header">
              <h2>Job Management</h2>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td>{job.job_title || job.title}</td>
                      <td>{job.company || job.recruiter?.company_name || 'N/A'}</td>
                      <td>{job.location}</td>
                      <td>
                        <span className="job-type-badge">{job.job_type || job.type}</span>
                      </td>
                      <td>{new Date(job.created_at || job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDeleteJob(job.id)}
                            title="Delete Job"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'webinars' && (
          <div className="webinars-section">
            <div className="section-header">
              <h2>Webinar Management</h2>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Speaker</th>
                    <th>Organization</th>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {webinars.map(webinar => (
                    <tr key={webinar.id}>
                      <td>{webinar.title}</td>
                      <td>{webinar.speaker}</td>
                      <td>{webinar.organization}</td>
                      <td>{new Date(webinar.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`mode-badge ${webinar.mode}`}>{webinar.mode}</span>
                      </td>
                      <td>₹{webinar.price}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn" 
                            onClick={() => openModal('webinar', webinar)}
                            title="Edit Webinar"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDeleteWebinar(webinar.id)}
                            title="Delete Webinar"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'admissions' && (
          <div className="admissions-section">
            <div className="section-header">
              <h2>Admission Management</h2>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>College Name</th>
                    <th>Location</th>
                    <th>Courses</th>
                    <th>Deadline</th>
                    <th>Fees</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map(admission => (
                    <tr key={admission.id}>
                      <td>{admission.collegeName || admission.college_name}</td>
                      <td>{admission.location}</td>
                      <td>{admission.courses}</td>
                      <td>{new Date(admission.deadline).toLocaleDateString()}</td>
                      <td>₹{admission.fees}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn" 
                            onClick={() => openModal('admission', admission)}
                            title="Edit Admission"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDeleteAdmission(admission.id)}
                            title="Delete Admission"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'webinar-registrations' && (
          <div className="registrations-section">
            <div className="section-header">
              <h2>Webinar Registrations</h2>
              <p>Track candidate registrations for webinars</p>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Webinar Title</th>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Registered At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {webinarRegistrations.map(registration => (
                    <tr key={registration.id}>
                      <td>{registration.user_name}</td>
                      <td>{registration.user_email}</td>
                      <td>{registration.user_phone}</td>
                      <td>{registration.webinar_title}</td>
                      <td>{new Date(registration.webinar_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`mode-badge ${registration.webinar_mode}`}>
                          {registration.webinar_mode}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${registration.status}`}>
                          {registration.status}
                        </span>
                      </td>
                      <td>{new Date(registration.registered_at).toLocaleDateString()}</td>
                      <td>
                        <select
                          value={registration.status}
                          onChange={(e) => updateRegistrationStatus(registration.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="registered">Registered</option>
                          <option value="attended">Attended</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'admission-applications' && (
          <div className="applications-section">
            <div className="section-header">
              <h2>Admission Applications</h2>
              <p>Track candidate applications for college admissions</p>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>College</th>
                    <th>Location</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Documents</th>
                    <th>Applied At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissionApplications.map(application => (
                    <tr key={application.id}>
                      <td>{application.user_name}</td>
                      <td>{application.user_email}</td>
                      <td>{application.user_phone}</td>
                      <td>{application.admission_college}</td>
                      <td>{application.admission_location}</td>
                      <td>{new Date(application.admission_deadline).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${application.status}`}>
                          {application.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`docs-badge ${application.documents_submitted ? 'submitted' : 'pending'}`}>
                          {application.documents_submitted ? 'Submitted' : 'Pending'}
                        </span>
                      </td>
                      <td>{new Date(application.applied_at).toLocaleDateString()}</td>
                      <td>
                        <select
                          value={application.status}
                          onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="applied">Applied</option>
                          <option value="under_review">Under Review</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                          <option value="withdrawn">Withdrawn</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal for Create/Edit Forms */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h3>
              <button className="close-btn" onClick={closeModal}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="modal-body">
              {modalType === 'user' && (
                <form onSubmit={editingItem ? handleUpdateUser : handleCreateUser}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={userForm.firstName}
                        onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={userForm.lastName}
                        onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                        required
                      >
                        <option value="candidate">Candidate</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  
                  {!editingItem && (
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        required={!editingItem}
                        placeholder={editingItem ? "Leave blank to keep current password" : ""}
                      />
                    </div>
                  )}
                  
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {editingItem ? 'Update' : 'Create'} User
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'webinar' && (
                <form onSubmit={editingItem ? handleUpdateWebinar : handleCreateWebinar}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={webinarForm.title}
                      onChange={(e) => setWebinarForm({...webinarForm, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Speaker</label>
                      <input
                        type="text"
                        value={webinarForm.speaker}
                        onChange={(e) => setWebinarForm({...webinarForm, speaker: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Organization</label>
                      <input
                        type="text"
                        value={webinarForm.organization}
                        onChange={(e) => setWebinarForm({...webinarForm, organization: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={webinarForm.date}
                        onChange={(e) => setWebinarForm({...webinarForm, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        value={webinarForm.time}
                        onChange={(e) => setWebinarForm({...webinarForm, time: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Mode</label>
                      <select
                        value={webinarForm.mode}
                        onChange={(e) => setWebinarForm({...webinarForm, mode: e.target.value})}
                        required
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Platform/Venue</label>
                      <input
                        type="text"
                        value={webinarForm.platform}
                        onChange={(e) => setWebinarForm({...webinarForm, platform: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        value={webinarForm.price}
                        onChange={(e) => setWebinarForm({...webinarForm, price: e.target.value})}
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={webinarForm.category}
                        onChange={(e) => setWebinarForm({...webinarForm, category: e.target.value})}
                        required
                      >
                        <option value="technology">Technology</option>
                        <option value="business">Business</option>
                        <option value="career">Career Development</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={webinarForm.description}
                      onChange={(e) => setWebinarForm({...webinarForm, description: e.target.value})}
                      rows="3"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Agenda</label>
                    <textarea
                      value={webinarForm.agenda}
                      onChange={(e) => setWebinarForm({...webinarForm, agenda: e.target.value})}
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {editingItem ? 'Update' : 'Create'} Webinar
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'admission' && (
                <form onSubmit={editingItem ? handleUpdateAdmission : handleCreateAdmission}>
                  <div className="form-group">
                    <label>College Name</label>
                    <input
                      type="text"
                      value={admissionForm.collegeName}
                      onChange={(e) => setAdmissionForm({...admissionForm, collegeName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={admissionForm.location}
                      onChange={(e) => setAdmissionForm({...admissionForm, location: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Courses Offered</label>
                    <input
                      type="text"
                      value={admissionForm.courses}
                      onChange={(e) => setAdmissionForm({...admissionForm, courses: e.target.value})}
                      placeholder="e.g., B.Tech, M.Tech, MBA"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Eligibility Criteria</label>
                    <textarea
                      value={admissionForm.eligibility}
                      onChange={(e) => setAdmissionForm({...admissionForm, eligibility: e.target.value})}
                      rows="3"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Application Deadline</label>
                      <input
                        type="date"
                        value={admissionForm.deadline}
                        onChange={(e) => setAdmissionForm({...admissionForm, deadline: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Fees (₹)</label>
                      <input
                        type="text"
                        value={admissionForm.fees}
                        onChange={(e) => setAdmissionForm({...admissionForm, fees: e.target.value})}
                        placeholder="e.g., 50,000 per year"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Contact Email</label>
                      <input
                        type="email"
                        value={admissionForm.contactEmail}
                        onChange={(e) => setAdmissionForm({...admissionForm, contactEmail: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Phone</label>
                      <input
                        type="tel"
                        value={admissionForm.contactPhone}
                        onChange={(e) => setAdmissionForm({...admissionForm, contactPhone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={admissionForm.description}
                      onChange={(e) => setAdmissionForm({...admissionForm, description: e.target.value})}
                      rows="3"
                      required
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {editingItem ? 'Update' : 'Create'} Admission
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/NaukriProfile.css';
import ResumeManager from '../components/Resume/ResumeManager';

function ProfileNaukri() {
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: '', dateOfBirth: '',
    address: '', city: '', state: '', pincode: '', profilePhoto: '', bio: '',
    skills: [], experience: '', education: '', linkedin: '', github: '', portfolio: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('view-edit');
  const [activeSection, setActiveSection] = useState('preferences');
  const [editingSection, setEditingSection] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [showResumeManager, setShowResumeManager] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchResumeInfo();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const profileData = response.data;
      if (profileData.skills && !Array.isArray(profileData.skills)) {
        profileData.skills = profileData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      } else if (!profileData.skills) {
        profileData.skills = [];
      }
      
      const defaultProfile = {
        firstName: '', lastName: '', email: '', phone: '', gender: '', dateOfBirth: '',
        address: '', city: '', state: '', pincode: '', profilePhoto: '', bio: '',
        skills: [], experience: '', education: '', linkedin: '', github: '', portfolio: ''
      };
      
      setProfile({ ...defaultProfile, ...profileData });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (window.showPopup) {
        window.showPopup('Error loading profile data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchResumeInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resume-upload/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumeInfo(response.data);
    } catch (error) {
      console.error('Error fetching resume info:', error);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      profile.firstName, profile.lastName, profile.email, profile.phone,
      profile.gender, profile.dateOfBirth, profile.city, profile.bio,
      profile.skills.length > 0, profile.experience, profile.education,
      resumeInfo?.hasResume
    ];
    const completed = fields.filter(field => field).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getMissingDetails = () => {
    const missing = [];
    if (!profile.bio) missing.push({ text: 'Add bio', section: 'personal' });
    if (profile.skills.length === 0) missing.push({ text: 'Add skills', section: 'skills' });
    if (!profile.experience) missing.push({ text: 'Add experience', section: 'employment' });
    if (!profile.education) missing.push({ text: 'Add education', section: 'education' });
    if (!resumeInfo?.hasResume) missing.push({ text: 'Upload resume', section: 'resume' });
    return missing;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/upload-photo`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, profilePhoto: response.data.photoUrl }));
      
      const user = JSON.parse(localStorage.getItem('user'));
      user.profilePhoto = response.data.photoUrl;
      localStorage.setItem('user', JSON.stringify(user));
      
      if (window.showPopup) {
        window.showPopup('Profile photo updated successfully!', 'success');
      }
    } catch (error) {
      if (window.showPopup) {
        window.showPopup('Error uploading photo', 'error');
      }
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSaveSection = async (section) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Validate required fields
      if (!profile.firstName || !profile.lastName || !profile.email) {
        throw new Error('First name, last name, and email are required fields.');
      }
      
      const cleanProfile = { ...profile };
      
      // Convert frontend field names to backend field names
      const backendProfile = {
        first_name: cleanProfile.firstName,
        last_name: cleanProfile.lastName,
        phone: cleanProfile.phone,
        gender: cleanProfile.gender,
        address: cleanProfile.address,
        city: cleanProfile.city,
        state: cleanProfile.state,
        pincode: cleanProfile.pincode,
        bio: cleanProfile.bio,
        experience: cleanProfile.experience,
        education: cleanProfile.education,
        linkedin_url: cleanProfile.linkedin,
        github_url: cleanProfile.github,
        portfolio_url: cleanProfile.portfolio,
        skills: Array.isArray(cleanProfile.skills) ? cleanProfile.skills.join(', ') : cleanProfile.skills || ''
      };
      
      // Clean up phone number - remove any formatting
      if (backendProfile.phone) {
        backendProfile.phone = backendProfile.phone.replace(/[^\d+]/g, '');
        // If it's just digits and reasonable length, keep it
        if (backendProfile.phone && !/^\+/.test(backendProfile.phone) && backendProfile.phone.length >= 9 && backendProfile.phone.length <= 15) {
          // Valid phone number
        } else if (backendProfile.phone && backendProfile.phone.length < 9) {
          throw new Error('Phone number must be at least 9 digits long.');
        }
      }
      
      // Convert empty strings to null for optional fields
      const optionalFields = ['bio', 'address', 'city', 'state', 'pincode', 'experience', 'education', 'linkedin_url', 'github_url', 'portfolio_url', 'phone', 'gender'];
      optionalFields.forEach(field => {
        if (backendProfile[field] === '' || backendProfile[field] === undefined) {
          backendProfile[field] = null;
        }
      });
      
      // Validate social links format
      const socialFields = ['linkedin_url', 'github_url', 'portfolio_url'];
      socialFields.forEach(field => {
        if (backendProfile[field] && backendProfile[field] !== null) {
          if (!backendProfile[field].startsWith('http://') && !backendProfile[field].startsWith('https://')) {
            backendProfile[field] = `https://${backendProfile[field]}`;
          }
        }
      });
      
      // Remove any undefined fields
      Object.keys(backendProfile).forEach(key => {
        if (backendProfile[key] === undefined) {
          delete backendProfile[key];
        }
      });
      
      console.log('Updating profile with data:', backendProfile);
      console.log('API URL:', `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`);
      console.log('Headers:', { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      
      // Test if the API endpoint is reachable
      try {
        const testResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
          method: 'GET',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Test GET request status:', testResponse.status);
        if (!testResponse.ok) {
          const testError = await testResponse.text();
          console.log('Test GET request error:', testError);
        }
      } catch (testError) {
        console.log('Test GET request failed:', testError);
      }
      
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, backendProfile, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('Profile update response:', response.data);
      
      const user = JSON.parse(localStorage.getItem('user'));
      user.name = `${profile.firstName} ${profile.lastName}`;
      localStorage.setItem('user', JSON.stringify(user));
      
      if (window.showPopup) {
        window.showPopup('Profile updated successfully!', 'success');
      }
      setEditingSection(null);
    } catch (error) {
      console.error('Profile update error:', error);
      
      // More detailed error handling
      let errorMessage = 'Error updating profile';
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.errors) {
          // Handle validation errors
          const errors = error.response.data.errors;
          const errorMessages = [];
          Object.keys(errors).forEach(field => {
            if (Array.isArray(errors[field])) {
              errorMessages.push(...errors[field]);
            } else {
              errorMessages.push(errors[field]);
            }
          });
          errorMessage = errorMessages.join('. ');
        }
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request);
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout. Please check your connection and try again.';
        } else {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      } else {
        // Other error
        console.error('Error:', error.message);
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      if (window.showPopup) {
        window.showPopup(errorMessage, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="naukri-profile-page">
        <div className="naukri-loading">
          <div className="naukri-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const completionPercent = calculateProfileCompletion();
  const missingDetails = getMissingDetails();

  return (
    <div className="naukri-profile-page">
      <div className="naukri-profile-container">
        {/* Profile Header */}
        <div className="naukri-profile-header">
          <div className="naukri-header-content">
            {/* Photo Section */}
            <div className="naukri-photo-section">
              <div className="naukri-photo-wrapper">
                <svg className="naukri-completion-ring" viewBox="0 0 136 136">
                  <circle cx="68" cy="68" r="64" fill="none" stroke="#e0e0e0" strokeWidth="4" />
                  <circle
                    cx="68" cy="68" r="64" fill="none" stroke="#4A90E2" strokeWidth="4"
                    strokeDasharray={`${(completionPercent / 100) * 402} 402`}
                    strokeLinecap="round" transform="rotate(-90 68 68)"
                  />
                </svg>
                <div className="naukri-photo">
                  {profile.profilePhoto ? (
                    <img src={profile.profilePhoto} alt="Profile" />
                  ) : (
                    <div className="naukri-photo-placeholder">
                      <i className="ri-user-line"></i>
                    </div>
                  )}
                </div>
                <label className="naukri-photo-upload" htmlFor="photo-upload">
                  <i className="ri-camera-line"></i>
                  <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Info Section */}
            <div className="naukri-info-section">
              <h1 className="naukri-name">{profile.firstName} {profile.lastName}</h1>
              <div className="naukri-info-grid">
                <div className="naukri-info-item">
                  <i className="ri-mail-line"></i>
                  <span>{profile.email}</span>
                  <i className="ri-verified-badge-fill naukri-verified"></i>
                </div>
                {profile.phone && (
                  <div className="naukri-info-item">
                    <i className="ri-phone-line"></i>
                    <span>{profile.phone}</span>
                    <i className="ri-verified-badge-fill naukri-verified"></i>
                  </div>
                )}
                {profile.city && (
                  <div className="naukri-info-item">
                    <i className="ri-map-pin-line"></i>
                    <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
                  </div>
                )}
                {profile.gender && (
                  <div className="naukri-info-item">
                    <i className="ri-user-2-line"></i>
                    <span>{profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</span>
                  </div>
                )}
                {profile.dateOfBirth && (
                  <div className="naukri-info-item">
                    <i className="ri-calendar-line"></i>
                    <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                {profile.education && (
                  <div className="naukri-info-item">
                    <i className="ri-graduation-cap-line"></i>
                    <span>{profile.education.substring(0, 50)}{profile.education.length > 50 ? '...' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Completion Widget */}
            <div className="naukri-completion-widget">
              <div className="naukri-completion-header">
                <span className="naukri-completion-title">Profile Completion</span>
                <span className="naukri-completion-percent">{completionPercent}%</span>
              </div>
              <div className="naukri-completion-bar">
                <div className="naukri-completion-fill" style={{ width: `${completionPercent}%` }}></div>
              </div>
              {missingDetails.length > 0 && (
                <ul className="naukri-missing-items">
                  {missingDetails.map((item, index) => (
                    <li 
                      key={index} 
                      className="naukri-missing-item"
                      onClick={() => {
                        setActiveSection(item.section);
                        setEditingSection(item.section);
                      }}
                    >
                      <i className="ri-add-circle-line"></i>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="naukri-tabs">
          <ul className="naukri-tabs-list">
            <li className={`naukri-tab ${activeTab === 'view-edit' ? 'active' : ''}`} onClick={() => setActiveTab('view-edit')}>
              View & Edit
            </li>
            <li className={`naukri-tab ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
              Activity Insights
            </li>
          </ul>
        </div>

        {/* Main Content */}
        {activeTab === 'view-edit' && (
          <div className="naukri-main-content">
            {/* Sidebar */}
            <aside className="naukri-sidebar">
              <div className="naukri-sidebar-card">
                <div className="naukri-sidebar-title">Quick Links</div>
                <ul className="naukri-sidebar-menu">
                  <li className={`naukri-sidebar-item ${activeSection === 'preferences' ? 'active' : ''}`} onClick={() => setActiveSection('preferences')}>
                    <i className="ri-heart-line"></i>
                    <span>Career Preferences</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'education' ? 'active' : ''}`} onClick={() => setActiveSection('education')}>
                    <i className="ri-graduation-cap-line"></i>
                    <span>Education</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'skills' ? 'active' : ''}`} onClick={() => setActiveSection('skills')}>
                    <i className="ri-tools-line"></i>
                    <span>Key Skills</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'employment' ? 'active' : ''}`} onClick={() => setActiveSection('employment')}>
                    <i className="ri-briefcase-line"></i>
                    <span>Employment</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'resume' ? 'active' : ''}`} onClick={() => setActiveSection('resume')}>
                    <i className="ri-file-text-line"></i>
                    <span>Resume</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'personal' ? 'active' : ''}`} onClick={() => setActiveSection('personal')}>
                    <i className="ri-user-line"></i>
                    <span>Personal Details</span>
                  </li>
                  <li className={`naukri-sidebar-item ${activeSection === 'social' ? 'active' : ''}`} onClick={() => setActiveSection('social')}>
                    <i className="ri-links-line"></i>
                    <span>Social Links</span>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Content Area */}
            <div className="naukri-content-area">
              {/* Career Preferences Section */}
              {activeSection === 'preferences' && (
                <div className="naukri-section">
                  <div className="naukri-section-header">
                    <h2 className="naukri-section-title">
                      <i className="ri-heart-line"></i>
                      Career Preferences
                    </h2>
                    {editingSection !== 'preferences' && (
                      <button className="naukri-edit-btn" onClick={() => setEditingSection('preferences')}>
                        <i className="ri-edit-line"></i>
                        Edit
                    
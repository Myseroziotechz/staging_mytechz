import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

function WebinarCard({ webinar, onClick }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  const handleRegisterClick = (e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Show confirmation modal
    setShowConfirmationModal(true);
  };

  const handleConfirmRegistration = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/admin/register-webinar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ webinar_id: webinar.id }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        if (window.showPopup) {
          window.showPopup('Registration successful! You will receive confirmation details soon.', 'success');
        } else {
          alert('Registration successful! You will receive confirmation details soon.');
        }
      } else {
        if (window.showPopup) {
          window.showPopup(data.message || 'Failed to register', 'error');
        } else {
          alert(data.message || 'Failed to register');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (window.showPopup) {
        window.showPopup('Error registering for webinar. Please try again.', 'error');
      } else {
        alert('Error registering for webinar. Please try again.');
      }
    }
  };

  return (
    <>
    <div className="webinar-card" onClick={() => onClick(webinar)}>
      <div className="card-header">
        <div className="webinar-info">
          <h3 className="webinar-title">{webinar.title}</h3>
          <p className="speaker-name">by {webinar.speaker}</p>
          <p className="organization">{webinar.organization}</p>
        </div>
        <div className="webinar-meta">
          <span className={`mode-badge ${webinar.mode.toLowerCase()}`}>
            {webinar.mode}
          </span>
          <span className="category-badge">{webinar.category}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="webinar-details">
          <div className="detail-item">
            <i className="ri-calendar-line"></i>
            <span>{new Date(webinar.date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <i className="ri-time-line"></i>
            <span>{webinar.time}</span>
          </div>
          <div className="detail-item">
            <i className={webinar.mode === 'Online' ? 'ri-computer-line' : 'ri-map-pin-line'}></i>
            <span>{webinar.mode === 'Online' ? webinar.platform : webinar.venue}</span>
          </div>
          <div className="detail-item">
            <i className="ri-money-dollar-line"></i>
            <span className={webinar.price === 'Free' ? 'free-price' : 'paid-price'}>
              {webinar.price}
            </span>
          </div>
        </div>

        <p className="webinar-description">{webinar.shortDescription}</p>
      </div>

      <div className="card-footer">
        <div className="webinar-status">
          <span className="event-date">
            {new Date(webinar.date) > new Date() ? 'Upcoming Event' : 'Past Event'}
          </span>
        </div>
        <div className="webinar-actions">
          <button 
            className="share-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
          >
            <i className="ri-share-line"></i>
            Share
          </button>
          <button 
            className="register-btn" 
            onClick={handleRegisterClick}
            disabled={new Date(webinar.date) < new Date()}
          >
            <i className="ri-calendar-check-line"></i>
            {new Date(webinar.date) > new Date() ? 'Register Now' : 'Event Ended'}
          </button>
        </div>
      </div>
    </div>
    
    <ShareModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
      shareUrl={`${window.location.origin}/webinar/${webinar.id}`}
      title={webinar.title}
      type="Webinar"
    />
    
    <ConfirmationModal
      isOpen={showConfirmationModal}
      onClose={() => setShowConfirmationModal(false)}
      onConfirm={handleConfirmRegistration}
      title="Confirm Webinar Registration"
      message={`Are you sure you want to register for "${webinar.title}"? You will receive confirmation details and joining instructions after registration.`}
      confirmText="Yes, Register"
      cancelText="Cancel"
      type="webinar"
    />
    </>
  );
}

export default WebinarCard;
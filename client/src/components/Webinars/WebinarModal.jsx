import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

function WebinarModal({ webinar, isOpen, onClose }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  if (!isOpen || !webinar) return null;

  const handleShare = async (platform) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/webinars/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webinarId: webinar.webinarId || webinar._id,
          platform
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (window.showPopup) {
          window.showPopup('Webinar shared successfully!', 'success');
        }
      }
    } catch (error) {
      console.error('Error sharing webinar:', error);
    }
  };

  const handleRegisterClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

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
        onClose();
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

  const isUpcoming = new Date(webinar.date) > new Date();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{webinar.title}</h2>
            <p className="speaker-info">by {webinar.speaker} • {webinar.organization}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="webinar-overview">
            <div className="overview-item">
              <i className="ri-calendar-line"></i>
              <div>
                <strong>Date</strong>
                <p>{new Date(webinar.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="overview-item">
              <i className="ri-time-line"></i>
              <div>
                <strong>Time</strong>
                <p>{webinar.time}</p>
              </div>
            </div>
            <div className="overview-item">
              <i className={webinar.mode === 'Online' ? 'ri-computer-line' : 'ri-map-pin-line'}></i>
              <div>
                <strong>{webinar.mode === 'Online' ? 'Platform' : 'Venue'}</strong>
                <p>{webinar.mode === 'Online' ? webinar.platform : webinar.venue}</p>
              </div>
            </div>
            <div className="overview-item">
              <i className="ri-money-dollar-line"></i>
              <div>
                <strong>Price</strong>
                <p className={webinar.price === 'Free' ? 'free-price' : 'paid-price'}>
                  {webinar.price}
                </p>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>About This Webinar</h3>
            <p>{webinar.description}</p>
          </div>

          <div className="section">
            <h3>Agenda</h3>
            <ul>
              {webinar.agenda.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>Requirements</h3>
            <ul>
              {webinar.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h3>What You'll Get</h3>
            <ul>
              {webinar.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="share-btn-modal" 
            onClick={() => setShowShareModal(true)}
          >
            <i className="ri-share-line"></i>
            Share
          </button>
          <button 
            className="register-btn-modal" 
            onClick={handleRegisterClick}
            disabled={!isUpcoming}
          >
            <i className="ri-calendar-check-line"></i>
            {isUpcoming ? 'Register for this Webinar' : 'Event has ended'}
          </button>
        </div>
      </div>
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={`${window.location.origin}/webinars/${webinar.webinarId || webinar._id}`}
        title={webinar.title}
        type="Webinar"
        onShare={handleShare}
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
    </div>
  );
}

export default WebinarModal;
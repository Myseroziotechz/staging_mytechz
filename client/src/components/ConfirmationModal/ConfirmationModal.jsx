import React from 'react';
import './ConfirmationModal.css';

function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "webinar" // "webinar" or "admission"
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirmation-modal-overlay" onClick={onClose}>
      <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-modal-header">
          <div className="confirmation-icon">
            {type === "webinar" ? (
              <i className="ri-presentation-line"></i>
            ) : (
              <i className="ri-school-line"></i>
            )}
          </div>
          <h3>{title}</h3>
          <button className="confirmation-close-btn" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="confirmation-modal-body">
          <p>{message}</p>
        </div>

        <div className="confirmation-modal-footer">
          <button 
            className="confirmation-cancel-btn" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className="confirmation-confirm-btn" 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
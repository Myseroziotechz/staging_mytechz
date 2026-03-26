import React from 'react';
import './CTAButton.css';

const CTAButton = ({ 
  children, 
  icon, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  className = ''
}) => {
  return (
    <button 
      className={`cta-button-component ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${className}`}
      onClick={onClick}
    >
      {icon && <i className={icon}></i>}
      <span>{children}</span>
    </button>
  );
};

export default CTAButton;

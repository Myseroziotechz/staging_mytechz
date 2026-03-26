import React from 'react';
import './TestimonialCard.css';

const TestimonialCard = ({ name, role, company, quote, avatar, stats }) => {
  return (
    <div className="testimonial-card-component">
      <div className="testimonial-header">
        <div className="testimonial-avatar">
          {avatar || <i className="ri-user-smile-line"></i>}
        </div>
        <div className="testimonial-info">
          <h4>{name}</h4>
          <p>{role}{company && ` at ${company}`}</p>
        </div>
      </div>
      <div className="testimonial-content">
        <p>"{quote}"</p>
      </div>
      {stats && stats.length > 0 && (
        <div className="testimonial-stats">
          {stats.map((stat, index) => (
            <span key={index}>
              <i className={stat.icon}></i> {stat.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialCard;

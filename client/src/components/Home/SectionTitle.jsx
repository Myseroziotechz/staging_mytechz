import React from 'react';
import './SectionTitle.css';

const SectionTitle = ({ title, subtitle, align = 'center' }) => {
  return (
    <div className={`section-title-wrapper ${align}`}>
      <h2 className="section-main-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;

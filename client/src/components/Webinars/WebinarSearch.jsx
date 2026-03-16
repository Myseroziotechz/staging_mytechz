import React, { useState } from 'react';

function WebinarSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Real-time search like in Home
  };

  return (
    <div className="webinar-search-section">
      <div className="webinar-search-header">
        <h1>Discover Amazing Webinars</h1>
        <p>Learn from industry experts and expand your knowledge</p>
      </div>
      
      <div className="webinar-search-container">
        <div className="webinar-search-wrapper">
          <input
            type="text"
            className="webinar-search-input"
            placeholder="Search webinars by title, speaker, or category..."
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button className="webinar-search-btn" onClick={handleSubmit}>
            <i className="ri-search-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebinarSearch;
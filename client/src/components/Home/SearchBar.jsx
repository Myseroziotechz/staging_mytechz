import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ 
  placeholder = "Search for jobs, pages, results, admissions...",
  suggestions = [],
  onSearch,
  onSuggestionClick 
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (value) => {
    setSearchValue(value);
    setShowSuggestions(value.length > 0);
    if (onSearch) onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) onSuggestionClick(suggestion);
    setShowSuggestions(false);
    setSearchValue("");
  };

  const filteredSuggestions = suggestions.filter(item =>
    item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="search-bar-component">
      <div className="search-bar-wrapper">
        <input
          type="text"
          className="search-bar-input"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowSuggestions(searchValue.length > 0)}
        />
        <button className="search-bar-btn">
          <i className="ri-search-line"></i>
        </button>
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="search-suggestions-dropdown">
            {filteredSuggestions.slice(0, 6).map((suggestion, index) => (
              <div 
                key={index} 
                className="suggestion-item-dropdown"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="suggestion-icon-dropdown">
                  {suggestion.type === 'job' ? 
                    <i className="ri-briefcase-line"></i> : 
                    <i className="ri-file-text-line"></i>
                  }
                </div>
                <div className="suggestion-content-dropdown">
                  <div className="suggestion-title-dropdown">{suggestion.title}</div>
                  {suggestion.description && (
                    <div className="suggestion-desc-dropdown">{suggestion.description}</div>
                  )}
                </div>
                <i className="ri-arrow-right-line suggestion-arrow-dropdown"></i>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

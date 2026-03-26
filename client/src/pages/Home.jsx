import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import './ResumeSection.css';
import heroImage from '../assets/photo.webp';
import '../components/ScrollAnimations.css';
import { useScrollAnimation } from '../components/useScrollAnimation';
import JobCard from '../components/Jobs/JobCard';
import { sampleJobs } from '../components/Jobs/jobData';
import ResumeManager from '../components/Resume/ResumeManager';
import Popup from '../components/Popup';

const industries = ["All", "IT & Software", "Education", "Engineering", "Healthcare", "Private", "Government"];
const experiences = ["All", "Entry", "Mid", "Senior"];
const locations = ["All", "Bangalore, India", "Chennai, India", "Delhi, India", "Hyderabad, India", "Mumbai, India", "Pune, India"];

export default function Home() {
  const [industry, setIndustry] = useState("All");
  const [experience, setExperience] = useState("All");
  const [location, setLocation] = useState("All");
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showResumeManager, setShowResumeManager] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Handle Resume click
  const handleResumeClick = () => {
    setPopupOpen(true);
  };

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  
  const searchSuggestions = [
    { title: "Government Jobs", url: "/jobs/government", type: "page", description: "Browse all government job openings" },
    { title: "Private Jobs", url: "/jobs/private", type: "page", description: "Explore private sector opportunities" },
    { title: "Software Developer", url: "/jobs/government", type: "job", description: "Government software development positions" },
    { title: "Full Stack Developer", url: "/jobs/private", type: "job", description: "Private sector development roles" },
    { title: "Data Analyst", url: "/jobs/government", type: "job", description: "Government data analysis positions" },
    { title: "UI/UX Designer", url: "/jobs/private", type: "job", description: "Design roles in private companies" },
    { title: "Results", url: "/results", type: "page", description: "Check exam results and notifications" },
    { title: "Admit Cards", url: "/admit-card", type: "page", description: "Download admit cards for exams" },
    { title: "Internships", url: "/internships", type: "page", description: "Find internship opportunities" },
    { title: "College Admissions", url: "/admissions", type: "page", description: "College admission information" }
  ];
  
  const filteredSuggestions = searchSuggestions.filter(item =>
    item.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
    item.description.toLowerCase().includes(globalSearch.toLowerCase())
  );
  
  const handleGlobalSearch = (value) => {
    setGlobalSearch(value);
    setShowSuggestions(value.length > 0);
  };
  
  const handleSuggestionClick = (url) => {
    window.location.href = url;
    setShowSuggestions(false);
    setGlobalSearch("");
  };
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    
    setLoading(true);
    
    // Combine government and private jobs, sort by datePosted (most recent first) and take only latest 6
    const allJobs = [...sampleJobs.government, ...sampleJobs.private];
    const sortedJobs = allJobs
      .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
      .slice(0, 6);
    
    setJobs(sortedJobs);
    setLoading(false);
  }, []);
  
  const handleJobClick = (job) => {
    // Redirect to appropriate job section based on job company type
    if (job.company?.toLowerCase().includes('government') || job.company?.toLowerCase().includes('ministry')) {
      window.location.href = '/jobs/government';
    } else {
      window.location.href = '/jobs/private';
    }
  };

  const searchBarRef = useRef(null);

  // Apply scroll animations
  const heroImageRef = useScrollAnimation('move-in-right');
  const quickLinksRef = useScrollAnimation('move-in-bottom');
  const featuredJobsRef = useScrollAnimation('move-in-top');

  const filteredJobs = jobs.filter(job =>
    (industry === "All" || job.category === industry || job.type === industry) &&
    (experience === "All" || job.experienceLevel === experience) &&
    (location === "All" || job.location?.toLowerCase().includes(location.toLowerCase())) &&
    (search.trim() === "" ||
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleScrollToSearch = () => {
    if (searchBarRef.current) {
      searchBarRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchBarRef.current.querySelector('input')?.focus();
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text" ref={useScrollAnimation('move-in-left')}>
          <h1>Find the Right Job. Build Your Career with <span> MytechZ</span>.</h1>
          <p className="hero-subtext">
            Government & Private Jobs • Admit Cards • Results • Internships — All in One Place
          </p>
          <div className="hero-buttons">
            <button 
              className="resume-btn" 
              onClick={handleResumeClick}
            >
              <i className="ri-mail-line"></i> Post Your Resume
            </button>
            <button className="explore-btn" onClick={handleScrollToSearch}><i className="ri-search-line"></i> Explore Jobs</button>
          </div>
        </div>
        <div className="hero-image" ref={useScrollAnimation('move-in-right')}>
          <img src={heroImage} alt="Job Search" />
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="global-search-section">
        <div className="global-search-container">
          <div className="global-search-wrapper">
            <input
              type="text"
              className="global-search-input"
              placeholder="Search for jobs, pages, results, admissions..."
              value={globalSearch}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              onFocus={() => setShowSuggestions(globalSearch.length > 0)}
            />
            <button className="global-search-btn">
              <i className="ri-search-line"></i>
            </button>
            
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="search-suggestions">
                {filteredSuggestions.slice(0, 6).map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion.url)}
                  >
                    <div className="suggestion-icon">
                      {suggestion.type === 'job' ? <i className="ri-briefcase-line"></i> : <i className="ri-file-text-line"></i>}
                    </div>
                    <div className="suggestion-content">
                      <div className="suggestion-title">{suggestion.title}</div>
                      <div className="suggestion-desc">{suggestion.description}</div>
                    </div>
                    <i className="ri-arrow-right-line suggestion-arrow"></i>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="resume-section" ref={useScrollAnimation('move-in-right')}>
        <div className="resume-content">
          <h2 className="resume-title">Build Your Professional Resume</h2>
          <p className="resume-description">
            Create a standout resume with our professional templates and get noticed by companies.
          </p>
          <div className="resume-features">
            <div className="feature-icon">
              <i className="ri-file-text-line"></i>
              <span>Professional Templates</span>
            </div>
            <div className="feature-icon">
              <i className="ri-palette-line"></i>
              <span>Customizable Design</span>
            </div>
            <div className="feature-icon">
              <i className="ri-download-line"></i>
              <span>Best ATS score</span>
            </div>
          </div>
          <button 
            className="resume-cta-btn"
            onClick={handleResumeClick}
          >
            <i className="ri-rocket-line"></i>
            Get Ready My First Resume
          </button>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-section">
        <h2 className="quick-links-title">Fast Access to Resources</h2>
        <div className="quick-links-list" ref={useScrollAnimation('move-in-bottom')}>
          {[
            { href: "/jobs/private", label: "Private Jobs", icon: "ri-building-line" },
            { href: "/gov-exams", label: "Government Exams", icon: "ri-government-line" },
            { href: "/admissions", label: "College Admissions", icon: "ri-school-line" },
            { href: "#", label: "Resume Creation", icon: "ri-file-text-line", onClick: handleResumeClick },
            { href: "/webinars", label: "Webinars & Workshops", icon: "ri-graduation-cap-line" },
            { href: "/internships", label: "Internship Listings", icon: "ri-global-line" },
          ].slice(0, window.innerWidth <= 768 ? 6 : 10).map(link => (
            link.onClick ? (
              <div 
                className="quick-link-card" 
                key={link.label}
                onClick={link.onClick}
                style={{ cursor: 'pointer' }}
              >
                {link.icon.startsWith('ri-') ? <i className={link.icon}></i> : link.icon}<span>{link.label}</span>
              </div>
            ) : (
              <a href={link.href} className="quick-link-card" key={link.href}>
                {link.icon.startsWith('ri-') ? <i className={link.icon}></i> : link.icon}<span>{link.label}</span>
              </a>
            )
          ))}
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="featured-jobs-section">
        <h2 className="featured-jobs-title">Latest Job Openings</h2>
        <div className="integrated-search-section" ref={useScrollAnimation('move-in-top')}>
          <div className="search-with-filters" ref={searchBarRef}>
            <div className="search-input-container">
              <input
                type="text"
                className="job-search-input"
                placeholder="Search job title or company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="job-search-icon" tabIndex={-1} aria-label="Search">
                <i className="ri-search-line"></i>
              </button>
            </div>
            <div className="inline-filters">
              <select value={industry} onChange={e => setIndustry(e.target.value)} className="filter-select">
                <option value="All">All Industries</option>
                {industries.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={experience} onChange={e => setExperience(e.target.value)} className="filter-select">
                <option value="All">All Experience</option>
                {experiences.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={location} onChange={e => setLocation(e.target.value)} className="filter-select">
                <option value="All">All Locations</option>
                {locations.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="jobs-grid" ref={useScrollAnimation('move-in-bottom')}>
          {loading ? (
            <div className="loading-msg">Loading latest jobs...</div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.slice(0, window.innerWidth <= 768 ? 3 : 6).map((job) => (
              <JobCard key={job.id} job={job} onClick={handleJobClick} />
            ))
          ) : (
            <div className="no-jobs-msg">No jobs found for selected filters.</div>
          )}
        </div>
      </div>

      {/* Services Section */}
      <div className="service-highlights-section">
        <h2 className="service-highlights-title">We Offer More Than Just Jobs</h2>
        <div className="service-highlights-list" ref={useScrollAnimation('move-in-right')}>
          <div className="service-card" onClick={() => window.showNotification('Career guidance service coming soon!', 'info')}>
            <i className="ri-lightbulb-line"></i><span>Career Guidance</span>
          </div>
          <div className="service-card" onClick={handleResumeClick}>
            <i className="ri-file-text-line"></i><span>Resume Building</span>
          </div>
          <div className="service-card" onClick={() => window.showNotification('Interview preparation service coming soon!', 'info')}>
            <i className="ri-mic-line"></i><span>Interview Preparation</span>
          </div>
          <div className="service-card" onClick={() => window.location.href = '/admissions'}>
            <i className="ri-school-line"></i><span>College Admission Help</span>
          </div>
          <div className="service-card" onClick={() => window.location.href = '/webinars'}>
            <i className="ri-global-line"></i><span>Webinars & Workshops</span>
          </div>
        </div>
      </div>

      {/* Why Choose MytechZ Section */}
      <div className="why-choose-section">
        <h2 className="why-choose-title">Why Choose MytechZ?</h2>
        <p className="why-choose-subtitle">Your complete career companion for every step of your professional journey</p>
        <div className="why-choose-grid" ref={useScrollAnimation('move-in-bottom')}>
          <div className="why-choose-card">
            <div className="why-icon">
              <i className="ri-shield-check-line"></i>
            </div>
            <h3>Verified Opportunities</h3>
            <p>Every job listing is verified to ensure authenticity. No fake postings, only genuine career opportunities from trusted employers.</p>
          </div>
          <div className="why-choose-card">
            <div className="why-icon">
              <i className="ri-time-line"></i>
            </div>
            <h3>Real-Time Updates</h3>
            <p>Get instant notifications for new job postings, exam results, and admit cards. Never miss an important deadline again.</p>
          </div>
          <div className="why-choose-card">
            <div className="why-icon">
              <i className="ri-user-star-line"></i>
            </div>
            <h3>Personalized Matches</h3>
            <p>Our smart algorithm matches your skills and preferences with the right opportunities, saving you time and effort.</p>
          </div>
          <div className="why-choose-card">
            <div className="why-icon">
              <i className="ri-graduation-cap-line"></i>
            </div>
            <h3>Career Growth Tools</h3>
            <p>Access free webinars, interview prep resources, and career guidance from industry experts to accelerate your growth.</p>
          </div>
        </div>
      </div>

      {/* Trending Skills Section */}
      <div className="trending-skills-section">
        <h2 className="trending-skills-title">In-Demand Skills for 2026</h2>
        <p className="trending-skills-subtitle">Master these skills to stay ahead in the job market</p>
        <div className="skills-grid" ref={useScrollAnimation('move-in-left')}>
          <div className="skill-card">
            <div className="skill-icon">💻</div>
            <h4>Full Stack Development</h4>
            <div className="skill-demand">
              <span className="demand-badge high">High Demand</span>
              <span className="job-count">2,500+ Jobs</span>
            </div>
          </div>
          <div className="skill-card">
            <div className="skill-icon">🤖</div>
            <h4>AI & Machine Learning</h4>
            <div className="skill-demand">
              <span className="demand-badge high">High Demand</span>
              <span className="job-count">1,800+ Jobs</span>
            </div>
          </div>
          <div className="skill-card">
            <div className="skill-icon">☁️</div>
            <h4>Cloud Computing</h4>
            <div className="skill-demand">
              <span className="demand-badge high">High Demand</span>
              <span className="job-count">2,200+ Jobs</span>
            </div>
          </div>
          <div className="skill-card">
            <div className="skill-icon">📊</div>
            <h4>Data Analytics</h4>
            <div className="skill-demand">
              <span className="demand-badge medium">Growing</span>
              <span className="job-count">1,600+ Jobs</span>
            </div>
          </div>
          <div className="skill-card">
            <div className="skill-icon">🎨</div>
            <h4>UI/UX Design</h4>
            <div className="skill-demand">
              <span className="demand-badge medium">Growing</span>
              <span className="job-count">1,400+ Jobs</span>
            </div>
          </div>
          <div className="skill-card">
            <div className="skill-icon">🔒</div>
            <h4>Cybersecurity</h4>
            <div className="skill-demand">
              <span className="demand-badge high">High Demand</span>
              <span className="job-count">1,900+ Jobs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="success-stories-section">
        <h2 className="success-stories-title">Success Stories from Our Community</h2>
        <p className="success-stories-subtitle">Real people, real career transformations</p>
        <div className="stories-grid" ref={useScrollAnimation('move-in-right')}>
          <div className="story-card">
            <div className="story-header">
              <div className="story-avatar">
                <i className="ri-user-smile-line"></i>
              </div>
              <div className="story-info">
                <h4>Priya Sharma</h4>
                <p>Software Engineer at TCS</p>
              </div>
            </div>
            <div className="story-content">
              <p>"I found my dream job within 2 weeks of joining MytechZ. The resume builder helped me create a professional CV, and the interview prep resources were invaluable!"</p>
            </div>
            <div className="story-stats">
              <span><i className="ri-briefcase-line"></i> Applied: 12 jobs</span>
              <span><i className="ri-check-circle-line"></i> Hired in 14 days</span>
            </div>
          </div>
          <div className="story-card">
            <div className="story-header">
              <div className="story-avatar">
                <i className="ri-user-smile-line"></i>
              </div>
              <div className="story-info">
                <h4>Rajesh Kumar</h4>
                <p>Data Analyst at Infosys</p>
              </div>
            </div>
            <div className="story-content">
              <p>"The government job alerts feature is amazing! I got notified about SSC CGL exam the moment it was announced. Now I'm preparing with their free webinars."</p>
            </div>
            <div className="story-stats">
              <span><i className="ri-notification-line"></i> 50+ Alerts</span>
              <span><i className="ri-star-line"></i> 5 Interviews</span>
            </div>
          </div>
          <div className="story-card">
            <div className="story-header">
              <div className="story-avatar">
                <i className="ri-user-smile-line"></i>
              </div>
              <div className="story-info">
                <h4>Ananya Reddy</h4>
                <p>UI/UX Designer at Wipro</p>
              </div>
            </div>
            <div className="story-content">
              <p>"MytechZ's career guidance helped me transition from teaching to tech. The personalized job matches saved me hours of searching!"</p>
            </div>
            <div className="story-stats">
              <span><i className="ri-arrow-up-line"></i> Career Switch</span>
              <span><i className="ri-money-rupee-circle-line"></i> 40% Salary Hike</span>
            </div>
          </div>
        </div>
      </div>

      {/* Career Resources Hub */}
      <div className="career-resources-section">
        <h2 className="career-resources-title">Your Career Growth Hub</h2>
        <p className="career-resources-subtitle">Free resources to accelerate your professional journey</p>
        <div className="resources-grid" ref={useScrollAnimation('move-in-bottom')}>
          <div className="resource-card" onClick={() => window.location.href = '/webinars'}>
            <div className="resource-icon">
              <i className="ri-live-line"></i>
            </div>
            <h3>Live Webinars</h3>
            <p>Join expert-led sessions on resume building, interview skills, and industry trends</p>
            <div className="resource-meta">
              <span><i className="ri-calendar-line"></i> Weekly Sessions</span>
              <span className="resource-badge">Free</span>
            </div>
          </div>
          <div className="resource-card" onClick={() => window.showNotification('Interview prep resources coming soon!', 'info')}>
            <div className="resource-icon">
              <i className="ri-question-answer-line"></i>
            </div>
            <h3>Interview Preparation</h3>
            <p>Practice with 500+ interview questions and get AI-powered feedback on your answers</p>
            <div className="resource-meta">
              <span><i className="ri-file-list-line"></i> 500+ Questions</span>
              <span className="resource-badge">Free</span>
            </div>
          </div>
          <div className="resource-card" onClick={() => window.showNotification('Career guidance service coming soon!', 'info')}>
            <div className="resource-icon">
              <i className="ri-compass-line"></i>
            </div>
            <h3>Career Guidance</h3>
            <p>Get personalized career advice from industry mentors and career counselors</p>
            <div className="resource-meta">
              <span><i className="ri-user-line"></i> Expert Mentors</span>
              <span className="resource-badge">Premium</span>
            </div>
          </div>
          <div className="resource-card" onClick={handleResumeClick}>
            <div className="resource-icon">
              <i className="ri-file-text-line"></i>
            </div>
            <h3>Resume Builder</h3>
            <p>Create ATS-friendly resumes with professional templates in minutes</p>
            <div className="resource-meta">
              <span><i className="ri-layout-line"></i> 10+ Templates</span>
              <span className="resource-badge">Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hiring Made Easy Section - Only show for non-logged in users or recruiters */}
      {(!isLoggedIn || (isLoggedIn && JSON.parse(localStorage.getItem('user') || '{}').role === 'recruiter')) && (
        <div className="hiring-made-easy-section">
          <h2 className="hiring-title">Hiring Made Easy</h2>
          <div className="hiring-cards">
            <div className="hiring-card">
              <h3>Job Posting</h3>
              <div className="hiring-features">
                <div className="hiring-feature">
                  <i className="ri-check-line"></i>
                  <span>Post unlimited jobs</span>
                </div>
                <div className="hiring-feature">
                  <i className="ri-check-line"></i>
                  <span>Reach qualified candidates</span>
                </div>
              </div>
              <button className="hiring-btn">View plans</button>
            </div>
            
            <div className="hiring-card">
              <h3>RESDEX</h3>
              <div className="hiring-features">
                <div className="hiring-feature">
                  <i className="ri-check-line"></i>
                  <span>Access resume database</span>
                </div>
                <div className="hiring-feature">
                  <i className="ri-check-line"></i>
                  <span>Advanced search filters</span>
                </div>
              </div>
              <button className="hiring-btn">View plans</button>
            </div>
            
            <div className="hiring-card popular">
              <div className="popular-badge">MOST POPULAR</div>
              <h3>Assisted Hiring</h3>
              <div className="hiring-features">
                <div className="hiring-feature">
                  <i className="ri-check-line"></i>
                  <span>Dedicated hiring support</span>
                </div>
                <div className="hiring-feature">
                  <i className="ri-check-line"></i>
                  <span>Pre-screened candidates</span>
                </div>
              </div>
              <button className="hiring-btn">View plans</button>
            </div>
          </div>
        </div>
      )}

      {/* Job Categories */}
      <div className="categories-section">
        <h2 className="categories-title">Explore Job Sectors</h2>
        <ul className="categories-list" ref={useScrollAnimation('move-in-left')}>
          <li><i className="ri-briefcase-line"></i> Private Company Roles</li>
          <li><i className="ri-computer-line"></i> IT & Software</li>
          <li><i className="ri-book-line"></i> Education & Teaching</li>
          <li><i className="ri-settings-line"></i> Engineering</li>
          <li><i className="ri-hospital-line"></i> Healthcare</li>
        </ul>
        <a href="/categories" className="view-all-categories">→ View All Categories</a>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <div className="testimonials-list">
          <div className="testimonial-card">
            <span className="testimonial-quote">"MytechZ helped me find my first internship!"</span>
            <span className="testimonial-user">– Asha, Bangalore</span>
          </div>
          <div className="testimonial-card">
            <span className="testimonial-quote">"Very useful for government job updates."</span>
            <span className="testimonial-user">– Rahul, Mysore</span>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="newsletter-section">
        <h2 className="newsletter-title">Stay Updated – Get Job Alerts in Your Inbox</h2>
        <form
          className="newsletter-form"
          onSubmit={e => {
            e.preventDefault();
            alert("Subscribed!");
          }}
          ref={useScrollAnimation('move-in-bottom')}
        >
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="newsletter-btn">
            Subscribe
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {[
            {
              q: "How do I apply for jobs on MytechZ?",
              a: "Simply browse through our job listings, click on any job that interests you, and follow the application instructions provided."
            },
            {
              q: "Are the job listings verified?",
              a: "Yes, we verify all job postings to ensure they are legitimate opportunities from real companies."
            },
            {
              q: "Do I need an account to create a resume?",
              a: "Yes, you need to log in to access resume creation and management features."
            },
            {
              q: "How often are new jobs posted?",
              a: "New jobs are posted daily. We recommend checking back regularly or subscribing to our newsletter for updates."
            },
            {
              q: "Is MytechZ free to use?",
              a: "Yes, job searching and basic features are completely free. Premium features may require a subscription."
            }
          ].map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.q}</span>
                <i className={`ri-arrow-${openFaq === index ? 'up' : 'down'}-s-line`}></i>
              </div>
              {openFaq === index && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Resume Manager Modal */}
      {showResumeManager && (
        <ResumeManager onClose={() => setShowResumeManager(false)} />
      )}
      
      {/* Resume Feature Popup */}
      <Popup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="Resume AI Analyzer"
        message="Our advanced Resume AI Analyzer feature is coming soon! Get ready for ATS score analysis, keyword optimization, and industry-specific tips to make your resume stand out. 🚀"
        type="info"
      />
    </div>
  );
}
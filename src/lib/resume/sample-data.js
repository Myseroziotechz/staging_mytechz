/**
 * Sample resume data used for template previews in the gallery and detail pages.
 */
export const SAMPLE_RESUME_DATA = {
  contact: {
    fullName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/priyasharma',
    github: 'github.com/priyasharma',
  },
  summary:
    'Results-driven software engineer with 4+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud infrastructure. Passionate about clean code, performance optimisation, and mentoring junior developers.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Flipkart',
      location: 'Bengaluru',
      startDate: 'Jan 2023',
      endDate: 'Present',
      bullets: [
        'Led migration of monolithic codebase to microservices, reducing deployment time by 60%',
        'Built real-time inventory tracking system handling 50K+ requests/sec',
        'Mentored 4 junior engineers and established code review best practices',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'Infosys',
      location: 'Pune',
      startDate: 'Jul 2020',
      endDate: 'Dec 2022',
      bullets: [
        'Developed RESTful APIs serving 2M+ daily active users',
        'Improved application load time by 40% through code splitting and lazy loading',
        'Implemented CI/CD pipeline reducing release cycles from 2 weeks to 2 days',
      ],
    },
  ],
  education: [
    {
      degree: 'B.Tech Computer Science',
      institution: 'IIT Madras',
      location: 'Chennai',
      year: '2020',
    },
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'AWS',
    'Docker',
    'PostgreSQL',
    'MongoDB',
    'Git',
    'CI/CD',
    'System Design',
  ],
  certifications: [
    { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
  ],
  projects: [
    {
      name: 'Open Source Dashboard',
      description:
        'Built a real-time analytics dashboard using React and D3.js, used by 500+ developers',
      techStack: ['React', 'D3.js', 'WebSocket'],
      date: '2023',
    },
  ],
  languages: [
    { name: 'English', proficiency: 'Professional' },
    { name: 'Hindi', proficiency: 'Native' },
  ],
}

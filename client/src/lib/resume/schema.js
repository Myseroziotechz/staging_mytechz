// JSON Resume schema defaults and validation for MyTechZ Resume Builder

export const DEFAULT_RESUME_DATA = {
  basics: {
    name: '',
    label: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: { city: '', region: '', countryCode: 'IN' },
    profiles: [],
  },
  work: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
}

export const EMPTY_WORK = {
  name: '',
  position: '',
  startDate: '',
  endDate: '',
  summary: '',
  highlights: [''],
  current: false,
}

export const EMPTY_EDUCATION = {
  institution: '',
  area: '',
  studyType: '',
  startDate: '',
  endDate: '',
  score: '',
}

export const EMPTY_SKILL = {
  name: '',
  level: '',
  keywords: [],
}

export const EMPTY_PROJECT = {
  name: '',
  description: '',
  highlights: [''],
  url: '',
}

export const EMPTY_CERTIFICATE = {
  name: '',
  issuer: '',
  date: '',
}

export const EMPTY_LANGUAGE = {
  language: '',
  fluency: '',
}

export const EMPTY_PROFILE = {
  network: '',
  url: '',
  username: '',
}

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
export const FLUENCY_LEVELS = ['Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native']
export const STUDY_TYPES = ['High School', 'Diploma', 'Bachelor', 'Master', 'Doctorate', 'Certificate']
export const NETWORKS = ['LinkedIn', 'GitHub', 'Twitter', 'Portfolio', 'Other']

// Validation
export function validateBasics(basics) {
  const errors = {}
  if (!basics.name?.trim()) errors.name = 'Name is required'
  if (!basics.email?.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email)) errors.email = 'Invalid email'
  if (basics.phone && !/^[+\d\s()-]{7,20}$/.test(basics.phone)) errors.phone = 'Invalid phone number'
  return errors
}

export function validateWork(work) {
  return work.map((w) => {
    const errors = {}
    if (!w.name?.trim()) errors.name = 'Company name is required'
    if (!w.position?.trim()) errors.position = 'Position is required'
    if (!w.startDate) errors.startDate = 'Start date is required'
    return errors
  })
}

export function validateEducation(edu) {
  return edu.map((e) => {
    const errors = {}
    if (!e.institution?.trim()) errors.institution = 'Institution is required'
    if (!e.area?.trim()) errors.area = 'Field of study is required'
    return errors
  })
}

export function hasErrors(errorObj) {
  if (Array.isArray(errorObj)) return errorObj.some((e) => Object.keys(e).length > 0)
  return Object.keys(errorObj).length > 0
}

// Sample data for template previews
export const SAMPLE_RESUME_DATA = {
  basics: {
    name: 'Priya Sharma',
    label: 'Senior Software Engineer',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    url: 'https://priyasharma.dev',
    summary:
      'Results-driven software engineer with 6+ years of experience building scalable web applications. Passionate about clean architecture, performance optimization, and mentoring junior developers. Led teams that delivered products serving 2M+ users.',
    location: { city: 'Bengaluru', region: 'Karnataka', countryCode: 'IN' },
    profiles: [
      { network: 'LinkedIn', url: 'https://linkedin.com/in/priyasharma', username: 'priyasharma' },
      { network: 'GitHub', url: 'https://github.com/priyasharma', username: 'priyasharma' },
    ],
  },
  work: [
    {
      name: 'TechCorp India',
      position: 'Senior Software Engineer',
      startDate: '2022-01',
      endDate: '',
      current: true,
      summary: 'Lead developer for customer-facing platform.',
      highlights: [
        'Architected microservices platform reducing API latency by 40%',
        'Led team of 8 engineers delivering features for 2M+ active users',
        'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
      ],
    },
    {
      name: 'StartupXYZ',
      position: 'Software Engineer',
      startDate: '2019-06',
      endDate: '2021-12',
      summary: 'Full-stack development for fintech platform.',
      highlights: [
        'Built real-time payment processing system handling 50K transactions/day',
        'Reduced page load time by 60% through code splitting and caching',
        'Mentored 3 junior developers through structured code review process',
      ],
    },
  ],
  education: [
    {
      institution: 'Indian Institute of Technology, Delhi',
      area: 'Computer Science',
      studyType: 'Bachelor',
      startDate: '2015-08',
      endDate: '2019-05',
      score: '8.7 CGPA',
    },
  ],
  skills: [
    { name: 'Frontend', level: 'Expert', keywords: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
    { name: 'Backend', level: 'Advanced', keywords: ['Node.js', 'Python', 'PostgreSQL', 'Redis'] },
    { name: 'DevOps', level: 'Intermediate', keywords: ['Docker', 'AWS', 'CI/CD', 'Kubernetes'] },
  ],
  projects: [
    {
      name: 'OpenSource Analytics',
      description: 'Privacy-first analytics platform for web applications',
      highlights: ['1.2K GitHub stars', 'Used by 500+ websites', 'Built with Next.js and ClickHouse'],
      url: 'https://github.com/priya/os-analytics',
    },
  ],
  certificates: [
    { name: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', date: '2023-03' },
  ],
  languages: [
    { language: 'English', fluency: 'Full Professional' },
    { language: 'Hindi', fluency: 'Native' },
  ],
}

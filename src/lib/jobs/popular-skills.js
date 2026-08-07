// Top tech / non-tech skills surfaced as instant suggestions in the JobForm.
// Falls back to dynamic Supabase query when the typed prefix doesn't match.
export const POPULAR_SKILLS = [
  // Frontend
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue.js', 'Angular',
  'Tailwind CSS', 'HTML', 'CSS', 'SASS', 'Redux', 'GraphQL', 'Webpack',
  'Vite', 'Astro', 'Svelte',
  // Backend
  'Node.js', 'Express', 'NestJS', 'Python', 'Django', 'Flask', 'FastAPI',
  'Java', 'Spring Boot', 'Go', 'Rust', 'Ruby', 'Ruby on Rails', 'PHP',
  'Laravel', '.NET', 'C#', 'C++', 'Kotlin', 'Scala',
  // Mobile
  'React Native', 'Flutter', 'Swift', 'Objective-C', 'Android', 'iOS',
  // Database
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQL',
  'Supabase', 'Firebase', 'DynamoDB', 'Cassandra',
  // DevOps / Cloud
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
  'CI/CD', 'GitHub Actions', 'Jenkins', 'Linux', 'Nginx',
  // Data / AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NumPy',
  'Pandas', 'scikit-learn', 'OpenAI', 'LangChain', 'LLMs', 'Computer Vision',
  'NLP', 'Data Science', 'Data Engineering', 'Spark', 'Airflow', 'Hadoop',
  'BigQuery', 'Snowflake',
  // QA / Test
  'Jest', 'Cypress', 'Playwright', 'Selenium', 'Pytest', 'JUnit',
  // Design / Product
  'Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Product Management',
  'Agile', 'Scrum', 'JIRA',
  // Marketing / Sales / Ops
  'SEO', 'Content Writing', 'Digital Marketing', 'Google Ads', 'HubSpot',
  'Salesforce', 'Excel', 'Power BI', 'Tableau', 'Lead Generation',
  // Soft / common
  'Communication', 'Teamwork', 'Problem Solving', 'Leadership',
  // Government-prep common
  'General Knowledge', 'Quantitative Aptitude', 'Reasoning', 'English',
]

export function localSuggest(prefix, exclude = []) {
  const p = (prefix || '').toLowerCase().trim()
  if (!p) return []
  const ex = new Set(exclude.map((s) => s.toLowerCase()))
  return POPULAR_SKILLS.filter(
    (s) => s.toLowerCase().includes(p) && !ex.has(s.toLowerCase())
  ).slice(0, 8)
}

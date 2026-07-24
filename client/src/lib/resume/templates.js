// Template registry: maps slug to component, metadata, and thumbnail info

export const TEMPLATES = [
  {
    slug: 'classic',
    name: 'Classic',
    category: 'professional',
    description: 'Clean, traditional single-column layout. Perfect for corporate roles and experienced professionals.',
    features: ['ATS-Friendly', 'Single Column', 'Clean Typography'],
    color: '#1e40af',
  },
  {
    slug: 'modern',
    name: 'Modern',
    category: 'modern',
    description: 'Two-column design with a colored accent sidebar. Great for tech professionals and designers.',
    features: ['Two Column', 'Accent Sidebar', 'Visual Skills'],
    color: '#7c3aed',
  },
  {
    slug: 'minimal',
    name: 'Minimal',
    category: 'minimal',
    description: 'Whitespace-focused, elegant layout. Ideal for senior roles where content speaks for itself.',
    features: ['Minimal Design', 'Maximum Readability', 'Elegant'],
    color: '#374151',
  },
  {
    slug: 'creative',
    name: 'Creative',
    category: 'creative',
    description: 'Bold header with colored sidebar. Stands out while remaining professional for creative roles.',
    features: ['Bold Header', 'Color Accents', 'Creative Layout'],
    color: '#059669',
  },
  {
    slug: 'professional',
    name: 'Professional',
    category: 'professional',
    description: 'Corporate-grade formal layout with structured sections. Best for finance, consulting, and management.',
    features: ['Formal Layout', 'Structured Sections', 'Corporate Ready'],
    color: '#0f172a',
  },
  {
    slug: 'tech',
    name: 'Tech',
    category: 'modern',
    description: 'Developer-focused template with monospace accents and skill badges. Built for engineers.',
    features: ['Skill Badges', 'Monospace Accents', 'Developer Focused'],
    color: '#ea580c',
  },
]

export function getTemplate(slug) {
  return TEMPLATES.find((t) => t.slug === slug) || TEMPLATES[0]
}

export function getTemplatesByCategory(category) {
  if (!category || category === 'all') return TEMPLATES
  return TEMPLATES.filter((t) => t.category === category)
}

export const CATEGORIES = [
  { value: 'all', label: 'All Templates' },
  { value: 'professional', label: 'Professional' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'creative', label: 'Creative' },
]

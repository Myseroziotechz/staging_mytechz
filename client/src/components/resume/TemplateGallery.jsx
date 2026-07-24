'use client'

import { useState } from 'react'
import TemplateCard from './TemplateCard'
import { TEMPLATES, CATEGORIES } from '@/lib/resume/templates'

export default function TemplateGallery() {
  const [category, setCategory] = useState('all')

  const filtered = category === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category)

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              category === cat.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((template) => (
          <TemplateCard key={template.slug} template={template} />
        ))}
      </div>
    </div>
  )
}

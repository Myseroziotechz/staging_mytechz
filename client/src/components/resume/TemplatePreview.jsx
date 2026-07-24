'use client'

import dynamic from 'next/dynamic'

const templates = {
  classic: dynamic(() => import('./templates/ClassicTemplate'), { ssr: false }),
  modern: dynamic(() => import('./templates/ModernTemplate'), { ssr: false }),
  minimal: dynamic(() => import('./templates/MinimalTemplate'), { ssr: false }),
  creative: dynamic(() => import('./templates/CreativeTemplate'), { ssr: false }),
  professional: dynamic(() => import('./templates/ProfessionalTemplate'), { ssr: false }),
  tech: dynamic(() => import('./templates/TechTemplate'), { ssr: false }),
}

export default function TemplatePreview({ slug = 'classic', data = {}, scale }) {
  const TemplateComponent = templates[slug] || templates.classic

  return (
    <div className="relative bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      <div className="overflow-auto max-h-[80vh]">
        <div
          className="origin-top-left"
          style={{
            transform: `scale(${scale || 0.5})`,
            width: scale ? `${100 / scale}%` : '200%',
            height: scale ? `${100 / scale}%` : '200%',
          }}
        >
          <TemplateComponent data={data} />
        </div>
      </div>
    </div>
  )
}

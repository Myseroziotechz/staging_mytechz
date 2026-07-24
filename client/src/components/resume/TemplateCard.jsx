'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { SAMPLE_RESUME_DATA } from '@/lib/resume/schema'
import dynamic from 'next/dynamic'

const templates = {
  classic: dynamic(() => import('./templates/ClassicTemplate'), { ssr: false }),
  modern: dynamic(() => import('./templates/ModernTemplate'), { ssr: false }),
  minimal: dynamic(() => import('./templates/MinimalTemplate'), { ssr: false }),
  creative: dynamic(() => import('./templates/CreativeTemplate'), { ssr: false }),
  professional: dynamic(() => import('./templates/ProfessionalTemplate'), { ssr: false }),
  tech: dynamic(() => import('./templates/TechTemplate'), { ssr: false }),
}

// A4 width in CSS pixels at 96 dpi (210mm)
const A4_W_PX = 794

export default function TemplateCard({ template, showUseButton = true }) {
  const TemplateComponent = templates[template.slug]
  const containerRef = useRef(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    if (!containerRef.current) return
    const update = () => {
      const w = containerRef.current?.offsetWidth
      if (w) setScale(w / A4_W_PX)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="group relative">
      <Link
        href={`/ai-tools/resume-builder/templates/${template.slug}`}
        className="block"
      >
        {/* Preview */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div ref={containerRef} className="relative w-full aspect-[210/297] overflow-hidden">
            {TemplateComponent && (
              <TemplateComponent data={SAMPLE_RESUME_DATA} scale={scale} />
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white text-sm font-semibold">Preview Template</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.color }} />
            <h3 className="text-sm font-bold text-slate-900">{template.name}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{template.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {template.features?.map((f, i) => (
              <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{f}</span>
            ))}
          </div>
        </div>
      </Link>

      {showUseButton && (
        <Link
          href={`/ai-tools/resume-builder/editor?template=${template.slug}`}
          className="mt-3 block w-full text-center bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Use This Template
        </Link>
      )}
    </div>
  )
}

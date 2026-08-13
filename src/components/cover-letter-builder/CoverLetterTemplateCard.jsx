'use client'

import Link from 'next/link'
import ResumeTemplatePreview from '@/components/resume-builder/ResumeTemplatePreview'
import { SAMPLE_COVER_LETTER_DATA } from '@/lib/cover-letter/sample-data'
import UseTemplateButton from './UseTemplateButton'

const CATEGORY_COLORS = {
  general: 'bg-slate-100 text-slate-700',
  tech: 'bg-blue-100 text-blue-700',
  creative: 'bg-purple-100 text-purple-700',
  government: 'bg-green-100 text-green-700',
  academic: 'bg-amber-100 text-amber-700',
}

export default function CoverLetterTemplateCard({ template, showUseButton = true }) {
  const { id, name, slug, description, category, html_css_template } = template

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
      {/* Live rendered preview thumbnail — true A4 aspect ratio */}
      <div className="aspect-210/297 bg-white relative overflow-hidden">
        {html_css_template ? (
          <ResumeTemplatePreview htmlTemplate={html_css_template} data={SAMPLE_COVER_LETTER_DATA} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-sm text-slate-400">{name}</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-900">{name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[category] || CATEGORY_COLORS.general}`}>
            {category}
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center gap-2">
          <Link
            href={`/ai-tools/cover-letter-builder/templates/${slug}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Preview
          </Link>
          {showUseButton && (
            <UseTemplateButton templateId={id} templateName={name} variant="compact" />
          )}
        </div>
      </div>
    </div>
  )
}

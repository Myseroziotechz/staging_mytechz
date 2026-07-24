'use client'

import { formatDate } from './utils'

export default function ProfessionalTemplate({ data = {}, scale = 1 }) {
  const { basics = {}, work = [], education = [], skills = [], projects = [], certificates = [], languages = [] } = data

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white font-serif text-[11px] leading-[1.55] text-gray-800"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <div className="px-12 py-10">
        {/* Header — formal, top-aligned */}
        <header className="mb-6">
          <h1 className="text-[26px] font-bold text-slate-950 tracking-tight">{basics.name || 'Your Name'}</h1>
          {basics.label && <p className="text-[13px] text-slate-700 mt-0.5">{basics.label}</p>}
          <div className="h-[3px] bg-slate-900 mt-3 mb-2" />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-600">
            {basics.email && <span>{basics.email}</span>}
            {basics.phone && <span>{basics.phone}</span>}
            {basics.location?.city && (
              <span>{basics.location.city}{basics.location.region ? `, ${basics.location.region}` : ''}</span>
            )}
            {basics.url && <span>{basics.url}</span>}
            {basics.profiles?.map((p, i) => (
              <span key={i}>{p.network}: {p.url || p.username}</span>
            ))}
          </div>
        </header>

        {/* Summary */}
        {basics.summary && (
          <section className="mb-5">
            <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">Executive Summary</h2>
            <p className="text-slate-700">{basics.summary}</p>
          </section>
        )}

        {/* Experience */}
        {work.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Professional Experience</h2>
            {work.map((w, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[12px] font-bold text-slate-900">{w.position}</h3>
                    <p className="text-slate-700 font-semibold">{w.name}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 ml-4">
                    {formatDate(w.startDate)} — {w.current ? 'Present' : formatDate(w.endDate)}
                  </span>
                </div>
                {w.highlights?.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 list-disc list-inside text-slate-700">
                    {w.highlights.filter(Boolean).map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Education</h2>
            {education.map((e, i) => (
              <div key={i} className="mb-3 flex justify-between items-start">
                <div>
                  <h3 className="text-[12px] font-bold text-slate-900">
                    {e.studyType && `${e.studyType} in `}{e.area}
                  </h3>
                  <p className="text-slate-700">{e.institution}</p>
                  {e.score && <p className="text-[10px] text-slate-500">Score: {e.score}</p>}
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 ml-4">
                  {formatDate(e.startDate)} — {formatDate(e.endDate)}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Two-column: Skills + Certifications */}
        <div className="grid grid-cols-2 gap-8">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Core Competencies</h2>
              <div className="space-y-2">
                {skills.map((s, i) => (
                  <div key={i}>
                    <span className="font-bold text-slate-900">{s.name}: </span>
                    <span className="text-slate-700">{s.keywords?.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div>
            {/* Certifications */}
            {certificates.length > 0 && (
              <section className="mb-5">
                <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Certifications</h2>
                {certificates.map((c, i) => (
                  <div key={i} className="mb-1.5">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-slate-600"> — {c.issuer}</span>
                    {c.date && <span className="text-[10px] text-slate-500"> ({formatDate(c.date)})</span>}
                  </div>
                ))}
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Languages</h2>
                <div className="space-y-1">
                  {languages.map((l, i) => (
                    <div key={i}>
                      <span className="font-bold text-slate-900">{l.language}</span>
                      <span className="text-slate-600"> — {l.fluency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[12px] font-bold text-slate-950 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">Key Projects</h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-3">
                <h3 className="text-[12px] font-bold text-slate-900">{p.name}</h3>
                {p.description && <p className="text-slate-600 mt-0.5">{p.description}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

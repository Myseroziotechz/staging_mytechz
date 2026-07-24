'use client'

import { formatDate } from './utils'

export default function MinimalTemplate({ data = {}, scale = 1 }) {
  const { basics = {}, work = [], education = [], skills = [], projects = [], certificates = [], languages = [] } = data

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white font-sans text-[11px] leading-[1.6] text-gray-700"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <div className="px-16 py-14">
        {/* Header — minimal, centered */}
        <header className="text-center mb-10">
          <h1 className="text-[30px] font-light text-gray-900 tracking-wide">{basics.name || 'Your Name'}</h1>
          {basics.label && <p className="text-[13px] text-gray-500 mt-1 tracking-wide">{basics.label}</p>}
          <div className="flex justify-center flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] text-gray-500">
            {basics.email && <span>{basics.email}</span>}
            {basics.phone && <><span className="text-gray-300">|</span><span>{basics.phone}</span></>}
            {basics.location?.city && (
              <><span className="text-gray-300">|</span><span>{basics.location.city}</span></>
            )}
            {basics.url && <><span className="text-gray-300">|</span><span>{basics.url}</span></>}
          </div>
        </header>

        <hr className="border-gray-200 mb-8" />

        {/* Summary */}
        {basics.summary && (
          <section className="mb-8 text-center max-w-[150mm] mx-auto">
            <p className="text-gray-600 italic">{basics.summary}</p>
          </section>
        )}

        {/* Experience */}
        {work.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">Experience</h2>
            {work.map((w, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[12px] font-semibold text-gray-900">{w.position} <span className="font-normal text-gray-500">at {w.name}</span></h3>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-4">
                    {formatDate(w.startDate)} — {w.current ? 'Present' : formatDate(w.endDate)}
                  </span>
                </div>
                {w.highlights?.filter(Boolean).length > 0 && (
                  <ul className="mt-2 space-y-1 text-gray-600">
                    {w.highlights.filter(Boolean).map((h, j) => (
                      <li key={j} className="pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-gray-400">{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">Education</h2>
            {education.map((e, i) => (
              <div key={i} className="mb-3 flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-gray-900">{e.studyType && `${e.studyType} in `}{e.area}</span>
                  <span className="text-gray-500"> — {e.institution}</span>
                  {e.score && <span className="text-gray-400 text-[10px] ml-2">({e.score})</span>}
                </div>
                <span className="text-[10px] text-gray-400 shrink-0 ml-4">
                  {formatDate(e.startDate)} — {formatDate(e.endDate)}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">Skills</h2>
            <div className="space-y-2">
              {skills.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-gray-900 font-medium min-w-[90px]">{s.name}</span>
                  <span className="text-gray-600">{s.keywords?.join(' · ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-4">Projects</h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-3">
                <h3 className="text-[12px] font-semibold text-gray-900">{p.name}</h3>
                {p.description && <p className="text-gray-600 mt-0.5">{p.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Certifications & Languages — inline */}
        <div className="flex gap-12">
          {certificates.length > 0 && (
            <section className="flex-1">
              <h2 className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-3">Certifications</h2>
              {certificates.map((c, i) => (
                <p key={i} className="mb-1"><span className="font-medium text-gray-900">{c.name}</span> — {c.issuer}</p>
              ))}
            </section>
          )}
          {languages.length > 0 && (
            <section>
              <h2 className="text-[12px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-3">Languages</h2>
              {languages.map((l, i) => (
                <p key={i} className="mb-1"><span className="font-medium text-gray-900">{l.language}</span> — {l.fluency}</p>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

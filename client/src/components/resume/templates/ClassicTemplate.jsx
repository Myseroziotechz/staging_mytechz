'use client'

import { formatDate } from './utils'

export default function ClassicTemplate({ data = {}, scale = 1 }) {
  const { basics = {}, work = [], education = [], skills = [], projects = [], certificates = [], languages = [] } = data

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white font-sans text-[11px] leading-[1.5] text-gray-800"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <div className="px-12 py-10">
        {/* Header */}
        <header className="border-b-2 border-blue-700 pb-4 mb-6">
          <h1 className="text-[28px] font-bold text-slate-900 leading-tight">{basics.name || 'Your Name'}</h1>
          {basics.label && <p className="text-[14px] text-blue-700 font-medium mt-1">{basics.label}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-600">
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
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2">Professional Summary</h2>
            <p className="text-slate-700">{basics.summary}</p>
          </section>
        )}

        {/* Experience */}
        {work.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-3">Experience</h2>
            {work.map((w, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[12px] font-bold text-slate-900">{w.position}</h3>
                    <p className="text-blue-700 font-medium">{w.name}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 ml-4">
                    {formatDate(w.startDate)} — {w.current ? 'Present' : formatDate(w.endDate)}
                  </span>
                </div>
                {w.summary && <p className="mt-1 text-slate-600">{w.summary}</p>}
                {w.highlights?.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {w.highlights.filter(Boolean).map((h, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-blue-600 mt-0.5">&#8226;</span>
                        <span>{h}</span>
                      </li>
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
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-3">Education</h2>
            {education.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[12px] font-bold text-slate-900">
                      {e.studyType && `${e.studyType} in `}{e.area}
                    </h3>
                    <p className="text-blue-700 font-medium">{e.institution}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 ml-4">
                    {formatDate(e.startDate)} — {formatDate(e.endDate)}
                  </span>
                </div>
                {e.score && <p className="text-slate-600 mt-0.5">Score: {e.score}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-3">Skills</h2>
            <div className="space-y-1.5">
              {skills.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <span className="font-semibold text-slate-900 min-w-[100px]">{s.name}:</span>
                  <span className="text-slate-700">{s.keywords?.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-3">Projects</h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-3">
                <h3 className="text-[12px] font-bold text-slate-900">{p.name}</h3>
                {p.description && <p className="text-slate-600 mt-0.5">{p.description}</p>}
                {p.highlights?.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {p.highlights.filter(Boolean).map((h, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-blue-600 mt-0.5">&#8226;</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className="mb-5">
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-3">Certifications</h2>
            {certificates.map((c, i) => (
              <div key={i} className="flex justify-between mb-1.5">
                <span><span className="font-semibold">{c.name}</span> — {c.issuer}</span>
                {c.date && <span className="text-[10px] text-slate-500">{formatDate(c.date)}</span>}
              </div>
            ))}
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-2">Languages</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {languages.map((l, i) => (
                <span key={i}><span className="font-semibold">{l.language}</span> — {l.fluency}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

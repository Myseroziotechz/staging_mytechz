'use client'

import { formatDate } from './utils'

export default function CreativeTemplate({ data = {}, scale = 1 }) {
  const { basics = {}, work = [], education = [], skills = [], projects = [], certificates = [], languages = [] } = data

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white font-sans text-[11px] leading-[1.5] text-gray-800"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      {/* Bold Header */}
      <header className="bg-emerald-700 text-white px-12 py-8">
        <h1 className="text-[28px] font-bold tracking-tight">{basics.name || 'Your Name'}</h1>
        {basics.label && <p className="text-emerald-200 text-[14px] mt-1 font-medium">{basics.label}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] text-emerald-100">
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

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-[65mm] bg-emerald-50 px-6 py-8 shrink-0">
          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-3">Skills</h2>
              {skills.map((s, i) => (
                <div key={i} className="mb-3">
                  <p className="font-semibold text-[10px] text-emerald-900 mb-1.5">{s.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {s.keywords?.map((k, j) => (
                      <span key={j} className="bg-emerald-200 text-emerald-800 text-[9px] px-2 py-0.5 rounded">{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-3">Education</h2>
              {education.map((e, i) => (
                <div key={i} className="mb-3">
                  <p className="font-semibold text-[10px] text-emerald-900">{e.studyType && `${e.studyType} in `}{e.area}</p>
                  <p className="text-[10px] text-emerald-700">{e.institution}</p>
                  <p className="text-[9px] text-emerald-600">{formatDate(e.startDate)} — {formatDate(e.endDate)}</p>
                  {e.score && <p className="text-[9px] text-emerald-600">Score: {e.score}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-3">Languages</h2>
              {languages.map((l, i) => (
                <div key={i} className="mb-1.5 flex justify-between text-[10px]">
                  <span className="font-medium text-emerald-900">{l.language}</span>
                  <span className="text-emerald-600">{l.fluency}</span>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certificates.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-3">Certifications</h2>
              {certificates.map((c, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold text-[10px] text-emerald-900">{c.name}</p>
                  <p className="text-[9px] text-emerald-600">{c.issuer} {c.date && `· ${formatDate(c.date)}`}</p>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 py-8">
          {/* Summary */}
          {basics.summary && (
            <section className="mb-6">
              <h2 className="text-[13px] font-bold text-emerald-700 mb-2">About Me</h2>
              <p className="text-slate-700">{basics.summary}</p>
            </section>
          )}

          {/* Experience */}
          {work.length > 0 && (
            <section className="mb-6">
              <h2 className="text-[13px] font-bold text-emerald-700 mb-3">Experience</h2>
              {work.map((w, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12px] font-bold text-slate-900">{w.position}</h3>
                      <p className="text-emerald-700 font-medium">{w.name}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-4 bg-emerald-50 px-2 py-0.5 rounded">
                      {formatDate(w.startDate)} — {w.current ? 'Present' : formatDate(w.endDate)}
                    </span>
                  </div>
                  {w.highlights?.filter(Boolean).length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {w.highlights.filter(Boolean).map((h, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-emerald-500 mt-0.5">&#9656;</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-[13px] font-bold text-emerald-700 mb-3">Projects</h2>
              {projects.map((p, i) => (
                <div key={i} className="mb-3">
                  <h3 className="text-[12px] font-bold text-slate-900">{p.name}</h3>
                  {p.description && <p className="text-slate-600 mt-0.5">{p.description}</p>}
                  {p.highlights?.filter(Boolean).length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {p.highlights.filter(Boolean).map((h, j) => (
                        <li key={j} className="flex gap-2"><span className="text-emerald-500">&#9656;</span><span>{h}</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

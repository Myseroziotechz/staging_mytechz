'use client'

import { formatDate } from './utils'

export default function TechTemplate({ data = {}, scale = 1 }) {
  const { basics = {}, work = [], education = [], skills = [], projects = [], certificates = [], languages = [] } = data

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-slate-950 font-mono text-[11px] leading-[1.55] text-slate-300"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <div className="px-10 py-10">
        {/* Header — terminal style */}
        <header className="mb-7 border border-slate-700 rounded-lg p-5 bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-[10px] text-slate-500 ml-2">resume.tsx</span>
          </div>
          <h1 className="text-[26px] font-bold text-orange-400">{basics.name || 'Your Name'}</h1>
          {basics.label && <p className="text-[13px] text-cyan-400 mt-1">{basics.label}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] text-slate-400">
            {basics.email && <span className="text-green-400">{basics.email}</span>}
            {basics.phone && <span>{basics.phone}</span>}
            {basics.location?.city && (
              <span>{basics.location.city}{basics.location.region ? `, ${basics.location.region}` : ''}</span>
            )}
            {basics.url && <span className="text-cyan-400">{basics.url}</span>}
            {basics.profiles?.map((p, i) => (
              <span key={i} className="text-cyan-400">{p.network}: {p.url || p.username}</span>
            ))}
          </div>
        </header>

        {/* Summary */}
        {basics.summary && (
          <section className="mb-6">
            <h2 className="text-[12px] font-bold text-orange-400 mb-2">
              <span className="text-slate-500">{'// '}</span>README.md
            </h2>
            <p className="text-slate-300 bg-slate-900 rounded p-3 border border-slate-800">{basics.summary}</p>
          </section>
        )}

        {/* Skills — badges style */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[12px] font-bold text-orange-400 mb-3">
              <span className="text-slate-500">{'// '}</span>tech_stack
            </h2>
            {skills.map((s, i) => (
              <div key={i} className="mb-3">
                <p className="text-[10px] text-cyan-400 font-semibold mb-1.5">{s.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.keywords?.map((k, j) => (
                    <span key={j} className="bg-slate-800 border border-slate-700 text-slate-200 text-[9px] px-2.5 py-1 rounded-md font-medium">{k}</span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Experience */}
        {work.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[12px] font-bold text-orange-400 mb-3">
              <span className="text-slate-500">{'// '}</span>work_experience
            </h2>
            {work.map((w, i) => (
              <div key={i} className="mb-4 bg-slate-900 rounded-lg p-4 border border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[12px] font-bold text-slate-100">{w.position}</h3>
                    <p className="text-cyan-400 text-[11px]">{w.name}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded shrink-0 ml-4">
                    {formatDate(w.startDate)} → {w.current ? 'now' : formatDate(w.endDate)}
                  </span>
                </div>
                {w.highlights?.filter(Boolean).length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {w.highlights.filter(Boolean).map((h, j) => (
                      <li key={j} className="flex gap-2 text-slate-300">
                        <span className="text-green-500 shrink-0">$</span>
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
          <section className="mb-6">
            <h2 className="text-[12px] font-bold text-orange-400 mb-3">
              <span className="text-slate-500">{'// '}</span>projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-3 bg-slate-900 rounded p-3 border border-slate-800">
                <h3 className="text-[12px] font-bold text-yellow-400">{p.name}</h3>
                {p.url && <p className="text-cyan-400 text-[10px]">{p.url}</p>}
                {p.description && <p className="text-slate-400 mt-1">{p.description}</p>}
                {p.highlights?.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {p.highlights.filter(Boolean).map((h, j) => (
                      <li key={j} className="flex gap-2"><span className="text-green-500">-</span><span>{h}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education + Certs + Languages in grid */}
        <div className="grid grid-cols-3 gap-4">
          {education.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold text-orange-400 mb-2">
                <span className="text-slate-500">{'// '}</span>education
              </h2>
              {education.map((e, i) => (
                <div key={i} className="mb-2 text-[10px]">
                  <p className="text-slate-200 font-semibold">{e.studyType && `${e.studyType} in `}{e.area}</p>
                  <p className="text-cyan-400">{e.institution}</p>
                  <p className="text-slate-500">{formatDate(e.startDate)} — {formatDate(e.endDate)}</p>
                </div>
              ))}
            </section>
          )}

          {certificates.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold text-orange-400 mb-2">
                <span className="text-slate-500">{'// '}</span>certifications
              </h2>
              {certificates.map((c, i) => (
                <div key={i} className="mb-2 text-[10px]">
                  <p className="text-slate-200 font-semibold">{c.name}</p>
                  <p className="text-slate-500">{c.issuer}</p>
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold text-orange-400 mb-2">
                <span className="text-slate-500">{'// '}</span>languages
              </h2>
              {languages.map((l, i) => (
                <div key={i} className="mb-1 text-[10px] flex justify-between">
                  <span className="text-slate-200">{l.language}</span>
                  <span className="text-slate-500">{l.fluency}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

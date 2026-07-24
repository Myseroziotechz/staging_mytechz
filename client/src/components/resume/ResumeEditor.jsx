'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DEFAULT_RESUME_DATA } from '@/lib/resume/schema'
import { createResume, updateResume, getResume } from '@/lib/resume/queries'
import TemplatePreview from './TemplatePreview'
import AIContentPanel from './AIContentPanel'
import ResumeUploader from './ResumeUploader'
import BasicsStep from './steps/BasicsStep'
import ExperienceStep from './steps/ExperienceStep'
import EducationStep from './steps/EducationStep'
import SkillsStep from './steps/SkillsStep'
import ProjectsStep from './steps/ProjectsStep'
import SummaryStep from './steps/SummaryStep'

const STEPS = [
  { key: 'basics', label: 'Personal Info', icon: '1' },
  { key: 'experience', label: 'Experience', icon: '2' },
  { key: 'education', label: 'Education', icon: '3' },
  { key: 'skills', label: 'Skills', icon: '4' },
  { key: 'projects', label: 'Projects & More', icon: '5' },
  { key: 'summary', label: 'Summary & Review', icon: '6' },
]

export default function ResumeEditor({ templateSlug = 'classic', resumeId = null }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ ...DEFAULT_RESUME_DATA })
  const [docId, setDocId] = useState(resumeId)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'saved' | 'error'
  const [exporting, setExporting] = useState(false)
  const [title, setTitle] = useState('Untitled Resume')
  const [template, setTemplate] = useState(templateSlug)
  const [showPreview, setShowPreview] = useState(false)
  const [showUploader, setShowUploader] = useState(!resumeId)

  function handleResumeParsed(parsed) {
    if (!parsed || typeof parsed !== 'object') return
    setData((prev) => {
      const merged = { ...prev }
      if (parsed.basics) merged.basics = { ...prev.basics, ...parsed.basics }
      if (parsed.work?.length)         merged.work         = parsed.work
      if (parsed.education?.length)    merged.education    = parsed.education
      if (parsed.skills?.length)       merged.skills       = parsed.skills
      if (parsed.projects?.length)     merged.projects     = parsed.projects
      if (parsed.certificates?.length) merged.certificates = parsed.certificates
      if (parsed.languages?.length)    merged.languages    = parsed.languages
      return merged
    })
    if (parsed.basics?.name) setTitle(`${parsed.basics.name}'s Resume`)
    setShowUploader(false)
    // Navigate to Personal Info step so the user sees the populated fields
    setStep(0)
  }

  // Load existing resume
  useEffect(() => {
    if (!resumeId) return
    getResume(resumeId).then((doc) => {
      if (doc) {
        setData(doc.resume_data || { ...DEFAULT_RESUME_DATA })
        setTitle(doc.title)
        setTemplate(doc.template_slug)
      }
    }).catch(() => {})
  }, [resumeId])

  const handleChange = useCallback((newData) => {
    setData(newData)
  }, [])

  // Auto-save
  async function save() {
    setSaveStatus('saving')
    try {
      if (docId) {
        await updateResume(docId, { title, templateSlug: template, resumeData: data })
      } else {
        const doc = await createResume({ title, templateSlug: template, resumeData: data })
        setDocId(doc.id)
        window.history.replaceState(null, '', `/ai-tools/resume-builder/editor?template=${template}&resumeId=${doc.id}`)
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (err) {
      console.error('Save failed:', err)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  async function handleExport(format) {
    setExporting(true)
    try {
      // Save first
      let id = docId
      if (!id) {
        const doc = await createResume({ title, templateSlug: template, resumeData: data })
        id = doc.id
        setDocId(id)
      } else {
        await updateResume(id, { title, templateSlug: template, resumeData: data })
      }
      // Download
      const res = await fetch(`/api/resume/export?id=${id}&format=${format}`)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.${format === 'pdf' ? 'pdf' : 'docx'}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
      alert('Export failed. Please try again.')
    }
    setExporting(false)
  }

  const StepComponent = {
    0: BasicsStep,
    1: ExperienceStep,
    2: EducationStep,
    3: SkillsStep,
    4: ProjectsStep,
    5: SummaryStep,
  }[step]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push('/ai-tools/resume-builder/templates')}
              className="text-slate-500 hover:text-slate-700 shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm font-semibold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 truncate min-w-0"
              placeholder="Resume Title"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={save}
              disabled={saveStatus === 'saving'}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200 flex items-center gap-1.5 ${
                saveStatus === 'saved'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : saveStatus === 'error'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-50'
              }`}
            >
              {saveStatus === 'saving' && (
                <>
                  <svg className="animate-spin w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              )}
              {saveStatus === 'error' && 'Failed — Retry'}
              {saveStatus === 'idle' && 'Save Draft'}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="px-4 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Download PDF'}
            </button>
            <button
              onClick={() => handleExport('docx')}
              disabled={exporting}
              className="px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-50"
            >
              DOCX
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Left: Form */}
          <div className={`flex-1 min-w-0 ${showPreview ? 'hidden lg:block' : ''}`}>
            {/* Step indicator */}
            <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
              {STEPS.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    i === step
                      ? 'bg-blue-600 text-white shadow-md'
                      : i < step
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-white/70 text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === step ? 'bg-white text-blue-600' : i < step ? 'bg-green-200 text-green-700' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {i < step ? '✓' : s.icon}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Resume Upload */}
            {step === 0 && showUploader && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Quick Start: Upload Existing Resume</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Upload a PDF or DOCX and we'll auto-fill the form for you</p>
                  </div>
                  <button
                    onClick={() => setShowUploader(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Skip
                  </button>
                </div>
                <ResumeUploader onParsed={handleResumeParsed} />
              </div>
            )}

            {step === 0 && !showUploader && !resumeId && (
              <button
                onClick={() => setShowUploader(true)}
                className="mb-6 w-full py-2.5 text-sm font-medium text-blue-600 border border-dashed border-blue-300 rounded-xl hover:bg-blue-50/50 transition-colors"
              >
                Upload an existing resume to auto-fill
              </button>
            )}

            {/* Form content */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6 sm:p-8">
              <StepComponent data={data} onChange={handleChange} />
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (step < STEPS.length - 1) setStep(step + 1)
                  else save()
                }}
                className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {step < STEPS.length - 1 ? 'Next' : 'Save Resume'}
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className={`w-[480px] shrink-0 ${showPreview ? '' : 'hidden lg:block'}`}>
            <div className="sticky top-20">
              {/* Template switcher */}
              <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                {['classic', 'modern', 'minimal', 'creative', 'professional', 'tech'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                      template === t ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-blue-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <TemplatePreview slug={template} data={data} scale={0.48} />
              <div className="mt-4">
                <AIContentPanel
                  resumeData={data}
                  onApply={(action) => {
                    if (action.type === 'summary') {
                      setData((prev) => ({ ...prev, basics: { ...prev.basics, summary: action.value } }))
                    } else if (action.type === 'merge') {
                      setData((prev) => {
                        const merged = { ...prev }
                        const v = action.value
                        if (v.basics) merged.basics = { ...prev.basics, ...v.basics }
                        if (v.work?.length) merged.work = v.work
                        if (v.education?.length) merged.education = v.education
                        if (v.skills?.length) merged.skills = v.skills
                        if (v.projects?.length) merged.projects = v.projects
                        return merged
                      })
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

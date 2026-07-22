'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import ResumeForm from '@/components/resume-builder/ResumeForm'
import ResumePreview from '@/components/resume-builder/ResumePreview'
import FileUpload from '@/components/resume-builder/FileUpload'
import { SAMPLE_RESUME_DATA } from '@/lib/resume/sample-data'

const EMPTY_RESUME = {
  contact: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '' },
  summary: '',
  experience: [{ title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }],
  education: [{ degree: '', institution: '', location: '', year: '' }],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
}

export default function CreateResumePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')

  const [template, setTemplate] = useState(null)
  const [activeTab, setActiveTab] = useState('manual') // manual | upload | ai
  const [resumeData, setResumeData] = useState(SAMPLE_RESUME_DATA)
  const [loading, setLoading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [error, setError] = useState('')
  const [suggestedSkills, setSuggestedSkills] = useState([])

  useEffect(() => {
    if (templateId) fetchTemplate(templateId)
  }, [templateId])

  async function fetchTemplate(id) {
    const supabase = createClient()
    const { data } = await supabase
      .from('resume_templates')
      .select('*')
      .eq('id', id)
      .single()
    if (data) setTemplate(data)
  }

  async function fetchSkillSuggestions(data) {
    try {
      const res = await fetch('/api/ai/resume/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data }),
      })
      const result = await res.json()
      if (res.ok && result.suggestions?.missingKeywords) {
        const existing = (data.skills || []).map((s) => s.toLowerCase())
        const newSuggestions = result.suggestions.missingKeywords.filter(
          (kw) => !existing.includes(kw.toLowerCase())
        )
        setSuggestedSkills(newSuggestions.slice(0, 12))
      }
    } catch {
      // Silent fail
    }
  }

  async function handleFileUpload(file) {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      let resumeResult = null

      if (templateId) {
        // Template-aware autofill
        const formData = new FormData()
        formData.append('file', file)
        formData.append('templateId', templateId)
        const res = await fetch('/api/ai/resume/autofill', { method: 'POST', body: formData })
        const data = await res.json()
        if (res.ok && data.resumeData) {
          resumeResult = data.resumeData
        } else {
          setError(data.error || 'Failed to parse resume')
          return
        }
      } else {
        // Fallback: parse without template
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/ai/resume/parse', { method: 'POST', body: formData })
        const data = await res.json()
        if (res.ok && data.resumeData) {
          resumeResult = data.resumeData
        } else {
          setError(data.error || 'Failed to parse resume. Please select a template first.')
          return
        }
      }

      if (resumeResult) {
        const merged = { ...EMPTY_RESUME, ...resumeResult }
        setResumeData(merged)
        fetchSkillSuggestions(merged)
      }
    } catch {
      setError('Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  async function handleAIGenerate() {
    if (!aiPrompt.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })
      const data = await res.json()
      if (res.ok && data.resumeData) {
        const merged = { ...EMPTY_RESUME, ...data.resumeData }
        setResumeData(merged)
        fetchSkillSuggestions(merged)
      } else {
        setError(data.error || 'Failed to generate resume')
      }
    } catch {
      setError('Failed to generate resume')
    } finally {
      setLoading(false)
    }
  }

  async function handleContinue() {
    if (!templateId) {
      setError('Please select a template first')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resumeData.contact?.fullName ? `${resumeData.contact.fullName}'s Resume` : 'Untitled Resume',
          template_id: templateId,
          resume_data: resumeData,
        }),
      })
      const data = await res.json()
      if (res.ok && data.id) {
        router.push(`/ai-tools/resume-builder/editor/${data.id}`)
      } else {
        setError(data.error || 'Failed to create resume')
      }
    } catch {
      setError('Failed to create resume')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    {
      key: 'manual',
      label: 'Manual Input',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
        </svg>
      ),
    },
    {
      key: 'upload',
      label: 'Upload Resume',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
    },
    {
      key: 'ai',
      label: 'AI Generate',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Your Resume</h1>
        <p className="text-slate-600">
          {template ? `Using: ${template.name} template` : 'Choose how you want to get started'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Left: Input */}
        <div>
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'manual' && (
            <div>
              {resumeData === SAMPLE_RESUME_DATA && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-4">
                  <p className="text-xs text-blue-700">Pre-filled with sample data. Edit the fields below or clear to start fresh.</p>
                  <button
                    onClick={() => setResumeData(EMPTY_RESUME)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap ml-3"
                  >
                    Clear All
                  </button>
                </div>
              )}
              <ResumeForm
                resumeData={resumeData}
                onChange={setResumeData}
                sections={template?.default_sections}
              />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Upload Your Existing Resume</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Upload a PDF or DOCX file. AI will extract your information and auto-fill the form.
                </p>
                <FileUpload onFileSelected={handleFileUpload} disabled={loading} />
                {loading && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Parsing your resume with AI...
                  </div>
                )}
              </div>
              {/* Show form below for editing after upload */}
              {resumeData.contact?.fullName && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Review & Edit Extracted Data</h3>
                  <ResumeForm
                    resumeData={resumeData}
                    onChange={setResumeData}
                    sections={template?.default_sections}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Generate with AI</h3>
              <p className="text-sm text-slate-500 mb-4">
                Describe your experience and the role you are targeting. AI will generate a complete resume for you.
              </p>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Example: I'm a software engineer with 3 years of experience in React and Node.js. I've worked at a startup building e-commerce platforms. I have a B.Tech from NIT Warangal. I want to apply for senior frontend roles at product companies..."
                rows={6}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none mb-4"
              />
              <button
                onClick={handleAIGenerate}
                disabled={loading || !aiPrompt.trim()}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Generate Resume
                  </>
                )}
              </button>

              {/* Show form below for editing after generation */}
              {resumeData.contact?.fullName && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Review & Edit Generated Content</h3>
                  <ResumeForm
                    resumeData={resumeData}
                    onChange={setResumeData}
                    sections={template?.default_sections}
                  />
                </div>
              )}
            </div>
          )}

          {/* AI Suggested Skills */}
          {suggestedSkills.length > 0 && (
            <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                AI-suggested skills for your profile (click to add)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => {
                      if (!resumeData.skills?.includes(skill)) {
                        setResumeData({ ...resumeData, skills: [...(resumeData.skills || []), skill] })
                      }
                      setSuggestedSkills((prev) => prev.filter((s) => s !== skill))
                    }}
                    className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 rounded-full transition-colors border border-amber-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => router.push('/ai-tools/resume-builder/templates')}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ← Change Template
            </button>
            <button
              onClick={handleContinue}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              Continue to Editor
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <h3 className="text-sm font-semibold text-slate-500 mb-3">Live Preview</h3>
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <ResumePreview
                template={template?.html_css_template}
                resumeData={resumeData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

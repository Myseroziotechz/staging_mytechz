'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { saveCompanyProfile } from '@/app/recruiter/onboarding/actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Company' },
  { id: 3, label: 'Details' },
]

const COMPANY_SIZES = [
  { value: '1-10', label: '1\u201310 employees' },
  { value: '11-50', label: '11\u201350 employees' },
  { value: '51-200', label: '51\u2013200 employees' },
  { value: '201-500', label: '201\u2013500 employees' },
  { value: '501-1000', label: '501\u20131,000 employees' },
  { value: '1000+', label: '1,000+ employees' },
]

const WORK_MODES = [
  { value: 'office', label: 'Office' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
]

const INDUSTRIES = [
  'Information Technology',
  'Software Development',
  'FinTech',
  'Healthcare',
  'EdTech',
  'E-Commerce',
  'Manufacturing',
  'Consulting',
  'Telecommunications',
  'Banking & Finance',
  'Media & Entertainment',
  'Other',
]

// Which fields belong to which step — used to auto-navigate on server errors.
const STEP_FIELDS = {
  1: ['full_name', 'designation', 'phone'],
  2: ['company_name', 'industry', 'company_size', 'head_office_location'],
  3: ['work_mode', 'company_description', 'company_website', 'gst_or_cin'],
}

function findStepForError(fieldErrors) {
  for (const s of [1, 2, 3]) {
    if (STEP_FIELDS[s].some((f) => fieldErrors[f])) return s
  }
  return null
}

export default function RecruiterOnboardingOverlay({ initial, userName, userPhone }) {
  const [state, formAction, pending] = useActionState(saveCompanyProfile, {
    error: null,
    fieldErrors: {},
    values: null,
  })

  const [step, setStep] = useState(1)
  const [localErrors, setLocalErrors] = useState({})
  const [workMode, setWorkMode] = useState(initial?.work_mode ?? '')
  const scrollRef = useRef(null)

  const v = state?.values || initial || {}
  const fe = state?.fieldErrors || {}
  const errors = { ...localErrors, ...fe }

  // When server returns field errors, jump to the first step that has one.
  useEffect(() => {
    if (fe && Object.keys(fe).length > 0) {
      const target = findStepForError(fe)
      if (target) setStep(target)
    }
  }, [fe])

  // Scroll the overlay panel to top on step change.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const validateStep = (currentStep) => {
    const errs = {}
    const form = document.getElementById('recruiter-onboarding-form')
    if (!form) return true

    const fd = new FormData(form)
    const get = (key) => (fd.get(key) || '').toString().trim()

    if (currentStep === 1) {
      if (!get('full_name')) errs.full_name = 'Required'
      if (!get('designation')) errs.designation = 'Required'
    }

    if (currentStep === 2) {
      if (!get('company_name')) errs.company_name = 'Required'
      if (!get('industry')) errs.industry = 'Required'
      if (!get('company_size')) errs.company_size = 'Pick a company size'
      if (!get('head_office_location')) errs.head_office_location = 'Required'
    }

    if (Object.keys(errs).length > 0) {
      setLocalErrors(errs)
      return false
    }

    setLocalErrors({})
    return true
  }

  const goNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3))
    }
  }

  const goBack = () => {
    setLocalErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div
        ref={scrollRef}
        className="relative w-full max-w-lg max-h-[95dvh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
      >
        {/* ── Header ── */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 z-10">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Set up your recruiter profile
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Complete these details to start posting jobs on MyTechZ.
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1.5 sm:gap-2 flex-1">
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-colors ${
                      step > s.id
                        ? 'bg-green-500 text-white'
                        : step === s.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s.id ? '\u2713' : s.id}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium ${
                      step === s.id ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 rounded transition-colors ${
                      step > s.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <form id="recruiter-onboarding-form" action={formAction} className="px-4 sm:px-6 py-4 sm:py-5">
          {/* Global error */}
          {state?.error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {state.error}
            </div>
          )}

          {/* ── Step 1: Personal Info ── */}
          <div className={step === 1 ? 'space-y-4' : 'hidden'}>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Tell us about yourself
            </p>

            <Input
              name="full_name"
              label="Full name"
              placeholder="e.g. Priya Sharma"
              defaultValue={v.full_name ?? userName ?? ''}
              error={errors.full_name}
              required
            />

            <Input
              name="designation"
              label="Designation / Job title"
              placeholder="e.g. HR Manager, Technical Lead"
              defaultValue={v.designation ?? ''}
              error={errors.designation}
              required
            />

            <Input
              name="phone"
              label="Phone number (optional)"
              type="tel"
              placeholder="+91 98765 43210"
              defaultValue={v.phone ?? userPhone ?? ''}
              error={errors.phone}
            />
          </div>

          {/* ── Step 2: Company Info ── */}
          <div className={step === 2 ? 'space-y-4' : 'hidden'}>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Company information
            </p>

            <Input
              name="company_name"
              label="Company name"
              placeholder="e.g. TechCorp India Pvt Ltd"
              defaultValue={v.company_name ?? ''}
              error={errors.company_name}
              required
            />

            {/* Industry dropdown */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                name="industry"
                defaultValue={v.industry ?? ''}
                required
                className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.industry ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
              >
                <option value="" disabled>Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
              )}
            </div>

            {/* Company size */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company size
              </label>
              <select
                name="company_size"
                defaultValue={v.company_size ?? ''}
                required
                className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.company_size ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
              >
                <option value="" disabled>Select a size</option>
                {COMPANY_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.company_size && (
                <p className="mt-1 text-sm text-red-600">{errors.company_size}</p>
              )}
            </div>

            <Input
              name="head_office_location"
              label="Head office location"
              placeholder="e.g. Bengaluru, India"
              defaultValue={v.head_office_location ?? ''}
              error={errors.head_office_location}
              required
            />
          </div>

          {/* ── Step 3: Details & Verification ── */}
          <div className={step === 3 ? 'space-y-4' : 'hidden'}>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              A few more details
            </p>

            {/* Work mode pills — controlled so they highlight on click */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary work mode
              </label>
              <input type="hidden" name="work_mode" value={workMode} />
              <div className="grid grid-cols-3 gap-2">
                {WORK_MODES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setWorkMode(m.value)}
                    className={`flex items-center justify-center px-2 sm:px-3 py-2.5 border rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      workMode === m.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              {errors.work_mode && (
                <p className="mt-1 text-sm text-red-600">{errors.work_mode}</p>
              )}
            </div>

            {/* Company description */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company description
              </label>
              <textarea
                name="company_description"
                rows={4}
                minLength={50}
                defaultValue={v.company_description ?? ''}
                placeholder="A short paragraph candidates will see on your job posts."
                required
                className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.company_description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors.company_description ? (
                <p className="mt-1 text-sm text-red-600">{errors.company_description}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">At least 50 characters.</p>
              )}
            </div>

            <Input
              name="company_website"
              label="Company website (optional)"
              type="url"
              placeholder="https://www.example.com"
              defaultValue={v.company_website ?? ''}
              error={errors.company_website}
            />

            <Input
              name="gst_or_cin"
              label="GST or CIN (optional)"
              placeholder="Helps us verify your company faster"
              defaultValue={v.gst_or_cin ?? ''}
              error={errors.gst_or_cin}
            />
          </div>

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 border-t border-gray-100">
            {step > 1 ? (
              <Button type="button" variant="secondary" size="md" onClick={goBack}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" size="md" onClick={goNext}>
                Continue
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? 'Saving\u2026' : initial ? 'Save changes' : 'Complete setup'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

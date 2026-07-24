'use client'

import { NETWORKS, EMPTY_PROFILE } from '@/lib/resume/schema'

export default function BasicsStep({ data, onChange }) {
  const basics = data.basics || {}

  function update(field, value) {
    onChange({ ...data, basics: { ...basics, [field]: value } })
  }

  function updateLocation(field, value) {
    onChange({
      ...data,
      basics: { ...basics, location: { ...(basics.location || {}), [field]: value } },
    })
  }

  function updateProfile(index, field, value) {
    const profiles = [...(basics.profiles || [])]
    profiles[index] = { ...profiles[index], [field]: value }
    onChange({ ...data, basics: { ...basics, profiles } })
  }

  function addProfile() {
    onChange({
      ...data,
      basics: { ...basics, profiles: [...(basics.profiles || []), { ...EMPTY_PROFILE }] },
    })
  }

  function removeProfile(index) {
    const profiles = (basics.profiles || []).filter((_, i) => i !== index)
    onChange({ ...data, basics: { ...basics, profiles } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Personal Information</h3>
        <p className="text-sm text-slate-500">Start with your basic contact details.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input
            value={basics.name || ''}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Priya Sharma"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Professional Title</label>
          <input
            value={basics.label || ''}
            onChange={(e) => update('label', e.target.value)}
            placeholder="Senior Software Engineer"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
          <input
            type="email"
            value={basics.email || ''}
            onChange={(e) => update('email', e.target.value)}
            placeholder="priya@example.com"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            value={basics.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
          <input
            value={basics.location?.city || ''}
            onChange={(e) => updateLocation('city', e.target.value)}
            placeholder="Bengaluru"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">State / Region</label>
          <input
            value={basics.location?.region || ''}
            onChange={(e) => updateLocation('region', e.target.value)}
            placeholder="Karnataka"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Website / Portfolio</label>
        <input
          type="url"
          value={basics.url || ''}
          onChange={(e) => update('url', e.target.value)}
          placeholder="https://yoursite.com"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Profiles */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-slate-700">Social Profiles</label>
          <button
            type="button"
            onClick={addProfile}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            + Add Profile
          </button>
        </div>
        {(basics.profiles || []).map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <select
              value={p.network || ''}
              onChange={(e) => updateProfile(i, 'network', e.target.value)}
              className="px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Network</option>
              {NETWORKS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <input
              value={p.url || ''}
              onChange={(e) => updateProfile(i, 'url', e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              type="button"
              onClick={() => removeProfile(i)}
              className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

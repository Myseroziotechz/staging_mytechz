'use client'

function FieldInput({ label, value, onChange, placeholder = '', type = 'text', optional = false }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}{optional && <span className="text-slate-400 font-normal"> (optional)</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
      />
    </div>
  )
}

export default function RecipientSection({ data = {}, onChange }) {
  const update = (key, val) => onChange({ ...data, [key]: val })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <FieldInput label="Hiring Manager Name" value={data.hiringManagerName} onChange={(v) => update('hiringManagerName', v)} placeholder="Anjali Mehta" optional />
        <FieldInput label="Hiring Manager Title" value={data.hiringManagerTitle} onChange={(v) => update('hiringManagerTitle', v)} placeholder="Engineering Manager" optional />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldInput label="Company Name" value={data.companyName} onChange={(v) => update('companyName', v)} placeholder="Flipkart" />
        <FieldInput label="Company Location" value={data.companyLocation} onChange={(v) => update('companyLocation', v)} placeholder="Bengaluru, India" optional />
      </div>
      <FieldInput label="Job Title / Target Role" value={data.jobTitle} onChange={(v) => update('jobTitle', v)} placeholder="Senior Frontend Engineer" />
      <div className="grid grid-cols-2 gap-3">
        <FieldInput label="Job Reference / ID" value={data.jobRef} onChange={(v) => update('jobRef', v)} placeholder="FK-2026-1142" optional />
        <FieldInput label="Date" value={data.date} onChange={(v) => update('date', v)} placeholder="7 August 2026" />
      </div>
    </div>
  )
}

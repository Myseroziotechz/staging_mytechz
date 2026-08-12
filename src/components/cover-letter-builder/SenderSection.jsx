'use client'

function FieldInput({ label, value, onChange, placeholder = '', type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
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

export default function SenderSection({ data = {}, onChange }) {
  const update = (key, val) => onChange({ ...data, [key]: val })

  return (
    <div className="space-y-3">
      <FieldInput label="Full Name" value={data.fullName} onChange={(v) => update('fullName', v)} placeholder="John Doe" />
      <FieldInput label="Headline / Title" value={data.headline} onChange={(v) => update('headline', v)} placeholder="Senior Software Engineer" />
      <div className="grid grid-cols-2 gap-3">
        <FieldInput label="Email" value={data.email} onChange={(v) => update('email', v)} placeholder="john@example.com" type="email" />
        <FieldInput label="Phone" value={data.phone} onChange={(v) => update('phone', v)} placeholder="+91 98765 43210" />
      </div>
      <FieldInput label="Location" value={data.location} onChange={(v) => update('location', v)} placeholder="Mumbai, India" />
      <div className="grid grid-cols-2 gap-3">
        <FieldInput label="LinkedIn URL" value={data.linkedin} onChange={(v) => update('linkedin', v)} placeholder="linkedin.com/in/johndoe" />
        <FieldInput label="Portfolio / GitHub URL" value={data.portfolio} onChange={(v) => update('portfolio', v)} placeholder="johndoe.dev" />
      </div>
    </div>
  )
}

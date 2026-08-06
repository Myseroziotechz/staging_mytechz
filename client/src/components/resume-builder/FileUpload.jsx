'use client'

import { useState, useRef } from 'react'

export default function FileUpload({ onFileSelected, onError, accept = '.pdf,.docx,.doc,.txt', disabled = false }) {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('')
  const inputRef = useRef(null)

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  function handleChange(e) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  function reportError(message) {
    setFileName('')
    if (onError) onError(message)
    else alert(message)
  }

  function handleFile(file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedExt = accept.split(',').map((e) => e.trim().replace(/^\./, '').toLowerCase())
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (!ext || !allowedExt.includes(ext)) {
      reportError(`Unsupported file type. Accepted formats: ${accept.replace(/\./g, '').toUpperCase()}`)
      return
    }
    if (file.size > maxSize) {
      reportError('File size must be under 5MB')
      return
    }
    setFileName(file.name)
    onFileSelected(file)
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
        dragActive
          ? 'border-blue-400 bg-blue-50'
          : fileName
          ? 'border-green-300 bg-green-50'
          : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {fileName ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="text-sm font-medium text-green-700">{fileName}</span>
          <button
            onClick={(e) => { e.stopPropagation(); setFileName(''); onFileSelected(null) }}
            className="text-xs text-slate-500 hover:text-red-600 ml-2"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <svg className="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium text-slate-700 mb-1">
            Drag & drop your resume here
          </p>
          <p className="text-xs text-slate-500">
            or click to browse — PDF, DOCX, DOC, TXT (max 5MB)
          </p>
        </>
      )}
    </div>
  )
}

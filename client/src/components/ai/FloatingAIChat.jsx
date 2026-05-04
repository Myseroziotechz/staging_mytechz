'use client'

import { useEffect, useRef, useState } from 'react'
import ChatJobCard from './ChatJobCard'

const ICON = {
  sparkle: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2zM19 16l1 2.4 2.4 1-2.4 1L19 23l-1-2.6L15.6 19.4 18 18.4 19 16z" />
    </svg>
  ),
  sparkleSm: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 5.8L20 10l-5.6 2.2L12 18l-2.4-5.8L4 10l5.6-2.2L12 2z" />
    </svg>
  ),
  x: (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
    </svg>
  ),
  send: (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  mic: (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path strokeLinecap="round" d="M5 11a7 7 0 0014 0M12 18v3" />
    </svg>
  ),
  micOff: (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" d="M3 3l18 18" />
      <path strokeLinecap="round" d="M9 9v3a3 3 0 005.12 2.12M15 11V6a3 3 0 00-5.83-1M5 11a7 7 0 0011.92 5M12 18v3" />
    </svg>
  ),
}

const STORAGE_KEY = 'mytechz_ai_session'

// Click telemetry deferred to Phase 5 — link navigation handles redirect.

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your MyTechZ assistant. Ask me \"best jobs for me\", \"find React internships\", or \"how do I apply?\".",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceHint, setVoiceHint] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [suggestions, setSuggestions] = useState([
    'Best jobs for me',
    'How do I apply?',
    'What is MyTechZ?',
  ])

  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)
  const listenTimerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) setSessionId(saved)
    } catch {}
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const clearListenTimer = () => {
    if (listenTimerRef.current) {
      clearTimeout(listenTimerRef.current)
      listenTimerRef.current = null
    }
  }

  async function sendMessage(text) {
    const t = (text || '').trim()
    if (!t || loading) return
    setMessages((p) => [...p, { role: 'user', text: t }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t, sessionId }),
      })
      const data = await res.json()
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId)
        try {
          sessionStorage.setItem(STORAGE_KEY, data.sessionId)
        } catch {}
      }
      setMessages((p) => [
        ...p,
        {
          role: 'assistant',
          text: data.reply || 'No reply.',
          jobs: data.jobs || [],
          intent: data.intent,
        },
      ])
      if (Array.isArray(data.suggestions) && data.suggestions.length)
        setSuggestions(data.suggestions)
    } catch {
      setMessages((p) => [
        ...p,
        { role: 'assistant', text: 'Sorry — something went wrong. Try again?' },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function startListening() {
    setVoiceHint(null)
    if (recognitionRef.current) {
      try { recognitionRef.current.abort?.() } catch {}
      try { recognitionRef.current.stop?.() } catch {}
      recognitionRef.current = null
    }
    clearListenTimer()

    const SR =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    if (!SR) {
      setVoiceHint('Voice not supported. Try Chrome or Edge.')
      return
    }
    if (!window.isSecureContext) {
      setVoiceHint('Voice needs HTTPS or localhost.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((tr) => tr.stop())
    } catch {
      setVoiceHint('Microphone permission denied.')
      return
    }

    const recognition = new SR()
    recognition.lang = navigator.language || 'en-US'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      setVoiceHint('Listening… speak now.')
      clearListenTimer()
      listenTimerRef.current = setTimeout(() => {
        try { recognition.stop?.() } catch {}
        setListening(false)
        setVoiceHint('No speech detected — tap mic to retry.')
        recognitionRef.current = null
      }, 12000)
    }
    recognition.onend = () => {
      setListening(false)
      clearListenTimer()
      recognitionRef.current = null
    }
    recognition.onerror = (e) => {
      setListening(false)
      clearListenTimer()
      recognitionRef.current = null
      const code = e?.error || 'unknown'
      setVoiceHint(
        code === 'not-allowed'
          ? 'Microphone access blocked.'
          : code === 'no-speech'
            ? "Didn't catch that — try again."
            : code === 'audio-capture'
              ? 'No microphone detected.'
              : 'Voice input failed.'
      )
    }
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setVoiceHint(null)
      // Show transcript in input for 600ms confirm window before auto-send.
      setInput(transcript)
      setTimeout(() => sendMessage(transcript), 500)
    }

    recognitionRef.current = recognition
    try { recognition.start() } catch { setVoiceHint('Voice already running.') }
  }

  function stopListening() {
    try { recognitionRef.current?.stop?.() } catch {}
    try { recognitionRef.current?.abort?.() } catch {}
    recognitionRef.current = null
    clearListenTimer()
    setListening(false)
  }

  useEffect(() => { if (!open && listening) stopListening() }, [open, listening])
  useEffect(() => () => stopListening(), [])

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open AI chat assistant"
          className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center
                     rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white
                     shadow-lg shadow-blue-700/30 transition hover:scale-105 hover:shadow-xl
                     ring-2 ring-white"
        >
          {ICON.sparkle}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-4 right-4 z-[60] flex h-[34rem] w-[24rem] max-h-[calc(100vh-2rem)]
                     max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl
                     border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              {ICON.sparkleSm}
              <div>
                <p className="text-sm font-semibold leading-tight">MyTechZ AI</p>
                <p className="text-[10px] opacity-80 leading-tight">
                  Personal job assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1.5 hover:bg-white/15"
            >
              {ICON.x}
            </button>
          </div>

          {/* Transcript */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3">
            {messages.map((m, i) => (
              <div key={i} className="space-y-2">
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'ml-auto bg-blue-700 text-white'
                      : 'bg-white text-slate-800 shadow-sm border border-slate-100'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'assistant' &&
                  Array.isArray(m.jobs) &&
                  m.jobs.length > 0 && (
                    <div className="-mx-1 px-1 overflow-x-auto snap-x snap-mandatory flex gap-2 pb-2">
                      {m.jobs.map((job, idx) => (
                        <ChatJobCard
                          key={job.id}
                          job={job}
                          rank={idx + 1}
                        />
                      ))}
                    </div>
                  )}
              </div>
            ))}
            {loading && (
              <div className="max-w-[60%] rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 shadow-sm border border-slate-100 inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:120ms]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:240ms]" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !loading && (
            <div className="border-t bg-white px-3 py-2 flex gap-1.5 overflow-x-auto">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendMessage(s)}
                  className="text-[11px] shrink-0 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition border border-slate-200"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {voiceHint && (
            <div className="border-t bg-amber-50 px-3 py-1.5 text-[11px] text-amber-700">
              {voiceHint}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage(input)
            }}
            className="flex items-center gap-2 border-t bg-white px-3 py-2"
          >
            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              aria-label={listening ? 'Stop listening' : 'Start voice input'}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                listening
                  ? 'animate-pulse border-red-300 bg-red-50 text-red-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {listening ? ICON.micOff : ICON.mic}
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white transition hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ICON.send}
            </button>
          </form>
        </div>
      )}
    </>
  )
}

# Floating AI Chat Assistant — MyTechZ Implementation Plan

A personalized, voice-enabled AI chat widget for the MyTechZ job portal. The assistant uses the signed-in user's profile, uploaded resume, past searches, and applications to recommend ranked, clickable job cards directly inside the chat panel, plus answers questions about how to apply and how MyTechZ works.

---

## 1. Goals

- **Personalized advice** based on profile, resume, skills, past searches, saved jobs, and applications.
- **Inline ranked job cards** rendered as a horizontally scrollable carousel inside the chat.
- **Click-through navigation** — tapping a card opens that job's existing detail page (`/jobs/[id]`).
- **Application guidance** — short, contextual steps for "how to apply" on MyTechZ or external links.
- **Voice input** — Web Speech API with permission pre-flight + 12s stuck-mic recovery.
- **Mobile-friendly, accessible, secure** — auth-gated API, rate limited, key kept server-side.

---

## 2. High-Level Architecture

```
┌─────────────────────────────┐
│ Client (Next.js App Router) │
│  components/ai/             │
│   FloatingAIChat.jsx        │  FAB + panel + voice + render JobCardList
│   ChatJobCard.jsx           │  single ranked card → /jobs/[id]
│   ChatJobCardList.jsx       │  horizontal scroll, ranked
└──────────────┬──────────────┘
               │ POST /api/ai/chat  { message, history }
               ▼
┌─────────────────────────────┐
│ Next.js Route Handler       │
│  app/api/ai/chat/route.js   │
│  - auth(): get user id      │
│  - buildUserContext(uid)    │  profile + resume text + searches + applications
│  - retrieveCandidateJobs()  │  filter by skills/location/role from DB
│  - rankJobs() + LLM call    │  tool/JSON output: { reply, jobIds[] }
│  - return { reply, jobs[] } │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│ Django backend (existing)   │
│  /api/profile, /api/jobs,   │
│  /api/applications, /api/   │
│  resume-text, /api/search-  │
│  history                    │
└─────────────────────────────┘
```

---

## 3. User Experience Flow

1. User signs in → `<FloatingAIChat />` renders globally from [client/src/app/layout.js](client/src/app/layout.js).
2. Sparkle FAB sits bottom-right on every page.
3. User clicks → panel opens with greeting personalized by name + role (e.g. "Hi Neeraj, want jobs that match your React + Python resume?").
4. User types or speaks: *"best frontend internships for me"*.
5. Backend pulls user context, retrieves matching jobs from DB, ranks them, asks LLM for a short blurb + ordered job IDs.
6. Panel renders:
   - 2–3 sentence reply ("Top 5 React internships ranked by skill overlap…")
   - Horizontal scrollable strip of ranked job cards (`#1`, `#2`, …)
7. User taps a card → `router.push('/jobs/<id>')` opens the existing detail page.
8. User asks "how do I apply?" → AI responds with contextual steps:
   - If job is internal → "Click Apply on the job page; your saved profile + resume auto-fill."
   - If external → short steps + the company URL.
9. User asks "what is MyTechZ?" → short canned-but-LLM-rendered description, linked to `/about`.

---

## 4. File Plan

### New files

| Path | Purpose |
|---|---|
| [client/src/components/ai/FloatingAIChat.jsx](client/src/components/ai/FloatingAIChat.jsx) | FAB + chat panel + voice input |
| [client/src/components/ai/ChatJobCard.jsx](client/src/components/ai/ChatJobCard.jsx) | Single ranked job card (rank badge, title, company, skills, CTA) |
| [client/src/components/ai/ChatJobCardList.jsx](client/src/components/ai/ChatJobCardList.jsx) | Horizontal scroller wrapper |
| [client/src/components/ai/useVoiceInput.js](client/src/components/ai/useVoiceInput.js) | Web Speech API hook (permission, timeout, errors) |
| [client/src/app/api/ai/chat/route.js](client/src/app/api/ai/chat/route.js) | Personalized chat endpoint |
| [client/src/app/api/ai/context/route.js](client/src/app/api/ai/context/route.js) | (optional) cached user-context fetch |
| [backend/ai_assistant/](backend/ai_assistant/) | Django app: `views.py` for `resume-text`, `search-history`, `recommendations` |

### Edited files

| Path | Change |
|---|---|
| [client/src/app/layout.js](client/src/app/layout.js) | Mount `<FloatingAIChat />` once |
| [client/src/components/LayoutShell.jsx](client/src/components/LayoutShell.jsx) | Hide FAB on `/login`, `/auth/*` |
| [backend/job_management/models.py](backend/job_management/models.py) | (if missing) `SearchHistory` model |
| [backend/authentication/models.py](backend/authentication/models.py) | (if missing) `resume_text` field on Profile |
| `.env.local` | `GROQ_API_KEY=` (or `OPENAI_API_KEY=`) |

---

## 5. Personalization Inputs

The route handler builds a **system prompt** from these inputs (server-side only, never trust client):

1. **Identity & profile** — name, role (student/recruiter/admin), location, education, years of experience.
2. **Resume text** — extracted at upload time and stored as plain text on the Profile (server-extracted, e.g. `pdfplumber` / `python-docx`).
3. **Skills** — derived from profile + resume keywords (deduped).
4. **Past search history** — last 20 search queries + filters from `SearchHistory`.
5. **Applications** — list of `{ job_id, status, applied_at }` (last 30 days).
6. **Saved jobs** — to avoid recommending dupes and to learn intent.
7. **Recent activity** — page views or job views (optional, 7d window).

```js
const ctx = `
USER: ${profile.name} — ${profile.role}, ${profile.location}
SKILLS: ${skills.join(', ')}
RESUME (truncated):
${resumeText.slice(0, 2000)}
RECENT SEARCHES: ${searches.slice(0,10).map(s => s.query).join(' | ')}
APPLIED TO: ${applications.map(a => a.job_title).join(', ')}
SAVED: ${savedJobs.map(j => j.title).join(', ')}
`;
```

---

## 6. Ranking & Retrieval Strategy

We do retrieval **before** the LLM to keep cost low and recommendations grounded in real DB rows.

**Phase 1 — candidate retrieval (DB query, ~30 jobs):**
- Filter by `is_active=true`, location preference, role type (intern/full-time), seniority.
- SQL `ILIKE` on title/skills against the user's top skills (or pgvector if available).

**Phase 2 — scoring (cheap, deterministic):**
- `score = 0.5 * skill_overlap + 0.2 * title_match + 0.1 * location_match + 0.1 * seniority_fit + 0.1 * recency`
- Sort desc, take top 10.

**Phase 3 — LLM rerank + explanation:**
- Send top 10 (id + title + company + skills) to LLM with the user context.
- Ask for: short reply + ranked `jobIds` (max 5) + one-line "why this matches" per job.
- Use **structured JSON output** (`response_format: { type: 'json_object' }`).

**Returned shape:**
```json
{
  "reply": "Top 5 React internships ranked by skill overlap and recency.",
  "jobs": [
    { "id": 142, "rank": 1, "title": "Frontend Intern",
      "company": "Acme", "match_reason": "React + Tailwind in resume",
      "score": 0.91 }
  ]
}
```

---

## 7. Frontend Component Outline

```jsx
// FloatingAIChat.jsx
const [messages, setMessages] = useState([
  { role: 'ai', text: greetingFromProfile, jobs: null }
]);

async function sendMessage(text) {
  // optimistic user bubble
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify({ message: text, history: lastN(messages, 6) })
  });
  const { reply, jobs } = await res.json();
  setMessages(prev => [...prev, { role: 'ai', text: reply, jobs }]);
}

// In render:
{m.jobs?.length > 0 && <ChatJobCardList jobs={m.jobs} />}
```

```jsx
// ChatJobCardList.jsx
<div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 -mx-3 px-3">
  {jobs.map(j => <ChatJobCard key={j.id} job={j} />)}
</div>
```

```jsx
// ChatJobCard.jsx
<button onClick={() => router.push(`/jobs/${job.id}`)}
  className="snap-start min-w-[220px] rounded-xl border bg-white p-3 text-left shadow-sm hover:shadow-md">
  <div className="text-[11px] font-semibold text-blue-700">#{job.rank} match</div>
  <div className="font-semibold text-sm line-clamp-1">{job.title}</div>
  <div className="text-xs text-slate-600">{job.company}</div>
  <div className="mt-1 text-[11px] text-slate-500 line-clamp-2">{job.match_reason}</div>
  <div className="mt-2 text-[11px] font-medium text-blue-700">View & apply →</div>
</button>
```

Voice input is extracted into `useVoiceInput.js` (same logic as the spec doc: permission pre-flight, 12s timeout, error mapping, abort-on-stale).

---

## 8. Backend (Next.js Route Handler)

```js
// app/api/ai/chat/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { fetchUserContext, fetchCandidateJobs, scoreJobs } from '@/lib/ai/personalize';
import { rateLimit } from '@/lib/ai/rateLimit';

export async function POST(req) {
  const session = await getServerSession(req);
  if (!session) return NextResponse.json({ reply: 'Please sign in to chat.' }, { status: 401 });

  const ok = await rateLimit(session.userId, 20, '1m');
  if (!ok) return NextResponse.json({ reply: 'Slow down a bit — try again in a minute.' }, { status: 429 });

  const { message, history = [] } = await req.json();
  if (!message?.trim() || message.length > 1000) {
    return NextResponse.json({ reply: 'Please ask a short, clear question.' });
  }

  const ctx = await fetchUserContext(session.userId);
  const candidates = await fetchCandidateJobs(ctx);
  const ranked = scoreJobs(candidates, ctx).slice(0, 10);

  const systemPrompt = buildSystemPrompt(ctx, ranked);

  const llm = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
               Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ],
      max_tokens: 600,
      temperature: 0.3
    })
  });

  const data = await llm.json();
  const parsed = safeJSON(data?.choices?.[0]?.message?.content);
  // parsed = { reply, jobIds: [142, 87, ...] }

  const jobs = hydrateJobs(parsed.jobIds, candidates);
  return NextResponse.json({ reply: parsed.reply, jobs });
}
```

`buildSystemPrompt` instructs the model to:
- Use ONLY the provided user data + ranked candidate list.
- Output strict JSON: `{ reply: string, jobIds: number[] }`.
- Keep reply under 3 sentences.
- For "how to apply" questions, return `jobs: []` and explain steps.
- For "what is MyTechZ" questions, return short description + link to `/about`.
- Never invent job IDs — only choose from the provided list.

---

## 9. Backend Django Endpoints (new / confirmed)

| Endpoint | Purpose |
|---|---|
| `GET /api/me/context/` | Returns profile + skills + resume_text + recent searches/applications (auth required) |
| `POST /api/me/search-history/` | Logged when user runs job search on `/jobs` |
| `GET /api/jobs/recommend/?limit=30` | Server-side candidate retrieval (filters + skill match) |
| `POST /api/me/resume/parse/` | Re-extracts resume text on upload |

The Next.js route handler calls these with the user's session cookie (server-to-server with the same auth header).

---

## 10. Voice Input Requirements

- Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
- HTTPS or localhost only — show hint otherwise.
- Pre-flight `getUserMedia({ audio: true })` to surface mic permission.
- 12-second hard timeout to recover from stuck mic on macOS Chrome.
- Map error codes: `not-allowed` → "Microphone access blocked.", `no-speech` → "Didn't catch that.", `audio-capture` → "No microphone detected.".
- Abort any prior recognition before starting a new one.
- Auto-stop when chat panel closes.

---

## 11. Security Checklist

- [ ] LLM API key kept server-side (`process.env.GROQ_API_KEY`) — never in client bundle.
- [ ] Route requires authenticated session; reject unauthenticated requests.
- [ ] Rate limit: 20 req / minute / user (Upstash Redis or in-memory for dev).
- [ ] Cap message length at 1000 chars; cap history to last 6 turns.
- [ ] Resume text capped at 2000 chars in the prompt.
- [ ] Sanitize / escape any user-supplied text injected into the system prompt.
- [ ] Log only metadata (latency, token count, status) — never full prompts.
- [ ] Strict JSON output + allow-list of `jobIds` against returned candidates to prevent hallucinated routes.

---

## 12. Implementation Phases

**Phase 1 — Skeleton (½ day)**
- Build `FloatingAIChat.jsx` with FAB, panel, text input, voice input.
- Wire `/api/ai/chat` returning a stub `{ reply, jobs: [] }`.
- Mount in `layout.js`, hide on auth routes.

**Phase 2 — Personalization (1 day)**
- Add `fetchUserContext` calling Django endpoints.
- Add resume text storage + extraction on upload.
- Add `SearchHistory` logging on `/jobs` page search.

**Phase 3 — Job retrieval & ranking (1 day)**
- Implement `fetchCandidateJobs` + scoring.
- LLM rerank with structured JSON output.
- Render `ChatJobCardList` + `ChatJobCard`, click → `/jobs/[id]`.

**Phase 4 — Application guidance (½ day)**
- Detect intent ("how do I apply", "what is mytechz") and branch system prompt.
- Add canned facts about MyTechZ flow (apply button, profile auto-fill, status tracking).

**Phase 5 — Hardening (½ day)**
- Auth gate, rate limit, length caps, error states, mobile QA.
- Telemetry: request count, latency, top intents.

---

## 13. Open Questions

1. **LLM provider** — Groq (free tier, fast) for dev, OpenAI/Anthropic for prod? Confirm key budget.
2. **Resume text extraction** — server-side `pdfplumber` already in the stack, or add it?
3. **Vector search** — keyword scoring is enough for v1; add pgvector embeddings in v2 for better matches?
4. **Streaming** — ship v1 non-streaming for simplicity; add SSE in v2 for typing UX?
5. **Recruiter/admin variants** — should the assistant behave differently for recruiters (e.g., "find candidates")?

---

## 14. Quick-start Checklist

- [ ] `npm install lucide-react` (already present? verify in `client/package.json`)
- [ ] Add `GROQ_API_KEY` to `client/.env.local`
- [ ] Create `client/src/components/ai/FloatingAIChat.jsx` + helpers
- [ ] Create `client/src/app/api/ai/chat/route.js`
- [ ] Add Django endpoints under `backend/ai_assistant/`
- [ ] Mount `<FloatingAIChat />` in `client/src/app/layout.js`
- [ ] Add `SearchHistory` logging in [client/src/app/jobs/page.js](client/src/app/jobs/page.js)
- [ ] Restart dev servers
- [ ] Sign in → click sparkle → ask *"best internships for me"* → tap a ranked card → land on the job page

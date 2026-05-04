# Floating AI Chat Assistant — Implementation Plan

> **Scope:** A bottom-right floating AI chat that personalizes answers from the
> signed-in user's profile, resume, past searches, applications and saved jobs.
> When the user asks about jobs/internships it returns **ranked, scrollable job
> cards inline in the chat**. Cards click through to the existing
> `/jobs/[category]/[slug]` detail page. Voice input via Web Speech API.
> The assistant also answers "how do I apply?" and "what is MyTechz?".
>
> **Database:** MyTechz Supabase only — project ref `aiycgmrubisaxknbeaov`.
> Never touch the Supabase-GS project for any of this work.
> **Stack:** Next.js 16 (App Router) + Supabase + Tailwind v4. No Django.

---

## 0. TL;DR

- One floating button (FAB) bottom-right of every page → opens a 22rem × 28rem panel.
- Server reads the signed-in user, builds **personalized context** (profile + resume + last 5 applications + last 5 saved jobs + last 5 chat queries), then routes the message through one of five **intents**.
- For job-search intents: DB candidate fetch → deterministic score → LLM rerank → strict JSON `{ reply, jobIds[] }` → frontend renders ranked `ChatJobCard`s linking to `/jobs/[category]/[slug]`.
- For *how to apply / what is MyTechz / resume help / general* — short personalized prose reply, no cards.
- Voice **input** via Web Speech API (Chrome/Edge/Safari) with 12s stuck-mic timeout and graceful fallback.
- All chat history persisted to `chat_sessions` / `chat_messages` so the same user keeps continuity across visits.
- Server-only LLM key. Rate-limited. Auth-gated for personalized answers (anonymous → generic + signup nudge).

---

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  client                                                     │
│  ┌──────────────────┐    POST /api/ai/chat                  │
│  │ FloatingAIChat   │ ──────────────────────►               │
│  │  - FAB           │    { message, sessionId? }            │
│  │  - Panel         │                                       │
│  │  - VoiceInput    │ ◄──────────────────────               │
│  │  - ChatJobCardList│   { reply, jobs[], sessionId,        │
│  │  - ChatJobCard   │     intent, suggestions[] }           │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│  server: app/api/ai/chat/route.js                           │
│                                                             │
│  1. auth + rate-limit + length cap                          │
│  2. load chat_sessions / chat_messages (recent history)     │
│  3. build USER_CONTEXT from Supabase                        │
│       - user_profiles (name, role, location)                │
│       - resumes (latest: parsed_skills, experience_years)   │
│       - job_applications (last 5)                           │
│       - saved_jobs (last 5)                                 │
│       - chat_messages (last 5 user turns = "past searches") │
│  4. detect INTENT (lightweight rules + LLM fallback)        │
│  5. branch:                                                 │
│       a) search_jobs   → retrieve + rank + LLM rerank       │
│       b) how_to_apply  → reply with internal-vs-external    │
│       c) about_mytechz → short product description          │
│       d) resume_advice → reply using resume context         │
│       e) general       → personalized fallback              │
│  6. persist USER + ASSISTANT messages                       │
│  7. return { reply, jobs[], suggestions[], intent,          │
│              sessionId }                                    │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase (MyTechz, ref aiycgmrubisaxknbeaov)               │
│  - public.jobs / companies / user_profiles                  │
│  - public.resumes / job_applications / saved_jobs           │
│  - public.chat_sessions / chat_messages   ◄── NEW           │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│  LLM (Groq → swappable)                                     │
│  - llama-3.3-70b-versatile (default, free for dev)          │
│  - upgrade to claude-sonnet-4-6 in 1 file when ready        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Personalization sources

The server pulls **only what's needed** per request and trims to a tight token
budget. Everything is server-side; the LLM key never touches the client.

| Source | Table | Fields used | Cap |
|---|---|---|---|
| Profile | `user_profiles` | `full_name`, `role`, `phone`, `onboarding_completed` | 1 row |
| Resume | `resumes` (latest, primary) | `parsed_skills[]`, `total_experience_years`, `parsed_location`, top of `work_history` | 1 row |
| Recent applications | `job_applications` | `job_title`, `company_name`, `status`, `applied_at` | last 5 |
| Saved jobs | `saved_jobs` | `job_title`, `company_name`, `saved_at` | last 5 |
| Past searches | `chat_messages` (role=user) | `content` | last 5 |

**`USER_CONTEXT` shape sent to the LLM** (compact, < 600 tokens):

```
NAME: Aarav Mehta
ROLE: candidate
LOCATION: Bengaluru, KA
EXPERIENCE: 4.5 years
TOP SKILLS: React, TypeScript, Next.js, Tailwind, Jest
RECENTLY APPLIED:
  - Senior React Developer @ Acme Cloud Labs (status: applied, 2026-04-30)
  - Backend Engineer (Go) @ Acme Cloud Labs (status: applied, 2026-04-22)
SAVED:
  - Senior UX Designer @ Pixel Pioneers (saved 2026-05-01)
RECENT SEARCHES:
  - "remote react jobs in bangalore under 5 yrs"
  - "internships with PPO"
```

If the user is **not signed in**, `USER_CONTEXT = "ANONYMOUS"` and the assistant
nudges sign-up while still answering generic questions.

---

## 3. Intents

Detected by a tiny rules layer first; falls through to the LLM if ambiguous.

| Intent | Trigger examples | Branch behavior |
|---|---|---|
| `search_jobs` | "best jobs for me", "react jobs in pune", "internships with stipend > 25k", "show government jobs" | DB retrieve + rank + rerank → reply + ranked job cards |
| `how_to_apply` | "how do I apply?", "what happens after apply?", "is the form on the company site?" | Branch on `apply_mode` (internal vs external vs email vs phone) — step-by-step |
| `about_mytechz` | "what is mytechz?", "how does this work?", "why should I trust the listings?" | 3-bullet description + link to `/about`, plus how to use the four job categories |
| `resume_advice` | "is my resume good for this role?", "what should I add?" | Use `resumes.parsed_skills` + last viewed JD; suggest 3 concrete edits |
| `general` | anything else (small talk, prep questions, etc.) | Personalized prose reply, no cards |

The LLM is given a small **router prompt** that returns `{ "intent": "..." }`
when rules can't decide. We then hard-call the matching branch.

---

## 4. Search → ranked cards pipeline (the hard part)

### 4.1 LLM filter extraction (cheap JSON call)

```
SYSTEM: Extract job-search filters from the user message and the user context.
Return ONLY this JSON:
{
  "city":     string|null,
  "category": "private"|"government"|null,   // null if either fits
  "job_type": "internship"|"full_time"|"part_time"|"contract"|null,
  "work_mode":"remote"|"hybrid"|"onsite"|null,
  "exp_max":  number|null,                   // years
  "skills":   string[]|null,                 // intersect with user.parsed_skills if vague
  "salary_min": number|null                  // INR/year (or stipend if internship)
}
```

### 4.2 DB candidate retrieval (cheap, first pass)

```sql
select <JOB_SELECT>
from   public.jobs
where  status = 'active'
       and ( :category   is null or category = :category )
       and ( :city       is null or location_city ilike :city )
       and ( :workmode   is null or work_mode = :workmode )
       and ( :jobtype    is null or job_type = :jobtype )
       and ( :exp_max    is null or experience_min <= :exp_max )
       and ( :skills_filter is null or skills && :skills_filter )  -- gin overlap
order by posted_at desc
limit 50;
```

### 4.3 Deterministic score (no LLM, ~1ms per row)

```
score(job, user) =
    0.45 * skill_overlap(job.skills, user.parsed_skills)        // jaccard
  + 0.20 * location_match(job.location_city, user.parsed_location)
  + 0.15 * experience_fit(job.experience_min/max, user.years)
  + 0.10 * freshness(job.posted_at)                              // 1.0 if <3d
  + 0.05 * featured_or_urgent(job)
  + 0.05 * salary_signal(job.salary_min, user.applied_history)
```

Top 8 by score advance to LLM rerank. Below 0.20 → drop.

### 4.4 LLM rerank with **strict JSON** output

```
SYSTEM: You are MyTechZ's job-matching assistant.
Given USER_CONTEXT and 8 candidate jobs, return ONLY this JSON (no prose around it):
{
  "reply":   "<= 60 words, second person, mention 1-2 reasons for the top pick>",
  "jobIds":  ["<id-1>", "<id-2>", "<id-3>"]   // 3-6 ids, ranked
}
The jobIds MUST be a subset of the candidate ids I gave you.
```

We pass the 8 candidates as compact strings (id + title + company + skills +
location + salary). Use `temperature: 0.3` and `response_format: json_object`
where supported (Groq + OpenAI both accept it).

### 4.5 Server post-processing (security)

- Parse the JSON. Fall back to deterministic top-3 if parse fails.
- **Allow-list**: drop any `jobId` not in our candidate set. Prevents the LLM
  from hallucinating IDs that map to other users' drafts.
- Re-fetch the final 3-6 jobs with the full `JOB_SELECT` so the frontend has
  everything `ChatJobCard` needs.
- Log only metadata (intent, candidate count, latency) — never log the prompt
  or the personalized context (PII).

### 4.6 Response shape

```ts
{
  sessionId: string,
  intent: 'search_jobs',
  reply: "Three matches that fit your React + Next.js background…",
  jobs: [
    { id, slug, category, title, company:{name,logo_url,is_verified},
      location_city, work_mode, job_type, salary_min, salary_max,
      experience_min, experience_max, skills, posted_at, apply_mode,
      _matchScore: 0.87, _reason: "Strong React + Next.js overlap" },
    ...
  ],
  suggestions: ["Show only remote", "Filter by stipend > 25k", "Just internships"]
}
```

---

## 5. Frontend components

```
src/components/ai/
  FloatingAIChat.jsx        ← FAB + panel container, mounts in app/layout.js
  ChatPanel.jsx             ← header + transcript + input bar
  ChatBubble.jsx            ← role=user | assistant; markdown-light
  ChatJobCardList.jsx       ← horizontal scrollable strip of cards
  ChatJobCard.jsx           ← compact glass card with #1/#2 rank badge,
                              click → /jobs/[category]/[slug]
  ChatSuggestions.jsx       ← chip row of follow-up prompts
  VoiceInputButton.jsx      ← mic + state machine (idle | listening | error)
  useChat.js                ← hook: messages, send, voice, sessionId persistence
```

**Mounting** in `client/src/app/layout.js` (just above the `</body>` close):

```jsx
import FloatingAIChat from '@/components/ai/FloatingAIChat'
…
        {children}
        <FloatingAIChat />
      </body>
```

**`ChatJobCard` essentials** (matches the existing `JobCard` look + glass surface):

```jsx
<Link
  href={`/jobs/${job.category}/${job.slug}`}
  onClick={() => trackChatCardClick(job.id, sessionId)}
  className="job-card snap-start shrink-0 w-72 p-4 rounded-2xl"
>
  <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5
                   rounded-full bg-blue-700 text-white">#{rank}</span>
  …same layout as JobCard variant="compact"…
  {job._reason && (
    <p className="mt-2 text-[11px] text-slate-500 italic">{job._reason}</p>
  )}
</Link>
```

The list uses `overflow-x-auto snap-x snap-mandatory` so it scrolls horizontally
inside the chat panel and snaps card-to-card.

**Voice button** is the source from the docx, copied into
`VoiceInputButton.jsx`. Permission pre-flight + 12-second stuck-mic timeout
both kept. Adapt: replace `lucide-react` with inline SVG (project convention).

---

## 6. Database — schema additions

### 6.1 `chat_sessions` + `chat_messages`

```sql
-- 20260505120000_chat.sql (apply on MyTechz only)

create table public.chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,  -- nullable: guests
  created_at  timestamptz not null default now(),
  ended_at    timestamptz,
  title       text                                                -- first user message, truncated
);

create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.chat_sessions(id) on delete cascade,
  role        text not null check (role in ('user','assistant','system','tool')),
  content     text not null,
  intent      text,                                               -- search_jobs | how_to_apply | …
  job_ids     uuid[] default '{}',                                -- ids surfaced in the reply
  meta        jsonb,                                              -- latency_ms, model, candidate_count
  created_at  timestamptz not null default now()
);

create index chat_sessions_user_idx on public.chat_sessions (user_id, created_at desc);
create index chat_messages_session_idx on public.chat_messages (session_id, created_at);

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

create policy chat_sessions_own on public.chat_sessions for all
  using  (user_id = auth.uid() or user_id is null)
  with check (user_id = auth.uid() or user_id is null);

create policy chat_messages_own on public.chat_messages for all
  using  (exists (select 1 from public.chat_sessions s
                  where s.id = session_id and (s.user_id = auth.uid() or s.user_id is null)))
  with check (exists (select 1 from public.chat_sessions s
                      where s.id = session_id and (s.user_id = auth.uid() or s.user_id is null)));

grant select, insert, update on public.chat_sessions, public.chat_messages
  to anon, authenticated;
```

### 6.2 (Optional) `ai_card_clicks` for ranking-quality telemetry

```sql
create table public.ai_card_clicks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  session_id  uuid references public.chat_sessions(id) on delete cascade,
  message_id  uuid references public.chat_messages(id) on delete cascade,
  job_id      uuid references public.jobs(id) on delete cascade,
  rank        int,                                                -- 1, 2, 3, ...
  clicked_at  timestamptz not null default now()
);
```

Used later to learn which suggestions actually convert to a click (cheap
implicit feedback signal to improve ranking).

---

## 7. API route — `app/api/ai/chat/route.js`

```js
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { buildUserContext } from '@/lib/ai/context'
import { detectIntent }     from '@/lib/ai/intent'
import { searchJobsBranch } from '@/lib/ai/branches/search-jobs'
import { howToApplyBranch } from '@/lib/ai/branches/how-to-apply'
import { aboutBranch }      from '@/lib/ai/branches/about'
import { resumeBranch }     from '@/lib/ai/branches/resume'
import { generalBranch }    from '@/lib/ai/branches/general'
import { rateLimit }        from '@/lib/ai/rate-limit'
import { ensureSession, persistTurn } from '@/lib/ai/session'

const MAX_LEN = 1000

export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. parse + cap
  const { message, sessionId: incomingSession } = await req.json().catch(() => ({}))
  if (!message?.trim())          return NextResponse.json({ reply: 'Ask me anything.' })
  if (message.length > MAX_LEN)  return NextResponse.json({ reply: 'Please keep it under 1000 characters.' }, { status: 400 })

  // 2. rate limit (per user OR per ip if anon)
  const limited = await rateLimit(user?.id || req.headers.get('x-forwarded-for') || 'anon')
  if (limited)                   return NextResponse.json({ reply: 'Too many requests — try again in a minute.' }, { status: 429 })

  // 3. session
  const sessionId = await ensureSession(supabase, user, incomingSession, message)

  // 4. context
  const userCtx = user ? await buildUserContext(supabase, user.id) : null

  // 5. intent
  const intent = await detectIntent(message, userCtx)

  // 6. branch
  const branchOut = await ({
    search_jobs:   searchJobsBranch,
    how_to_apply:  howToApplyBranch,
    about_mytechz: aboutBranch,
    resume_advice: resumeBranch,
    general:       generalBranch,
  })[intent](supabase, { message, userCtx })

  // 7. persist
  await persistTurn(supabase, sessionId, message, branchOut, intent)

  // 8. respond
  return NextResponse.json({
    sessionId,
    intent,
    reply: branchOut.reply,
    jobs:  branchOut.jobs || [],
    suggestions: branchOut.suggestions || [],
  })
}
```

### 7.1 `lib/ai/llm.js` — single provider switch

```js
const PROVIDER = process.env.AI_PROVIDER || 'groq'

export async function chatJSON({ system, user, json = false, max = 600 }) {
  if (PROVIDER === 'groq')      return await groq({ system, user, json, max })
  if (PROVIDER === 'anthropic') return await anthropic({ system, user, json, max })
  throw new Error(`unknown AI_PROVIDER: ${PROVIDER}`)
}
// groq() and anthropic() implementations live here. One file = one swap.
```

Default **Groq + `llama-3.3-70b-versatile`** (free dev tier). Production swap
to **`claude-sonnet-4-6`** is one env var: `AI_PROVIDER=anthropic`.

---

## 8. Voice input

Copy the source from the docx into `VoiceInputButton.jsx` verbatim with two
small adaptations:

- Replace `lucide-react` icons with inline SVGs (we already use inline SVG
  everywhere else — avoids one extra dependency).
- After a successful transcript, call `onTranscript(text)` so the parent
  `ChatPanel` sends it. **Don't auto-send** — show the text in the input first
  with a 600ms confirm window so the user can correct.

Voice **synthesis** (assistant speaking back) is **out of scope for v1**. Add
later behind a setting because some users find it intrusive.

---

## 9. Security checklist

- [x] LLM API key only in `process.env`, server route only.
- [x] Auth check at top of route. Anonymous gets generic answers + signup nudge.
- [x] Rate limit (10 req / min / user, 30 / min / IP for anon). Token-bucket in
      memory for v1; move to Upstash later.
- [x] Length cap: 1000 chars in, 600 tokens out.
- [x] **JobId allow-list** — server only returns ids that came from the
      candidate set this turn. No LLM-hallucinated ids leak through.
- [x] No PII in logs. Log only intent, candidate count, latency, model.
- [x] System prompt sanitization: user message is interpolated **only as the
      `user` role**, never inside the system prompt.
- [x] RLS-protected tables — chat history readable only by its owner.

---

## 10. Phased delivery

### Phase 1 — Skeleton (≈1 day)
- Migration `chat_sessions` + `chat_messages` (RLS).
- `FloatingAIChat.jsx` FAB + panel + input bar (no voice yet).
- `app/api/ai/chat/route.js` echoing back a stub reply.
- Mount in `app/layout.js`.

### Phase 2 — Generic chat with personalization (≈1 day)
- `buildUserContext` from Supabase.
- `lib/ai/llm.js` (Groq) + `general` branch.
- Persist messages.
- Auth gate + rate limit + length cap.

### Phase 3 — Search-jobs branch with ranked cards (≈2 days)
- LLM extract → DB candidate query → deterministic score → LLM rerank.
- `ChatJobCardList` + `ChatJobCard` UI (horizontal scrollable strip).
- `suggestions[]` chip row.

### Phase 4 — How-to-apply / About / Resume branches (≈1 day)
- Three small branches with their own short system prompts.
- "About MyTechz" pulls from a static blurb file (not LLM-generated) for accuracy.

### Phase 5 — Voice + telemetry (≈1 day)
- `VoiceInputButton.jsx` from the docx.
- `ai_card_clicks` table + frontend tracker.
- Light dashboard query (admin only) for click-through ranking signal.

---

## 11. File layout (final)

```
client/src/
  app/api/ai/chat/route.js                ← POST handler
  components/ai/
    FloatingAIChat.jsx                    ← FAB + panel host
    ChatPanel.jsx
    ChatBubble.jsx
    ChatJobCardList.jsx
    ChatJobCard.jsx
    ChatSuggestions.jsx
    VoiceInputButton.jsx
    useChat.js                            ← client hook (state + send + voice)
  lib/ai/
    llm.js                                ← provider switch
    context.js                            ← buildUserContext
    intent.js                             ← detectIntent (rules + LLM fallback)
    rate-limit.js
    score.js                              ← deterministic scoring
    extract-filters.js                    ← LLM JSON extractor
    session.js                            ← ensureSession + persistTurn
    branches/
      search-jobs.js
      how-to-apply.js
      about.js
      resume.js
      general.js
    prompts/
      system-router.txt
      system-rerank.txt
      system-howto.txt
      system-about.txt
      system-resume.txt
      system-general.txt
client/migrations/
  20260505120000_chat.sql
  20260505120001_ai_card_clicks.sql       ← optional, Phase 5
```

---

## 12. Env vars

```
# .env.local — add these
AI_PROVIDER=groq                          # or 'anthropic'
GROQ_API_KEY=gsk_…
# ANTHROPIC_API_KEY=sk-ant-…              # set when switching
AI_MODEL_FAST=llama-3.3-70b-versatile     # for intent + extract
AI_MODEL_SMART=llama-3.3-70b-versatile    # for rerank + general
AI_RATE_LIMIT_PER_MIN=10
```

---

## 13. Quick-start checklist

- [ ] Apply migration `20260505120000_chat.sql` on MyTechz Supabase.
- [ ] Add `GROQ_API_KEY` (and optional `ANTHROPIC_API_KEY`) to `.env.local`.
- [ ] Phase 1 ship: FAB + panel + stub route.
- [ ] Phase 2 ship: personalization context + Groq general branch.
- [ ] Phase 3 ship: ranked job cards inline.
- [ ] Phase 4 ship: how-to-apply + about + resume branches.
- [ ] Phase 5 ship: voice + click telemetry.
- [ ] Restart dev, click the sparkle in the bottom-right, ask
      "Best react jobs for me?" — expect 3 ranked cards in the panel.

---

## 14. Things deliberately deferred

- **Voice OUT** (assistant talking back) — Phase 6 behind a setting.
- **Streaming responses** — UX nice-to-have; current panel already shows a
  "Thinking…" bubble which is good enough for v1.
- **Multi-turn tool use** (e.g. "show me #2 in detail") — Phase 6, needs a
  proper tool-use loop. For v1 we just give cards that link to detail pages.
- **Embeddings-based candidate retrieval** — current text/skill filter is fast
  and good enough up to ~10k jobs. Switch to pgvector when listings cross 10k.
- **Reranking from `ai_card_clicks`** — Phase 7 once we have signal.

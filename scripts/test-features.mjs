// Pure-logic smoke tests for Phase 1-4. No DB / no LLM.
// Run with: node scripts/test-features.mjs
// Exits 0 on success, 1 on any failure.

import { validateJobInput, toJobRow } from '../src/lib/jobs/schema.js'
import { localSuggest } from '../src/lib/jobs/popular-skills.js'
import { detectIntent } from '../src/lib/ai/intent.js'
import { jaccard, scoreJob } from '../src/lib/ai/score.js'
import { toCSV } from '../src/lib/exports/csv.js'

let passed = 0
let failed = 0
const failures = []

function t(name, fn) {
  try {
    fn()
    passed++
    console.log(`  ✓ ${name}`)
  } catch (e) {
    failed++
    failures.push({ name, msg: e.message })
    console.log(`  ✗ ${name}`)
    console.log(`      ${e.message}`)
  }
}

function eq(a, b, msg = '') {
  const sa = JSON.stringify(a)
  const sb = JSON.stringify(b)
  if (sa !== sb) throw new Error(`expected ${sb}, got ${sa}${msg ? ' — ' + msg : ''}`)
}
function truthy(v, msg = '') {
  if (!v) throw new Error(`expected truthy, got ${JSON.stringify(v)}${msg ? ' — ' + msg : ''}`)
}
function falsy(v, msg = '') {
  if (v) throw new Error(`expected falsy, got ${JSON.stringify(v)}${msg ? ' — ' + msg : ''}`)
}

// ────────────────────── Job schema ──────────────────────
console.log('\n── Job schema ──')

t('valid private job passes', () => {
  const r = validateJobInput(
    {
      category: 'private',
      title: 'Senior React Dev',
      description: 'Build cool stuff',
      job_type: 'full_time',
      work_mode: 'onsite',
      location_city: 'Bengaluru',
      apply_mode: 'internal',
      is_salary_disclosed: true,
      salary_min: 800000,
      salary_max: 1500000,
      experience_min: 3,
      experience_max: 6,
    },
    { actorRole: 'recruiter' }
  )
  truthy(r.ok, 'should be ok')
  eq(r.data.slug, 'senior-react-dev')
  eq(r.data.status, 'pending_approval')
})

t('recruiter cannot post government', () => {
  const r = validateJobInput(
    {
      category: 'government',
      title: 'X',
      description: 'X',
      job_type: 'full_time',
      work_mode: 'onsite',
      location_city: 'Delhi',
      apply_mode: 'internal',
      government_meta: { notification_url: 'https://gov.in/n.pdf', department: 'X' },
    },
    { actorRole: 'recruiter' }
  )
  falsy(r.ok)
  truthy(r.errors.category, 'should reject category')
})

t('admin can post government with meta', () => {
  const r = validateJobInput(
    {
      category: 'government',
      title: 'RRB Group D',
      description: 'X',
      job_type: 'full_time',
      work_mode: 'onsite',
      location_city: 'Delhi',
      apply_mode: 'external',
      apply_url: 'https://rrbcdg.gov.in/apply',
      government_meta: {
        notification_url: 'https://rrbcdg.gov.in/n.pdf',
        department: 'Indian Railways',
        vacancies: 1500,
      },
    },
    { actorRole: 'admin' }
  )
  truthy(r.ok, JSON.stringify(r.errors))
  eq(r.data.government_meta.department, 'Indian Railways')
  eq(r.data.status, 'active', 'admin defaults to active')
})

t('internship forces job_type=internship + requires duration', () => {
  const r = validateJobInput(
    {
      category: 'internship',
      title: 'SDE Intern',
      description: 'Cool',
      job_type: 'full_time',
      work_mode: 'remote',
      apply_mode: 'internal',
      duration_months: 6,
      stipend_min: 25000,
      is_salary_disclosed: true,
    },
    { actorRole: 'recruiter' }
  )
  truthy(r.ok, JSON.stringify(r.errors))
  eq(r.data.job_type, 'internship')
  eq(r.data.salary_period, 'month')
})

t('internship without duration fails', () => {
  const r = validateJobInput(
    {
      category: 'internship',
      title: 'X',
      description: 'X',
      work_mode: 'remote',
      apply_mode: 'internal',
    },
    { actorRole: 'recruiter' }
  )
  falsy(r.ok)
  truthy(r.errors.duration_months)
})

t('external apply requires URL', () => {
  const r = validateJobInput(
    {
      category: 'private',
      title: 'X',
      description: 'X',
      job_type: 'full_time',
      work_mode: 'onsite',
      location_city: 'Pune',
      apply_mode: 'external',
    },
    { actorRole: 'recruiter' }
  )
  falsy(r.ok)
  truthy(r.errors.apply_url)
})

t('remote job does not require city', () => {
  const r = validateJobInput(
    {
      category: 'private',
      title: 'X',
      description: 'X',
      job_type: 'full_time',
      work_mode: 'remote',
      apply_mode: 'internal',
      is_salary_disclosed: false,
    },
    { actorRole: 'recruiter' }
  )
  truthy(r.ok, JSON.stringify(r.errors))
})

t('skills get deduped and capped at 15', () => {
  const r = validateJobInput(
    {
      category: 'private',
      title: 'X',
      description: 'X',
      job_type: 'full_time',
      work_mode: 'remote',
      apply_mode: 'internal',
      skills: Array.from({ length: 25 }, (_, i) => `skill-${i % 12}`),
    },
    { actorRole: 'recruiter' }
  )
  truthy(r.ok)
  truthy(r.data.skills.length <= 15, `got ${r.data.skills.length}`)
  eq(new Set(r.data.skills).size, r.data.skills.length, 'no dupes')
})

t('toJobRow drops non-table columns', () => {
  const v = validateJobInput(
    {
      category: 'internship',
      title: 'I',
      description: 'D',
      work_mode: 'remote',
      apply_mode: 'internal',
      duration_months: 3,
      ppo_chance: 50,
      is_salary_disclosed: false,
    },
    { actorRole: 'recruiter' }
  )
  truthy(v.ok)
  const row = toJobRow(v.data)
  // duration_months / ppo_chance / curation_reason should NOT be in the row
  falsy('duration_months' in row, 'duration_months should be stripped')
  falsy('ppo_chance' in row, 'ppo_chance should be stripped')
  falsy('curation_reason' in row, 'curation_reason should be stripped')
  // they should be folded into description
  truthy(row.description.includes('Duration'))
  truthy(row.description.includes('PPO'))
})

t('toJobRow folds AI curation_reason into summary', () => {
  const v = validateJobInput(
    {
      category: 'ai',
      title: 'AI Pick',
      description: 'D',
      job_type: 'full_time',
      work_mode: 'remote',
      apply_mode: 'internal',
      curation_reason: 'Trending React role',
      is_salary_disclosed: false,
    },
    { actorRole: 'admin' }
  )
  truthy(v.ok, JSON.stringify(v.errors))
  const row = toJobRow(v.data)
  eq(row.summary, 'Trending React role')
  falsy('curation_reason' in row)
})

// ────────────────────── Skill autocomplete ──────────────────────
console.log('\n── Skill autocomplete ──')

t('localSuggest returns React-family for "Re"', () => {
  const out = localSuggest('Re', [])
  truthy(out.length > 0)
  truthy(out.some((s) => s.toLowerCase().includes('react')))
})

t('localSuggest excludes already-picked skills', () => {
  const out = localSuggest('rea', ['React'])
  falsy(out.includes('React'))
})

t('localSuggest empty prefix returns []', () => {
  eq(localSuggest('', []).length, 0)
})

// ────────────────────── AI intent + score ──────────────────────
console.log('\n── AI assistant ──')

t('detectIntent: search_jobs for "best react jobs"', () => {
  eq(detectIntent('best react jobs in pune'), 'search_jobs')
})
t('detectIntent: how_to_apply', () => {
  eq(detectIntent('how do I apply for this'), 'how_to_apply')
})
t('detectIntent: about_mytechz', () => {
  eq(detectIntent('what is mytechz'), 'about_mytechz')
})
t('detectIntent: general for chit-chat', () => {
  eq(detectIntent('hello'), 'general')
})

t('jaccard overlaps correctly', () => {
  eq(jaccard(['React', 'Node', 'TS'], ['react', 'go']), 1 / 4)
})

t('scoreJob handles missing user context', () => {
  const s = scoreJob(
    { skills: ['React'], posted_at: new Date().toISOString() },
    null
  )
  truthy(typeof s === 'number' && s > 0)
})

t('scoreJob ranks skill-overlap higher', () => {
  const job = {
    skills: ['React', 'Next.js'],
    location_city: 'Bengaluru',
    experience_min: 2,
    experience_max: 5,
    posted_at: new Date().toISOString(),
  }
  const matched = scoreJob(job, {
    skills: ['React', 'Next.js'],
    location: 'Bengaluru',
    experienceYears: 3,
  })
  const unmatched = scoreJob(job, {
    skills: ['Java', 'Spring'],
    location: 'Mumbai',
    experienceYears: 12,
  })
  truthy(matched > unmatched, `matched ${matched} should beat ${unmatched}`)
})

// ────────────────────── CSV exports ──────────────────────
console.log('\n── CSV exports ──')

t('toCSV produces header + rows', () => {
  const csv = toCSV(
    [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ],
    [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
    ]
  )
  eq(csv, 'Name,Age\nAlice,30\nBob,25')
})

t('toCSV escapes commas and quotes', () => {
  const csv = toCSV(
    [{ s: 'a, b' }, { s: 'has "quotes"' }],
    [{ key: 's', label: 'S' }]
  )
  truthy(csv.includes('"a, b"'))
  truthy(csv.includes('"has ""quotes"""'))
})

t('toCSV defuses formula injection', () => {
  const csv = toCSV(
    [{ s: '=SUM(A1)' }, { s: '+1' }, { s: '@cmd' }],
    [{ key: 's', label: 'S' }]
  )
  truthy(csv.includes("'=SUM(A1)"), 'should prefix = with apostrophe')
  truthy(csv.includes("'+1"))
  truthy(csv.includes("'@cmd"))
})

t('toCSV uses get() function when provided', () => {
  const csv = toCSV(
    [{ a: 1, b: 2 }],
    [{ key: 'sum', label: 'Sum', get: (r) => r.a + r.b }]
  )
  eq(csv, 'Sum\n3')
})

// ────────────────────── Result ──────────────────────
console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) {
  console.log('\nFailures:')
  for (const f of failures) console.log(`  - ${f.name}: ${f.msg}`)
  process.exit(1)
}

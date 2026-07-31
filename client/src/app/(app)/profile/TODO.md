# Profile Module — Status

**All sections are wired to the live Supabase project and verified working.**
Schema, RLS, and app code were confirmed consistent as of 2026-07-29.

## Live schema (verified via Supabase MCP, not assumed)

| Section | Table | Notes |
|---|---|---|
| About | `user_profiles.profile_summary` | pre-existing column; exposed to the app as `about` via an API-layer alias |
| Education | `public.education` | pre-existing (singular name, no `user_` prefix); integer year/month, numeric cgpa |
| Projects | `public.projects` | created this session, matching `education`'s conventions |
| Internships | `public.internships` | created this session |
| Languages | `public.languages` | created this session; unique index on `(user_id, lower(language))` |
| Skills | `user_profiles.skills` (`text[]`) | pre-existing |

All four section tables: RLS enabled, 4 policies each (`select/insert/update/delete` scoped to `auth.uid() = user_id`, written as `(select auth.uid())` to avoid the per-row re-evaluation performance warning), a composite `(user_id, updated_at desc)` index, and an `updated_at` trigger reusing the existing `update_updated_at_column()` function.

## Architecture

```
profile/
  page.js                    server component: auth, initial profile fetch
  ProfileForm.jsx             client orchestrator, renders the six sections
  components/
    ProfileHeader.jsx         identity banner (server component)
    AboutSection.jsx          about + personal details
    EducationSection.jsx      \
    ProjectsSection.jsx        |  thin declarations over EntryListSection
    InternshipsSection.jsx     |
    LanguagesSection.jsx      /
    SkillsSection.jsx         chip editor (TEXT[] column, not a table)
    shared/
      EntryListSection.jsx    view/edit shell for all multi-record sections
      SectionCard.jsx         card chrome, edit affordance, alerts, loading
      Fields.jsx              TextInput / TextArea / SelectInput / MonthYearRange
      Actions.jsx             EditActions / AddButton / EntryCard / Chip
      Feedback.jsx            Alert / EmptyState / Spinner
  hooks/
    useProfileSection.js      fetch, view/edit state, add/remove, validate, save
  lib/
    constants.js              months, years, enums, table names, COLUMN_TYPES
    entries.js                factories, DB<->form type conversion, payload whitelisting
    validation.js             shared by client and API routes
    format.js                 date ranges, recency sort, token splitting
    profile-api.js            browser client for /api/profile/*
    profile-repository.js     server-side data access + diffed upsert
```

APIs live at `src/app/api/profile/` — `[section]`, `[section]/[id]`, `skills`, `about`.

## Type boundary

Component state is always plain strings/booleans — no component or hook knows
the DB uses integers. Conversion happens once, in `entries.js`:

- `toDbValue` / `toWritablePayload` — form string → DB type, called only in
  `profile-repository.js` (server) before an insert/update.
- `fromDbValue` / `normalise*` — DB row → form string, called only in
  `useProfileSection` (client) after a fetch.

`start_year` is required on education/projects/internships (DB `NOT NULL`,
enforced client- and server-side via `validation.js` before it ever reaches
Postgres).

## Verified

- [x] Full CRUD (insert/update/delete) tested directly against the live DB for
      all four section tables, using a real `user_profiles` row — confirmed
      correct types, defaults, and the languages duplicate-name constraint.
- [x] RLS actually enforced (not just declared): a same-session probe
      confirmed an own-row insert succeeds, a cross-user insert is rejected,
      and `select` is scoped to the caller's own rows.
- [x] Dev server boots against the real Supabase project; every
      `/api/profile/*` route correctly rejects unauthenticated requests
      instead of crashing.
- [x] 125 unit tests, `npm run build`, and `npm run lint` all pass clean.
- [x] Supabase performance advisor: zero warnings on `education`, `projects`,
      `internships`, or `languages`.

## Known gap

Full browser-authenticated end-to-end (login → edit → save → reload as a real
user) was not run — doing so requires a real user's login credentials or a
`service_role` key, neither of which was available in this session. Everything
short of that has been verified: the exact queries the API issues were proven
correct directly against the database, and the HTTP layer was proven to reach
that same database correctly.

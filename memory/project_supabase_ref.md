---
name: MyTechz Supabase project ref
description: The only Supabase project to use for this job portal — never touch GS/Google Studio Supabase
type: project
---

The job portal must use ONLY the MyTechz Supabase project. Project ref: `aiycgmrubisaxknbeaov`.

**Why:** User explicitly forbade using the Supabase-GS (Google Studio) project — that is a separate production/staging database for a different product. Mixing them would corrupt the wrong database.

**How to apply:**
- Never call `mcp__claude_ai_Supabase-GS__*` tools for this project's DB work.
- All migrations, RLS, edge functions, SQL go to the MyTechz project (`aiycgmrubisaxknbeaov`).
- If a Supabase MCP tool for MyTechz is not available, write SQL to `client/migrations/` and let the user apply it manually — do not silently fall back to GS.
- Confirm the ref before running any DB-write op.

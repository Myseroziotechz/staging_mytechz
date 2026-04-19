---
name: agent-skills
description: Activates production-grade engineering workflows for AI coding agents based on the addyosmani/agent-skills framework. Use this skill whenever the user is starting a new feature, writing code, debugging, reviewing, or shipping — especially when they need structured, senior-engineer-level discipline enforced across the full software development lifecycle (Define → Plan → Build → Verify → Review → Ship). Trigger on phrases like "write a spec", "plan this feature", "implement incrementally", "write tests first", "review my code", "security audit", "optimize performance", "set up CI/CD", "write an ADR", "ship this to prod", or any request that maps to a phase of the engineering lifecycle. Also trigger when the user asks to follow best practices, enforce quality gates, or work like a senior engineer would.
inclusion: manual
---

# Agent Skills

## Production-Grade Engineering Workflows for AI Coding Agents

> Based on [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — a curated collection of skills that encode the workflows, quality gates, and best practices senior engineers use when building web applications.

---

## Overview

AI coding agents default to taking the **shortest path** — skipping specs, tests, security reviews, and all the practices that make software reliable. This skill enforces the full engineering lifecycle with concrete workflows, verification steps, and anti-patterns to avoid.

The lifecycle is:

```
DEFINE ──▶ PLAN ──▶ BUILD ──▶ VERIFY ──▶ REVIEW ──▶ SHIP
/spec     /plan    /build     /test     /review    /ship
```

Each phase has a dedicated workflow below. **Do not skip phases.** Each phase requires human review before advancing.

---

## When to Use

**Activate a phase skill when:**
- Starting something new → **Define** (idea-refine, spec-driven-development)
- Breaking work into tasks → **Plan** (planning-and-task-breakdown)
- Writing code → **Build** (incremental-implementation, frontend-ui-engineering, api-and-interface-design, context-engineering)
- Proving it works → **Verify** (test-driven-development, browser-testing-with-devtools, debugging-and-error-recovery)
- Gating quality before merge → **Review** (code-review-and-quality, security-and-hardening, performance-optimization, code-simplification)
- Deploying → **Ship** (git-workflow-and-versioning, ci-cd-and-automation, documentation-and-adrs, shipping-and-launch, deprecation-and-migration)

**Do NOT use this skill for:**
- One-line answers or factual lookups
- Purely conversational responses
- Tasks with no code, specs, or engineering artifacts involved

---

## Phase Workflows

---

### DEFINE PHASE

#### `/spec` — Spec-Driven Development

Write structured specifications **before** writing any code. The spec is a living document.

**Gated workflow — do not advance without human review at each gate:**

```
SPECIFY ──▶ PLAN ──▶ TASKS ──▶ IMPLEMENT
│           │        │           │
▼           ▼        ▼           ▼
Human       Human    Human       Human
reviews     reviews  reviews     reviews
```

**Steps:**

1. **Surface assumptions immediately.** Before writing spec content, list all assumptions:
```
ASSUMPTIONS I'M MAKING:
1. This is a web application (not native mobile)
2. Auth uses session-based cookies (not JWT)
3. Database is PostgreSQL
→ Correct me now or I'll proceed with these.
```
2. **Write the high-level vision** — one paragraph describing the goal, not the implementation.
3. **Write the PRD** covering six core areas: commands/entry points, testing strategy, project structure, code style, git workflow, scope boundaries.
4. **Get human sign-off** before proceeding to planning.
5. **Keep the spec alive** — update it when decisions change, commit it to version control, reference it in PRs.

**Simple tasks:** A two-line spec with acceptance criteria is fine. Don't over-spec.

---

#### `/idea` — Idea Refinement

Use before writing a spec when the idea is still vague.

1. **Diverge:** Generate 3–5 distinct approaches or framings of the idea.
2. **Evaluate:** List pros/cons and assumptions for each.
3. **Converge:** Select the strongest direction with rationale.
4. **Hand off:** Feed the refined idea into `/spec`.

---

### PLAN PHASE

#### `/plan` — Planning & Task Breakdown

Decompose work into small, verifiable, agent-executable tasks.

**Steps:**

1. **Read the spec.** Never plan without it.
2. **Identify dependencies.** Draw the dependency graph before sizing tasks.
3. **Size tasks.** Each task should be completable in one agent session with clear, checkable acceptance criteria.
4. **Order tasks.** Topological sort by dependencies. No task should have a blocking unknown.
5. **Define checkpoints.** After every 3–5 tasks, there's a checkpoint where the human reviews progress before continuing.
6. **Write acceptance criteria.** For every task: "This task is done when [observable, verifiable outcome]."

**Task sizing guide:**
- Good: "Add Zod schema for task creation with title (required) and description (optional)"
- Too big: "Implement the task management feature"
- Too vague: "Write some tests"

---

### BUILD PHASE

#### `/build` — Incremental Implementation

Build in **thin vertical slices** — one piece, test it, verify it, then expand.

**Steps:**

1. **Pick the smallest vertical slice** that delivers observable value.
2. **Implement only that slice.** Do not jump ahead.
3. **Verify it works** (run tests, check build output).
4. **Commit as a save point** before moving to the next slice.
5. **Use feature flags** for changes that can't be fully landed in one slice.
6. **Never mix formatting changes with behavior changes** in the same commit.

**Context loading (context-engineering):**

Before starting any task, pack the right context:
```
PROJECT CONTEXT:
- We're building [X] using [tech stack]
- Relevant spec section: [excerpt]
- Files involved: [list with descriptions]
- Pattern to follow: [pointer to existing example]
- Known gotchas: [list]

TASK: [specific task]
```
Load only the relevant spec section — not the entire spec.

---

#### Frontend UI Engineering

Use when building or modifying user-facing interfaces.

1. Follow the project's **design system** — don't invent new tokens, colors, or spacing.
2. Build to **WCAG 2.1 AA** accessibility minimum.
3. Use **semantic HTML** before reaching for ARIA.
4. Design **mobile-first**, then enhance for desktop.
5. Avoid "AI-generated UI" aesthetic — no gratuitous gradients, no random shadows, no inconsistent spacing.
6. Every interactive element must have: focus state, hover state, disabled state, loading state.

---

#### API & Interface Design

Use when designing APIs, module boundaries, or any public interface.

1. **Define the contract first** — inputs, outputs, errors — before implementing.
2. **Be conservative in what you accept** (strict input validation at system edges).
3. **Be liberal in what you return** (don't break consumers with extra fields).
4. **Version from day one** — even internal APIs change.
5. **Hyrum's Law:** Any observable behavior will be depended on. Design intentionally.
6. **Error semantics matter** — use HTTP status codes correctly; never return 200 for an error.

---

### VERIFY PHASE

#### `/test` — Test-Driven Development

Write tests **before** code. Prove behavior, don't assume it.

**The Prove-It Pattern (for bug fixes):**
```
1. Reproduce the bug with a failing test
2. Confirm the test fails for the right reason
3. Fix the code
4. Confirm the test passes
5. Confirm no regressions
```

**Test hierarchy:**
```
  E2E (few, slow, high confidence)
  Integration (moderate)
  Unit (many, fast, isolated)
```

**Rules:**
- Never ship without at least one test that proves the behavior.
- Unit tests for pure functions and business logic.
- Integration tests for service boundaries and DB interactions.
- E2E tests for critical user flows only.
- Run `npm test` (or equivalent) and verify all pass before considering done.

---

#### Browser Testing with DevTools

Use when building or debugging anything that runs in a browser.

1. **Inspect the DOM** — verify structure matches intent, not just visual output.
2. **Check the console** — zero errors and zero warnings is the standard.
3. **Review network traces** — look for failed requests, unexpected payloads, N+1 patterns.
4. **Profile performance** — check for layout thrashing, long tasks, memory leaks.
5. **Take screenshots** for before/after comparison on UI changes.

---

#### Debugging & Error Recovery

Systematic triage — never guess.

**Five-step triage:**
```
1. REPRODUCE  → Get a reliable way to trigger the bug
2. LOCALIZE   → Narrow to the smallest failing unit
3. REDUCE     → Create a minimal reproduction
4. FIX        → Change the root cause, not the symptom
5. GUARD      → Add a test that would have caught this
```

**Stop-the-line rule:** If a build is broken, no new features until it's fixed. A broken build is not a background task.

---

### REVIEW PHASE

#### `/review` — Code Review & Quality

Review on five axes before any merge:

| Axis | Questions |
|------|-----------|
| **Correctness** | Does it do what the spec says? Edge cases handled? |
| **Readability** | Would a new engineer understand this in 6 months? |
| **Architecture** | Right abstraction level? Good separation of concerns? |
| **Security** | Input validated? No secrets in code? Auth checked? |
| **Performance** | No N+1 queries? No unbounded loops? No layout thrashing? |

**Multi-model review pattern:** Write with one model, review with another. Fresh context catches more.

**Standard:** "Would a staff engineer approve this?" If uncertain, the answer is no.

---

#### Security & Hardening

Apply to any code handling user input, authentication, data storage, or external integrations.

**OWASP Top 10 checklist (minimum):**
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output encoding)
- [ ] Authentication verified on every protected route
- [ ] Authorization checked (not just authentication)
- [ ] No secrets in source code or logs
- [ ] Dependencies audited (`npm audit` or equivalent)
- [ ] Input validated at system boundaries
- [ ] Rate limiting on public endpoints

**Three-tier boundary:**
- **Always:** Validate all input, encode all output, use parameterized queries
- **Ask First:** Storing PII, adding new auth flows, changing security headers
- **Never:** Disabling CSRF protection, logging passwords, hardcoding credentials

---

#### Performance Optimization

**Measure before optimizing.** Never optimize based on intuition.

1. **Establish a baseline** — run Lighthouse or equivalent, record Core Web Vitals (LCP, INP, CLS).
2. **Set a performance budget** — agree on targets before optimizing.
3. **Profile to find the bottleneck** — don't guess which code is slow.
4. **Fix the bottleneck** — only what measurements prove matters.
5. **Verify improvement** — re-run the same benchmark.

**Common anti-patterns:**
- N+1 queries (fix with joins or batching)
- Unbounded loops over large datasets
- Unthrottled event listeners (scroll, resize, input)
- Render-blocking scripts
- Images without dimensions (causes CLS)

---

#### Code Simplification

Apply Chesterton's Fence: **understand why something exists before removing it.**

1. Read the code and identify what it does.
2. Search for callers, tests, and git blame for context.
3. Ask: "Why was this written this way?" before simplifying.
4. Simplify only what you can prove is safe to change.
5. Leave a comment if non-obvious complexity must stay.

---

### SHIP PHASE

#### `/ship` — Shipping & Launch

**Pre-launch checklist:**
- [ ] All tests pass in CI
- [ ] Feature flags configured for staged rollout
- [ ] Monitoring and alerting set up
- [ ] Rollback procedure documented and tested
- [ ] Error tracking configured (Sentry or equivalent)
- [ ] Database migrations are reversible
- [ ] Load tested if traffic increase expected
- [ ] Stakeholders notified

**Staged rollout:**
```
Internal → 1% → 10% → 50% → 100%
```
Hold at each stage. Watch metrics. Roll back immediately if error rate increases.

---

#### Git Workflow & Versioning

Git as your safety net.

1. **Atomic commits** — one logical change per commit.
2. **Descriptive messages** — format: `type(scope): what changed` (e.g., `feat(auth): add email verification`)
3. **Commit as save points** — commit before risky changes, before context switches.
4. **Never mix** formatting/style changes with behavior changes.
5. **Branch strategy:** `main` is always deployable. Feature branches merge via PR. No direct pushes to main.

---

#### CI/CD & Automation

Automate quality gates. CI is the last line of defense.

**Minimum pipeline:**
```
push → lint → typecheck → test → build → deploy (on main only)
```

**Failure feedback loop:**
Feed CI errors directly back to the agent with the specific error text, file, and line — not just "CI failed."

**Deployment strategies:**
- Blue/green for zero-downtime
- Feature flags for gradual rollout
- Canary releases for high-risk changes

---

#### Documentation & ADRs

Document **decisions**, not just code.

**Architecture Decision Record (ADR) template:**
```markdown
# ADR-NNN: [Decision Title]
Date: YYYY-MM-DD
Status: Proposed | Accepted | Deprecated

## Context
What situation forced this decision?

## Decision
What did we decide?

## Consequences
What becomes easier? What becomes harder?
```

Write an ADR for: technology choices, architectural patterns, API design decisions, anything you'd have to re-explain in a PR.

---

#### Deprecation & Migration

Treat code as a **liability**, not just an asset.

1. **Signal first** — add deprecation warnings before removing anything.
2. **Set a timeline** — announce removal date with adequate notice.
3. **Provide a migration path** — never remove without an alternative.
4. **Remove completely** — half-removed code is worse than both options.
5. **Update all callsites** — search the entire codebase, not just obvious ones.

---

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "I'll add tests later" | Later never comes. Tests written after the fact test what was built, not what should have been built. |
| "This is too simple to need a spec" | Simple tasks still need acceptance criteria. A two-line spec takes 2 minutes. |
| "The code is obvious, it doesn't need a comment" | Obvious to whom? In 6 months? To a new engineer? |
| "I'll optimize it once it's working" | Premature optimization avoidance ≠ skipping profiling. Measure first. |
| "This change is safe, I don't need a rollback plan" | Every production incident started with "this change is safe." |
| "We can skip the security review for internal tools" | Internal tools become external-facing. Breaches happen from inside. |
| "CI is too slow, I'll just push" | CI is the last line of defense. Breaking it creates risk for the whole team. |
| "The spec is out of date, I'll just implement what makes sense" | Update the spec first, then implement. A stale spec is still a spec. |

---

## Red Flags

- Code merged without any test coverage for the new behavior
- Spec written after implementation ("documentation spec")
- Commits that mix multiple unrelated changes
- "TODO: add tests" comments in merged code
- Performance optimization without a before/after benchmark
- Security-sensitive code (auth, input handling) without a review checklist
- Architectural decisions made in Slack/chat with no ADR
- Features shipped without monitoring or rollback plan
- Dependencies added without `npm audit` or equivalent check

---

## Verification

After completing any phase, confirm:

**Define:**
- [ ] Spec written before any code
- [ ] Assumptions listed and confirmed
- [ ] Human sign-off obtained

**Plan:**
- [ ] All tasks have acceptance criteria
- [ ] Dependencies mapped
- [ ] Tasks are agent-sized (completable in one session)

**Build:**
- [ ] Implemented in vertical slices
- [ ] Each slice committed as a save point
- [ ] Context packed correctly before each task

**Verify:**
- [ ] All tests pass: `npm test` output shows green
- [ ] No console errors in the browser
- [ ] Bug fixes guarded with a regression test

**Review:**
- [ ] Five-axis review completed
- [ ] Security checklist passed
- [ ] Performance baseline measured (if applicable)

**Ship:**
- [ ] CI pipeline passes
- [ ] Rollback procedure documented
- [ ] Monitoring configured
- [ ] Staged rollout plan in place

---

## Cross-Skill References

This skill orchestrates 19 specialized sub-skills. For deep-dive guidance, reference:

| Skill | When |
|-------|------|
| `idea-refine` | Vague idea needs clarification before spec |
| `spec-driven-development` | Starting any feature or project |
| `planning-and-task-breakdown` | Breaking spec into tasks |
| `incremental-implementation` | During active coding |
| `context-engineering` | Agent output quality is degrading |
| `frontend-ui-engineering` | Building UI components |
| `api-and-interface-design` | Designing any public interface |
| `test-driven-development` | Writing any logic or fixing any bug |
| `browser-testing-with-devtools` | Debugging browser behavior |
| `debugging-and-error-recovery` | Tests fail or builds break |
| `code-review-and-quality` | Before any merge |
| `code-simplification` | Refactoring or removing code |
| `security-and-hardening` | User input, auth, storage, external integrations |
| `performance-optimization` | Performance requirements or suspected regressions |
| `git-workflow-and-versioning` | Always (every code change) |
| `ci-cd-and-automation` | Setting up or changing build/deploy pipelines |
| `documentation-and-adrs` | Making architectural decisions |
| `shipping-and-launch` | Deploying to production |
| `deprecation-and-migration` | Removing or replacing existing code/APIs |

---

*Source: [github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) · MIT License*

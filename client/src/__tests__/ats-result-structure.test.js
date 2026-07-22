import { describe, it, expect } from 'vitest'
import { analyzeResumeATS } from '@/lib/ai/ats-rule-engine'

/**
 * Tests that the local engine result structure matches the expected data contract
 * that both Gemini and local paths must conform to (as enforced in route.js).
 *
 * The route.js merges these fields; this test validates that the local engine
 * produces everything the UI components expect.
 */

const RESUME = `
Jane Smith | jane@example.com | +91-9876543210

Summary
Full-stack developer with 3 years building React and Node.js applications. Experienced in Docker, AWS, and agile teams.

Experience
Software Developer at ABC Corp (Jan 2023 - Present)
- Developed React dashboards for internal analytics
- Built REST APIs with Node.js and Express
- Deployed microservices using Docker on AWS ECS
- Increased test coverage from 40% to 85%

Junior Developer at XYZ Ltd (Jul 2021 - Dec 2022)
- Created responsive UI components with HTML, CSS, and JavaScript
- Managed PostgreSQL databases and wrote optimized SQL queries

Education
B.Tech Computer Science, IIT Delhi (2021)

Skills
React, Node.js, JavaScript, Python, Docker, AWS, PostgreSQL, Git, REST API, Agile
`

const JD = `
Looking for a Full Stack Developer with experience in React, Node.js, TypeScript, PostgreSQL.
Must have strong communication skills, leadership ability, and experience with CI/CD pipelines.
Knowledge of GraphQL, Redis, and Kubernetes is a plus.
`

describe('Result structure — UI data contract', () => {
  const localOnly = analyzeResumeATS({ resumeText: RESUME })
  const withJD = analyzeResumeATS({ resumeText: RESUME, jobDescription: JD })

  it('local-only result has source = "local"', () => {
    expect(localOnly.source).toBe('local')
  })

  it('both results have identical top-level keys', () => {
    const localKeys = Object.keys(localOnly).sort()
    const jdKeys = Object.keys(withJD).sort()
    expect(localKeys).toEqual(jdKeys)
  })

  describe('keywords object — used by KeywordPieChart', () => {
    for (const [label, result] of [['local-only', localOnly], ['with-JD', withJD]]) {
      it(`${label}: keywords.matched is an array of strings`, () => {
        expect(Array.isArray(result.keywords.matched)).toBe(true)
        result.keywords.matched.forEach((k) => expect(typeof k).toBe('string'))
      })

      it(`${label}: keywords.hardSkills has matched and missing arrays`, () => {
        expect(Array.isArray(result.keywords.hardSkills.matched)).toBe(true)
        expect(Array.isArray(result.keywords.hardSkills.missing)).toBe(true)
      })

      it(`${label}: keywords.softSkills has matched and missing arrays`, () => {
        expect(Array.isArray(result.keywords.softSkills.matched)).toBe(true)
        expect(Array.isArray(result.keywords.softSkills.missing)).toBe(true)
      })

      it(`${label}: hard + soft matched = total matched`, () => {
        const hardMatched = result.keywords.hardSkills.matched.length
        const softMatched = result.keywords.softSkills.matched.length
        expect(hardMatched + softMatched).toBe(result.keywords.matched.length)
      })

      it(`${label}: hard + soft missing = total missing`, () => {
        const hardMissing = result.keywords.hardSkills.missing.length
        const softMissing = result.keywords.softSkills.missing.length
        expect(hardMissing + softMissing).toBe(result.keywords.missing.length)
      })
    }
  })

  describe('keywordFrequency — used by KeywordFrequencyChart', () => {
    it('every keyword in matched/missing has a frequency entry', () => {
      const allKw = [...withJD.keywords.matched, ...withJD.keywords.missing]
      for (const kw of allKw) {
        expect(withJD.keywordFrequency).toHaveProperty(kw)
        expect(withJD.keywordFrequency[kw]).toHaveProperty('jdCount')
        expect(withJD.keywordFrequency[kw]).toHaveProperty('resumeCount')
      }
    })

    it('matched keywords have resumeCount > 0', () => {
      for (const kw of withJD.keywords.matched) {
        expect(withJD.keywordFrequency[kw].resumeCount).toBeGreaterThan(0)
      }
    })
  })

  describe('missingKeywords — used by MissingKeywords component', () => {
    it('each item has keyword, section, skillType, suggestion, priority', () => {
      for (const kw of withJD.missingKeywords) {
        expect(typeof kw.keyword).toBe('string')
        expect(typeof kw.section).toBe('string')
        expect(typeof kw.skillType).toBe('string')
        expect(typeof kw.suggestion).toBe('string')
        expect(typeof kw.priority).toBe('string')
      }
    })
  })

  describe('formattingChecklist — used by FormattingChecklist component', () => {
    it('has 8 items for a complete resume', () => {
      expect(localOnly.formattingChecklist.length).toBe(8)
    })

    it('each item has label (string) and passed (boolean)', () => {
      for (const item of localOnly.formattingChecklist) {
        expect(typeof item.label).toBe('string')
        expect(typeof item.passed).toBe('boolean')
      }
    })

    it('detects email as present', () => {
      const emailItem = localOnly.formattingChecklist.find((c) => c.label.includes('Email'))
      expect(emailItem?.passed).toBe(true)
    })
  })

  describe('suggestedAdditions — used by SuggestionsList', () => {
    it('each suggestion has section, keyword, suggestion text', () => {
      for (const s of withJD.suggestedAdditions) {
        expect(typeof s.section).toBe('string')
        expect(typeof s.keyword).toBe('string')
        expect(typeof s.suggestion).toBe('string')
      }
    })
  })

  describe('warnings and tips — used by WarningsPanel and SuggestionsList', () => {
    it('warnings is an array with level/message/fix', () => {
      expect(Array.isArray(localOnly.warnings)).toBe(true)
      for (const w of localOnly.warnings) {
        expect(typeof w.level).toBe('string')
        expect(typeof w.message).toBe('string')
        expect(typeof w.fix).toBe('string')
      }
    })

    it('tips is an array of strings', () => {
      expect(Array.isArray(localOnly.tips)).toBe(true)
      localOnly.tips.forEach((t) => expect(typeof t).toBe('string'))
    })
  })
})

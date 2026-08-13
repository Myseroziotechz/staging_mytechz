import { describe, it, expect } from 'vitest'
import { scoreJobMatch } from './engine'
import { deriveJobRequirements } from './job-requirements'

function makeJob(overrides = {}) {
  return {
    title: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'CSS'],
    experience_min: 0,
    experience_max: 2,
    work_mode: 'remote',
    location_city: 'Bengaluru',
    posted_at: new Date().toISOString(),
    ...overrides,
  }
}

function makeCandidate(overrides = {}) {
  return {
    skills: ['react', 'javascript', 'html'],
    experienceYears: 0.5,
    domain: 'frontend developer',
    location: 'Bengaluru',
    preferredLocations: [],
    workMode: 'remote',
    ...overrides,
  }
}

describe('scoreJobMatch', () => {
  it('scores a fresher well against an entry-level frontend job', () => {
    const job = makeJob()
    const result = scoreJobMatch(job, makeCandidate(), deriveJobRequirements(job))
    expect(result.percent).toBeGreaterThanOrEqual(60)
    expect(result.dampened).toBe(false)
  })

  it('dampens a fresher matched against a senior role, scoring lower than an experienced candidate on the same job', () => {
    const job = makeJob({ title: 'Senior Frontend Developer', experience_min: 5, experience_max: 8 })
    const fresher = scoreJobMatch(job, makeCandidate({ experienceYears: 0 }), deriveJobRequirements(job))
    const experienced = scoreJobMatch(job, makeCandidate({ experienceYears: 6 }), deriveJobRequirements(job))

    expect(fresher.dampened).toBe(true)
    expect(experienced.dampened).toBe(false)
    expect(fresher.percent).toBeLessThan(experienced.percent)
  })

  it('lists a required skill the candidate lacks as missing, and one they have as matched', () => {
    const job = makeJob({ skills: ['React', 'GraphQL'] })
    const result = scoreJobMatch(job, makeCandidate({ skills: ['react'] }), deriveJobRequirements(job))
    expect(result.matchedSkills).toContain('react')
    expect(result.missingSkills).toContain('graphql')
  })

  it('scores a remote job as a full location match regardless of candidate location', () => {
    const job = makeJob({ work_mode: 'remote', location_city: 'Mumbai' })
    const result = scoreJobMatch(job, makeCandidate({ location: 'Chennai' }), deriveJobRequirements(job))
    expect(result.breakdown.location).toBe(100)
  })

  it('assigns category labels consistent with the percent thresholds', () => {
    const job = makeJob()
    const strongMatch = scoreJobMatch(job, makeCandidate({ skills: ['react', 'javascript', 'css'] }), deriveJobRequirements(job))
    expect(strongMatch.label).toMatch(/match/i)
    expect(typeof strongMatch.percent).toBe('number')
  })
})

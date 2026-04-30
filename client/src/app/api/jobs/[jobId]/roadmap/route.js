import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const FALLBACK = (job) => ({
  skills_gap: {
    matched: (job?.skills || []).slice(0, 3),
    missing: (job?.skills || []).slice(3, 6),
  },
  weeks: [
    { week: 1, focus: 'Fundamentals refresher',                   tasks: ['Revise core concepts for the role', 'Re-read the JD carefully'] },
    { week: 2, focus: 'Hands-on with the top 3 required skills',  tasks: ['Build a small project per skill', 'Push to GitHub'] },
    { week: 3, focus: 'Mock interviews + system design',           tasks: ['3 mock interviews', '10 problems'] },
    { week: 4, focus: 'Tailor resume + apply',                     tasks: ['Match resume bullets to the JD', 'Write a 3-line cover note'] },
  ],
  resources:   [{ title: 'Official documentation', url: '#' }, { title: 'A curated YouTube playlist', url: '#' }],
  questions:   ['Walk through a project using the top JD skill.', 'Debug a vague production issue.', 'A speed-vs-quality tradeoff.'],
  resume_tips: ['Mirror skill names from the JD.', 'Quantify impact (numbers, %).', 'Move most-relevant role to the top.'],
  checklist:   ['Tailored resume PDF', 'Portfolio works on mobile', 'Top 5 questions rehearsed', 'Deadline noted', 'Day-7 follow-up reminder'],
})

export async function POST(_req, { params }) {
  const { jobId } = await params
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: job } = await supabase
      .from('jobs')
      .select('id, title, skills, description')
      .eq('id', jobId)
      .maybeSingle()

    if (!job) return NextResponse.json({ roadmap: FALLBACK(null) }, { status: 200 })

    if (user) {
      const { data: cached } = await supabase
        .from('job_assistant_roadmaps')
        .select('roadmap')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .maybeSingle()
      if (cached?.roadmap) return NextResponse.json({ roadmap: cached.roadmap })
    }

    const { data: generic } = await supabase
      .from('job_assistant_roadmaps')
      .select('roadmap')
      .eq('job_id', jobId)
      .is('user_id', null)
      .maybeSingle()
    if (generic?.roadmap) return NextResponse.json({ roadmap: generic.roadmap })

    const roadmap = FALLBACK(job)

    try {
      await supabase.from('job_assistant_roadmaps').insert({
        job_id: jobId,
        user_id: user?.id || null,
        roadmap,
      })
    } catch { /* ignore — table may not yet be migrated */ }

    return NextResponse.json({ roadmap })
  } catch (err) {
    console.warn('[roadmap] fallback:', err?.message)
    return NextResponse.json({ roadmap: FALLBACK(null) }, { status: 200 })
  }
}

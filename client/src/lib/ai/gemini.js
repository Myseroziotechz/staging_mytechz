import 'server-only'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const MODEL = 'gemini-2.0-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export function isGeminiConfigured() {
  return !!(GEMINI_KEY && GEMINI_KEY.length > 10)
}

/**
 * Core Gemini chat function.
 * @param {{ prompt: string, systemInstruction?: string, json?: boolean, maxTokens?: number }} opts
 * @returns {Promise<string>}
 */
export async function geminiChat({ prompt, systemInstruction = '', json = false, maxTokens = 2048 }) {
  if (!isGeminiConfigured()) throw new Error('GEMINI_API_KEY not configured')

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: json ? 0.2 : 0.6,
      ...(json ? { responseMimeType: 'application/json' } : {}),
    },
  }

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] }
  }

  const res = await fetch(`${ENDPOINT}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(`Gemini ${res.status}: ${t.slice(0, 300)}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

  if (json) {
    // strip code fences if present
    return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  }
  return text
}

/**
 * Parse an uploaded resume text into structured data.
 */
export async function parseResumeWithGemini(resumeText) {
  const systemInstruction = `You are a resume parser. Extract structured data from the resume text provided.
Return JSON with this exact structure:
{
  "contact": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "summary": "",
  "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "bullets": [""] }],
  "education": [{ "degree": "", "institution": "", "location": "", "year": "" }],
  "skills": [""],
  "certifications": [{ "name": "", "issuer": "", "year": "" }],
  "projects": [{ "name": "", "description": "", "techStack": [""], "date": "" }],
  "languages": [{ "name": "", "proficiency": "" }]
}
Fill only fields that exist in the resume. Use empty arrays for missing sections. Keep bullet points concise and impactful.`

  const result = await geminiChat({
    prompt: resumeText,
    systemInstruction,
    json: true,
    maxTokens: 4096,
  })

  return safeParseGemini(result, {})
}

/**
 * Generate a full resume from a text prompt.
 */
export async function generateResumeContent(userPrompt, targetRole = '') {
  const systemInstruction = `You are an expert resume writer. Generate professional, ATS-optimised resume content based on the user's description.
${targetRole ? `Target role: ${targetRole}` : ''}

Return JSON with this structure:
{
  "contact": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "summary": "2-3 sentence professional summary",
  "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "bullets": ["quantified achievement bullet"] }],
  "education": [{ "degree": "", "institution": "", "location": "", "year": "" }],
  "skills": ["skill1", "skill2"],
  "certifications": [{ "name": "", "issuer": "", "year": "" }],
  "projects": [{ "name": "", "description": "", "techStack": [""], "date": "" }],
  "languages": [{ "name": "", "proficiency": "" }]
}

Rules:
- Write strong, quantified bullet points (use numbers, percentages, metrics)
- Use action verbs: Led, Built, Designed, Implemented, Reduced, Increased, Optimised
- Keep bullets concise (1-2 lines max)
- Include relevant industry keywords for ATS
- Fill contact with placeholder values the user should replace
- Generate realistic, professional content based on the user's description`

  const result = await geminiChat({
    prompt: userPrompt,
    systemInstruction,
    json: true,
    maxTokens: 4096,
  })

  return safeParseGemini(result, {})
}

/**
 * Rewrite a single resume section with AI.
 */
export async function rewriteSection(sectionType, currentContent, context = '') {
  const systemInstruction = `You are an expert resume writer. Rewrite the given ${sectionType} section to be more professional, impactful, and ATS-friendly.
${context ? `Context: ${context}` : ''}

Rules:
- Use strong action verbs and quantified achievements
- Keep the same general meaning but improve phrasing
- Make it concise and impactful
- Optimise for ATS keyword matching

Return JSON:
- For "summary": { "summary": "improved text" }
- For "experience": { "bullets": ["improved bullet 1", "improved bullet 2"] }
- For "skills": { "skills": ["skill1", "skill2"] }
- For other sections: return the improved content in the same structure as input`

  const result = await geminiChat({
    prompt: JSON.stringify(currentContent),
    systemInstruction,
    json: true,
    maxTokens: 2048,
  })

  return safeParseGemini(result, currentContent)
}

/**
 * Suggest ATS keywords based on a job description or target role.
 */
export async function suggestKeywords(resumeData, jobDescription = '', targetRole = '') {
  const systemInstruction = `You are an ATS optimisation expert. Analyse the resume and suggest keywords to improve ATS match score.
${jobDescription ? 'Compare against the provided job description.' : ''}
${targetRole ? `Target role: ${targetRole}` : ''}

Return JSON:
{
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestedAdditions": [
    { "section": "skills|experience|summary", "keyword": "keyword", "suggestion": "how to incorporate it" }
  ],
  "atsScore": 0-100,
  "tips": ["tip1", "tip2"]
}`

  const prompt = `Resume: ${JSON.stringify(resumeData)}${jobDescription ? `\n\nJob Description: ${jobDescription}` : ''}`

  const result = await geminiChat({
    prompt,
    systemInstruction,
    json: true,
    maxTokens: 2048,
  })

  return safeParseGemini(result, { missingKeywords: [], suggestedAdditions: [], atsScore: 0, tips: [] })
}

/**
 * Auto-fill a template from parsed resume data.
 * Maps extracted data to the template's required fields.
 */
export async function templateAutofill(parsedResume, templateRequiredFields, templateSections) {
  const systemInstruction = `You are a resume template filler. Given parsed resume data and a template's required fields,
map the data to fit the template format. Ensure all required fields are populated.
If data is missing for a required field, generate appropriate placeholder text.

Required fields for this template: ${JSON.stringify(templateRequiredFields)}
Template sections: ${JSON.stringify(templateSections)}

Return the resume_data JSON that fits this template's structure:
{
  "contact": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "summary": "",
  "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "bullets": [""] }],
  "education": [{ "degree": "", "institution": "", "location": "", "year": "" }],
  "skills": [""],
  "certifications": [{ "name": "", "issuer": "", "year": "" }],
  "projects": [{ "name": "", "description": "", "techStack": [""], "date": "" }],
  "languages": [{ "name": "", "proficiency": "" }]
}`

  const result = await geminiChat({
    prompt: JSON.stringify(parsedResume),
    systemInstruction,
    json: true,
    maxTokens: 4096,
  })

  return safeParseGemini(result, parsedResume)
}

function safeParseGemini(text, fallback) {
  if (!text) return fallback
  try {
    return JSON.parse(text)
  } catch {}
  const m = text.match(/\{[\s\S]*\}/)
  if (m) {
    try {
      return JSON.parse(m[0])
    } catch {}
  }
  return fallback
}

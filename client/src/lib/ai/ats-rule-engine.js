/**
 * Local ATS Rule Engine — fallback scoring when Gemini is unavailable.
 * Analyses resume text against job descriptions or role-based keyword sets.
 */

// ── Constants ──────────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a','about','above','after','again','against','all','am','an','and','any','are',
  "aren't",'as','at','be','because','been','before','being','below','between','both',
  'but','by','can','could','did','do','does','doing','down','during','each','few',
  'for','from','further','get','got','had','has','have','having','he','her','here',
  'hers','herself','him','himself','his','how','i','if','in','into','is','it','its',
  'itself','just','let','like','make','me','might','more','most','must','my','myself',
  'no','nor','not','now','of','off','on','once','only','or','other','our','ours',
  'ourselves','out','over','own','per','really','same','she','should','so','some',
  'such','than','that','the','their','theirs','them','themselves','then','there',
  'these','they','this','those','through','to','too','under','until','up','upon',
  'us','very','was','we','were','what','when','where','which','while','who','whom',
  'why','will','with','would','you','your','yours','yourself','yourselves',
  'also','may','shall','since','thus','etc','via','vs','ie','eg','re','well',
  'work','working','worked','using','used','use','new','role','team','company',
  'job','position','years','year','experience','responsible','responsibilities',
  'including','include','includes','ensure','ability','strong','excellent',
  'good','required','preferred','minimum','knowledge','skills','looking',
])

const ACTION_VERBS = new Set([
  'achieved','administered','analysed','analyzed','built','collaborated','completed',
  'configured','coordinated','created','decreased','delivered','deployed','designed',
  'developed','directed','drove','eliminated','engineered','established','evaluated',
  'executed','expanded','facilitated','formulated','generated','grew','headed',
  'identified','implemented','improved','increased','initiated','integrated',
  'introduced','launched','led','managed','mentored','migrated','modernised',
  'modernized','monitored','negotiated','optimised','optimized','orchestrated',
  'organised','organized','overhauled','owned','performed','pioneered','planned',
  'produced','programmed','published','rebuilt','reduced','refactored','reformed',
  'reorganised','reorganized','resolved','restructured','revamped','scaled',
  'secured','simplified','spearheaded','standardised','standardized','streamlined',
  'strengthened','supervised','supported','surpassed','tested','trained',
  'transformed','unified','upgraded','utilized','validated',
])

const ROLE_KEYWORDS_MAP = {
  'software engineer': [
    'javascript','typescript','python','java','react','node','sql','git','api',
    'rest','agile','ci/cd','docker','kubernetes','aws','testing','unit test',
    'data structures','algorithms','microservices','cloud','devops','linux',
    'html','css','mongodb','postgresql','redis','graphql','webpack','next.js',
  ],
  'frontend developer': [
    'javascript','typescript','react','vue','angular','html','css','sass',
    'tailwind','responsive','accessibility','webpack','vite','next.js','redux',
    'state management','component','ui/ux','figma','performance','seo','testing',
    'jest','cypress','git','api','rest','graphql','node',
  ],
  'backend developer': [
    'python','java','node','express','django','spring','sql','postgresql',
    'mongodb','redis','api','rest','graphql','microservices','docker','kubernetes',
    'aws','gcp','azure','ci/cd','testing','linux','security','authentication',
    'caching','message queue','rabbitmq','kafka',
  ],
  'data scientist': [
    'python','r','sql','machine learning','deep learning','tensorflow','pytorch',
    'pandas','numpy','scikit-learn','statistics','data analysis','visualization',
    'tableau','power bi','nlp','computer vision','feature engineering','model',
    'a/b testing','jupyter','spark','hadoop','etl','regression','classification',
  ],
  'product manager': [
    'roadmap','strategy','stakeholder','agile','scrum','user research','analytics',
    'kpi','metrics','prioritization','requirement','user story','jira','confluence',
    'a/b testing','market research','competitive analysis','go-to-market','mvp',
    'product lifecycle','cross-functional','data-driven','customer',
  ],
  'devops engineer': [
    'docker','kubernetes','aws','gcp','azure','terraform','ansible','jenkins',
    'ci/cd','linux','bash','python','monitoring','prometheus','grafana','elk',
    'logging','infrastructure','automation','security','networking','load balancer',
    'nginx','git','helm','argocd','istio',
  ],
  'data analyst': [
    'sql','excel','python','r','tableau','power bi','data visualization',
    'statistics','analytics','reporting','dashboard','etl','data cleaning',
    'data modeling','a/b testing','hypothesis testing','regression','kpi',
    'business intelligence','looker','google analytics',
  ],
  'ui/ux designer': [
    'figma','sketch','adobe xd','wireframe','prototype','user research',
    'usability testing','information architecture','interaction design',
    'visual design','design system','accessibility','responsive','typography',
    'color theory','user flow','persona','journey map','heuristic evaluation',
  ],
  'mobile developer': [
    'react native','flutter','swift','kotlin','ios','android','mobile',
    'app store','firebase','push notification','offline','responsive',
    'performance','testing','ci/cd','git','api','rest','graphql','sqlite',
    'state management','navigation','animation',
  ],
  'cybersecurity': [
    'security','vulnerability','penetration testing','firewall','siem',
    'incident response','compliance','encryption','authentication','authorization',
    'owasp','network security','threat modeling','risk assessment','sox','gdpr',
    'iso 27001','ids','ips','malware','forensics',
  ],
}

// Role aliases → canonical role name
const ROLE_ALIASES = {
  'sde': 'software engineer', 'swe': 'software engineer', 'developer': 'software engineer',
  'full stack': 'software engineer', 'fullstack': 'software engineer',
  'front end': 'frontend developer', 'front-end': 'frontend developer', 'ui developer': 'frontend developer',
  'back end': 'backend developer', 'back-end': 'backend developer', 'server side': 'backend developer',
  'data science': 'data scientist', 'ml engineer': 'data scientist',
  'pm': 'product manager', 'product owner': 'product manager',
  'devops': 'devops engineer', 'sre': 'devops engineer', 'site reliability': 'devops engineer',
  'analyst': 'data analyst', 'business analyst': 'data analyst',
  'ux designer': 'ui/ux designer', 'ui designer': 'ui/ux designer', 'designer': 'ui/ux designer',
  'mobile': 'mobile developer', 'ios developer': 'mobile developer', 'android developer': 'mobile developer',
  'security': 'cybersecurity', 'infosec': 'cybersecurity', 'security engineer': 'cybersecurity',
}

// Soft skills — commonly expected but not technical
const SOFT_SKILLS = new Set([
  'communication','leadership','teamwork','problem solving','problem-solving',
  'collaboration','critical thinking','time management','adaptability','creativity',
  'attention to detail','interpersonal','negotiation','presentation',
  'decision making','decision-making','conflict resolution','mentoring',
  'project management','strategic thinking','analytical','self-motivated',
  'stakeholder','cross-functional','customer','data-driven','prioritization',
  'roadmap','strategy','go-to-market','product lifecycle','user research',
  'market research','competitive analysis','agile','scrum',
])

// Section detection patterns
const SECTION_PATTERNS = {
  summary: /(?:^|\n)\s*(?:summary|objective|profile|about\s*me|professional\s*summary)[:\s\-—]*([\s\S]*?)(?=\n\s*(?:experience|education|skills|projects|certifications|work\s*history|technical)|$)/i,
  experience: /(?:^|\n)\s*(?:experience|employment|work\s*history|professional\s*experience)[:\s\-—]*([\s\S]*?)(?=\n\s*(?:education|skills|projects|certifications|summary)|$)/i,
  education: /(?:^|\n)\s*(?:education|academic|qualifications|degree)[:\s\-—]*([\s\S]*?)(?=\n\s*(?:experience|skills|projects|certifications|summary|work\s*history)|$)/i,
  skills: /(?:^|\n)\s*(?:skills|technologies|tech\s*stack|competencies|technical\s*skills|core\s*competencies)[:\s\-—]*([\s\S]*?)(?=\n\s*(?:experience|education|projects|certifications|summary|work\s*history)|$)/i,
  projects: /(?:^|\n)\s*(?:projects|portfolio)[:\s\-—]*([\s\S]*?)(?=\n\s*(?:experience|education|skills|certifications|summary|work\s*history)|$)/i,
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function tokenize(text) {
  return text
    .toLowerCase()
    // Protect compound tech terms (node.js, c#, c++, .net) by normalising around them
    .replace(/\b(\w+\.\w+)\b/g, (m) => m) // keep internal dots
    .replace(/([.,;:!?])(?=\s|$)/g, ' ')   // strip trailing punctuation before spaces/EOL
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => w.replace(/^[^a-z0-9.]+|[^a-z0-9.]+$/g, '')) // keep internal dots
    .filter((w) => w.length > 1)
}

function extractKeywords(text) {
  const tokens = tokenize(text)
  const keywords = new Set()
  // single words only — skip stop words and very short tokens
  tokens.forEach((t) => {
    if (!STOP_WORDS.has(t) && t.length > 2) keywords.add(t)
  })
  // Bigrams: only from natural phrases, skip comma/and-separated lists.
  // Split text into segments by commas/semicolons/and first, then extract bigrams within segments.
  const segments = text.toLowerCase().split(/[,;]|\band\b/).map((s) => s.trim())
  for (const seg of segments) {
    const segTokens = tokenize(seg)
    for (let i = 0; i < segTokens.length - 1; i++) {
      if (!STOP_WORDS.has(segTokens[i]) && !STOP_WORDS.has(segTokens[i + 1]) &&
          segTokens[i].length > 1 && segTokens[i + 1].length > 1) {
        keywords.add(`${segTokens[i]} ${segTokens[i + 1]}`)
      }
    }
  }
  return keywords
}

/**
 * Count occurrences of a keyword in text (case-insensitive).
 * For bigrams, matches the exact phrase. For unigrams, matches word boundaries.
 */
function countOccurrences(text, keyword) {
  const lower = text.toLowerCase()
  if (keyword.includes(' ')) {
    // Bigram — count exact phrase occurrences
    let count = 0
    let idx = 0
    while ((idx = lower.indexOf(keyword, idx)) !== -1) {
      count++
      idx += keyword.length
    }
    return count
  }
  // Unigram — match via regex word boundary where possible, fallback to includes count
  try {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const matches = lower.match(new RegExp(`\\b${escaped}\\b`, 'g'))
    return matches ? matches.length : 0
  } catch {
    // Fallback for keywords that break regex (e.g., c++)
    let count = 0
    let idx = 0
    while ((idx = lower.indexOf(keyword, idx)) !== -1) {
      count++
      idx += keyword.length
    }
    return count
  }
}

/**
 * Extract keyword frequencies from JD text and rank by importance.
 * Returns keywords sorted by frequency (highest first).
 */
function extractKeywordsWithFrequency(text) {
  const keywords = extractKeywords(text)
  const lower = text.toLowerCase()
  const freqMap = []

  for (const kw of keywords) {
    const count = countOccurrences(lower, kw)
    freqMap.push({ keyword: kw, jdCount: count })
  }

  // Sort by frequency descending — JD keywords that appear more often are more important
  freqMap.sort((a, b) => b.jdCount - a.jdCount)
  return freqMap
}

function resolveRole(targetRole) {
  if (!targetRole) return null
  const lower = targetRole.toLowerCase().trim()
  if (ROLE_KEYWORDS_MAP[lower]) return lower
  if (ROLE_ALIASES[lower]) return ROLE_ALIASES[lower]
  // partial match
  for (const [alias, canonical] of Object.entries(ROLE_ALIASES)) {
    if (lower.includes(alias)) return canonical
  }
  for (const role of Object.keys(ROLE_KEYWORDS_MAP)) {
    if (lower.includes(role) || role.includes(lower)) return role
  }
  return null
}

/**
 * Detect which resume section a keyword most likely belongs in.
 * Scans resume sections and returns the section where the keyword fits best.
 */
function detectKeywordSection(keyword, resumeText) {
  const lower = resumeText.toLowerCase()

  // Check if it's a soft skill — belongs in summary or experience
  if (SOFT_SKILLS.has(keyword.toLowerCase())) {
    return 'summary'
  }

  // Parse sections from resume
  const sectionContent = {}
  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    const match = lower.match(pattern)
    sectionContent[section] = match ? match[1] || '' : ''
  }

  // Check if keyword appears in any section context
  // If it's a technical term and skills section exists, suggest skills
  // If it relates to a tool/process and experience exists, suggest experience
  // Otherwise default based on keyword type

  // Technical keywords (contain dots, plus, hash, or are short acronyms) → skills
  if (/[.+#]/.test(keyword) || (keyword.length <= 4 && /^[a-z]+$/i.test(keyword))) {
    return 'skills'
  }

  // Multi-word phrases that sound like methodologies or processes → experience
  if (keyword.includes(' ') && !SOFT_SKILLS.has(keyword)) {
    // Check if it sounds like a tool/framework → skills, otherwise experience
    const techBigrams = ['machine learning','deep learning','data analysis','unit test',
      'data structures','state management','design system','tech stack','data visualization',
      'data modeling','data cleaning','feature engineering','network security',
      'threat modeling','risk assessment','user research','usability testing']
    if (techBigrams.includes(keyword)) return 'skills'
    return 'experience'
  }

  // Default: technical single words → skills
  return 'skills'
}

/**
 * Classify a keyword as hard skill or soft skill.
 */
function classifySkillType(keyword) {
  return SOFT_SKILLS.has(keyword.toLowerCase()) ? 'soft' : 'hard'
}

// ── Scoring Functions ──────────────────────────────────────────────────────────

function scoreKeywordMatch(resumeText, jobDescription, targetRole) {
  const resumeTokens = new Set(tokenize(resumeText))
  const resumeLower = resumeText.toLowerCase()
  let targetKeywords = []
  let matched = []
  let missing = []
  let keywordFrequency = {}

  if (jobDescription && jobDescription.trim().length > 20) {
    // Extract keywords from JD, ranked by frequency
    const ranked = extractKeywordsWithFrequency(jobDescription)
    targetKeywords = ranked.slice(0, 30).map((r) => r.keyword)

    // Build JD frequency map for top keywords
    for (const r of ranked.slice(0, 30)) {
      keywordFrequency[r.keyword] = { jdCount: r.jdCount, resumeCount: 0 }
    }
  } else {
    // Use role-based keywords
    const role = resolveRole(targetRole)
    targetKeywords = role ? ROLE_KEYWORDS_MAP[role] : ROLE_KEYWORDS_MAP['software engineer']
    targetKeywords = targetKeywords.slice(0, 30)

    // Build frequency map for role keywords
    for (const kw of targetKeywords) {
      keywordFrequency[kw] = { jdCount: 1, resumeCount: 0 }
    }
  }

  // Classify and match
  const hardSkills = { matched: [], missing: [] }
  const softSkills = { matched: [], missing: [] }

  for (const kw of targetKeywords) {
    const isMatch = resumeLower.includes(kw) || resumeTokens.has(kw)
    const resumeCount = countOccurrences(resumeText, kw)
    keywordFrequency[kw].resumeCount = resumeCount
    const skillType = classifySkillType(kw)

    if (isMatch) {
      matched.push(kw)
      if (skillType === 'hard') hardSkills.matched.push(kw)
      else softSkills.matched.push(kw)
    } else {
      missing.push(kw)
      if (skillType === 'hard') hardSkills.missing.push(kw)
      else softSkills.missing.push(kw)
    }
  }

  const score = targetKeywords.length > 0
    ? Math.round((matched.length / targetKeywords.length) * 100)
    : 50

  return {
    score: Math.min(score, 100),
    matched,
    missing,
    targetKeywords,
    hardSkills,
    softSkills,
    keywordFrequency,
  }
}

function scoreSectionCompleteness(resumeText) {
  const lower = resumeText.toLowerCase()
  let score = 0
  const issues = []

  // Contact: name/email/phone patterns
  const hasEmail = /[\w.-]+@[\w.-]+\.\w{2,}/.test(resumeText)
  const hasPhone = /(\+?\d[\d\s.-]{7,}\d)/.test(resumeText)
  if (hasEmail) score += 15; else issues.push({ level: 'critical', message: 'No email address found', fix: 'Add your email address in the contact section' })
  if (hasPhone) score += 10; else issues.push({ level: 'warning', message: 'No phone number found', fix: 'Add your phone number for recruiter contact' })

  // Summary/objective
  const hasSummary = /summary|objective|profile|about/i.test(lower)
  const summaryMatch = lower.match(/(?:summary|objective|profile|about)[:\s]*([\s\S]{0,500})/)
  if (hasSummary && summaryMatch && summaryMatch[1]?.trim().length > 50) {
    score += 20
  } else if (hasSummary) {
    score += 10
    issues.push({ level: 'warning', message: 'Summary section is too short', fix: 'Write a 2-3 sentence professional summary highlighting your key skills and experience' })
  } else {
    issues.push({ level: 'warning', message: 'No summary/objective section found', fix: 'Add a professional summary at the top of your resume' })
  }

  // Experience
  const hasExperience = /experience|employment|work history/i.test(lower)
  if (hasExperience) {
    score += 25
    // Check for bullet points
    const bulletCount = (resumeText.match(/^[\s]*[-•●▪◦]\s/gm) || []).length
    if (bulletCount < 3) {
      issues.push({ level: 'warning', message: 'Few bullet points in experience', fix: 'Use 2-5 bullet points per role to describe achievements' })
    }
  } else {
    issues.push({ level: 'critical', message: 'No experience section found', fix: 'Add a work experience section with your job history' })
  }

  // Education
  const hasEducation = /education|degree|university|college|bachelor|master|b\.?tech|m\.?tech|b\.?e\b|m\.?e\b|b\.?sc|m\.?sc/i.test(lower)
  if (hasEducation) score += 15; else issues.push({ level: 'warning', message: 'No education section found', fix: 'Add your educational qualifications' })

  // Skills
  const hasSkills = /skills|technologies|tech stack|competencies/i.test(lower)
  if (hasSkills) score += 15; else issues.push({ level: 'warning', message: 'No skills section found', fix: 'Add a dedicated skills section listing your technical and soft skills' })

  return { score: Math.min(score, 100), issues }
}

function scoreFormatting(resumeText) {
  let score = 100
  const issues = []

  // Special unicode characters (tables, columns, weird chars)
  const unicodeCount = (resumeText.match(/[^\x00-\x7F]/g) || []).length
  if (unicodeCount > 20) {
    score -= 20
    issues.push({ level: 'warning', message: 'Too many special characters detected', fix: 'Remove special unicode characters, symbols, and fancy formatting — ATS may not parse them correctly' })
  }

  // Check for proper date formats
  const datePatterns = resumeText.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s*\d{4}\b/gi) || []
  if (datePatterns.length === 0) {
    const yearOnly = resumeText.match(/\b20\d{2}\b/g) || []
    if (yearOnly.length === 0) {
      score -= 15
      issues.push({ level: 'warning', message: 'No date formats found', fix: 'Add dates to your experience and education sections (e.g., "Jan 2023 - Present")' })
    }
  }

  // Email present
  if (!/[\w.-]+@[\w.-]+\.\w{2,}/.test(resumeText)) {
    score -= 15
    issues.push({ level: 'critical', message: 'No valid email format', fix: 'Include a professional email address' })
  }

  // Very short resume
  const wordCount = resumeText.split(/\s+/).length
  if (wordCount < 100) {
    score -= 30
    issues.push({ level: 'critical', message: 'Resume is too short', fix: 'A good resume should be at least 300 words. Add more detail to your sections.' })
  }

  // Extremely long resume
  if (wordCount > 1500) {
    score -= 10
    issues.push({ level: 'info', message: 'Resume is very long', fix: 'Consider keeping your resume to 1-2 pages for better readability' })
  }

  return { score: Math.max(score, 0), issues }
}

function scoreContentDepth(resumeText) {
  let score = 0
  const issues = []
  const wordCount = resumeText.split(/\s+/).length
  const lower = resumeText.toLowerCase()
  const words = tokenize(resumeText)

  // Word count: 300-800 optimal
  if (wordCount >= 300 && wordCount <= 800) {
    score += 25
  } else if (wordCount >= 200 && wordCount <= 1200) {
    score += 15
  } else {
    score += 5
  }

  // Action verbs at bullet starts
  const lines = resumeText.split('\n')
  let actionVerbCount = 0
  for (const line of lines) {
    const trimmed = line.replace(/^[\s•\-●▪◦*]+/, '').trim()
    const firstWord = trimmed.split(/\s/)[0]?.toLowerCase()
    if (firstWord && ACTION_VERBS.has(firstWord)) actionVerbCount++
  }
  if (actionVerbCount >= 5) {
    score += 25
  } else if (actionVerbCount >= 2) {
    score += 15
    issues.push({ level: 'info', message: 'Could use more action verbs', fix: 'Start your bullet points with strong action verbs like Led, Built, Designed, Implemented, Reduced, Increased' })
  } else {
    score += 5
    issues.push({ level: 'warning', message: 'Few action verbs found', fix: 'Start your achievement bullets with strong action verbs (Led, Built, Designed, Implemented, Reduced, Increased)' })
  }

  // Quantification (numbers, percentages)
  const numberMatches = resumeText.match(/\d+[%+]|\$\d+|\d+\s*(users|customers|clients|projects|team|members|increase|decrease|reduction|improvement)/gi) || []
  if (numberMatches.length >= 3) {
    score += 25
  } else if (numberMatches.length >= 1) {
    score += 15
    issues.push({ level: 'info', message: 'Add more quantified achievements', fix: 'Quantify your achievements with numbers, percentages, and metrics (e.g., "Increased sales by 30%")' })
  } else {
    score += 5
    issues.push({ level: 'warning', message: 'No quantified achievements found', fix: 'Add numbers and metrics to your achievements (e.g., "Managed a team of 5", "Reduced load time by 40%")' })
  }

  // Skills count
  const skillsSectionMatch = lower.match(/skills[:\s]*([\s\S]{0,1000})(?=\n\n|\nexperience|\neducation|\nproject|\ncertif|$)/i)
  if (skillsSectionMatch) {
    const skillTokens = skillsSectionMatch[1].split(/[,|•\n]/).filter((s) => s.trim().length > 1)
    if (skillTokens.length >= 5 && skillTokens.length <= 15) {
      score += 25
    } else if (skillTokens.length >= 3) {
      score += 15
    } else {
      score += 5
      issues.push({ level: 'info', message: 'Skills section could be more detailed', fix: 'List 5-15 relevant skills for optimal ATS matching' })
    }
  } else {
    score += 5
  }

  return { score: Math.min(score, 100), issues }
}

/**
 * Build formatting checklist — what ATS parsers look for.
 */
function buildFormattingChecklist(resumeText) {
  const lower = resumeText.toLowerCase()
  const checks = []

  // Email
  const hasEmail = /[\w.-]+@[\w.-]+\.\w{2,}/.test(resumeText)
  checks.push({ label: 'Email address found', passed: hasEmail })

  // Phone
  const hasPhone = /(\+?\d[\d\s.-]{7,}\d)/.test(resumeText)
  checks.push({ label: 'Phone number found', passed: hasPhone })

  // Dates present
  const hasDates = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s*\d{4}\b/i.test(resumeText) || /\b20\d{2}\b/.test(resumeText)
  checks.push({ label: 'Date formats present', passed: hasDates })

  // No excessive special characters
  const unicodeCount = (resumeText.match(/[^\x00-\x7F]/g) || []).length
  checks.push({ label: 'No excessive special characters', passed: unicodeCount <= 20 })

  // Proper sections detected
  const hasSections = /summary|objective|profile/i.test(lower) &&
    /experience|employment|work history/i.test(lower) &&
    /education|degree|university/i.test(lower)
  checks.push({ label: 'Standard sections present', passed: hasSections })

  // Action verbs used
  const lines = resumeText.split('\n')
  let actionVerbCount = 0
  for (const line of lines) {
    const trimmed = line.replace(/^[\s•\-●▪◦*]+/, '').trim()
    const firstWord = trimmed.split(/\s/)[0]?.toLowerCase()
    if (firstWord && ACTION_VERBS.has(firstWord)) actionVerbCount++
  }
  checks.push({ label: 'Action verbs used', passed: actionVerbCount >= 2 })

  // Skills section
  const hasSkills = /skills|technologies|tech stack|competencies/i.test(lower)
  checks.push({ label: 'Skills section found', passed: hasSkills })

  // Reasonable length
  const wordCount = resumeText.split(/\s+/).length
  checks.push({ label: 'Resume length OK (100-1500 words)', passed: wordCount >= 100 && wordCount <= 1500 })

  return checks
}

// ── Main Export ─────────────────────────────────────────────────────────────────

/**
 * Analyse resume text using local rule-based engine.
 * @param {{ resumeText: string, jobDescription?: string, targetRole?: string }} opts
 * @returns {Object} ATS analysis result matching the shared data contract
 */
export function analyzeResumeATS({ resumeText, jobDescription = '', targetRole = '' }) {
  if (!resumeText || resumeText.trim().length < 20) {
    return {
      source: 'local',
      atsScore: 0,
      categoryScores: { keywordMatch: 0, sectionCompleteness: 0, formatting: 0, contentDepth: 0 },
      keywords: { matched: [], missing: [], hardSkills: { matched: [], missing: [] }, softSkills: { matched: [], missing: [] } },
      keywordFrequency: {},
      missingKeywords: [],
      suggestedAdditions: [],
      formattingChecklist: [],
      tips: ['Your resume appears to be empty or too short. Please provide more content.'],
      warnings: [{ level: 'critical', message: 'Resume text is too short to analyse', fix: 'Provide your full resume text for accurate scoring' }],
    }
  }

  // Run all scoring modules
  const kw = scoreKeywordMatch(resumeText, jobDescription, targetRole)
  const sections = scoreSectionCompleteness(resumeText)
  const formatting = scoreFormatting(resumeText)
  const depth = scoreContentDepth(resumeText)
  const formattingChecklist = buildFormattingChecklist(resumeText)

  // Weighted overall score
  const atsScore = Math.round(
    kw.score * 0.40 +
    sections.score * 0.25 +
    formatting.score * 0.15 +
    depth.score * 0.20
  )

  // Build missing keywords with intelligent section detection and JD-frequency priority
  const missingWithFreq = kw.missing.map((keyword) => {
    const freq = kw.keywordFrequency[keyword]
    return { keyword, jdCount: freq?.jdCount || 1 }
  })
  // Sort by JD frequency (most important keywords first)
  missingWithFreq.sort((a, b) => b.jdCount - a.jdCount)

  const missingKeywords = missingWithFreq.map((item, i) => {
    const section = detectKeywordSection(item.keyword, resumeText)
    const skillType = classifySkillType(item.keyword)
    return {
      keyword: item.keyword,
      section,
      skillType,
      suggestion: `Add "${item.keyword}" to your ${section} section`,
      priority: i < 5 ? 'high' : i < 15 ? 'medium' : 'low',
    }
  })

  // Suggested additions — with intelligent section mapping
  const suggestedAdditions = missingWithFreq.slice(0, 10).map((item) => {
    const section = detectKeywordSection(item.keyword, resumeText)
    return {
      section,
      keyword: item.keyword,
      suggestion: `Incorporate "${item.keyword}" into your ${section} section — ${
        section === 'skills' ? 'list it as a core competency' :
        section === 'experience' ? 'describe relevant experience using this term' :
        section === 'summary' ? 'mention it in your professional summary' :
        'add it to the relevant section'
      }`,
    }
  })

  // Collect all warnings
  const warnings = [
    ...sections.issues,
    ...formatting.issues,
    ...depth.issues,
  ]

  // Tips
  const tips = []
  if (kw.score < 50) tips.push('Your resume is missing many relevant keywords. Tailor it to the job description.')
  if (sections.score < 60) tips.push('Add missing resume sections (summary, experience, education, skills) for better ATS parsing.')
  if (formatting.score < 70) tips.push('Simplify formatting — avoid tables, columns, and special characters.')
  if (depth.score < 50) tips.push('Add quantified achievements and use action verbs to strengthen your content.')
  if (kw.hardSkills.missing.length > kw.hardSkills.matched.length) {
    tips.push('You are missing more technical skills than you have matched. Focus on adding the hard skills listed in the job description.')
  }
  if (tips.length === 0) tips.push('Your resume looks well-structured. Keep tailoring it to specific job descriptions for the best results.')

  return {
    source: 'local',
    atsScore,
    categoryScores: {
      keywordMatch: kw.score,
      sectionCompleteness: sections.score,
      formatting: formatting.score,
      contentDepth: depth.score,
    },
    keywords: {
      matched: kw.matched,
      missing: kw.missing,
      hardSkills: kw.hardSkills,
      softSkills: kw.softSkills,
    },
    keywordFrequency: kw.keywordFrequency,
    missingKeywords,
    suggestedAdditions,
    formattingChecklist,
    tips,
    warnings,
  }
}

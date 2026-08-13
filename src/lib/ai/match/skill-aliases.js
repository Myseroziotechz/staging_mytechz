// Curated alias map: variant (lowercase) -> canonical form. Not exhaustive —
// covers the stacks that appear in ats-rule-engine.js's ROLE_KEYWORDS_MAP
// plus common resume/JD variants, so a candidate's "React.js" and a job's
// "React" are recognised as the same skill without true embeddings.
const ALIASES = {
  'js': 'javascript', 'es6': 'javascript', 'ecmascript': 'javascript',
  'ts': 'typescript',
  'react.js': 'react', 'reactjs': 'react', 'react js': 'react',
  'next': 'next.js', 'nextjs': 'next.js',
  'vue.js': 'vue', 'vuejs': 'vue',
  'angularjs': 'angular',
  'node': 'node.js', 'nodejs': 'node.js',
  'expressjs': 'express', 'express.js': 'express',
  'nest': 'nestjs', 'nest.js': 'nestjs',
  'golang': 'go',
  'py': 'python',
  'c sharp': 'c#', 'csharp': 'c#',
  'cpp': 'c++',
  'postgres': 'postgresql', 'psql': 'postgresql',
  'mongo': 'mongodb',
  'ms sql': 'sql server', 'mssql': 'sql server', 'sqlserver': 'sql server',
  'k8s': 'kubernetes',
  'gcp': 'google cloud', 'google cloud platform': 'google cloud',
  'ci/cd': 'cicd', 'ci-cd': 'cicd',
  'restful api': 'rest', 'restful': 'rest', 'rest api': 'rest', 'rest apis': 'rest',
  'graph ql': 'graphql',
  'html5': 'html', 'css3': 'css',
  'tailwindcss': 'tailwind', 'tailwind css': 'tailwind',
  'sass/scss': 'sass', 'scss': 'sass',
  'redux toolkit': 'redux',
  'material ui': 'mui', 'material-ui': 'mui',
  'jest.js': 'jest',
  'ml': 'machine learning', 'dl': 'deep learning',
  'tf': 'tensorflow',
  'sklearn': 'scikit-learn', 'scikit learn': 'scikit-learn',
  'power bi': 'powerbi',
  'react native': 'react-native',
  'ios development': 'ios', 'android development': 'android',
  'objective c': 'objective-c', 'obj-c': 'objective-c',
  'figma design': 'figma',
  'adobe photoshop': 'photoshop', 'adobe illustrator': 'illustrator',
  'ux design': 'ux', 'ui design': 'ui',
  'devops engineering': 'devops',
  'terraform iac': 'terraform',
  'jenkins ci': 'jenkins',
  'rabbit mq': 'rabbitmq',
  'apache kafka': 'kafka',
  'elasticsearch': 'elastic search',
  'firebase auth': 'firebase',
  'dot net': '.net', 'asp.net': '.net', 'dotnet': '.net',
  'linux/unix': 'linux', 'unix': 'linux',
  'git hub': 'github', 'git lab': 'gitlab',
  'agile methodology': 'agile', 'scrum methodology': 'scrum',
  'nlp': 'natural language processing',
  'cv': 'computer vision',
  'a/b testing': 'ab testing',
  'sql server management studio': 'sql server',
}

/** Lowercase, trim, collapse whitespace, then map through the alias table. */
export function normalizeSkill(raw) {
  const s = String(raw || '').toLowerCase().trim().replace(/\s+/g, ' ')
  if (!s) return ''
  return ALIASES[s] || s
}

/** Normalize + dedupe a list, preserving first-seen order. */
export function normalizeSkillSet(list = []) {
  const seen = new Set()
  const out = []
  for (const raw of list) {
    const n = normalizeSkill(raw)
    if (n && !seen.has(n)) {
      seen.add(n)
      out.push(n)
    }
  }
  return out
}

import { countWords } from './text'

export type CheckId = 'minWords' | 'paragraphs' | 'overview' | 'position' | 'linkers'
export type InformalId = 'contractions' | 'alot' | 'informalWords' | 'exclamation' | 'etc'

/** A pass/fail observation; the UI turns the id and value into a translated sentence. */
export interface WritingCheck {
  id: CheckId
  ok: boolean
  /** The measured quantity: words short, paragraphs found, linkers used … */
  value: number
}

export interface WritingAnalysis {
  words: number
  sentences: number
  paragraphs: number
  avgSentenceLength: number
  uniqueWordRatio: number
  linkers: string[]
  repeated: { word: string; count: number }[]
  informal: InformalId[]
  checks: WritingCheck[]
}

const LINKERS = [
  'overall', 'in general', 'however', 'moreover', 'furthermore', 'in addition', 'additionally', 'for example', 'for instance',
  'on the other hand', 'in contrast', 'by contrast', 'whereas', 'while', 'although', 'even though', 'therefore', 'thus',
  'as a result', 'consequently', 'similarly', 'likewise', 'firstly', 'secondly', 'finally', 'in conclusion', 'to conclude',
  'nevertheless', 'nonetheless', 'meanwhile', 'subsequently', 'in particular', 'such as', 'because', 'since', 'despite',
  'in my view', 'in my opinion',
]

const STOPWORDS = new Set(
  'the a an and or but of to in on at for with by from as is are was were be been being it its this that these those there their they them he she his her we our you your i my me not no so than then which who whom what when where why how also more most less least very can could will would should may might must do does did have has had into over up down out about after before between during through while if all some any each other such only own same too just'.split(
    ' ',
  ),
)

const INFORMAL: [RegExp, InformalId][] = [
  [/\b(don't|doesn't|can't|won't|isn't|aren't|wasn't|weren't|it's|that's|there's|they're|i'm|i've|you're|shouldn't|wouldn't|couldn't|didn't)\b/i, 'contractions'],
  [/\ba lot of\b|\blots of\b/i, 'alot'],
  [/\b(kids|stuff|things|guys|pretty|really|super|gonna|wanna)\b/i, 'informalWords'],
  [/!/, 'exclamation'],
  [/\betc\b/i, 'etc'],
]

/** Quick, transparent text statistics — a starting point for self-assessment, not a band score. */
export function analyzeWriting(text: string, task: 1 | 2, minWords: number): WritingAnalysis {
  const clean = text.trim()
  const words = countWords(clean)
  const sentences = clean ? clean.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/).filter((s) => countWords(s) > 0).length : 0
  const paragraphs = clean ? clean.split(/\n\s*\n|\n/).filter((p) => p.trim()).length : 0
  const lower = clean.toLowerCase()
  const tokens = lower.match(/[a-z]+(?:['-][a-z]+)*/g) ?? []
  const unique = new Set(tokens)

  const linkers = LINKERS.filter((l) => new RegExp(`(^|[^a-z])${l.replace(/ /g, '\\s+')}([^a-z]|$)`).test(lower))

  const counts = new Map<string, number>()
  for (const t of tokens) if (t.length > 3 && !STOPWORDS.has(t)) counts.set(t, (counts.get(t) ?? 0) + 1)
  const threshold = Math.max(4, Math.round(words / 60))
  const repeated = [...counts.entries()]
    .filter(([, c]) => c >= threshold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }))

  const informal = INFORMAL.filter(([re]) => re.test(clean)).map(([, id]) => id)

  const checks: WritingCheck[] = [
    { id: 'minWords', ok: words >= minWords, value: Math.max(0, minWords - words) },
    { id: 'paragraphs', ok: paragraphs >= (task === 1 ? 3 : 4), value: paragraphs },
    task === 1
      ? { id: 'overview', ok: /\b(overall|in general|generally|it is clear|it can be seen|the most striking)\b/i.test(clean), value: 0 }
      : { id: 'position', ok: /\b(i (strongly )?(believe|think|feel|agree|disagree)|in my (view|opinion)|from my perspective|i would argue)\b/i.test(clean), value: 0 },
    { id: 'linkers', ok: linkers.length >= 4, value: linkers.length },
  ]

  return {
    words,
    sentences,
    paragraphs,
    avgSentenceLength: sentences ? Math.round((words / sentences) * 10) / 10 : 0,
    uniqueWordRatio: tokens.length ? unique.size / tokens.length : 0,
    linkers,
    repeated,
    informal,
    checks,
  }
}

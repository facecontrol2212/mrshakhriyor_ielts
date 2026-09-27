import type { AnswerValue } from '@/types/attempt'
import type { AnswerSpec, ListeningSection, Module, QuestionGroup, ReadingSection } from '@/types/content'
import { rawToBand } from './bands'
import { buildQuestionIndex, questionTypeLabel } from './questions'
import { exceedsWordLimit, matchesAccepted } from './text'

export interface QuestionResult {
  n: number
  partIndex: number
  group: QuestionGroup
  typeLabel: string
  given: string
  expected: string
  correct: boolean
  answered: boolean
  overLimit: boolean
  spec: AnswerSpec
}

export interface ObjectiveScore {
  raw: number
  total: number
  band: number
  results: QuestionResult[]
}

function asText(value: AnswerValue | undefined): string {
  if (value === undefined) return ''
  return Array.isArray(value) ? value.join(', ') : value
}

const CHOICE_TYPES = new Set<QuestionGroup['type']>(['tfng', 'ynng', 'mcq', 'mcq-multi', 'headings', 'matching', 'map', 'gap-bank'])

function isChoice(group: QuestionGroup) {
  return CHOICE_TYPES.has(group.type)
}

/**
 * Mark a Listening or Reading section. Multi-answer questions ("Choose TWO")
 * score one mark per correct letter, in any order.
 */
export function scoreObjective(
  skill: 'listening' | 'reading',
  section: ListeningSection | ReadingSection,
  answers: Record<string, AnswerValue>,
  module: Module = 'academic',
): ObjectiveScore {
  const refs = buildQuestionIndex(section.parts)
  const results: QuestionResult[] = []
  const multiCorrect = new Map<string, number>()

  for (const ref of refs) {
    const spec = section.answers[ref.n]
    if (!spec) throw new Error(`Missing answer key for question ${ref.n}`)
    const value = answers[ref.key]
    const group = ref.group
    let correct: boolean
    let overLimit = false
    let given = asText(value)

    if (group.type === 'mcq-multi') {
      const chosen = new Set((Array.isArray(value) ? value : []).map((v) => v.toUpperCase()))
      if (!multiCorrect.has(ref.key)) {
        const expectedKeys = new Set<string>()
        for (let n = group.from; n <= group.to; n++) for (const k of section.answers[n]?.accept ?? []) expectedKeys.add(k.toUpperCase())
        let hits = 0
        for (const key of chosen) if (expectedKeys.has(key)) hits++
        multiCorrect.set(ref.key, Math.min(hits, group.to - group.from + 1))
      }
      correct = (ref.multiIndex ?? 0) < (multiCorrect.get(ref.key) ?? 0)
      given = [...chosen].sort().join(', ')
    } else if (isChoice(group)) {
      correct = typeof value === 'string' && spec.accept.some((k) => k.toUpperCase() === value.trim().toUpperCase())
    } else {
      const text = typeof value === 'string' ? value : ''
      correct = matchesAccepted(text, spec.accept)
      if (!correct && (group.type === 'gap' || group.type === 'short') && text.trim()) overLimit = exceedsWordLimit(text, group.wordLimit)
    }

    results.push({
      n: ref.n,
      partIndex: ref.partIndex,
      group,
      typeLabel: questionTypeLabel(group),
      given,
      expected: group.type === 'mcq-multi' ? collectMultiExpected(section, group) : spec.accept.join(' / '),
      correct,
      answered: given.trim() !== '',
      overLimit,
      spec,
    })
  }

  const raw = results.filter((r) => r.correct).length
  const total = results.length
  return { raw, total, band: rawToBand(skill, raw, total, module), results }
}

function collectMultiExpected(section: ListeningSection | ReadingSection, group: QuestionGroup): string {
  const keys: string[] = []
  for (let n = group.from; n <= group.to; n++) keys.push(...(section.answers[n]?.accept ?? []))
  return [...new Set(keys)].sort().join(', ')
}

export interface TypeBreakdown {
  label: string
  correct: number
  total: number
}

/** Accuracy per question type — powers the "weak areas" analytics. */
export function breakdownByType(results: QuestionResult[]): TypeBreakdown[] {
  const map = new Map<string, TypeBreakdown>()
  for (const r of results) {
    const entry = map.get(r.typeLabel) ?? { label: r.typeLabel, correct: 0, total: 0 }
    entry.total++
    if (r.correct) entry.correct++
    map.set(r.typeLabel, entry)
  }
  return [...map.values()].sort((a, b) => a.correct / a.total - b.correct / b.total)
}

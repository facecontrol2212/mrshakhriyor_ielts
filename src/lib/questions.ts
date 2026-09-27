import type { AnswerValue } from '@/types/attempt'
import type { QuestionGroup } from '@/types/content'

export interface QuestionRef {
  n: number
  group: QuestionGroup
  partIndex: number
  /** Key in SectionState.answers where this question's answer lives. */
  key: string
  /** Position within a multi-answer group (0 for the first number). */
  multiIndex?: number
}

export function multiKey(group: { from: number; to: number }): string {
  return `${group.from}-${group.to}`
}

export function answerKey(group: QuestionGroup, n: number): string {
  return group.type === 'mcq-multi' ? multiKey(group) : String(n)
}

/** Every question number in the section, in order, with its group and part. */
export function buildQuestionIndex(parts: { groups: QuestionGroup[] }[]): QuestionRef[] {
  const refs: QuestionRef[] = []
  parts.forEach((part, partIndex) => {
    for (const group of part.groups) {
      for (let n = group.from; n <= group.to; n++) {
        refs.push({
          n,
          group,
          partIndex,
          key: answerKey(group, n),
          multiIndex: group.type === 'mcq-multi' ? n - group.from : undefined,
        })
      }
    }
  })
  return refs.sort((a, b) => a.n - b.n)
}

export function partRange(part: { groups: QuestionGroup[] }): { from: number; to: number } {
  const from = Math.min(...part.groups.map((g) => g.from))
  const to = Math.max(...part.groups.map((g) => g.to))
  return { from, to }
}

export function isAnswered(answers: Record<string, AnswerValue>, ref: QuestionRef): boolean {
  const value = answers[ref.key]
  if (value === undefined) return false
  if (Array.isArray(value)) return value.length > (ref.multiIndex ?? 0)
  return value.trim() !== ''
}

const GAP_LABELS: Record<string, string> = {
  notes: 'Note completion',
  form: 'Form completion',
  sentences: 'Sentence completion',
  summary: 'Summary completion',
  table: 'Table completion',
  flowchart: 'Flow-chart completion',
}

/** Human-readable question type used in reviews and weakness analytics. */
export function questionTypeLabel(group: QuestionGroup): string {
  switch (group.type) {
    case 'tfng':
      return 'True / False / Not Given'
    case 'ynng':
      return 'Yes / No / Not Given'
    case 'mcq':
      return 'Multiple choice'
    case 'mcq-multi':
      return 'Multiple choice (several answers)'
    case 'gap':
      return GAP_LABELS[group.layout]
    case 'gap-bank':
      return 'Summary completion (word box)'
    case 'headings':
      return 'Matching headings'
    case 'matching':
      return group.optionsTitle?.toLowerCase().includes('paragraph') ? 'Matching information' : 'Matching'
    case 'map':
      return 'Map / plan labelling'
    case 'short':
      return 'Short answer'
  }
}

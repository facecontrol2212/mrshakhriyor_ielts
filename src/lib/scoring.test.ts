import { describe, expect, it } from 'vitest'
import { mock1 } from '@/content/tests/mock-1'
import type { AnswerValue } from '@/types/attempt'
import type { ListeningSection, ReadingSection } from '@/types/content'
import { buildQuestionIndex, isAnswered } from './questions'
import { breakdownByType, scoreObjective } from './scoring'
import { expandOptional } from './text'

/** The answer key typed in as a perfect candidate would. */
function perfectAnswers(section: ListeningSection | ReadingSection): Record<string, AnswerValue> {
  const answers: Record<string, AnswerValue> = {}
  for (const ref of buildQuestionIndex(section.parts)) {
    const spec = section.answers[ref.n]
    if (ref.group.type === 'mcq-multi') {
      const keys = new Set<string>()
      for (let n = ref.group.from; n <= ref.group.to; n++) keys.add(section.answers[n].accept[0])
      answers[ref.key] = [...keys]
    } else answers[ref.key] = expandOptional(spec.accept[0])[0]
  }
  return answers
}

const reading = mock1.reading!
const listening = mock1.listening!

describe('scoreObjective', () => {
  it('gives 40/40 and band 9 for a perfect paper', () => {
    for (const [skill, section] of [
      ['reading', reading],
      ['listening', listening],
    ] as const) {
      const score = scoreObjective(skill, section, perfectAnswers(section))
      expect(score.raw).toBe(40)
      expect(score.band).toBe(9)
      expect(score.results.every((r) => r.correct && !r.overLimit)).toBe(true)
    }
  })

  it('gives 0 for a blank paper', () => {
    const score = scoreObjective('reading', reading, {})
    expect(score.raw).toBe(0)
    expect(score.results.every((r) => !r.answered)).toBe(true)
  })

  it('accepts choice answers in any case', () => {
    const score = scoreObjective('reading', reading, { '1': 'false' })
    expect(score.results.find((r) => r.n === 1)?.correct).toBe(true)
  })

  it('awards one mark per correct letter in multi-answer questions, in any order', () => {
    const both = scoreObjective('reading', reading, { '21-22': ['C', 'A'] })
    expect(both.raw).toBe(2)
    const one = scoreObjective('reading', reading, { '21-22': ['A', 'E'] })
    expect(one.raw).toBe(1)
    expect(one.results.find((r) => r.n === 21)?.correct).toBe(true)
    expect(one.results.find((r) => r.n === 22)?.correct).toBe(false)
  })

  it('flags wrong answers that break the word limit', () => {
    const score = scoreObjective('listening', listening, { '31': 'fly at all' })
    const q31 = score.results.find((r) => r.n === 31)!
    expect(q31.correct).toBe(false)
    expect(q31.overLimit).toBe(true)
  })

  it('accepts listed variants but not answers over the word limit', () => {
    const score = scoreObjective('listening', listening, { '3': '07946 218 530', '7': 'weekend' })
    expect(score.results.find((r) => r.n === 3)?.correct).toBe(true)
    expect(score.results.find((r) => r.n === 7)?.correct).toBe(true)
    const twoWords = scoreObjective('listening', listening, { '7': 'the weekend' }).results.find((r) => r.n === 7)!
    expect(twoWords.correct).toBe(false)
    expect(twoWords.overLimit).toBe(true)
  })
})

describe('isAnswered', () => {
  it('counts each selected letter of a multi-answer group', () => {
    const refs = buildQuestionIndex(reading.parts).filter((r) => r.n === 21 || r.n === 22)
    const answers = { '21-22': ['A'] }
    expect(refs.map((r) => isAnswered(answers, r))).toEqual([true, false])
  })
})

describe('breakdownByType', () => {
  it('sorts question types from weakest to strongest', () => {
    const answers = perfectAnswers(reading)
    for (let n = 1; n <= 7; n++) delete answers[String(n)]
    const rows = breakdownByType(scoreObjective('reading', reading, answers).results)
    expect(rows[0]).toEqual({ label: 'True / False / Not Given', correct: 0, total: 7 })
    expect(rows.at(-1)!.correct).toBe(rows.at(-1)!.total)
  })
})

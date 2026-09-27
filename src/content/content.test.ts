/**
 * Content integrity: every test on the site must have a complete, consistent
 * answer key. These checks also guard new tests added by teachers.
 */
import { describe, expect, it } from 'vitest'
import { buildSpeakingSteps } from '@/exam/speaking/steps'
import { buildQuestionIndex } from '@/lib/questions'
import { countWords, exceedsWordLimit, expandOptional, gapNumbers, matchesAccepted, plainText } from '@/lib/text'
import type { ListeningSection, QuestionGroup, ReadingSection } from '@/types/content'
import { ARTICLES } from './articles'
import { listeningAudio, speakingAudio } from './audio'
import { TESTS } from './tests'
import { VISUAL_KEYS } from './visuals/keys'

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

function groupNumbers(g: QuestionGroup): number[] {
  switch (g.type) {
    case 'gap': {
      const cells = g.table ? [...g.table.columns, ...g.table.rows.flat()] : []
      return [...(g.lines ?? []), ...cells].flatMap(gapNumbers)
    }
    case 'gap-bank':
      return g.lines.flatMap(gapNumbers)
    case 'mcq-multi':
      return range(g.from, g.to)
    default:
      return g.questions.map((q) => q.n)
  }
}

function validKeys(g: QuestionGroup): string[] | null {
  switch (g.type) {
    case 'tfng':
      return ['TRUE', 'FALSE', 'NOT GIVEN']
    case 'ynng':
      return ['YES', 'NO', 'NOT GIVEN']
    case 'mcq':
      return null // per question, checked separately
    case 'map':
      return g.letters
    case 'mcq-multi':
    case 'matching':
    case 'headings':
    case 'gap-bank':
      return g.options.map((o) => o.key)
    default:
      return null
  }
}

function sectionText(section: ListeningSection | ReadingSection, partIndex: number): string[] {
  if ('reviewSeconds' in section) {
    return section.parts[partIndex].script.flatMap((s) => (s.type === 'pause' ? [] : [s.text]))
  }
  const part = (section as ReadingSection).parts[partIndex]
  return [part.passage.title, part.passage.subtitle ?? '', ...part.passage.paragraphs.map((p) => plainText(p.text))]
}

for (const test of TESTS) {
  describe(test.id, () => {
    for (const skill of ['listening', 'reading'] as const) {
      const section = test[skill]
      if (!section) continue

      describe(skill, () => {
        const refs = buildQuestionIndex(section.parts)

        it('numbers the questions 1…N with no gaps or duplicates', () => {
          const numbers = refs.map((r) => r.n)
          expect(numbers).toEqual(range(1, numbers.length))
          if (test.kind === 'full') expect(numbers).toHaveLength(40)
        })

        it('has exactly one answer for every question', () => {
          const keys = Object.keys(section.answers)
            .map(Number)
            .sort((a, b) => a - b)
          expect(keys).toEqual(refs.map((r) => r.n))
        })

        it('matches every group range to its questions or gaps', () => {
          for (const part of section.parts) for (const g of part.groups) expect(groupNumbers(g), g.id).toEqual(range(g.from, g.to))
        })

        it('uses valid option keys in the answer key', () => {
          for (const part of section.parts)
            for (const g of part.groups) {
              for (const n of range(g.from, g.to)) {
                const accept = section.answers[n].accept
                expect(accept.length, `Q${n}`).toBeGreaterThan(0)
                const keys = g.type === 'mcq' ? g.questions.find((q) => q.n === n)!.options.map((o) => o.key) : validKeys(g)
                if (keys) for (const a of accept) expect(keys, `Q${n} answer ${a}`).toContain(a)
              }
              if (g.type === 'mcq-multi') {
                const all = range(g.from, g.to).flatMap((n) => section.answers[n].accept)
                expect(new Set(all).size, g.id).toBe(g.to - g.from + 1)
              }
              if (g.type === 'headings') {
                const labels = part.groups.length && 'passage' in part ? part.passage.paragraphs.map((p) => p.label) : []
                for (const q of g.questions) expect(labels, `paragraph ${q.paragraph}`).toContain(q.paragraph)
                const used = g.questions.map((q) => section.answers[q.n].accept[0])
                expect(new Set(used).size, 'each heading used once').toBe(used.length)
                if (g.example) expect(used).not.toContain(g.example.key)
              }
              if (g.type === 'matching' && !g.reuse) {
                const used = g.questions.map((q) => section.answers[q.n].accept[0])
                expect(new Set(used).size, `${g.id} reuses an option`).toBe(used.length)
              }
              if (g.type === 'map') expect(VISUAL_KEYS as readonly string[]).toContain(g.visual)
            }
        })

        it('keeps typed answers within the word limit and self-consistent', () => {
          for (const part of section.parts)
            for (const g of part.groups) {
              if (g.type !== 'gap' && g.type !== 'short') continue
              for (const n of range(g.from, g.to)) {
                for (const pattern of section.answers[n].accept)
                  for (const variant of expandOptional(pattern)) {
                    expect(exceedsWordLimit(variant, g.wordLimit), `Q${n} "${variant}"`).toBe(false)
                    expect(matchesAccepted(variant, section.answers[n].accept)).toBe(true)
                  }
              }
            }
        })

        it('quotes evidence that appears word for word in the text', () => {
          refs.forEach((ref) => {
            const quote = section.answers[ref.n].evidence
            if (!quote) return
            const blocks = sectionText(section, ref.partIndex).map((b) => b.toLowerCase())
            expect(
              blocks.some((b) => b.includes(quote.toLowerCase())),
              `Q${ref.n} evidence not found: "${quote}"`,
            ).toBe(true)
          })
        })
      })
    }

    if (test.listening) {
      it('has a recording with segment timings for every listening part', () => {
        for (const part of test.listening!.parts) {
          const audio = listeningAudio(test.id, part.id)
          expect(audio, `${part.id} audio — run npm run audio:export && npm run audio:generate`).toBeDefined()
          expect(audio!.duration).toBeGreaterThan(60)
          expect(audio!.segments).toHaveLength(part.script.length)
        }
      })

      it('names a known speaker on every script line', () => {
        for (const part of test.listening!.parts)
          for (const seg of part.script) if (seg.type === 'line') expect(Object.keys(part.speakers), part.id).toContain(seg.speaker)
      })
    }

    if (test.speaking) {
      it('has examiner audio for every speaking prompt', () => {
        for (const step of buildSpeakingSteps(test.speaking!)) if (step.kind === 'prompt') expect(speakingAudio(test.id, step.prompt.id), step.prompt.id).toBeDefined()
      })
    }

    if (test.writing) {
      it('has model answers that meet the word minimum', () => {
        for (const task of test.writing!.tasks) if (task.modelAnswer) expect(countWords(task.modelAnswer.text), task.id).toBeGreaterThanOrEqual(task.minWords)
      })
    }
  })
}

describe('articles', () => {
  it('have unique slugs', () => {
    const slugs = ARTICLES.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('test registry', () => {
  it('has unique test ids', () => {
    const ids = TESTS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

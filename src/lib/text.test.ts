import { describe, expect, it } from 'vitest'
import {
  countAnswerTokens,
  countWords,
  describeWordLimit,
  exceedsWordLimit,
  expandOptional,
  gapNumbers,
  matchesAccepted,
  normalizeAnswer,
  parseInline,
  parseLine,
  plainText,
} from './text'

describe('parseInline', () => {
  it('splits bold, italic and gaps', () => {
    expect(parseInline('Write **ONE WORD** in {{12}} *only*')).toEqual([
      { type: 'text', text: 'Write ' },
      { type: 'text', text: 'ONE WORD', bold: true },
      { type: 'text', text: ' in ' },
      { type: 'gap', n: 12 },
      { type: 'text', text: ' ' },
      { type: 'text', text: 'only', italic: true },
    ])
  })

  it('lists gap numbers and renders plain text', () => {
    expect(gapNumbers('£{{5}} per month, then {{6}}')).toEqual([5, 6])
    expect(plainText('**Standard:** £{{5}}')).toBe('Standard: £_____')
  })

  it('classifies note lines', () => {
    expect(parseLine('# Heading')).toEqual({ kind: 'heading', content: 'Heading' })
    expect(parseLine('- bullet')).toEqual({ kind: 'bullet', content: 'bullet' })
    expect(parseLine('-- sub')).toEqual({ kind: 'subbullet', content: 'sub' })
    expect(parseLine('  ')).toEqual({ kind: 'blank', content: '' })
  })
})

describe('answer matching', () => {
  it('ignores case, spacing, trailing punctuation and quotes', () => {
    expect(normalizeAnswer('  The   Library. ')).toBe('the library')
    expect(matchesAccepted('LIBRARY', ['library'])).toBe(true)
    expect(matchesAccepted('"library"', ['library'])).toBe(true)
  })

  it('treats hyphens and spaces alike', () => {
    expect(matchesAccepted('part time', ['part-time'])).toBe(true)
    expect(matchesAccepted('thirty-two', ['thirty two'])).toBe(true)
  })

  it('expands optional words in brackets', () => {
    expect(expandOptional('(the) town hall')).toEqual(['the town hall', 'town hall'])
    expect(matchesAccepted('weekend', ['weekends', '(the) weekend'])).toBe(true)
    expect(matchesAccepted('the weekend', ['weekends', '(the) weekend'])).toBe(true)
  })

  it('ignores currency symbols and spaces inside numbers', () => {
    expect(matchesAccepted('£32', ['32'])).toBe(true)
    expect(matchesAccepted('07946 218 530', ['07946218530'])).toBe(true)
  })

  it('is strict about spelling and extra words', () => {
    expect(matchesAccepted('libary', ['library'])).toBe(false)
    expect(matchesAccepted('the public library', ['library'])).toBe(false)
    expect(matchesAccepted('', ['library'])).toBe(false)
  })
})

describe('word limits', () => {
  it('counts words and numbers separately', () => {
    expect(countAnswerTokens('2 large rooms')).toEqual({ words: 2, numbers: 1 })
    expect(countAnswerTokens('07946 218530')).toEqual({ words: 0, numbers: 1 })
  })

  it('applies NO MORE THAN TWO WORDS AND/OR A NUMBER', () => {
    const limit = { words: 2, number: true }
    expect(exceedsWordLimit('2 large rooms', limit)).toBe(false)
    expect(exceedsWordLimit('three large rooms', limit)).toBe(true)
  })

  it('applies ONE WORD ONLY', () => {
    expect(exceedsWordLimit('library', { words: 1 })).toBe(false)
    expect(exceedsWordLimit('the library', { words: 1 })).toBe(true)
  })

  it('describes limits in exam wording', () => {
    expect(describeWordLimit({ words: 1 })).toBe('ONE WORD ONLY')
    expect(describeWordLimit({ words: 2, number: true })).toBe('NO MORE THAN TWO WORDS AND/OR A NUMBER')
  })
})

describe('countWords', () => {
  it('counts hyphenated words and numbers once', () => {
    expect(countWords('A well-known fact: 45% of people, in 2020.')).toBe(8)
    expect(countWords('   ')).toBe(0)
  })
})

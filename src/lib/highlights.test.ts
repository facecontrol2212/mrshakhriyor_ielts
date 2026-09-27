import { describe, expect, it } from 'vitest'
import { addHighlight, findSpans, overlapsHighlight, removeHighlight, segmentBoundaries } from './highlights'

const spans = (list: { start: number; end: number; note?: string }[]) => list.map(({ start, end, note }) => (note ? { start, end, note } : { start, end }))

describe('highlights', () => {
  it('adds and merges overlapping or touching ranges', () => {
    let list = addHighlight([], 10, 20)
    list = addHighlight(list, 30, 40)
    expect(spans(list)).toEqual([
      { start: 10, end: 20 },
      { start: 30, end: 40 },
    ])
    list = addHighlight(list, 18, 32)
    expect(spans(list)).toEqual([{ start: 10, end: 40 }])
    list = addHighlight(list, 40, 45)
    expect(spans(list)).toEqual([{ start: 10, end: 45 }])
  })

  it('keeps notes when ranges merge', () => {
    const list = addHighlight(addHighlight([], 0, 5, 'first'), 3, 9, 'second')
    expect(spans(list)).toEqual([{ start: 0, end: 9, note: 'first\nsecond' }])
  })

  it('ignores empty selections', () => {
    expect(addHighlight([], 5, 5)).toEqual([])
  })

  it('removes part of a range by splitting it', () => {
    const list = removeHighlight(addHighlight([], 0, 30), 10, 20)
    expect(spans(list)).toEqual([
      { start: 0, end: 10 },
      { start: 20, end: 30 },
    ])
    expect(overlapsHighlight(list, 12, 18)).toBe(false)
    expect(overlapsHighlight(list, 5, 12)).toBe(true)
  })

  it('segments text at every boundary', () => {
    expect(segmentBoundaries(10, [[{ start: 2, end: 5 }], [{ start: 4, end: 8 }]])).toEqual([
      { start: 0, end: 2 },
      { start: 2, end: 4 },
      { start: 4, end: 5 },
      { start: 5, end: 8 },
      { start: 8, end: 10 },
    ])
  })

  it('finds quotes case-insensitively', () => {
    expect(findSpans('The Bees and the bees', 'bees')).toEqual([
      { start: 4, end: 8 },
      { start: 17, end: 21 },
    ])
    expect(findSpans('abc', '')).toEqual([])
  })
})
